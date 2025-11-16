//client/src/components/menu/modals/modal.tsx

import React from 'react'

type ModalProps = {
  title: string
  children: React.ReactNode
  onClose: () => void
}

export default function Modal({ title, children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-50">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full border border-zinc-700 px-2.5 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
