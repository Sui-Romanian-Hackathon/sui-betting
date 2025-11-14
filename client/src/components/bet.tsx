export default function Bet() {
  return (
    <div className="flex w-full items-center gap-4 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* Left: title + description */}
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          The Bet Component
        </h2>
        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
          This is the first bet on the platform.
        </p>
      </div>

      {/* Right: bet buttons */}
      <div className="flex shrink-0 gap-2">
        <button className="rounded-full border border-emerald-500 px-3 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-900/30">
          Place Bet
        </button>
      </div>
    </div>
  )
}
