/* src/components/CardGrid.js - Card Grid Container */

import { el } from '../utils/dom.js';
import { renderStockCard } from './StockCard.js';

export function renderCardGrid({ entries, store, entriesActions, uiActions }) {
  const selectedIds = store.state.selectedIds;

  const gridEl = el('div', { class: 'log-list view-cards' }, 
    entries.map((entry, index) => 
      renderStockCard({
        entry,
        index,
        allEntries: store.state.entries,
        isSelected: selectedIds.has(entry.id),
        onSelect: (id) => entriesActions.toggleSelect(id),
        onOpenDetail: (e) => uiActions.openModal('detail', e)
      })
    )
  );

  return gridEl;
}
