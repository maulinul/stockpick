/* src/utils/calc.js - Financial Calculations & Metric Utilities */

export function pctOf(str) {
  const m = String(str || "").match(/\(([+\-]?\d+(?:[.,]\d+)?)%\)/);
  return m ? Math.abs(parseFloat(m[1].replace(",", "."))) : null;
}

export function riskPctOf(e) {
  return pctOf(e?.s?.rrStop);
}

export function rewardPctOf(e) {
  return pctOf(e?.s?.rrTarget);
}

export function rrRatioValue(entry) {
  const s = entry.s || {};
  const reward = rewardPctOf(entry);
  const risk = riskPctOf(entry);
  
  if (reward != null && risk != null && risk > 0) {
    return reward / risk;
  }
  
  const m = String(s.rrRatio || "").match(/([\d.]+)\s*:\s*([\d.]+)/);
  return m && Number(m[1]) ? Number(m[2]) / Number(m[1]) : null;
}

export function signalOf(entry) {
  const s = entry.s || {};
  const reward = rewardPctOf(entry);
  const risk = riskPctOf(entry);
  
  if (reward != null && risk != null && reward >= risk * 2) return "good";
  if (risk != null && reward != null && risk > reward) return "risk";
  if (s.fresh) return "good";
  if (s.skenario && !s.rr) return "risk";
  return "neutral";
}

export function tickerHistory(entries, ticker) {
  return entries
    .filter(e => e.ticker === ticker && e.harga && !isNaN(parseFloat(e.harga)))
    .map(e => ({ tanggal: e.tanggal, jam: e.jam, harga: parseFloat(e.harga) }))
    .sort((a, b) => `${a.tanggal} ${a.jam}`.localeCompare(`${b.tanggal} ${b.jam}`));
}

export function lastDelta(entries, ticker) {
  const hist = tickerHistory(entries, ticker);
  if (hist.length < 2) return null;
  const prev = hist[hist.length - 2].harga;
  const now = hist[hist.length - 1].harga;
  if (!prev) return null;
  return { abs: now - prev, pct: ((now - prev) / prev) * 100 };
}
