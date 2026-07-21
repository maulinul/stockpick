/* src/utils/dom.js - DOM Utilities & Safe HTML Escaping */

export const $ = (id) => document.getElementById(id);

/**
 * Escapes raw strings for safe insertion into HTML strings.
 */
export function esc(str) {
  if (str == null) return "";
  const div = document.createElement("div");
  div.textContent = String(str);
  return div.innerHTML;
}

/**
 * Programmatic DOM element creation helper.
 */
export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") node.className = v;
    else if (k.startsWith("on") && typeof v === "function") {
      node.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (k === "text") {
      node.textContent = v;
    } else if (k === "html") {
      node.innerHTML = v;
    } else if (v != null) {
      node.setAttribute(k, v);
    }
  });

  children.forEach(c => {
    if (c == null) return;
    if (typeof c === "string" || typeof c === "number") {
      node.appendChild(document.createTextNode(String(c)));
    } else if (c instanceof Node) {
      node.appendChild(c);
    }
  });

  return node;
}

/**
 * Throttles execution of a function to at most once per `limit` ms.
 */
export function throttle(func, limit = 16) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
