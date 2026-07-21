/* tests/store.test.js - Unit tests for Reactive Store */

import { describe, it, expect } from 'vitest';
import { createStore } from '../src/state/store.js';

describe('Reactive Store Proxy', () => {
  it('triggers subscribers when state value changes', () => {
    const store = createStore({ count: 0 });
    let notifiedValue = null;

    store.subscribe('count', (val) => {
      notifiedValue = val;
    });

    store.state.count = 5;
    expect(notifiedValue).toBe(5);
  });

  it('unsubscribes listeners correctly', () => {
    const store = createStore({ count: 0 });
    let calls = 0;

    const unsubscribe = store.subscribe('count', () => {
      calls++;
    });

    store.state.count = 1;
    expect(calls).toBe(1);

    unsubscribe();
    store.state.count = 2;
    expect(calls).toBe(1);
  });
});
