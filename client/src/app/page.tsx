import BetList from '@/components/bet-list/bet-list'
import Menu from '@/components/menu/menu'
import Wallet from '@/components/wallet'

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 font-sans">
      <main className="w-full max-w-6xl px-4 py-10 sm:px-8">
        {/* Betting window */}
        <div className="mx-auto w-full max-w-5xl rounded-3xl border border-zinc-200 bg-white/80 shadow-xl backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
          {/* Top menu bar */}
          <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                SUI Betting
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                The on-chain casino built on Sui Blockchain.
              </p>
            </div>

            <Menu />
          </header>

          <BetList />

          <Wallet />
        </div>
      </main>
    </div>
  )
}
