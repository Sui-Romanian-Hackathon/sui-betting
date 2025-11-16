//client/src/app/(dapp)/page.tsx

'use client'

import BetList from '@/modules/bets/components/bet-list'
import Menu from '@/modules/layout/components/control-menu'
import WalletGate from '@/modules/wallet/components/wallet-gate'
import Wallet from '@/modules/wallet/components/wallet-panel'

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* ambient lights */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-20 h-64 w-64 rounded-full bg-fuchsia-500/40 blur-[150px]" />
        <div className="absolute top-10 right-10 h-72 w-72 rounded-full bg-purple-600/40 blur-[160px]" />
        <div className="absolute bottom-0 left-1/2 h-60 w-[500px] -translate-x-1/2 rounded-[999px] bg-indigo-500/20 blur-[130px]" />
      </div>

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
        <div className="w-full max-w-6xl rounded-[36px] border border-white/10 bg-[rgba(12,0,24,0.85)] p-[1px] shadow-[0_25px_120px_rgba(9,1,18,0.8)] backdrop-blur-2xl">
          <div className="rounded-[34px] border border-white/10 bg-[rgba(10,0,20,0.65)]">
            <WalletGate>
              <header className="flex flex-col gap-8 rounded-t-[34px] border-b border-white/10 bg-gradient-to-r from-purple-900/70 via-purple-800/50 to-indigo-900/30 px-8 py-10 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.4em] text-purple-200/80">
                    SUI ROYALE
                  </div>
                  <div>
                    <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                      Purple Palace Online Casino
                    </h1>
                    <p className="mt-3 max-w-xl text-base text-purple-100/80">
                      Flashy odds, velvet gradients and instant wagers on-chain. Place bets with
                      confidence in the most elegant Sui-powered experience.
                    </p>
                  </div>
                  <div className="grid gap-4 text-sm text-white/90 sm:grid-cols-3">
                    {[
                      { label: 'Total Pools', value: '32 Active' },
                      { label: 'Jackpot Volume', value: '412,980 SUI' },
                      { label: 'Avg. Payout', value: '195%' },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                      >
                        <p className="text-xs uppercase tracking-wide text-purple-200/80">
                          {stat.label}
                        </p>
                        <p className="text-lg font-semibold text-white">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-black/30 p-6 shadow-inner shadow-purple-900/30 lg:items-end">
                  <Wallet />
                  <Menu />
                </div>
              </header>
              <div className="px-6 pb-10 pt-8 sm:px-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4 text-sm text-purple-100/80">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-purple-200/60">
                      Live Tables
                    </p>
                    <p className="text-xl font-semibold text-white">Betting Gallery</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                    Odds updating every block
                  </div>
                </div>
                <BetList />
              </div>
            </WalletGate>
          </div>
        </div>
      </main>
    </div>
  )
}
