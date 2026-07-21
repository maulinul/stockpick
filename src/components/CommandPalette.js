/* src/components/CommandPalette.js - Ctrl+K Command Palette Modal */

import { el, esc } from '../utils/dom.js';

export function renderCommandPalette({ store, uiActions, entriesActions, toastAction }) {
  let searchInput;
  let selectedIndex = 0;

  const baseCommands = [
    { label: "Tambah Kartu Saham", hint: "N", run: () => uiActions.openModal('form') },
    { label: "Fokus Pencarian Ticker", hint: "/", run: () => document.getElementById('searchInput')?.focus() },
    { label: "Tampilkan Mode Kartu", hint: "View", run: () => uiActions.setView("cards") },
    { label: "Tampilkan Mode Timeline", hint: "View", run: () => uiActions.setView("timeline") },
    { label: "Tampilkan Mode Tabel", hint: "View", run: () => uiActions.setView("table") },
    { label: "Tampilkan Mode Heatmap", hint: "View", run: () => uiActions.setView("heatmap") },
    { label: "Tampilkan Mode Fokus", hint: "View", run: () => uiActions.setView("focus") },
    { label: "Filter Fresh Buy", hint: "Filter", run: () => uiActions.toggleFilter("freshBuy") },
    { label: "Filter Punya RR", hint: "Filter", run: () => uiActions.toggleFilter("punyaRR") },
    { label: "Reset Search & Filter", hint: "Reset", run: () => uiActions.resetFilters() },
    { label: "Export / Import Data", hint: "Data", run: () => uiActions.openModal('export') },
    { label: "Buka Sinkronisasi GitHub & Gist", hint: "Sync", run: () => uiActions.openModal('sync') }
  ];

  const tickerCommands = store.state.entries.slice(0, 20).map(entry => ({
    label: `Buka $${entry.ticker} (${entry.tanggal})`,
    hint: "Ticker",
    run: () => uiActions.openModal('detail', entry)
  }));

  const commands = [...baseCommands, ...tickerCommands];

  const handleKeyDown = (ev) => {
    if (ev.key === "ArrowDown") {
      ev.preventDefault();
      selectedIndex = (selectedIndex + 1) % commands.length;
      updateHighlight();
    } else if (ev.key === "ArrowUp") {
      ev.preventDefault();
      selectedIndex = (selectedIndex - 1 + commands.length) % commands.length;
      updateHighlight();
    } else if (ev.key === "Enter") {
      ev.preventDefault();
      const cmd = commands[selectedIndex];
      if (cmd) {
        uiActions.closeModal();
        cmd.run();
      }
    }
  };

  const updateHighlight = () => {
    document.querySelectorAll('.palette-item').forEach((item, i) => {
      item.classList.toggle('active', i === selectedIndex);
    });
  };

  searchInput = el('input', {
    type: 'text',
    class: 'palette-search',
    placeholder: 'Ketik perintah atau cari ticker...',
    onkeydown: handleKeyDown
  });

  const listEl = el('div', { class: 'palette-list' }, 
    commands.map((cmd, i) => 
      el('button', {
        type: 'button',
        class: `palette-item ${i === 0 ? 'active' : ''}`,
        onclick: () => {
          uiActions.closeModal();
          cmd.run();
        }
      }, [
        el('span', { text: cmd.label }),
        el('kbd', { text: cmd.hint })
      ])
    )
  );

  const modalEl = el('div', { class: 'modal-overlay show', onclick: (e) => { if (e.target.classList.contains('modal-overlay')) uiActions.closeModal(); } }, [
    el('div', { class: 'modal-content palette-modal' }, [
      searchInput,
      listEl
    ])
  ]);

  setTimeout(() => searchInput.focus(), 50);

  return modalEl;
}
