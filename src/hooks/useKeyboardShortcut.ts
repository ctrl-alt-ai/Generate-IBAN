import { useEffect } from 'react';

interface KeyboardShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
}

export function useKeyboardShortcut(
  config: KeyboardShortcutConfig | string,
  callback: () => void,
  dependencies: any[] = []
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (typeof config === 'string') {
        // Simple shortcut format: "ctrl+enter", "alt+s", etc.
        const parts = config.toLowerCase().split('+');
        const key = parts[parts.length - 1];
        const modifiers = parts.slice(0, -1);
        
        const isCtrl = modifiers.includes('ctrl') || modifiers.includes('control');
        const isAlt = modifiers.includes('alt');
        const isShift = modifiers.includes('shift');
        const isMeta = modifiers.includes('meta') || modifiers.includes('cmd');
        
        if (
          event.key.toLowerCase() === key &&
          event.ctrlKey === isCtrl &&
          event.altKey === isAlt &&
          event.shiftKey === isShift &&
          event.metaKey === isMeta
        ) {
          event.preventDefault();
          callback();
        }
      } else {
        // Detailed config object
        if (
          event.key.toLowerCase() === config.key.toLowerCase() &&
          event.ctrlKey === (config.ctrlKey || false) &&
          event.altKey === (config.altKey || false) &&
          event.shiftKey === (config.shiftKey || false) &&
          event.metaKey === (config.metaKey || false)
        ) {
          event.preventDefault();
          callback();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [config, callback, ...dependencies]);
}