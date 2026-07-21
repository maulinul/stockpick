/* src/components/Toast.js - Toast Notification & Undo Manager */

import { el } from '../utils/dom.js';

let toastTimeout = null;

export function renderToast({ message, isError = false, undoAction = null }) {
  const container = document.getElementById('toastWrap') || el('div', { id: 'toastWrap', class: 'toast-wrap' });
  if (!container.parentElement) document.body.appendChild(container);

  container.innerHTML = '';

  const toastEl = el('div', { class: `toast ${isError ? 'err' : ''}` }, [
    el('span', { text: message }),
    undoAction ? el('button', {
      type: 'button',
      class: 'btn ghost',
      style: 'padding:2px 8px;font-size:11px;color:var(--gold)',
      text: '↩️ Undo',
      onclick: () => {
        undoAction();
        container.innerHTML = '';
      }
    }) : null
  ]);

  container.appendChild(toastEl);

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastEl.classList.add('leaving');
    setTimeout(() => { container.innerHTML = ''; }, 300);
  }, isError ? 4000 : 2500);
}
