/* src/components/BatchActionBar.js - Floating Action Bar for Batch Operations */

import { el } from '../utils/dom.js';

export function renderBatchActionBar({ store, entriesActions, toastAction }) {
  const selectedCount = store.state.selectedIds.size;

  const handleBatchDelete = () => {
    if (confirm(`Hapus ${selectedCount} kartu terpilih sekaligus?`)) {
      entriesActions.batchDelete();
      toastAction(`${selectedCount} kartu berhasil dihapus`);
    }
  };

  const barEl = el('div', { class: 'batch-bar ' + (selectedCount > 0 ? 'show' : '') }, [
    el('span', { class: 'batch-count', text: `${selectedCount} kartu terpilih` }),
    el('button', {
      type: 'button',
      class: 'btn danger',
      style: 'padding:5px 12px;font-size:12px',
      text: '🗑️ Hapus Terpilih',
      onclick: handleBatchDelete
    }),
    el('button', {
      type: 'button',
      class: 'btn ghost',
      style: 'padding:5px 10px;font-size:12px',
      text: 'Batal',
      onclick: () => entriesActions.clearSelection()
    })
  ]);

  return barEl;
}
