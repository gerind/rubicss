import React, { useMemo } from 'react'

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
}

const Side: React.FC<ISideProps> = ({ perspective, state, width, x, y }) => {
  const styles: React.CSSProperties = {
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
    transform: `translate(-50%, -50%) perspective(${perspective}px) translate3d(${
      width * x
    }px, ${width * y}px, ${width * 1.5}px)`,
  }

  return <div style={styles}></div>
}
/*
0 -> 1
1 -> 0
2 -> -1
*/

export default Side
