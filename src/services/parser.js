/* src/services/parser.js - Enhanced Raw Analysis Text Parser (Parser 2.0) */

export function parseRaw(text) {
  const out = {
    ticker: "",
    harga: "",
    desc: "",
    serumpun: "",
    kondisiText: "",
    kondisiS: "",
    kondisiR: "",
    skenario: "",
    bandar: "",
    rr: "",
    rrRatio: "",
    rrTarget: "",
    rrStop: "",
    fresh: "",
    freshPrice: "",
    avg: "",
    avgPrice: "",
    confidence: 0
  };

  if (!text || !text.trim()) return out;

  // Split into lines
  const allLines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (!allLines.length) return out;

  // Head line (first line): Ticker & Price
  const firstLine = allLines[0];
  const mHead = firstLine.match(/\$?([A-Za-z0-9]+)(?:\.[A-Za-z]+)?\D*?([\d.,]+)\s*$/);
  if (mHead) {
    out.ticker = mHead[1].toUpperCase();
    out.harga = mHead[2].replace(/[.,]/g, "");
  } else {
    const tickerOnlyMatch = firstLine.match(/\$?([A-Za-z]{4})\b/i);
    if (tickerOnlyMatch) {
      out.ticker = tickerOnlyMatch[1].toUpperCase();
    }
  }

  const blocks = text.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  const sections = [];

  if (blocks.length > 1) {
    sections.push(...blocks.slice(1));
  } else {
    let currentSection = "";
    for (let i = 1; i < allLines.length; i++) {
      const line = allLines[i];
      const isHeader = /^(kondisi|skenario|bandar|risk reward|rr|fresh|avg|serumpun)/i.test(line);
      if (isHeader && currentSection) {
        sections.push(currentSection);
        currentSection = line;
      } else {
        currentSection = currentSection ? `${currentSection}\n${line}` : line;
      }
    }
    if (currentSection) sections.push(currentSection);
  }

  for (const block of sections) {
    const lines = block.split(/\n/).map(l => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    const fullText = lines.join(" ");
    const title = lines[0].toLowerCase();
    const body = lines.length > 1 ? lines.slice(1).join(" ") : fullText;

    if (title.includes("kondisi")) {
      out.kondisiText = body;
      const mS = fullText.match(/S\s*(\d+)(?:\s*[-–]\s*(\d+))?/i);
      const mR = fullText.match(/R\s*(\d+)(?:\s*[-–]\s*(\d+))?/i);
      if (mS) out.kondisiS = mS[2] ? `${mS[1]}-${mS[2]}` : mS[1];
      if (mR) out.kondisiR = mR[2] ? `${mR[1]}-${mR[2]}` : mR[1];
    } else if (title.includes("skenario")) {
      out.skenario = body;
    } else if (title.includes("bandarmology") || title.includes("bandar")) {
      out.bandar = body;
    } else if (title.includes("risk reward") || title.includes("rr")) {
      out.rr = body;
      const mRatio = fullText.match(/RR\s*([\d.]+\s*:\s*[\d.]+)/i);
      const mTarget = fullText.match(/(?:target|sampai)\s*<?(\d+)\s*(\([+\-]?\d+(?:[.,]\d+)?%\))/i);
      const mStop = fullText.match(/(?:stop loss|cutloss|sl)\s*<?(\d+)\s*(\([+\-]?\d+(?:[.,]\d+)?%\))/i);
      if (mRatio) out.rrRatio = mRatio[1].replace(/\s+/g, "");
      if (mTarget) out.rrTarget = `${mTarget[1]} ${mTarget[2]}`;
      if (mStop) out.rrStop = `<${mStop[1]} ${mStop[2]}`;
    } else if (title.includes("fresh buy") || title.includes("fresh")) {
      out.fresh = body;
      const mPrice = fullText.match(/(?:best price|entry|beli)\D*(\d+)/i);
      if (mPrice) out.freshPrice = `<${mPrice[1]}`;
    } else if (title.includes("avgdown") || title.includes("avg")) {
      out.avg = body;
      const mPrice = fullText.match(/(?:avg terakhir|avg)\D*(\d+)/i);
      if (mPrice) out.avgPrice = `<${mPrice[1]}`;
    } else if (title.includes("serumpun")) {
      out.serumpun = (title.match(/\$([A-Za-z0-9]+)/g) || []).map(t => t.replace("$", "")).join(", ");
    } else if (!out.desc) {
      out.desc = lines[0];
    }
  }

  // Calculate confidence score
  let score = 0;
  if (out.ticker) score += 0.3;
  if (out.harga) score += 0.2;
  if (out.kondisiS || out.kondisiR) score += 0.2;
  if (out.rrRatio || out.rrTarget || out.rrStop) score += 0.2;
  if (out.fresh || out.avg) score += 0.1;
  out.confidence = Math.min(1.0, score);

  return out;
}
