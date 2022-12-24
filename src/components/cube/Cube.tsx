import React, { useEffect, useMemo, useState } from 'react'
import { forkey2, ICube, IKey, IRotateResponce, Logic } from './Logic'
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
      let rotate: (() => IRotateResponce) | null = null
      if (/^Arrow(?:Left|Right|Up|Down)$/i.test(event.code)) {
        const methodName = `rotate${event.code.slice(5)}`
        const method = logic[methodName as keyof Logic] as () => IRotateResponce
        rotate = () => method.call(logic)
      } else if (/^Key(?:R|L|U|D|F)$/i.test(event.code)) {
        const methodName = `rotate${event.code[3]}`
        const method = logic[methodName as keyof Logic] as (
          clockwise: boolean
        ) => IRotateResponce
        rotate = () => method.call(logic, !event.shiftKey)
      }
      if (rotate) {
        const rotateResponse = rotate()
        setBlocks(logic.blocks)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [logic])

  const cubes = useMemo(() => {
    const ans: JSX.Element[] = []
    const front = logic.getFrontSquare()
    forkey2((x, y) =>
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
    )
    return ans
  }, [perspective, sideWidth, blocks, logic])

  return <>{cubes}</>
}

export default Cube
