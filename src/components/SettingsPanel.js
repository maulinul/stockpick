/* src/components/SettingsPanel.js - Theme & Motion Settings Modal */

import { el } from '../utils/dom.js';

export function renderSettingsPanel({ store, uiActions }) {
  const currentTheme = store.state.themeMode;
  const currentMotion = store.state.motionMode;

  const modalEl = el('div', { class: 'modal-overlay show', onclick: (e) => { if (e.target.classList.contains('modal-overlay')) uiActions.closeModal(); } }, [
    el('div', { class: 'modal-content', style: 'max-width:420px' }, [
      el('div', { style: 'display:flex;justify-content:space-between;align-items:center;margin-bottom:16px' }, [
        el('h2', { style: 'margin:0;font-size:18px', text: 'Pengaturan Tampilan' }),
        el('button', { type: 'button', class: 'btn ghost', text: '✕', onclick: () => uiActions.closeModal() })
      ]),

      el('div', { style: 'margin-bottom:20px' }, [
        el('h4', { style: 'margin:0 0 10px;font-size:14px;color:var(--gold)', text: 'Tema Warna' }),
        el('div', { style: 'display:flex;flex-direction:column;gap:8px' }, [
          el('button', {
            class: `btn ${currentTheme === 'dark' ? 'primary' : 'ghost'}`,
            style: 'justify-content:flex-start',
            text: '🌌 Aurora (Default Dark)',
            onclick: () => uiActions.setTheme('dark')
          }),
          el('button', {
            class: `btn ${currentTheme === 'midnight' ? 'primary' : 'ghost'}`,
            style: 'justify-content:flex-start',
            text: '🖤 Midnight (Deep OLED Black)',
            onclick: () => uiActions.setTheme('midnight')
          }),
          el('button', {
            class: `btn ${currentTheme === 'champagne' ? 'primary' : 'ghost'}`,
            style: 'justify-content:flex-start',
            text: '🍾 Champagne (Warm Dark Gold)',
            onclick: () => uiActions.setTheme('champagne')
          }),
          el('button', {
            class: `btn ${currentTheme === 'light' ? 'primary' : 'ghost'}`,
            style: 'justify-content:flex-start',
            text: '☀️ Siang (Gentle Light Mode)',
            onclick: () => uiActions.setTheme('light')
          })
        ])
      ]),

      el('div', { style: 'margin-bottom:20px' }, [
        el('h4', { style: 'margin:0 0 10px;font-size:14px;color:var(--gold)', text: 'Animasi & Canvas Partikel' }),
        el('div', { style: 'display:flex;flex-direction:column;gap:8px' }, [
          el('button', {
            class: `btn ${currentMotion === 'dynamic' ? 'primary' : 'ghost'}`,
            style: 'justify-content:flex-start',
            text: '✨ Dynamic (Partikel Aurora & Interaksi Pointer)',
            onclick: () => uiActions.setMotion('dynamic')
          }),
          el('button', {
            class: `btn ${currentMotion === 'subtle' ? 'primary' : 'ghost'}`,
            style: 'justify-content:flex-start',
            text: '🌿 Subtle (Partikel Halus & Minim Beban)',
            onclick: () => uiActions.setMotion('subtle')
          }),
          el('button', {
            class: `btn ${currentMotion === 'off' ? 'primary' : 'ghost'}`,
            style: 'justify-content:flex-start',
            text: '🛑 Off (Matikan Canvas Partikel)',
            onclick: () => uiActions.setMotion('off')
          })
        ])
      ]),

      el('div', { style: 'display:flex;justify-content:flex-end' }, [
        el('button', { type: 'button', class: 'btn primary', text: 'Selesai', onclick: () => uiActions.closeModal() })
      ])
    ])
  ]);

  return modalEl;
}
