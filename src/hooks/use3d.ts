import React, { useMemo, useCallback, useState, useEffect } from 'react'

export function use3d() {
  const [deg, setDeg] = useState(0)
  const onTransitionEnd = useCallback(() => {
    setDeg(deg => deg + 180)
  }, [])

  const styles: React.CSSProperties = useMemo(
    () => ({
      // backfaceVisibility: 'hidden',
      transition: 'transform 2s linear',
      transform: `translate(-50%, -50%) perspective(1000px) rotateY(${deg}deg) translate3d(0, 0, 100px)`,
    }),
    [deg]
  )

  useEffect(() => {
    setDeg(deg => deg + 180)
  }, [])

  return {
    styles,
    onTransitionEnd,
  }
}
