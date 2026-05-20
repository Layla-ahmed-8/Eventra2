import { useEffect } from 'react';

type ShortcutMap = Record<string, (e: KeyboardEvent) => void>;

const INPUT_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

function buildKey(e: KeyboardEvent): string {
  const parts: string[] = [];
  if (e.ctrlKey) parts.push('ctrl');
  if (e.metaKey) parts.push('meta');
  if (e.shiftKey) parts.push('shift');
  parts.push(e.key.toLowerCase());
  return parts.join('+');
}

function isEditableTarget(e: KeyboardEvent): boolean {
  const target = e.target as HTMLElement;
  return (
    INPUT_TAGS.has(target.tagName) ||
    target.isContentEditable
  );
}

export function useKeyboardShortcuts(shortcuts: ShortcutMap) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = buildKey(e);
      const action = shortcuts[key];
      if (!action) return;
      // Allow Escape everywhere; block other shortcuts when in inputs
      if (key !== 'escape' && isEditableTarget(e)) return;
      action(e);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [shortcuts]);
}
