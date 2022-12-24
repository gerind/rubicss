import { useEffect } from 'react'

function preventDefault(event: Event) {
  event.preventDefault()
}

export function usePreventSelectAndDrag() {
  useEffect(() => {
    document.addEventListener('selectstart', preventDefault)
    document.addEventListener('dragstart', preventDefault)
    return () => {
      document.removeEventListener('selectstart', preventDefault)
      document.removeEventListener('dragstart', preventDefault)
    }
  }, [])
}
