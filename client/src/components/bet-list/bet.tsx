export default async function Bet({ bet }: BetProps) {
  const betObj: BetObj = bet
  return (
    <div className="flex w-full items-center gap-4 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          {betObj.description ?? 'Loading...'}
        </h2>
        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{bet.id.id}</p>
      </div>

      <div className="flex shrink-0 gap-2">
        <button className="rounded-full border border-emerald-500 px-3 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-900/30">
          Place Bet
        </button>
      </div>
    </div>
  )
}
