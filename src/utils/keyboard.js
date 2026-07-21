/* src/utils/keyboard.js - Keyboard Shortcuts Manager */

export function typingInField() {
  const el = document.activeElement;
  return el && (
    el.tagName === "INPUT" ||
    el.tagName === "TEXTAREA" ||
    el.tagName === "SELECT" ||
    el.isContentEditable
  );
}

export function registerKeyboardShortcuts({
  onCommandPalette,
  onEscape,
  onNewCard,
  onFocusSearch
}) {
  const handler = (ev) => {
    // Ctrl+K or Cmd+K: Command Palette
    if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === "k") {
      ev.preventDefault();
      onCommandPalette?.();
      return;
    }

    // Escape: Close active overlays
    if (ev.key === "Escape") {
      onEscape?.();
      return;
    }

    // Shortcuts when not typing inside an input field
    if (typingInField()) return;

    if (ev.key === "n" || ev.key === "N") {
      ev.preventDefault();
      onNewCard?.();
    } else if (ev.key === "/") {
      ev.preventDefault();
      onFocusSearch?.();
    }
  };

  document.addEventListener("keydown", handler);
  return () => document.removeEventListener("keydown", handler);
}
