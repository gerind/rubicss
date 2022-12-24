import React, { useEffect, useMemo, useState } from 'react'

export const stateToColor = {
  red: 'red',
  blue: 'blue',
  green: 'green',
  orange: 'orange',
  white: 'white',
  yellow: 'yellow',
  void: 'transparent',
}
export type ISideState = keyof typeof stateToColor

interface ISideProps {
  perspective: number
  state: ISideState
  width: number
  x: number
  y: number
  from?: [number, number, number]
  to?: [number, number, number]
  onTransitionEnd?: () => void
}

const Side: React.FC<ISideProps> = ({
  perspective,
  state,
  width,
  x,
  y,
  from,
  to,
  onTransitionEnd,
}) => {
  const [deg, setDeg] = useState<[number, number, number]>(
    from ? from : [0, 0, 0]
  )

  const styles: React.CSSProperties = useMemo(
    () => ({
      position: 'absolute',
      top: 0,
      left: 0,
      width: `${width}px`,
      height: `${width}px`,
      background: `${stateToColor[state]}`,
      boxSizing: 'border-box',
      border: '5px solid black',
      borderRadius: '5px',
      backfaceVisibility: 'hidden',
      transition: `transform .5s linear`,
      transform: `translate(-50%, -50%) perspective(${perspective}px) rotateX(${
        deg[0]
      }) rotateY(${deg[1]}) rotateZ(${deg[2]}) translate3d(${width * x}px, ${
        width * y
      }px, ${width * 1.5}px)`,
    }),
    [deg, perspective, state, width, x, y]
  )

  useEffect(() => {
    if (to) setDeg(to)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div style={styles} onTransitionEnd={onTransitionEnd}></div>
}

export default Side
