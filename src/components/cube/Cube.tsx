import React, { useEffect, useMemo, useState } from 'react'
import { ICube, Logic } from './Logic'
import Side from './Side'

interface ICubeProps {
  perspective: number
  sideWidth: number
}

const Cube: React.FC<ICubeProps> = ({ perspective, sideWidth }) => {
  const logic = useMemo(() => new Logic(), [])
  const [blocks, setBlocks] = useState<ICube>(logic.blocks)

  useEffect(() => {
    function handler(event: KeyboardEvent) {
      if (/^(?:ArrowLeft|ArrowRight|ArrowUp|ArrowDown)$/.test(event.code)) {
        const methodName = `rotate${event.code.slice(5)}`
        const method = logic[methodName as keyof Logic] as () => void
        method.call(logic)
        setBlocks(logic.blocks)
      }
      if (/^(?:r|l|u|d|f)$/i.test(event.key)) {
        const methodName = `rotate${event.key.toUpperCase()}`
        const method = logic[methodName as keyof Logic] as (
          clockwise: boolean
        ) => void
        method.call(logic, event.key.toLowerCase() === event.key)
        setBlocks(logic.blocks)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [logic])

  const cubes = useMemo(() => {
    const ans: JSX.Element[] = []
    for (let x = -1 as -1 | 0 | 1; x <= 1; ++x) {
      for (let y = -1 as -1 | 0 | 1; y <= 1; ++y) {
        ans.push(
          <Side
            key={x + '_' + y}
            perspective={perspective}
            width={sideWidth}
            x={x}
            y={y}
            state={blocks[x][y][1].sides.front}
          />
        )
        console.log(x, y, blocks[x][y][1].sides)
      }
    }
    return ans
  }, [perspective, sideWidth, blocks])

  return <>{cubes}</>
}

export default Cube
