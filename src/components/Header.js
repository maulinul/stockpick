/* src/components/Header.js - Application Header & Topbar */

import { el } from '../utils/dom.js';

export function renderHeader({ store, uiActions }) {
  const isLight = store.state.themeMode === 'light';
  
  const headerEl = el('header', { class: 'topbar' }, [
    el('div', { class: 'topbar-title' }, [
      el('h1', {}, [
        el('span', { class: 'live-dot' }),
        'Stockpick'
      ]),
      el('div', { id: 'greeting', class: 'topbar-greeting', text: 'Log Kartu Saham & Analysis Journal' })
    ]),
    el('div', { class: 'topbar-actions' }, [
      // Theme Switcher Widget
      el('div', { class: 'theme-switch' }, [
        el('button', {
          class: store.state.themeMode === 'dark' ? 'active' : '',
          text: 'Aurora',
          onclick: () => uiActions.setTheme('dark')
        }),
        el('button', {
          class: store.state.themeMode === 'midnight' ? 'active' : '',
          text: 'Midnight',
          onclick: () => uiActions.setTheme('midnight')
        }),
        el('button', {
          class: store.state.themeMode === 'champagne' ? 'active' : '',
          text: 'Champagne',
          onclick: () => uiActions.setTheme('champagne')
        }),
        el('button', {
          class: store.state.themeMode === 'light' ? 'active' : '',
          text: 'Siang',
          onclick: () => uiActions.setTheme('light')
        })
      ]),
      // Command Palette button
      el('button', {
        type: 'button',
        class: 'btn ghost',
        title: 'Command Palette (Ctrl+K)',
        onclick: () => uiActions.openModal('command')
      }, ['⌘K']),
      // Settings button
      el('button', {
        type: 'button',
        class: 'btn ghost',
        title: 'Pengaturan',
        onclick: () => uiActions.openModal('settings')
      }, ['⚙️'])
    ])
  ]);

  return headerEl;
}
