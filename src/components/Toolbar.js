/* src/components/Toolbar.js - Search, Sort & Filter Chips */

import { el } from '../utils/dom.js';
import { renderViewSwitcher } from './ViewSwitcher.js';
import { todayStr, weekStartStr } from '../utils/date.js';

export function renderToolbar({ store, uiActions }) {
  const entries = store.state.entries;
  const activeFilters = store.state.activeFilters;
  const q = store.state.searchQuery;

  const counts = {
    hariIni: entries.filter(e => e.tanggal === todayStr()).length,
    mingguIni: entries.filter(e => e.tanggal >= weekStartStr()).length,
    punyaRR: entries.filter(e => e.s && (e.s.rrTarget || e.s.rrStop || e.s.rr)).length,
    freshBuy: entries.filter(e => e.s && e.s.fresh).length
  };

  const toolbarEl = el('div', { class: 'toolbar' }, [
    // Top Row: Search Box & Sort Dropdown & View Switcher
    el('div', { class: 'search-row' }, [
      el('div', { class: 'search-box' }, [
        el('span', { class: 'search-icon', text: '🔍' }),
        el('input', {
          id: 'searchInput',
          type: 'text',
          placeholder: 'Cari ticker atau kata kunci analisis...',
          value: q,
          oninput: (e) => uiActions.setSearch(e.target.value)
        })
      ]),
      el('select', {
        class: 'btn ghost',
        onchange: (e) => uiActions.setSort(e.target.value)
      }, [
        el('option', { value: 'baru', selected: store.state.sortMode === 'baru', text: 'Terbaru' }),
        el('option', { value: 'lama', selected: store.state.sortMode === 'lama', text: 'Terlama' }),
        el('option', { value: 'ticker', selected: store.state.sortMode === 'ticker', text: 'Ticker A-Z' }),
        el('option', { value: 'risk-asc', selected: store.state.sortMode === 'risk-asc', text: 'Risk Terendah' }),
        el('option', { value: 'reward-asc', selected: store.state.sortMode === 'reward-asc', text: 'Reward Tertinggi' })
      ]),
      renderViewSwitcher({ store, uiActions })
    ]),

    // Bottom Row: Filter chips & Reset
    el('div', { class: 'filter-chips' }, [
      el('button', {
        class: 'fchip ' + (activeFilters.has('hariIni') ? 'active' : ''),
        onclick: () => uiActions.toggleFilter('hariIni')
      }, [
        'Hari Ini ',
        el('span', { class: 'count', text: `(${counts.hariIni})` })
      ]),
      el('button', {
        class: 'fchip ' + (activeFilters.has('mingguIni') ? 'active' : ''),
        onclick: () => uiActions.toggleFilter('mingguIni')
      }, [
        'Minggu Ini ',
        el('span', { class: 'count', text: `(${counts.mingguIni})` })
      ]),
      el('button', {
        class: 'fchip ' + (activeFilters.has('punyaRR') ? 'active' : ''),
        onclick: () => uiActions.toggleFilter('punyaRR')
      }, [
        'Punya RR ',
        el('span', { class: 'count', text: `(${counts.punyaRR})` })
      ]),
      el('button', {
        class: 'fchip ' + (activeFilters.has('freshBuy') ? 'active' : ''),
        onclick: () => uiActions.toggleFilter('freshBuy')
      }, [
        'Fresh Buy ',
        el('span', { class: 'count', text: `(${counts.freshBuy})` })
      ]),
      (activeFilters.size > 0 || q) ? el('button', {
        class: 'btn ghost danger',
        style: 'padding:4px 10px;font-size:11px;border-radius:99px',
        text: 'Reset Filter',
        onclick: () => uiActions.resetFilters()
      }) : null
    ])
  ]);

  return toolbarEl;
}
