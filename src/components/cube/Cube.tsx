import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { forkey2, IMoveType, IRotateResponce, Logic } from './Logic'
import Side from './Side'

export type IPerformMove = (moveType: IMoveType, clockwise?: boolean) => void
export type IWaitTransition = (callback: () => void) => void

export interface ICubeHelpers {
  performMove: IPerformMove
  waitTransition: IWaitTransition
}

interface ICubeProps {
  transitionTime: number
  perspective: number
  sideWidth: number
  registerHelpers: (helpers: ICubeHelpers) => void
}

const Cube: React.FC<ICubeProps> = ({
  transitionTime,
  perspective,
  sideWidth,
  registerHelpers,
}) => {
  const logic = useMemo(() => new Logic(), [])

  const [sides, setSides] = useState<JSX.Element[]>([])

  const animationProgressRef = useRef(false)
  const stepCountRef = useRef(0)

  const transitionWaitRef = useRef<Array<() => void>>([])
  const waitTransition: IWaitTransition = useCallback(
    callback => transitionWaitRef.current.push(callback),
    []
  )

  useEffect(() => {
    renderFrontSide()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onTransitionEnd = useCallback(() => {
    // const callbacks = [...transitionWaitRef.current]
    // transitionWaitRef.current = []
    // callbacks.forEach(cb => cb())
    performMove('R', true)
  }, [])

  const renderSides = useCallback(
    (rotateResponse: IRotateResponce) => {
      let finishHandled = false
      const ans: JSX.Element[] = []
      console.log('render sides')
      ++stepCountRef.current
      animationProgressRef.current = rotateResponse.affectedCoords.length > 0
      forkey2((x, y) => {
        const sharedOptions = {
          transitionTime,
          perspective,
          width: sideWidth,
          x,
          y,
        }
        if (
          rotateResponse.affectedCoords.some(([_x, _y]) => _x === x && _y === y)
        ) {
          console.log('there are animated coords')
          ans.push(
            <Side
              {...sharedOptions}
              key={`animated_${x}_${y}_before_${stepCountRef.current}`}
              state={rotateResponse.before[x][y]}
              to={rotateResponse.to}
              onTransitionEnd={() => {
                if (!finishHandled) {
                  finishHandled = true
                  animationProgressRef.current = false
                }
              }}
            />,
            <Side
              {...sharedOptions}
              key={`animated_${x}_${y}_after_${stepCountRef.current}`}
              state={rotateResponse.after[x][y]}
              from={rotateResponse.from}
            />
          )
        } else {
          ans.push(
            <Side
              {...sharedOptions}
              key={`noanimated_${x}_${y}_${stepCountRef.current}`}
              state={rotateResponse.before[x][y]}
            />
          )
        }
      })
      setSides(ans)
    },
    [perspective, sideWidth, transitionTime]
  )

  const renderFrontSide = useCallback(() => {
    const frontSide = logic.getFrontSquare()
    renderSides({
      before: frontSide,
      after: frontSide,
      from: [0, 0, 0],
      to: [0, 0, 0],
      affectedCoords: [],
    })
  }, [logic, renderSides])

  const performMove = useCallback(
    (moveType: IMoveType, clockwise?: boolean) => {
      console.log(moveType, clockwise, animationProgressRef.current)
      if (!animationProgressRef.current) {
        renderSides(logic.performMove(moveType, clockwise))
      }
    },
    [logic, renderSides]
  )

  useEffect(() => {
    registerHelpers({
      performMove,
      waitTransition,
    })
  }, [registerHelpers, performMove, waitTransition])

  return <>{sides}</>
}

export default React.memo(Cube)
