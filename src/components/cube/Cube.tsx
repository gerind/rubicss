import React, { useEffect, useMemo, useState } from 'react'
import { ICube, IKey, Logic } from './Logic'
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
      if (/^Arrow(?:Left|Right|Up|Down)$/i.test(event.code)) {
        const methodName = `rotate${event.code.slice(5)}`
        const method = logic[methodName as keyof Logic] as () => void
        method.call(logic)
        setBlocks(logic.blocks)
      }
      if (/^Key(?:R|L|U|D|F)$/i.test(event.code)) {
        const methodName = `rotate${event.code[3]}`
        const method = logic[methodName as keyof Logic] as (
          clockwise: boolean
        ) => void
        method.call(logic, !event.shiftKey)
        setBlocks(logic.blocks)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [logic])

  const cubes = useMemo(() => {
    const ans: JSX.Element[] = []
    const front = logic.getFrontSquare()
    for (let x = -1 as IKey; x <= 1; ++x) {
      for (let y = -1 as IKey; y <= 1; ++y) {
        ans.push(
          <Side
            key={x + '_' + y}
            perspective={perspective}
            width={sideWidth}
            x={x}
            y={y}
            state={front[x][y]}
          />
        )
        console.log(x, y, blocks[x][y][1].sides)
      }
    }
    return ans
  }, [perspective, sideWidth, blocks, logic])

  return <>{cubes}</>
}

export default Cube
