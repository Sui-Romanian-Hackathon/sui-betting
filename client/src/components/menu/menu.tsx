//client/src/components/menu/menu.tsx

'use client'

import { useState } from 'react'
import CreateBetModal from './modals/create-bet-modal'
import SortModal from './modals/sort-modal'
import FilterModal from './modals/filter-modal'

type OpenModal = 'create' | 'sort' | 'filter' | null

export default function Menu() {
  const [open, setOpen] = useState<OpenModal>(null)

  const close = () => setOpen(null)

  const buttons: { label: string; action: OpenModal; gradient: string }[] = [
    { label: '+ Create Bet', action: 'create', gradient: 'from-fuchsia-500 via-purple-500 to-indigo-500' },
    { label: 'Sort', action: 'sort', gradient: 'from-purple-500 to-purple-700' },
    { label: 'Filter', action: 'filter', gradient: 'from-indigo-500 to-blue-600' },
  ]

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        {buttons.map((btn) => (
          <button
            key={btn.label}
            onClick={() => setOpen(btn.action)}
            className={`rounded-full border border-white/20 bg-gradient-to-r ${btn.gradient} px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-purple-900/40 transition hover:scale-[1.03]`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {open === 'create' && <CreateBetModal onClose={close} />}
      {open === 'sort' && <SortModal onClose={close} />}
      {open === 'filter' && <FilterModal onClose={close} />}
    </>
  )
}
