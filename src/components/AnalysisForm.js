/* src/components/AnalysisForm.js - Multi-Step Analysis Card Form */

import { el } from '../utils/dom.js';
import { parseRaw } from '../services/parser.js';
import { todayStr, nowStr } from '../utils/date.js';
import { saveDraft, loadDraft, clearDraft } from '../services/storage.js';

export function renderAnalysisForm({ editingEntry, entriesActions, uiActions, toastAction }) {
  let step = editingEntry ? 'review' : 'paste';

  // Form Field Inputs
  let rawInput, fTanggal, fJam, fTicker, fHarga, fDesc, fSerumpun;
  let sKondisiText, sKondisiS, sKondisiR, sSkenario, sBandar, sRR, rrRatio, rrTarget, rrStop, sFresh, fFreshPrice, sAvg, fAvgPrice;

  const initial = editingEntry || loadDraft() || {};
  const isEdit = !!editingEntry;

  rawInput = el('textarea', {
    rows: 5,
    style: 'width:100%;margin-bottom:12px',
    placeholder: 'Tempel analisis mentah dari WhatsApp / Telegram di sini...\nContoh:\n$BBRI 4850\nKondisi terbaru: S 4700 R 5100\nRisk reward: RR 1:2.3 Target 5100 (+5.1%) Stop loss 4700 (-3.1%)'
  });

  fTanggal = el('input', { type: 'date', value: initial.tanggal || todayStr() });
  fJam = el('input', { type: 'text', value: initial.jam || nowStr() });
  fTicker = el('input', { type: 'text', style: 'text-transform:uppercase', placeholder: 'BBRI', value: initial.ticker || '' });
  fHarga = el('input', { type: 'text', placeholder: '4850', value: initial.harga || '' });
  fDesc = el('textarea', { rows: 2, placeholder: 'Ringkasan singkat...', value: initial.desc || '' });
  fSerumpun = el('input', { type: 'text', placeholder: 'BMRI, BBNI', value: initial.serumpun || '' });

  const s = initial.s || {};
  sKondisiText = el('textarea', { rows: 2, value: s.kondisiText || '' });
  sKondisiS = el('input', { type: 'text', placeholder: '4700', value: s.kondisiS || '' });
  sKondisiR = el('input', { type: 'text', placeholder: '5100', value: s.kondisiR || '' });
  sSkenario = el('textarea', { rows: 2, value: s.skenario || '' });
  sBandar = el('textarea', { rows: 2, value: s.bandar || '' });
  sRR = el('textarea', { rows: 2, value: s.rr || '' });
  rrRatio = el('input', { type: 'text', placeholder: '1:2.3', value: s.rrRatio || '' });
  rrTarget = el('input', { type: 'text', placeholder: '5100 (+5%)', value: s.rrTarget || '' });
  rrStop = el('input', { type: 'text', placeholder: '4700 (-3%)', value: s.rrStop || '' });
  sFresh = el('textarea', { rows: 2, value: s.fresh || '' });
  fFreshPrice = el('input', { type: 'text', value: s.freshPrice || '' });
  sAvg = el('textarea', { rows: 2, value: s.avg || '' });
  fAvgPrice = el('input', { type: 'text', value: s.avgPrice || '' });

  const handleParse = () => {
    const p = parseRaw(rawInput.value);
    if (p.ticker) fTicker.value = p.ticker;
    if (p.harga) fHarga.value = p.harga;
    if (p.desc) fDesc.value = p.desc;
    if (p.serumpun) fSerumpun.value = p.serumpun;
    if (p.kondisiText) sKondisiText.value = p.kondisiText;
    if (p.kondisiS) sKondisiS.value = p.kondisiS;
    if (p.kondisiR) sKondisiR.value = p.kondisiR;
    if (p.skenario) sSkenario.value = p.skenario;
    if (p.bandar) sBandar.value = p.bandar;
    if (p.rr) sRR.value = p.rr;
    if (p.rrRatio) rrRatio.value = p.rrRatio;
    if (p.rrTarget) rrTarget.value = p.rrTarget;
    if (p.rrStop) rrStop.value = p.rrStop;
    if (p.fresh) sFresh.value = p.fresh;
    if (p.freshPrice) fFreshPrice.value = p.freshPrice;
    if (p.avg) sAvg.value = p.avg;
    if (p.avgPrice) fAvgPrice.value = p.avgPrice;

    toastAction(`✨ Analisis dibaca (${Math.round((p.confidence || 0) * 100)}% confidence)`);
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const ticker = fTicker.value.trim().toUpperCase();
    if (!ticker) {
      fTicker.focus();
      return;
    }

    const entryData = {
      id: isEdit ? editingEntry.id : `e${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      tanggal: fTanggal.value || todayStr(),
      jam: fJam.value || nowStr(),
      ticker,
      harga: fHarga.value.trim(),
      desc: fDesc.value.trim(),
      serumpun: fSerumpun.value.trim(),
      s: {
        kondisiText: sKondisiText.value.trim(),
        kondisiS: sKondisiS.value.trim(),
        kondisiR: sKondisiR.value.trim(),
        skenario: sSkenario.value.trim(),
        bandar: sBandar.value.trim(),
        rr: sRR.value.trim(),
        rrRatio: rrRatio.value.trim(),
        rrTarget: rrTarget.value.trim(),
        rrStop: rrStop.value.trim(),
        fresh: sFresh.value.trim(),
        freshPrice: fFreshPrice.value.trim(),
        avg: sAvg.value.trim(),
        avgPrice: fAvgPrice.value.trim()
      }
    };

    if (isEdit) {
      entriesActions.updateEntry(entryData.id, entryData);
      toastAction(`$${ticker} diperbarui`);
    } else {
      entriesActions.addEntry(entryData);
      toastAction(`$${ticker} tersimpan`);
      clearDraft();
    }

    uiActions.closeModal();
  };

  const modalEl = el('div', { class: 'modal-overlay show', onclick: (e) => { if (e.target.classList.contains('modal-overlay')) uiActions.closeModal(); } }, [
    el('div', { class: 'modal-content' }, [
      el('div', { style: 'display:flex;justify-content:space-between;align-items:center;margin-bottom:16px' }, [
        el('h2', { style: 'margin:0;font-size:18px', text: isEdit ? `Edit $${editingEntry.ticker}` : 'Buat Kartu Saham Baru' }),
        el('button', { type: 'button', class: 'btn ghost', text: '✕', onclick: () => uiActions.closeModal() })
      ]),

      // Stepper
      el('div', { class: 'stepper' }, [
        el('span', { class: 'step active', text: '1. Paste / Mentah' }),
        el('span', { class: 'step active', text: '2. Auto Parse' }),
        el('span', { class: 'step active', text: '3. Review & Simpan' })
      ]),

      el('form', { onsubmit: handleSubmit }, [
        // Step 1: Raw Text Input
        el('div', { class: 'form-field full' }, [
          el('label', { text: 'Teks Analisis Mentah' }),
          rawInput,
          el('button', { type: 'button', class: 'btn primary', style: 'margin-bottom:16px', text: '✨ Parse Otomatis', onclick: handleParse })
        ]),

        // Form Fields
        el('div', { class: 'form-grid' }, [
          el('div', { class: 'form-field' }, [el('label', { text: 'Tanggal' }), fTanggal]),
          el('div', { class: 'form-field' }, [el('label', { text: 'Jam' }), fJam]),
          el('div', { class: 'form-field' }, [el('label', { text: 'Ticker (*)' }), fTicker]),
          el('div', { class: 'form-field' }, [el('label', { text: 'Harga' }), fHarga]),
          el('div', { class: 'form-field full' }, [el('label', { text: 'Ringkasan Analisis' }), fDesc]),
          el('div', { class: 'form-field full' }, [el('label', { text: 'Saham Serumpun' }), fSerumpun]),

          el('div', { class: 'form-field' }, [el('label', { text: 'Support (S)' }), sKondisiS]),
          el('div', { class: 'form-field' }, [el('label', { text: 'Resistance (R)' }), sKondisiR]),
          el('div', { class: 'form-field full' }, [el('label', { text: 'Kondisi Terbaru' }), sKondisiText]),
          el('div', { class: 'form-field full' }, [el('label', { text: 'Skenario Terburuk' }), sSkenario]),
          el('div', { class: 'form-field full' }, [el('label', { text: 'Bandarmology' }), sBandar]),

          el('div', { class: 'form-field' }, [el('label', { text: 'RR Ratio (e.g. 1:2)' }), rrRatio]),
          el('div', { class: 'form-field' }, [el('label', { text: 'Target Price' }), rrTarget]),
          el('div', { class: 'form-field' }, [el('label', { text: 'Stop Loss' }), rrStop]),
          el('div', { class: 'form-field full' }, [el('label', { text: 'Detail Risk Reward' }), sRR]),
          el('div', { class: 'form-field full' }, [el('label', { text: 'Fresh Buy Notes' }), sFresh])
        ]),

        // Footer Actions
        el('div', { style: 'display:flex;justify-content:flex-end;gap:10px;margin-top:20px' }, [
          el('button', { type: 'button', class: 'btn ghost', text: 'Batal', onclick: () => uiActions.closeModal() }),
          el('button', { type: 'submit', class: 'btn primary', text: isEdit ? 'Simpan Perubahan' : '✓ Simpan Kartu' })
        ])
      ])
    ])
  ]);

  return modalEl;
}
