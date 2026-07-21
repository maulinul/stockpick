/* src/state/uiSlice.js - UI Modes, Theme, Motion, Search & Filter State */

const THEME_KEY = "kartuSahamTheme.v1";
const MOTION_KEY = "kartuSahamMotion.v1";
const VIEW_KEY = "kartuSahamView.v1";

export function createUiSlice(store) {
  store.state.themeMode = localStorage.getItem(THEME_KEY) || "dark";
  store.state.motionMode = localStorage.getItem(MOTION_KEY) || "dynamic";
  store.state.viewMode = localStorage.getItem(VIEW_KEY) || "cards";
  store.state.sortMode = "baru";
  store.state.searchQuery = "";
  store.state.activeFilters = new Set();
  store.state.activeModal = null; // 'form', 'detail', 'command', 'settings', 'export', 'sync', 'confirm'
  store.state.editingEntry = null;
  store.state.detailEntry = null;

  return {
    setTheme(mode) {
      store.state.themeMode = mode;
      localStorage.setItem(THEME_KEY, mode);
    },
    setMotion(mode) {
      store.state.motionMode = mode;
      localStorage.setItem(MOTION_KEY, mode);
    },
    setView(mode) {
      store.state.viewMode = mode;
      localStorage.setItem(VIEW_KEY, mode);
    },
    setSort(sort) {
      store.state.sortMode = sort;
    },
    setSearch(q) {
      store.state.searchQuery = q;
    },
    toggleFilter(key) {
      const set = new Set(store.state.activeFilters);
      if (set.has(key)) set.delete(key);
      else set.add(key);
      store.state.activeFilters = set;
    },
    resetFilters() {
      store.state.searchQuery = "";
      store.state.activeFilters = new Set();
    },
    openModal(modalName, data = null) {
      if (modalName === 'form') store.state.editingEntry = data;
      if (modalName === 'detail') store.state.detailEntry = data;
      store.state.activeModal = modalName;
    },
    closeModal() {
      store.state.activeModal = null;
      store.state.editingEntry = null;
      store.state.detailEntry = null;
    }
  };
}
