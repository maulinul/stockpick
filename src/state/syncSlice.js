/* src/state/syncSlice.js - GitHub Repo & Gist Sync State */

const GH_KEY = "kartuSahamGh.v1";

export function loadGhSettings() {
  try {
    return JSON.parse(localStorage.getItem(GH_KEY) || "{}");
  } catch (e) {
    return {};
  }
}

export function saveGhSettings(patch) {
  const current = loadGhSettings();
  const next = { ...current, ...patch };
  localStorage.setItem(GH_KEY, JSON.stringify(next));
  return next;
}

export function createSyncSlice(store) {
  store.state.ghSettings = loadGhSettings();
  store.state.repoSyncStatus = "";
  store.state.gistSyncStatus = "";

  return {
    updateGhSettings(patch) {
      const updated = saveGhSettings(patch);
      store.state.ghSettings = updated;
    },
    setRepoStatus(msg) {
      store.state.repoSyncStatus = msg;
    },
    setGistStatus(msg) {
      store.state.gistSyncStatus = msg;
    }
  };
}
