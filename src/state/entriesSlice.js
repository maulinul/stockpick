/* src/state/entriesSlice.js - Card Entries & Batch Actions State */

import { loadEntries, saveEntries } from '../services/storage.js';

export function createEntriesSlice(store) {
  store.state.entries = loadEntries();
  store.state.selectedIds = new Set();
  store.state.lastAddedId = null;
  store.state.undoDelete = null;

  return {
    getEntries() {
      return store.state.entries;
    },
    setEntries(newEntries) {
      store.state.entries = newEntries;
      saveEntries(newEntries);
    },
    addEntry(entry) {
      const updated = [entry, ...store.state.entries];
      store.state.lastAddedId = entry.id;
      store.state.entries = updated;
      saveEntries(updated);
    },
    updateEntry(id, updatedEntry) {
      const updated = store.state.entries.map(e => e.id === id ? { ...e, ...updatedEntry } : e);
      store.state.entries = updated;
      saveEntries(updated);
    },
    deleteEntry(id) {
      const idx = store.state.entries.findIndex(e => e.id === id);
      if (idx < 0) return;
      const entry = store.state.entries[idx];
      const updated = store.state.entries.filter(e => e.id !== id);
      store.state.undoDelete = { entry, index: idx };
      store.state.entries = updated;
      saveEntries(updated);
    },
    undoDelete() {
      const item = store.state.undoDelete;
      if (!item) return;
      const updated = [...store.state.entries];
      updated.splice(item.index, 0, item.entry);
      store.state.undoDelete = null;
      store.state.entries = updated;
      saveEntries(updated);
    },
    toggleSelect(id) {
      const set = new Set(store.state.selectedIds);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      store.state.selectedIds = set;
    },
    clearSelection() {
      store.state.selectedIds = new Set();
    },
    batchDelete() {
      const ids = store.state.selectedIds;
      if (!ids.size) return;
      const updated = store.state.entries.filter(e => !ids.has(e.id));
      store.state.selectedIds = new Set();
      store.state.entries = updated;
      saveEntries(updated);
    }
  };
}
