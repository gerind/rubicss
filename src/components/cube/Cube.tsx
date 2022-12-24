import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { forkey2, ICube, IRotateResponce, Logic } from './Logic'
import Side from './Side'

interface ICubeProps {
  perspective: number
  sideWidth: number
  logic: Logic
}

const Cube: React.FC<ICubeProps> = ({ perspective, sideWidth, logic }) => {
  const [blocks, setBlocks] = useState<ICube>(logic.blocks)
  const [animatedSides, setAnimatedSides] = useState<JSX.Element[]>([])
  const [animatedCount, setAnimatedCount] = useState(0)

  useEffect(() => {
    logic.registerCallback(() => setBlocks(logic.blocks))
  }, [logic])

  const startAnimation = useCallback(
    (rotateResponse: IRotateResponce) => {
      const ans: JSX.Element[] = []
      forkey2((x, y) => {
        if (
          rotateResponse.affectedCoords.length === 0 ||
          rotateResponse.affectedCoords.some(([_x, _y]) => _x === x && _y === y)
        ) {
          ans.push(
            <Side
              key={`animated_${x}_${y}_before`}
              perspective={perspective}
              state={rotateResponse.before[x][y]}
              width={sideWidth}
              x={x}
              y={y}
              to={rotateResponse.to}
              onTransitionEnd={() => setAnimatedCount(cnt => cnt - 1)}
            />,
            <Side
              key={`animated_${x}_${y}_after`}
              perspective={perspective}
              state={rotateResponse.after[x][y]}
              width={sideWidth}
              x={x}
              y={y}
              from={rotateResponse.from}
            />
          )
        } else {
          ans.push(
            <Side
              key={`noanimated_${x}_${y}`}
              perspective={perspective}
              state={rotateResponse.before[x][y]}
              width={sideWidth}
              x={x}
              y={y}
            />
          )
        }
      })
      setAnimatedSides(ans)
      setAnimatedCount(rotateResponse.affectedCoords.length || 9)
    },
    [perspective, sideWidth]
  )

  useEffect(() => {
    function handler(event: KeyboardEvent) {
      if (animatedCount) return
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
        startAnimation(rotateResponse)
        setBlocks(logic.blocks)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [logic, startAnimation, animatedCount])

  const staticSides = useMemo(() => {
    const ans: JSX.Element[] = []
    const front = logic.getFrontSquare()
    forkey2((x, y) =>
      ans.push(
        <Side
          key={`static_${x}_${y}`}
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

  return <>{animatedCount ? animatedSides : staticSides}</>
}

export default Cube
