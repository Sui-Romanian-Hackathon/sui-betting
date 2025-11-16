//client/src/components/menu/modals/sort-modal.tsx

import Modal from './base-modal'

type Props = {
  onClose: () => void
}

export default function SortModal({ onClose }: Props) {
  return (
    <Modal title="Sort Bets" onClose={onClose}>
      <form className="space-y-3 text-left text-sm text-zinc-100">
        <p className="text-xs text-zinc-400">Choose how to order the bet lines.</p>

        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="radio" name="sort" className="accent-zinc-100" defaultChecked />
            <span>Newest first</span>
          </label>

          <label className="flex items-center gap-2">
            <input type="radio" name="sort" className="accent-zinc-100" />
            <span>Oldest first</span>
          </label>

          <label className="flex items-center gap-2">
            <input type="radio" name="sort" className="accent-zinc-100" />
            <span>Largest pool</span>
          </label>

          <label className="flex items-center gap-2">
            <input type="radio" name="sort" className="accent-zinc-100" />
            <span>Earliest resolution</span>
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-zinc-700 px-4 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-800"
          >
            Close
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
