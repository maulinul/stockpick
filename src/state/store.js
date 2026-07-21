/* src/state/store.js - Lightweight Reactive Proxy Store */

export function createStore(initialState = {}) {
  const listeners = new Map();

  const state = new Proxy(initialState, {
    set(target, key, value) {
      const oldValue = target[key];
      target[key] = value;
      if (oldValue !== value) {
        (listeners.get(key) || []).forEach(fn => fn(value, oldValue));
        (listeners.get('*') || []).forEach(fn => fn(key, value, oldValue));
      }
      return true;
    }
  });

  return {
    state,
    subscribe(key, fn) {
      if (!listeners.has(key)) listeners.set(key, []);
      listeners.get(key).push(fn);
      return () => {
        const arr = listeners.get(key);
        if (arr) {
          const idx = arr.indexOf(fn);
          if (idx >= 0) arr.splice(idx, 1);
        }
      };
    }
  };
}
