/* src/components/FocusView.js - Per-Ticker Focus & History View */

import { el, esc } from '../utils/dom.js';
import { tickerHistory, rrRatioValue, signalOf } from '../utils/calc.js';

export function renderFocusView({ entries, allEntries, uiActions }) {
  const latestByTicker = new Map();
  entries.forEach(entry => {
    if (!latestByTicker.has(entry.ticker)) latestByTicker.set(entry.ticker, entry);
  });

  const cards = [...latestByTicker.values()].map(entry => {
    const hist = tickerHistory(allEntries, entry.ticker);
    const vals = hist.map(p => p.harga);
    const min = vals.length ? Math.min(...vals) : 0;
    const max = vals.length ? Math.max(...vals) : 1;
    const span = max - min || 1;

    const barsHtml = hist.slice(-12).map(p => 
      `<span class="history-bar" title="${esc(String(p.harga))}" style="height:${18 + ((p.harga - min) / span) * 34}px;width:6px;background:var(--emerald);border-radius:2px;display:inline-block;margin:0 2px"></span>`
    ).join('');

    const ratio = rrRatioValue(entry);
    const signal = signalOf(entry);

    return el('article', { class: 'focus-card glass', style: 'padding:16px;border-radius:14px;margin-bottom:14px' }, [
      el('div', { class: 'focus-head', style: 'display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px' }, [
        el('div', {}, [
          el('strong', { style: 'font-size:18px', text: `$${entry.ticker}` }),
          el('div', { class: 'focus-meta', style: 'font-size:12px;color:var(--text-faint)', text: `${hist.length} catatan historis` })
        ]),
        el('div', { class: 'focus-price', style: 'text-align:right' }, [
          el('div', { style: 'font-family:var(--font-mono);font-weight:700', text: entry.harga || '—' }),
          el('div', {
            html: `<span class="status-tag ${signal === 'good' ? 'buy' : signal === 'risk' ? 'risk' : ''}">${ratio != null ? `RR 1:${ratio.toFixed(1)}` : 'Pantau'}</span>`
          })
        ])
      ]),
      el('div', {
        class: 'focus-history',
        style: 'display:flex;align-items:flex-end;height:45px;margin:10px 0;background:var(--surface);padding:6px;border-radius:8px',
        html: barsHtml || '<span style="font-size:11px;color:var(--text-faint)">Tambahkan catatan harga lain untuk melihat histori.</span>'
      }),
      el('p', { style: 'font-size:13px;color:var(--text-dim)', text: entry.desc || entry.s?.kondisiText || 'Analisis terbaru' }),
      el('button', {
        type: 'button',
        class: 'btn ghost',
        style: 'margin-top:10px',
        text: 'Buka histori & detail →',
        onclick: () => uiActions.openModal('detail', entry)
      })
    ]);
  });

  return el('div', { class: 'focus-grid' }, cards);
}
