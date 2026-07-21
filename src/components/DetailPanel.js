/* src/components/DetailPanel.js - Slide-over Analysis Detail Panel */

import { el, esc } from '../utils/dom.js';
import { fmtTanggal } from '../utils/date.js';
import { renderSparklineSVG } from './StockCard.js';
import { rrRatioValue } from '../utils/calc.js';

export function renderDetailPanel({ entry, allEntries, uiActions, entriesActions, toastAction }) {
  if (!entry) return null;

  const sorted = [...allEntries].sort((a, b) => `${b.tanggal} ${b.jam}`.localeCompare(`${a.tanggal} ${a.jam}`));
  const detailIndex = sorted.findIndex(e => e.id === entry.id);
  const prevEntry = detailIndex > 0 ? sorted[detailIndex - 1] : null;
  const nextEntry = detailIndex >= 0 && detailIndex < sorted.length - 1 ? sorted[detailIndex + 1] : null;

  const s = entry.s || {};
  const ratio = rrRatioValue(entry);

  const handleDelete = () => {
    if (confirm(`Hapus kartu $${entry.ticker} (${fmtTanggal(entry.tanggal)})?`)) {
      entriesActions.deleteEntry(entry.id);
      uiActions.closeModal();
      toastAction(`$${entry.ticker} dihapus`);
    }
  };

  const sparklineHtml = renderSparklineSVG(allEntries, entry.ticker);

  const modalEl = el('div', { class: 'detail-overlay show', onclick: (e) => { if (e.target.classList.contains('detail-overlay')) uiActions.closeModal(); } }, [
    el('div', { class: 'detail-panel' }, [
      // Header
      el('div', { style: 'display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px' }, [
        el('div', {}, [
          el('h2', { style: 'margin:0;font-size:24px;color:var(--text)', text: `$${entry.ticker}` }),
          el('div', { style: 'font-family:var(--font-mono);font-size:18px;color:var(--gold)', text: entry.harga ? `Rp ${entry.harga}` : '' })
        ]),
        el('div', { style: 'display:flex;align-items:center;gap:10px' }, [
          el('span', { style: 'font-size:12px;color:var(--text-faint);text-align:right', html: `${fmtTanggal(entry.tanggal)}<br>${entry.jam || ''}` }),
          el('button', {
            type: 'button',
            class: 'btn ghost',
            style: 'padding:4px 8px;font-size:16px',
            text: '✕',
            onclick: () => uiActions.closeModal()
          })
        ])
      ]),

      entry.desc ? el('p', { style: 'font-size:14px;color:var(--text-dim);line-height:1.5;margin-bottom:16px', text: entry.desc }) : null,

      // Sparkline
      el('div', { html: sparklineHtml }),

      // Support & Resistance Price Map
      (s.kondisiS || s.kondisiR) ? el('div', { class: 'glass', style: 'padding:12px;border-radius:10px;margin:14px 0' }, [
        el('div', { style: 'display:flex;justify-content:space-between;font-size:12px;color:var(--text-dim);font-weight:600' }, [
          el('span', { text: `Support: ${s.kondisiS || '—'}` }),
          el('span', { text: `Resistance: ${s.kondisiR || '—'}` })
        ])
      ]) : null,

      // Analysis Text Sections
      s.kondisiText ? el('div', { class: 'glass', style: 'padding:14px;border-radius:10px;margin-bottom:12px' }, [
        el('h4', { style: 'margin:0 0 6px;color:var(--gold)', text: 'Kondisi Terbaru' }),
        el('p', { style: 'margin:0;font-size:13px;color:var(--text-dim)', text: s.kondisiText })
      ]) : null,

      s.skenario ? el('div', { class: 'glass', style: 'padding:14px;border-radius:10px;margin-bottom:12px' }, [
        el('h4', { style: 'margin:0 0 6px;color:var(--ruby)', text: 'Skenario Terburuk' }),
        el('p', { style: 'margin:0;font-size:13px;color:var(--text-dim)', text: s.skenario })
      ]) : null,

      s.bandar ? el('div', { class: 'glass', style: 'padding:14px;border-radius:10px;margin-bottom:12px' }, [
        el('h4', { style: 'margin:0 0 6px;color:var(--emerald)', text: 'Bandarmology' }),
        el('p', { style: 'margin:0;font-size:13px;color:var(--text-dim)', text: s.bandar })
      ]) : null,

      s.rr ? el('div', { class: 'glass', style: 'padding:14px;border-radius:10px;margin-bottom:12px' }, [
        el('h4', { style: 'margin:0 0 6px;color:var(--gold)', text: 'Risk Reward' }),
        el('p', { style: 'margin:0;font-size:13px;color:var(--text-dim)', text: s.rr }),
        ratio != null ? el('div', { style: 'margin-top:6px;font-weight:700;color:var(--emerald)', text: `Rasio RR: 1:${ratio.toFixed(1)}` }) : null
      ]) : null,

      // Action Buttons & Nav
      el('div', { style: 'display:flex;gap:10px;margin-top:20px' }, [
        el('button', {
          type: 'button',
          class: 'btn primary',
          text: '✏️ Edit',
          onclick: () => uiActions.openModal('form', entry)
        }),
        el('button', {
          type: 'button',
          class: 'btn danger',
          text: '🗑️ Hapus',
          onclick: handleDelete
        })
      ]),

      el('div', { style: 'display:flex;justify-content:space-between;margin-top:24px;border-top:1px solid var(--border-soft);padding-top:14px' }, [
        el('button', {
          type: 'button',
          class: 'btn ghost',
          disabled: !prevEntry,
          text: '← Lebih Baru',
          onclick: () => uiActions.openModal('detail', prevEntry)
        }),
        el('button', {
          type: 'button',
          class: 'btn ghost',
          disabled: !nextEntry,
          text: 'Lebih Lama →',
          onclick: () => uiActions.openModal('detail', nextEntry)
        })
      ])
    ])
  ]);

  return modalEl;
}
