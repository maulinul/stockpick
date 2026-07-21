/* src/app.js - Root Application Controller & Orchestrator */

import { createStore } from './state/store.js';
import { createEntriesSlice } from './state/entriesSlice.js';
import { createUiSlice } from './state/uiSlice.js';
import { createSyncSlice } from './state/syncSlice.js';
import { MarketAurora } from './canvas/MarketAurora.js';
import { registerKeyboardShortcuts } from './utils/keyboard.js';
import { riskPctOf, rewardPctOf, signalOf } from './utils/calc.js';
import { todayStr, weekStartStr } from './utils/date.js';

import { renderHeader } from './components/Header.js';
import { renderMarketPulse } from './components/MarketPulse.js';
import { renderQuickAddBar } from './components/QuickAddBar.js';
import { renderToolbar } from './components/Toolbar.js';
import { renderBatchActionBar } from './components/BatchActionBar.js';
import { renderCardGrid } from './components/CardGrid.js';
import { renderTimelineView } from './components/TimelineView.js';
import { renderTableView } from './components/TableView.js';
import { renderHeatmapView } from './components/HeatmapView.js';
import { renderFocusView } from './components/FocusView.js';
import { renderDetailPanel } from './components/DetailPanel.js';
import { renderAnalysisForm } from './components/AnalysisForm.js';
import { renderCommandPalette } from './components/CommandPalette.js';
import { renderSettingsPanel } from './components/SettingsPanel.js';
import { renderExportImportModal } from './components/ExportImportModal.js';
import { renderSyncPanel } from './components/SyncPanel.js';
import { renderToast } from './components/Toast.js';
import { el } from './utils/dom.js';

export function initApp(rootElement) {
  const store = createStore();

  const entriesActions = createEntriesSlice(store);
  const uiActions = createUiSlice(store);
  const syncActions = createSyncSlice(store);

  // Setup Canvas
  const canvasEl = document.getElementById('marketCanvas');
  const aurora = new MarketAurora(canvasEl);

  const toastAction = (msg, isErr = false) => {
    renderToast({ message: msg, isError: isErr, undoAction: store.state.undoDelete ? () => entriesActions.undoDelete() : null });
  };

  // Filter & Sort entries
  const getFilteredEntries = () => {
    const entries = store.state.entries;
    const q = (store.state.searchQuery || '').trim().toUpperCase();
    const sortMode = store.state.sortMode;
    const activeFilters = store.state.activeFilters;

    const sorted = [...entries].sort((a, b) => {
      if (sortMode === 'ticker') return a.ticker.localeCompare(b.ticker) || `${b.tanggal} ${b.jam}`.localeCompare(`${a.tanggal} ${a.jam}`);
      if (sortMode === 'risk-asc' || sortMode === 'reward-asc') {
        const getVal = sortMode === 'risk-asc' ? riskPctOf : rewardPctOf;
        const va = getVal(a), vb = getVal(b);
        if (va == null && vb == null) return `${b.tanggal} ${b.jam}`.localeCompare(`${a.tanggal} ${a.jam}`);
        if (va == null) return 1;
        if (vb == null) return -1;
        return va - vb;
      }
      const ka = `${a.tanggal} ${a.jam}`, kb = `${b.tanggal} ${b.jam}`;
      return sortMode === 'lama' ? ka.localeCompare(kb) : kb.localeCompare(ka);
    });

    return sorted.filter(e => {
      if (activeFilters.has('hariIni') && e.tanggal !== todayStr()) return false;
      if (activeFilters.has('mingguIni') && e.tanggal < weekStartStr()) return false;
      if (activeFilters.has('punyaRR') && !(e.s && (e.s.rrTarget || e.s.rrStop || e.s.rr))) return false;
      if (activeFilters.has('freshBuy') && !(e.s && e.s.fresh)) return false;
      if (q && !e.ticker.includes(q) && !String(e.desc || '').toUpperCase().includes(q)) return false;
      return true;
    });
  };

  // Render Root App Layout
  const render = () => {
    // 1. Update Theme & Motion data attributes
    document.documentElement.dataset.theme = store.state.themeMode;
    document.documentElement.dataset.motion = store.state.motionMode;
    aurora.setMotionMode(store.state.motionMode);

    const filteredEntries = getFilteredEntries();

    rootElement.innerHTML = '';

    const stageEl = el('div', { class: 'stage' }, [
      renderHeader({ store, uiActions }),
      renderMarketPulse({ entries: store.state.entries }),
      renderQuickAddBar({ entriesActions, toastAction }),
      renderToolbar({ store, uiActions }),
      renderBatchActionBar({ store, entriesActions, toastAction }),

      // Main View Display
      (() => {
        if (!store.state.entries.length) {
          return el('div', { class: 'glass', style: 'padding:32px;text-align:center;border-radius:16px' }, [
            el('h3', { style: 'margin:0 0 8px;font-size:18px', text: 'Mulai Market Journal Pertamamu' }),
            el('p', { style: 'font-size:13px;color:var(--text-dim);margin-bottom:16px', text: 'Tempel analisis mentah, biarkan Stockpick membacanya, lalu simpan sebagai kartu yang mudah dipantau.' }),
            el('button', { type: 'button', class: 'btn primary', text: '⚡ Buat Analisis Pertama', onclick: () => uiActions.openModal('form') })
          ]);
        }

        if (!filteredEntries.length) {
          return el('div', { class: 'glass', style: 'padding:32px;text-align:center;border-radius:16px' }, [
            el('h3', { style: 'margin:0 0 8px;font-size:18px', text: 'Tidak ada hasil yang cocok' }),
            el('p', { style: 'font-size:13px;color:var(--text-dim);margin-bottom:16px', text: 'Coba ubah kata pencarian atau reset filter aktif.' }),
            el('button', { type: 'button', class: 'btn ghost', text: 'Reset Filter', onclick: () => uiActions.resetFilters() })
          ]);
        }

        switch (store.state.viewMode) {
          case 'timeline': return renderTimelineView({ entries: filteredEntries, uiActions });
          case 'table': return renderTableView({ entries: filteredEntries, uiActions });
          case 'heatmap': return renderHeatmapView({ entries: filteredEntries, uiActions });
          case 'focus': return renderFocusView({ entries: filteredEntries, allEntries: store.state.entries, uiActions });
          default: return renderCardGrid({ entries: filteredEntries, store, entriesActions, uiActions });
        }
      })()
    ]);

    rootElement.appendChild(stageEl);

    // Render Active Modal Overlay
    const modalWrap = el('div', { id: 'modalWrap' });
    const modal = store.state.activeModal;

    if (modal === 'form') {
      modalWrap.appendChild(renderAnalysisForm({ editingEntry: store.state.editingEntry, entriesActions, uiActions, toastAction }));
    } else if (modal === 'detail') {
      modalWrap.appendChild(renderDetailPanel({ entry: store.state.detailEntry, allEntries: store.state.entries, uiActions, entriesActions, toastAction }));
    } else if (modal === 'command') {
      modalWrap.appendChild(renderCommandPalette({ store, uiActions, entriesActions, toastAction }));
    } else if (modal === 'settings') {
      modalWrap.appendChild(renderSettingsPanel({ store, uiActions }));
    } else if (modal === 'export') {
      modalWrap.appendChild(renderExportImportModal({ store, entriesActions, uiActions, toastAction }));
    } else if (modal === 'sync') {
      modalWrap.appendChild(renderSyncPanel({ store, syncActions, entriesActions, uiActions, toastAction }));
    }

    rootElement.appendChild(modalWrap);
  };

  // Subscribe to reactive store changes
  store.subscribe('*', () => {
    render();
  });

  // Global Keyboard Shortcuts Registration
  registerKeyboardShortcuts({
    onCommandPalette: () => uiActions.openModal('command'),
    onEscape: () => uiActions.closeModal(),
    onNewCard: () => uiActions.openModal('form'),
    onFocusSearch: () => document.getElementById('searchInput')?.focus()
  });

  // Initial Render & Canvas Start
  render();
  aurora.start();
}
