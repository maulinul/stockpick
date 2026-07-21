/* src/components/StockCard.js - Individual Stock Card Component */

import { el, esc } from '../utils/dom.js';
import { fmtTanggal } from '../utils/date.js';
import { tickerHistory, lastDelta, rrRatioValue, signalOf, pctOf } from '../utils/calc.js';

export function renderSparklineSVG(entries, ticker) {
  const hist = tickerHistory(entries, ticker);
  if (hist.length < 2) return "";
  const w = 110, h = 32, pad = 4;
  const vals = hist.map(p => p.harga);
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const span = (hi - lo) || 1;

  const pts = hist.map((p, i) => {
    const x = pad + (i / (hist.length - 1)) * (w - pad * 2);
    const y = pad + (1 - (p.harga - lo) / span) * (h - pad * 2);
    return [x, y];
  });

  const d = pts.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
  const areaD = `${d} L ${pts[pts.length - 1][0].toFixed(1)},${h} L ${pts[0][0].toFixed(1)},${h} Z`;

  const delta = lastDelta(entries, ticker);
  const rising = delta ? delta.abs >= 0 : true;
  const color = rising ? "var(--emerald)" : "var(--ruby)";
  const last = pts[pts.length - 1];

  return `
    <div class="spark-wrap">
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <defs>
          <linearGradient id="sparkGrad_${ticker}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="${color}" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <path class="spark-area" d="${areaD}" fill="url(#sparkGrad_${ticker})"/>
        <path class="spark-line" d="${d}" style="stroke:${color}"/>
        <circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="3" fill="${color}"/>
      </svg>
      <div class="spark-label">
        Histori ${hist.length} log<br>
        <b>${esc(hist[0].harga)} → ${esc(hist[hist.length - 1].harga)}</b>
      </div>
    </div>
  `;
}

export function renderStockCard({ entry, index, allEntries, isSelected, onSelect, onOpenDetail }) {
  const signal = signalOf(entry);
  const ratio = rrRatioValue(entry);
  const s = entry.s || {};

  const hist = tickerHistory(allEntries, entry.ticker);
  const isLatest = hist.length && hist[hist.length - 1].tanggal === entry.tanggal && hist[hist.length - 1].jam === entry.jam;
  const delta = isLatest ? lastDelta(allEntries, entry.ticker) : null;

  const deltaBadgeHtml = delta
    ? `<span class="card-delta ${delta.abs >= 0 ? "pos" : "neg"}">${delta.abs >= 0 ? "▲" : "▼"}${Math.abs(delta.pct).toFixed(1)}%</span>`
    : "";

  const up = pctOf(s.rrTarget);
  const down = pctOf(s.rrStop);
  const rrBarHtml = (up != null && down != null && (up + down) > 0)
    ? `<div class="card-rr-mini" role="img" aria-label="Potensi rugi ${down}%, potensi untung ${up}%">
        <span class="seg stop" style="width:${((down / (up + down)) * 100).toFixed(1)}%"></span>
        <span class="seg target" style="width:${((up / (up + down)) * 100).toFixed(1)}%"></span>
       </div>`
    : "";

  const cardEl = el('div', {
    class: 'log-card glass',
    'data-id': entry.id,
    'data-signal': signal,
    style: `--i:${index}`
  }, [
    el('div', { style: 'display:flex;align-items:center;padding:4px 0 0 16px' }, [
      el('input', {
        type: 'checkbox',
        class: 'card-batch-check',
        checked: isSelected,
        onchange: () => onSelect(entry.id)
      })
    ]),
    el('button', {
      type: 'button',
      class: 'card-btn',
      'aria-label': `Detail $${entry.ticker}, ${fmtTanggal(entry.tanggal)}`,
      onclick: () => onOpenDetail(entry)
    }, [
      el('span', { class: 'card-date' }, [
        el('span', { text: fmtTanggal(entry.tanggal) }),
        el('span', { text: entry.jam || '' })
      ]),
      el('span', { class: 'card-mid' }, [
        el('div', {
          class: 'card-tags',
          html: `
            ${s.fresh ? '<span class="status-tag buy">Fresh buy</span>' : ''}
            ${ratio != null ? `<span class="status-tag ${ratio < 1 ? 'risk' : ''}">RR 1:${ratio.toFixed(1)}</span>` : ''}
            ${!s.fresh && ratio == null ? '<span class="status-tag">Watchlist</span>' : ''}
          `
        }),
        el('span', { class: 'card-ticker', text: `$${entry.ticker}` }),
        el('span', {
          class: 'card-price-row',
          html: `<span class="card-price">${esc(entry.harga)}</span>${deltaBadgeHtml}`
        }),
        entry.desc ? el('span', { class: 'card-desc', text: entry.desc }) : null,
        el('div', { html: rrBarHtml })
      ]),
      el('span', { class: 'card-open-hint', text: 'Detail »' })
    ])
  ]);

  return cardEl;
}
