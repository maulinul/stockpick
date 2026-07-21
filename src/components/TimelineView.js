/* src/components/TimelineView.js - Chronological Timeline View */

import { el, esc } from '../utils/dom.js';
import { fmtTanggal } from '../utils/date.js';

export function renderTimelineView({ entries, uiActions }) {
  const container = el('div', { class: 'timeline' }, 
    entries.map(entry => {
      const btn = el('button', {
        type: 'button',
        class: 'timeline-item glass',
        style: 'border:1px solid var(--border);text-align:left;color:inherit;cursor:pointer;width:100%;padding:14px;border-radius:12px;margin-bottom:10px',
        onclick: () => uiActions.openModal('detail', entry)
      }, [
        el('div', { class: 'timeline-top', style: 'display:flex;justify-space-between;margin-bottom:6px' }, [
          el('span', { class: 'timeline-ticker', style: 'font-weight:700', text: `$${entry.ticker} · ${entry.harga || '—'}` }),
          el('span', { class: 'timeline-date', style: 'font-size:12px;color:var(--text-faint)', text: `${fmtTanggal(entry.tanggal)} ${entry.jam || ''}` })
        ]),
        el('p', { class: 'timeline-desc', style: 'font-size:13px;color:var(--text-dim);margin:0', text: entry.desc || entry.s?.kondisiText || 'Buka detail analisis' })
      ]);
      return btn;
    })
  );

  return container;
}
