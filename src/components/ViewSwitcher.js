/* src/components/ViewSwitcher.js - View Mode Switching Tabs */

import { el } from '../utils/dom.js';

export function renderViewSwitcher({ store, uiActions }) {
  const currentView = store.state.viewMode;

  const switcherEl = el('div', { class: 'view-switcher' }, [
    el('button', {
      class: currentView === 'cards' ? 'active' : '',
      text: '🎴 Kartu',
      onclick: () => uiActions.setView('cards')
    }),
    el('button', {
      class: currentView === 'timeline' ? 'active' : '',
      text: '⏱️ Timeline',
      onclick: () => uiActions.setView('timeline')
    }),
    el('button', {
      class: currentView === 'table' ? 'active' : '',
      text: '📊 Tabel',
      onclick: () => uiActions.setView('table')
    }),
    el('button', {
      class: currentView === 'heatmap' ? 'active' : '',
      text: '🔥 Heatmap',
      onclick: () => uiActions.setView('heatmap')
    }),
    el('button', {
      class: currentView === 'focus' ? 'active' : '',
      text: '🎯 Fokus',
      onclick: () => uiActions.setView('focus')
    })
  ]);

  return switcherEl;
}
