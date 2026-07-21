/* src/components/ConfirmDialog.js - Custom Confirmation Modal */

import { el } from '../utils/dom.js';

export function renderConfirmDialog({ message, onConfirm, onCancel }) {
  const modalEl = el('div', { class: 'modal-overlay show', onclick: (e) => { if (e.target.classList.contains('modal-overlay')) onCancel(); } }, [
    el('div', { class: 'modal-content', style: 'max-width:380px;text-align:center' }, [
      el('h3', { style: 'margin:0 0 12px;font-size:16px', text: 'Konfirmasi Action' }),
      el('p', { style: 'font-size:14px;color:var(--text-dim);margin-bottom:20px', text: message }),
      el('div', { style: 'display:flex;justify-content:center;gap:12px' }, [
        el('button', { type: 'button', class: 'btn ghost', text: 'Batal', onclick: onCancel }),
        el('button', { type: 'button', class: 'btn danger', text: 'Ya, Lanjutkan', onclick: onConfirm })
      ])
    ])
  ]);

  return modalEl;
}
