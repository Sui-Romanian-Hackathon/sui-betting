//client/src/components/menu/modals/filter-modal.tsx

import Modal from './base-modal'

type Props = {
  onClose: () => void
}

export default function FilterModal({ onClose }: Props) {
  return (
    <Modal title="Filter Bets" onClose={onClose}>
      <form className="space-y-4 text-left text-sm text-zinc-100">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">Status</p>
          <div className="space-y-1">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-zinc-100" defaultChecked />
              <span>Open</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-zinc-100" defaultChecked />
              <span>Resolved</span>
            </label>
          </div>
        </div>

        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">Asset</p>
          <div className="space-y-1">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-zinc-100" defaultChecked />
              <span>SUI / USD</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-zinc-100" defaultChecked />
              <span>BTC / USD</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-zinc-700 px-4 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-full bg-zinc-100 px-4 py-1.5 text-xs font-medium text-zinc-900 hover:bg-zinc-200"
          >
            Apply
          </button>
        </div>
      </form>
    </Modal>
  )
}
