/* src/components/SyncPanel.js - GitHub Repository & Gist Synchronization Modal */

import { el } from '../utils/dom.js';
import { saveToRepo, loadFromRepo } from '../services/github.js';
import { saveToGist, loadFromGist } from '../services/gist.js';
import { exportJsonText } from '../services/export.js';

export function renderSyncPanel({ store, syncActions, entriesActions, uiActions, toastAction }) {
  const settings = store.state.ghSettings;

  let tokenInput, ownerInput, repoInput, branchInput, pathInput, gistIdInput, gistDescInput, gistPublicCheck;

  tokenInput = el('input', { type: 'password', placeholder: 'ghp_xxxxxxxxxxxx', value: settings.token || '' });
  ownerInput = el('input', { type: 'text', placeholder: 'username', value: settings.owner || '' });
  repoInput = el('input', { type: 'text', placeholder: 'stockpick-data', value: settings.repo || '' });
  branchInput = el('input', { type: 'text', placeholder: 'main', value: settings.branch || 'main' });
  pathInput = el('input', { type: 'text', placeholder: 'data/kartu-saham.json', value: settings.path || 'data/kartu-saham.json' });

  gistIdInput = el('input', { type: 'text', placeholder: 'Gist ID', value: settings.gistId || '' });
  gistDescInput = el('input', { type: 'text', placeholder: 'Log kartu saham', value: settings.gistDesc || 'Log kartu saham' });
  gistPublicCheck = el('input', { type: 'checkbox', checked: !!settings.gistPublic });

  const getFormValues = () => ({
    token: tokenInput.value.trim(),
    owner: ownerInput.value.trim(),
    repo: repoInput.value.trim(),
    branch: branchInput.value.trim() || 'main',
    path: pathInput.value.trim() || 'data/kartu-saham.json',
    gistId: gistIdInput.value.trim(),
    gistDesc: gistDescInput.value.trim() || 'Log kartu saham',
    gistPublic: gistPublicCheck.checked
  });

  const handleSaveRepo = async () => {
    const vals = getFormValues();
    syncActions.updateGhSettings(vals);
    try {
      syncActions.setRepoStatus("Menyimpan ke Repo...");
      await saveToRepo({
        ...vals,
        jsonText: exportJsonText(store.state.entries)
      });
      syncActions.setRepoStatus(`Tersimpan ke ${vals.owner}/${vals.repo}:${vals.path}`);
      toastAction(`${store.state.entries.length} kartu tersimpan ke GitHub Repo`);
    } catch (e) {
      syncActions.setRepoStatus("Gagal: " + e.message);
      toastAction("Simpan Repo gagal: " + e.message, true);
    }
  };

  const handleLoadRepo = async () => {
    const vals = getFormValues();
    syncActions.updateGhSettings(vals);
    if (confirm(`Timpa ${store.state.entries.length} kartu lokal dengan data dari ${vals.owner}/${vals.repo}:${vals.path}?`)) {
      try {
        syncActions.setRepoStatus("Memuat dari Repo...");
        const entries = await loadFromRepo(vals);
        entriesActions.setEntries(entries);
        syncActions.setRepoStatus(`Dimuat dari ${vals.owner}/${vals.repo}:${vals.path}`);
        toastAction(`${entries.length} kartu dimuat dari GitHub Repo`);
      } catch (e) {
        syncActions.setRepoStatus("Gagal: " + e.message);
        toastAction("Muat Repo gagal: " + e.message, true);
      }
    }
  };

  const handleSaveGist = async () => {
    const vals = getFormValues();
    syncActions.updateGhSettings(vals);
    try {
      syncActions.setGistStatus("Menyimpan ke Gist...");
      const res = await saveToGist({
        ...vals,
        jsonText: exportJsonText(store.state.entries)
      });
      if (res.gistId) gistIdInput.value = res.gistId;
      syncActions.setGistStatus(`Tersimpan: ${res.url}`);
      toastAction(`${store.state.entries.length} kartu tersimpan ke Gist`);
    } catch (e) {
      syncActions.setGistStatus("Gagal: " + e.message);
      toastAction("Simpan Gist gagal: " + e.message, true);
    }
  };

  const handleLoadGist = async () => {
    const vals = getFormValues();
    syncActions.updateGhSettings(vals);
    if (confirm(`Timpa ${store.state.entries.length} kartu lokal dengan data dari Gist ${vals.gistId}?`)) {
      try {
        syncActions.setGistStatus("Memuat dari Gist...");
        const entries = await loadFromGist(vals);
        entriesActions.setEntries(entries);
        syncActions.setGistStatus(`Dimuat dari Gist ${vals.gistId}`);
        toastAction(`${entries.length} kartu dimuat dari Gist`);
      } catch (e) {
        syncActions.setGistStatus("Gagal: " + e.message);
        toastAction("Muat Gist gagal: " + e.message, true);
      }
    }
  };

  const modalEl = el('div', { class: 'modal-overlay show', onclick: (e) => { if (e.target.classList.contains('modal-overlay')) uiActions.closeModal(); } }, [
    el('div', { class: 'modal-content' }, [
      el('div', { style: 'display:flex;justify-content:space-between;align-items:center;margin-bottom:16px' }, [
        el('h2', { style: 'margin:0;font-size:18px', text: 'Sinkronisasi GitHub & Gist' }),
        el('button', { type: 'button', class: 'btn ghost', text: '✕', onclick: () => uiActions.closeModal() })
      ]),

      el('div', { class: 'form-field full', style: 'margin-bottom:16px' }, [
        el('label', { text: 'Personal Access Token (PAT)' }),
        tokenInput
      ]),

      el('div', { class: 'glass', style: 'padding:14px;border-radius:12px;margin-bottom:16px' }, [
        el('h4', { style: 'margin:0 0 10px;color:var(--gold)', text: '1. GitHub Repository Contents' }),
        el('div', { class: 'form-grid' }, [
          el('div', { class: 'form-field' }, [el('label', { text: 'Owner / Username' }), ownerInput]),
          el('div', { class: 'form-field' }, [el('label', { text: 'Repository Name' }), repoInput]),
          el('div', { class: 'form-field' }, [el('label', { text: 'Branch' }), branchInput]),
          el('div', { class: 'form-field' }, [el('label', { text: 'File Path' }), pathInput])
        ]),
        el('div', { style: 'display:flex;gap:10px;margin-top:12px' }, [
          el('button', { type: 'button', class: 'btn primary', text: '☁️ Simpan ke Repo', onclick: handleSaveRepo }),
          el('button', { type: 'button', class: 'btn ghost', text: '🔄 Muat dari Repo', onclick: handleLoadRepo })
        ]),
        el('div', { style: 'font-size:12px;color:var(--text-faint);margin-top:8px', text: store.state.repoSyncStatus })
      ]),

      el('div', { class: 'glass', style: 'padding:14px;border-radius:12px' }, [
        el('h4', { style: 'margin:0 0 10px;color:var(--emerald)', text: '2. GitHub Gist' }),
        el('div', { class: 'form-grid' }, [
          el('div', { class: 'form-field' }, [el('label', { text: 'Gist ID (Opsional jika baru)' }), gistIdInput]),
          el('div', { class: 'form-field' }, [el('label', { text: 'Deskripsi Gist' }), gistDescInput])
        ]),
        el('div', { style: 'display:flex;gap:10px;margin-top:12px' }, [
          el('button', { type: 'button', class: 'btn primary', text: '☁️ Simpan ke Gist', onclick: handleSaveGist }),
          el('button', { type: 'button', class: 'btn ghost', text: '🔄 Muat dari Gist', onclick: handleLoadGist })
        ]),
        el('div', { style: 'font-size:12px;color:var(--text-faint);margin-top:8px', text: store.state.gistSyncStatus })
      ])
    ])
  ]);

  return modalEl;
}
