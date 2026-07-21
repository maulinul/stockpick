/* src/services/export.js - Export / Import & Download Helper */

import { todayStr } from '../utils/date.js';

export function exportJsonText(entries) {
  return JSON.stringify(entries, null, 2);
}

export function tryAutoDownload(entries) {
  try {
    const jsonText = exportJsonText(entries);
    const blob = new Blob([jsonText], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `log-kartu-saham-${todayStr()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    return true;
  } catch (e) {
    return false;
  }
}

export async function copyToClipboard(entries) {
  const text = exportJsonText(entries);
  await navigator.clipboard.writeText(text);
}
