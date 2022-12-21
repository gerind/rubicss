import React, { useEffect, useMemo, useState } from 'react'
import { Logic } from './Logic'
import Side, { ISideState } from './Side'

interface ICubeProps {
  perspective: number
  sideWidth: number
}

const Cube: React.FC<ICubeProps> = ({ perspective, sideWidth }) => {
  const [state, setState] = useState(0)
  const logic = useMemo(() => new Logic(), [])

  useEffect(() => {
    function handler(event: KeyboardEvent) {
      switch (event.code) {
        case 'ArrowLeft':
          logic.rotateLeft()
          setState(s => s + 1)
          break
        case 'ArrowRight':
          logic.rotateRight()
          setState(s => s + 1)
          break
        case 'ArrowUp':
          logic.rotateUp()
          setState(s => s + 1)
          break
        case 'ArrowDown':
          logic.rotateDown()
          setState(s => s + 1)
          break
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [logic])

  const cubes = useMemo(() => {
    const ans = []
    for (let x = -1 as -1 | 0 | 1; x <= 1; ++x) {
      for (let y = -1 as -1 | 0 | 1; y <= 1; ++y) {
        ans.push(
          <Side
            key={x + '_' + y}
            perspective={perspective}
            width={sideWidth}
            x={x}
            y={y}
            state={logic.blocks[x][y][1].sides.front}
          />
        )
        console.log(x, y, logic.blocks[x][y][1].sides)
      }
    }
    return ans
  }, [perspective, sideWidth, state])

  return <>{cubes}</>
}

export default Cube
