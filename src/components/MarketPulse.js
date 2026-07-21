/* src/components/MarketPulse.js - Bento Dashboard Metrics */

import { el } from '../utils/dom.js';
import { todayStr, weekStartStr } from '../utils/date.js';
import { rrRatioValue, signalOf } from '../utils/calc.js';

export function renderMarketPulse({ entries }) {
  const total = entries.length;
  const todayCount = entries.filter(e => e.tanggal === todayStr()).length;
  const tickers = [...new Set(entries.map(e => e.ticker))];
  const freshCount = entries.filter(e => e.s && e.s.fresh).length;
  const riskCount = entries.filter(e => signalOf(e) === "risk").length;
  
  const ratios = entries.map(rrRatioValue).filter(v => v != null && isFinite(v));
  const avgRR = ratios.length ? ratios.reduce((a, b) => a + b, 0) / ratios.length : 0;
  
  const bestRR = entries.reduce((best, e) => {
    const ratio = rrRatioValue(e);
    return ratio != null && (!best || ratio > best.ratio) ? { entry: e, ratio } : best;
  }, null);

  const weekCount = entries.filter(e => e.tanggal >= weekStartStr()).length;

  const bentoEl = el('div', { class: 'bento' }, [
    // 1. Total Cards
    el('div', { class: 'bento-tile glass' }, [
      el('span', { class: 'k', text: 'Total Kartu' }),
      el('span', { class: 'v', text: String(total) }),
      el('span', { class: 'sub flat', text: `${tickers.length} ticker unik` })
    ]),
    // 2. Fresh Buy
    el('div', { class: 'bento-tile glass signal' }, [
      el('span', { class: 'k', text: 'Fresh Buy' }),
      el('span', { class: 'v', text: String(freshCount) }),
      el('span', { class: 'sub pos', text: 'Peluang aktif' })
    ]),
    // 3. Today & Week
    el('div', { class: 'bento-tile glass' }, [
      el('span', { class: 'k', text: 'Hari Ini' }),
      el('span', { class: 'v', text: String(todayCount) }),
      el('span', { class: 'sub flat', text: `${weekCount} minggu ini` })
    ]),
    // 4. Avg RR Ratio
    el('div', { class: 'bento-tile glass signal' }, [
      el('span', { class: 'k', text: 'Rata-rata RR' }),
      el('span', { class: 'v', text: `1:${avgRR.toFixed(1)}` }),
      el('span', { class: 'sub flat', text: 'Reward per 1 risk' })
    ]),
    // 5. Top Opportunity
    el('div', { class: 'bento-tile glass' }, [
      el('span', { class: 'k' }, [
        el('span', { class: 'live-dot', style: 'width:6px;height:6px' }),
        'Top Opportunity'
      ]),
      bestRR 
        ? el('span', { class: 'v small', text: `$${bestRR.entry.ticker}` })
        : el('span', { class: 'v small', text: '—' }),
      bestRR 
        ? el('span', { class: 'sub pos', text: `RR 1:${bestRR.ratio.toFixed(1)}` })
        : el('span', { class: 'sub flat', text: 'Belum ada RR' })
    ]),
    // 6. Risk Alert
    el('div', { class: 'bento-tile glass risk' }, [
      el('span', { class: 'k', text: 'Perlu Perhatian' }),
      el('span', { class: 'v', text: String(riskCount) }),
      el('span', { class: 'sub ' + (riskCount ? 'neg' : 'flat'), text: 'Risk signal' })
    ])
  ]);

  return bentoEl;
}
