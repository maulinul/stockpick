/* src/components/HeatmapView.js - Market Visual Heatmap View */

import { el } from '../utils/dom.js';
import { signalOf, rrRatioValue } from '../utils/calc.js';

export function renderHeatmapView({ entries, uiActions }) {
  const latestByTicker = new Map();
  entries.forEach(entry => {
    if (!latestByTicker.has(entry.ticker)) latestByTicker.set(entry.ticker, entry);
  });

  const cells = [...latestByTicker.values()].map(entry => {
    const signal = signalOf(entry);
    const ratio = rrRatioValue(entry);

    const heat = signal === "good" ? "var(--emerald-soft)" : signal === "risk" ? "var(--ruby-soft)" : "var(--gold-soft)";
    const heatText = signal === "good" ? "var(--emerald)" : signal === "risk" ? "var(--ruby)" : "var(--gold)";

    return el('button', {
      type: 'button',
      class: 'heat-cell glass',
      style: `background:${heat};border:1px solid ${heatText};padding:14px;border-radius:12px;cursor:pointer;text-align:left;display:flex;flex-direction:column;gap:4px`,
      onclick: () => uiActions.openModal('detail', entry)
    }, [
      el('strong', { style: `color:${heatText};font-size:16px`, text: `$${entry.ticker}` }),
      el('span', { style: 'font-size:12px;color:var(--text)', text: `Harga ${entry.harga || '—'}` }),
      el('span', { style: 'font-size:11px;color:var(--text-dim)', text: ratio != null ? `RR 1:${ratio.toFixed(1)}` : 'Belum ada RR' }),
      el('span', { style: `font-size:10px;font-weight:700;color:${heatText}`, text: signal === 'good' ? 'Peluang menarik' : signal === 'risk' ? 'Perlu perhatian' : 'Dalam pantauan' })
    ]);
  });

  return el('div', { class: 'heatmap', style: 'display:grid;grid-template-columns:repeat(auto-fill, minmax(140px, 1fr));gap:12px' }, cells);
}
