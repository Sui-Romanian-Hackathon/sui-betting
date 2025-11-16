/* eslint-disable @typescript-eslint/no-explicit-any */
// client/src/components/menu/modals/create-bet-modal.tsx

'use client'

import { useState } from 'react'
import { Transaction } from '@mysten/sui/transactions'
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import Modal from './base-modal'

type Props = {
  onClose: () => void
}

const REGISTRY_ID = '0x425464a95187b8063ea1768457c6dcd93a49d640f6331e6ab52fbd7147a50fb3'
const PACKAGE_ID = '0x8fcc86d396abd6a468be3bcccfa9a02b0693319ae645389d561ec8012412fa71'

export default function CreateBetModal({ onClose }: Props) {
  const account = useCurrentAccount()
  const signAndExecute = useSignAndExecuteTransaction()

  const [marketName, setMarketName] = useState('')
  const [asset, setAsset] = useState('SUI / USD')
  const [resolutionTime, setResolutionTime] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleCreate = async () => {
    if (!account) {
      setStatus('error')
      setErrorMessage('Wallet not connected.')
      return
    }

    if (!marketName || !resolutionTime) {
      setStatus('error')
      setErrorMessage('Please complete all fields.')
      return
    }

    try {
      setStatus('loading')

      const now = Math.floor(Date.now() / 1000)
      const end_ts = Math.floor(new Date(resolutionTime).getTime() / 1000)

      const tx = new Transaction()

      tx.moveCall({
        target: `${PACKAGE_ID}::factory::create_event`,
        arguments: [
          tx.object(REGISTRY_ID),
          tx.pure.string(marketName),
          tx.pure.u64(now),
          tx.pure.u64(end_ts),
        ],
      })

      const result = await signAndExecute.mutateAsync({ transaction: tx })

      console.log('EVENT CREATED:', result)

      setStatus('success')

      setTimeout(() => {
        onClose()
      }, 1200)
    } catch (err: any) {
      console.error('CREATE EVENT FAILED:', err)
      setStatus('error')
      setErrorMessage(err?.message ?? 'Transaction failed.')
    }
  }

  return (
    <Modal title="Create Bet" onClose={onClose}>
      <form className="space-y-4 text-left">
        {/* SUCCESS */}
        {status === 'success' && (
          <div className="rounded-md bg-emerald-600/20 border border-emerald-500 text-emerald-200 p-2 text-sm">
            ✅ Bet created successfully!
          </div>
        )}

        {/* ERROR */}
        {status === 'error' && (
          <div className="rounded-md bg-red-600/20 border border-red-500 text-red-200 p-2 text-sm">
            ❌ {errorMessage}
          </div>
        )}

        {/* MARKET NAME */}
        <div>
          <label className="block text-sm font-medium text-zinc-100">Market name</label>
          <input
            type="text"
            value={marketName}
            onChange={(e) => setMarketName(e.target.value)}
            placeholder="BTC > 100k until Dec 2025"
            className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none"
          />
        </div>

        {/* ASSET + SEED POOL */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-zinc-100">Asset</label>
            <select
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
              className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none"
            >
              <option>SUI / USD</option>
              <option>BTC / USD</option>
              <option>ETH / USD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-100">Seed pool (ignored)</label>
            <input
              type="number"
              placeholder="(not used)"
              className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none opacity-50"
              disabled
            />
          </div>
        </div>

        {/* RESOLUTION TIME */}
        <div>
          <label className="block text-sm font-medium text-zinc-100">Resolution time</label>

          <input
            type="datetime-local"
            value={resolutionTime}
            onChange={(e) => setResolutionTime(e.target.value)}
            className="
              mt-1 w-full rounded-md border border-zinc-700 
              bg-zinc-900 px-3 py-2 text-sm 
              text-white 
              [color-scheme:dark]
              cursor-pointer
            "
          />
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-zinc-700 px-4 py-1.5 text-sm font-medium text-zinc-200 hover:bg-zinc-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleCreate}
            disabled={status === 'loading'}
            className="rounded-full bg-zinc-100 px-4 py-1.5 text-sm font-medium text-zinc-900 hover:bg-zinc-200 disabled:opacity-50"
          >
            {status === 'loading' ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
