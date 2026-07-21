/* src/components/TableView.js - Data Table View */

import { el, esc } from '../utils/dom.js';
import { rrRatioValue, signalOf } from '../utils/calc.js';

export function renderTableView({ entries, uiActions }) {
  const tbody = el('tbody', {}, 
    entries.map(entry => {
      const s = entry.s || {};
      const ratio = rrRatioValue(entry);
      const signal = signalOf(entry);

      return el('tr', {}, [
        el('td', { style: 'font-weight:700', text: `$${entry.ticker}` }),
        el('td', { text: entry.harga || '—' }),
        el('td', { text: s.kondisiS || '—' }),
        el('td', { text: s.kondisiR || '—' }),
        el('td', { text: ratio != null ? `1:${ratio.toFixed(1)}` : '—' }),
        el('td', {
          html: `<span class="status-tag ${signal === 'risk' ? 'risk' : signal === 'good' ? 'buy' : ''}">${signal === 'good' ? 'Peluang' : signal === 'risk' ? 'Risk' : 'Pantau'}</span>`
        }),
        el('td', {}, [
          el('button', {
            type: 'button',
            class: 'btn ghost',
            style: 'padding:3px 8px;font-size:11px',
            text: 'Buka →',
            onclick: () => uiActions.openModal('detail', entry)
          })
        ])
      ]);
    })
  );

  const tableEl = el('div', { style: 'overflow-x:auto' }, [
    el('table', { class: 'market-table', style: 'width:100%;border-collapse:collapse' }, [
      el('thead', {}, [
        el('tr', {}, [
          el('th', { text: 'Ticker' }),
          el('th', { text: 'Harga' }),
          el('th', { text: 'Support' }),
          el('th', { text: 'Resistance' }),
          el('th', { text: 'RR' }),
          el('th', { text: 'Status' }),
          el('th', { text: '' })
        ])
      ]),
      tbody
    ])
  ]);

  return tableEl;
}
