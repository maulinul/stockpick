/* src/components/SkeletonLoader.js - Shimmer Loading Skeleton */

import { el } from '../utils/dom.js';

export function renderSkeletonLoader(count = 3) {
  const wrapper = el('div', { class: 'skeleton-wrap' }, 
    Array.from({ length: count }, () => el('div', { class: 'skeleton-row' }))
  );
  return wrapper;
}
