import { useEffect } from 'react'

interface ShortcutConfig {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  metaKey?: boolean
  action: () => void
  description: string
}

export const useKeyboardShortcuts = (shortcuts: ShortcutConfig[]) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return
      }

      shortcuts.forEach((shortcut) => {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase()
        const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey || event.metaKey : true
        const shiftMatch = shortcut.shiftKey ? event.shiftKey : true
        const altMatch = shortcut.altKey ? event.altKey : true
        const metaMatch = shortcut.metaKey ? event.metaKey : true

        if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
          event.preventDefault()
          shortcut.action()
        }
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])

  return shortcuts
}

// Common keyboard shortcuts
export const COMMON_SHORTCUTS = {
  SEARCH: { key: '/', description: 'Focus search' },
  NEW_UPLOAD: { key: 'n', ctrlKey: true, description: 'New upload' },
  EXPORT_PDF: { key: 'e', ctrlKey: true, description: 'Export PDF' },
  TOGGLE_THEME: { key: 't', ctrlKey: true, description: 'Toggle theme' },
  HELP: { key: '?', description: 'Show keyboard shortcuts' },
}