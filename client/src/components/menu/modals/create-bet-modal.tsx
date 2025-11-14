import Modal from './modal'

type Props = {
  onClose: () => void
}

export default function CreateBetModal({ onClose }: Props) {
  return (
    <Modal title="Create Bet" onClose={onClose}>
      <form className="space-y-4 text-left">
        <div>
          <label className="block text-sm font-medium text-zinc-100">Market name</label>
          <input
            type="text"
            placeholder="SUI / USD next 24h"
            className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-zinc-100">Asset</label>
            <select className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400">
              <option>SUI / USD</option>
              <option>BTC / USD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-100">Seed pool (SUI)</label>
            <input
              type="number"
              placeholder="10"
              className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-100">Resolution time</label>
          <input
            type="datetime-local"
            className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400"
          />
        </div>

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
            className="rounded-full bg-zinc-100 px-4 py-1.5 text-sm font-medium text-zinc-900 hover:bg-zinc-200"
          >
            Create
          </button>
        </div>
      </form>
    </Modal>
  )
}
