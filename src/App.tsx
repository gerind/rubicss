import React, { useCallback, useEffect, useState } from 'react'
import Cube, { ICubeHelpers } from './components/cube/Cube'
import Display from './components/Display'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  DECONSTRUCT_MOVES_COUNT,
  DECONSTRUCT_TRANSITION_TIME,
  PERSPECTIVE,
  SIDE_WIDTH,
} from './core/constants'
import { useDataActions } from './hooks/useDataActions'
import { useDataSelector } from './hooks/useSelector'
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { usePreventSelectAndDrag } from './hooks/usePreventSelectAndDrag'
import { useDeconstruct } from './hooks/useDeconstruct'
import { IMoveType } from './components/cube/Logic'

const App: React.FC = () => {
  const showDisplay = useDataSelector(data => data.showDisplay === 'yes')
  const actions = useDataActions()

  usePreventSelectAndDrag()

  const transitionTime = useDataSelector(data => data.transitionTime)

  const [helpers, registerHelpers] = useState<ICubeHelpers>()

  const [, changeDeconstruction] = useDeconstruct(
    helpers!,
    DECONSTRUCT_MOVES_COUNT,
    DECONSTRUCT_TRANSITION_TIME
  )

  const keyHandler = useCallback(
    (code: string, shiftKey: boolean) => {
      let moveType: IMoveType | null = null
      if (/^Arrow(?:Left|Right|Up|Down)$/.test(code))
        moveType = code.slice(5) as IMoveType
      else if (/^Key(?:R|L|U|D|F)$/.test(code)) moveType = code[3] as IMoveType
      if (moveType) {
        helpers!.performMove(transitionTime, moveType!, !shiftKey)
      }
    },
    [helpers, transitionTime]
  )

  useEffect(() => {
    const handler = (event: KeyboardEvent) =>
      keyHandler(event.code, event.shiftKey)
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [keyHandler])

  return (
    <div className="grid">
      <Display />
      <div className="wrapper">
        <div className="arrow" onMouseDown={() => actions.toggleDisplay()}>
          <FontAwesomeIcon icon={showDisplay ? faArrowLeft : faArrowRight} />
        </div>
        <div className="center">
          <Cube
            perspective={PERSPECTIVE}
            sideWidth={SIDE_WIDTH}
            registerHelpers={registerHelpers}
          />
        </div>
        <div className="deconstruct" onClick={() => changeDeconstruction(true)}>
          ??????????????????
        </div>
      </div>
    </div>
  )
}

export default App
