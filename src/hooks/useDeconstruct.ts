import { useState, useEffect, useRef, useCallback } from 'react'
import { ICubeHelpers } from '../components/cube/Cube'
import { availableMoves } from '../components/cube/Logic'

export function useDeconstruct(
  helpers: ICubeHelpers,
  rotationsCount: number,
  rotationTime: number
) {
  const [isDeconstruction, changeDeconstruction] = useState(false)
  const [step, setStep] = useState(0)
  const lastStepRef = useRef(-1)

  const randomRotation = useCallback(() => {
    const moves: Function[] = []
    for (const s of availableMoves)
      if (s.length > 1) moves.push(() => helpers.performMove(s))
      else
        moves.push(
          () => helpers.performMove(s, true),
          () => helpers.performMove(s, false)
        )
    moves[Math.floor(Math.random() * moves.length)]()
  }, [helpers])

  useEffect(() => {
    console.log(isDeconstruction, step, lastStepRef.current)
    if (!isDeconstruction) {
      lastStepRef.current = -1
      setStep(0)
      return
    }
    if (lastStepRef.current >= step) return
    if (step < rotationsCount) {
      lastStepRef.current = step
      randomRotation()
      helpers.waitTransition(() => {
        console.log('waitTransition')
        setStep(step + 1)
      })
    } else {
      lastStepRef.current = -1
      changeDeconstruction(false)
      setStep(0)
    }
  }, [step, isDeconstruction, helpers, randomRotation, rotationsCount])

  return [isDeconstruction, changeDeconstruction] as const
}
