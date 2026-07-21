/* src/components/ExportImportModal.js - Data Export & Import Modal */

import { el } from '../utils/dom.js';
import { exportJsonText, tryAutoDownload, copyToClipboard } from '../services/export.js';

export function renderExportImportModal({ store, entriesActions, uiActions, toastAction }) {
  const jsonText = exportJsonText(store.state.entries);

  const handleDownload = () => {
    const ok = tryAutoDownload(store.state.entries);
    toastAction(ok ? "Download dicoba — cek folder Downloads" : "Download gagal, gunakan Salin ke Clipboard");
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard(store.state.entries);
      toastAction(`${store.state.entries.length} kartu tersalin ke clipboard`);
    } catch (e) {
      toastAction("Gagal menyalin otomatis", true);
    }
  };

  const handleFileImport = async (ev) => {
    const file = ev.target.files[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (!Array.isArray(parsed)) throw new Error("File bukan daftar kartu yang valid");
      if (confirm(`Timpa ${store.state.entries.length} kartu saat ini dengan ${parsed.length} kartu dari "${file.name}"?`)) {
        entriesActions.setEntries(parsed);
        toastAction(`${parsed.length} kartu berhasil dimuat dari file`);
        uiActions.closeModal();
      }
    } catch (e) {
      toastAction("Import gagal: " + e.message, true);
    }
    ev.target.value = "";
  };

  const modalEl = el('div', { class: 'modal-overlay show', onclick: (e) => { if (e.target.classList.contains('modal-overlay')) uiActions.closeModal(); } }, [
    el('div', { class: 'modal-content' }, [
      el('div', { style: 'display:flex;justify-content:space-between;align-items:center;margin-bottom:16px' }, [
        el('h2', { style: 'margin:0;font-size:18px', text: 'Export & Import Data' }),
        el('button', { type: 'button', class: 'btn ghost', text: '✕', onclick: () => uiActions.closeModal() })
      ]),

      el('div', { style: 'margin-bottom:16px' }, [
        el('label', { style: 'font-weight:600;font-size:12px;color:var(--text-dim)', text: 'Format JSON Data Kartu Saham' }),
        el('textarea', {
          rows: 6,
          style: 'width:100%;font-family:var(--font-mono);font-size:12px;margin-top:6px',
          value: jsonText,
          readonly: true
        })
      ]),

      el('div', { style: 'display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px' }, [
        el('button', { type: 'button', class: 'btn primary', text: '⬇️ Download File JSON', onclick: handleDownload }),
        el('button', { type: 'button', class: 'btn ghost', text: '📋 Salin ke Clipboard', onclick: handleCopy })
      ]),

      el('hr', { style: 'border:none;border-top:1px solid var(--border-soft);margin:20px 0' }),

      el('div', {}, [
        el('h4', { style: 'margin:0 0 8px;font-size:14px;color:var(--gold)', text: 'Import dari File JSON' }),
        el('input', {
          type: 'file',
          accept: '.json',
          style: 'display:none',
          id: 'importFileInput',
          onchange: handleFileImport
        }),
        el('button', {
          type: 'button',
          class: 'btn ghost',
          text: '📂 Pilih File JSON untuk Import',
          onclick: () => document.getElementById('importFileInput')?.click()
        })
      ])
    ])
  ]);

  return modalEl;
}
