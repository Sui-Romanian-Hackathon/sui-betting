'use client'

import { useState } from 'react'
import CreateBetModal from './modals/create-bet-modal'
import SortModal from './modals/sort-modal'
import FilterModal from './modals/filter-modal'

type OpenModal = 'create' | 'sort' | 'filter' | null

export default function Menu() {
  const [open, setOpen] = useState<OpenModal>(null)

  const close = () => setOpen(null)

  return (
    <>
      {/* Button group */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOpen('create')}
          className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          + Create Bet
        </button>

        <button
          onClick={() => setOpen('sort')}
          className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Sort
        </button>

        <button
          onClick={() => setOpen('filter')}
          className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Filter
        </button>
      </div>

      {open === 'create' && <CreateBetModal onClose={close} />}
      {open === 'sort' && <SortModal onClose={close} />}
      {open === 'filter' && <FilterModal onClose={close} />}
    </>
  )
}
