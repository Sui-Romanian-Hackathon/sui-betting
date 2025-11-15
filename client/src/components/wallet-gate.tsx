'use client'

import { ReactNode } from 'react'
import { useCurrentAccount } from '@mysten/dapp-kit'
import Wallet from './wallet'

type WalletGateProps = {
  children: ReactNode
}

export default function WalletGate({ children }: WalletGateProps) {
  const account = useCurrentAccount()

  if (!account) {
    return (
      <section className="flex flex-col items-center justify-center gap-6 px-6 py-16 text-center">
        <h2 className="text-3xl font-semibold text-zinc-900 sm:text-4xl dark:text-zinc-50">
          Connect your SUI Wallet
        </h2>
        <p className="text-base text-zinc-500 dark:text-zinc-400">
          Link your wallet to browse bets and place wagers on Sui.
        </p>
        <Wallet showBalance={false} />
      </section>
    )
  }

  return <>{children}</>
}
