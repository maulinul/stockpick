/* src/components/QuickAddBar.js - Fast Inline Card Creation Bar */

import { el } from '../utils/dom.js';
import { todayStr, nowStr } from '../utils/date.js';

export function renderQuickAddBar({ entriesActions, toastAction }) {
  let qTicker, qPrice, qSupport, qResist;

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const ticker = qTicker.value.trim().toUpperCase();
    const harga = qPrice.value.trim();
    const sVal = qSupport.value.trim();
    const rVal = qResist.value.trim();

    if (!ticker) {
      qTicker.focus();
      return;
    }

    const newEntry = {
      id: `e${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      tanggal: todayStr(),
      jam: nowStr(),
      ticker,
      harga,
      desc: "Quick add entry",
      serumpun: "",
      s: {
        kondisiText: (sVal || rVal) ? `S: ${sVal || '—'}, R: ${rVal || '—'}` : "",
        kondisiS: sVal,
        kondisiR: rVal,
        skenario: "",
        bandar: "",
        rr: "",
        rrRatio: "",
        rrTarget: "",
        rrStop: "",
        fresh: "",
        freshPrice: "",
        avg: "",
        avgPrice: ""
      }
    };

    entriesActions.addEntry(newEntry);
    toastAction(`$${ticker} tersimpan via Quick Add`);

    qTicker.value = "";
    qPrice.value = "";
    qSupport.value = "";
    qResist.value = "";
  };

  qTicker = el('input', { type: 'text', class: 'q-ticker', placeholder: '$TICKER', maxLength: 10 });
  qPrice = el('input', { type: 'text', class: 'q-price', placeholder: 'Harga' });
  qSupport = el('input', { type: 'text', class: 'q-sr', placeholder: 'Support' });
  qResist = el('input', { type: 'text', class: 'q-sr', placeholder: 'Resist' });

  const formEl = el('form', { class: 'quick-add-bar glass', onsubmit: handleSubmit }, [
    el('span', { style: 'font-size:12px;font-weight:600;color:var(--gold)', text: '⚡ Quick Add:' }),
    qTicker,
    qPrice,
    qSupport,
    qResist,
    el('button', { type: 'submit', class: 'btn primary', style: 'padding:5px 10px;font-size:11px', text: '+ Tambah' })
  ]);

  return formEl;
}
