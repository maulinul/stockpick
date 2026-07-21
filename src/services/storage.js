/* src/services/storage.js - LocalStorage Abstraction & Migration */

const STORAGE_KEY = "kartuSahamEntries.v1";
const DRAFT_KEY = "kartuSahamDraft.v1";

export function loadEntries() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.map(entry => ({
      id: entry.id || `e${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      tanggal: entry.tanggal || new Date().toISOString().split("T")[0],
      jam: entry.jam || "09:00",
      ticker: (entry.ticker || "").toUpperCase(),
      harga: String(entry.harga || ""),
      desc: entry.desc || "",
      serumpun: entry.serumpun || "",
      s: entry.s || {}
    }));
  } catch (e) {
    console.error("[Stockpick Storage] Failed to load entries:", e);
    return [];
  }
}

export function saveEntries(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return { success: true };
  } catch (e) {
    if (e.name === "QuotaExceededError") {
      return { success: false, error: "QuotaExceededError" };
    }
    return { success: false, error: e.message };
  }
}

export function saveDraft(draft) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch (e) {
    console.warn("[Stockpick Storage] Could not save draft:", e);
  }
}

export function loadDraft() {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
  } catch (e) {
    localStorage.removeItem(DRAFT_KEY);
    return null;
  }
}

export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}
