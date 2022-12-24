import React, { useMemo } from 'react'
import Cube from './components/cube/Cube'
import Display from './components/Display'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { perspective, sideWidth } from './core/constants'
import { useDataActions } from './hooks/useDataActions'
import { useDataSelector } from './hooks/useSelector'
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { usePreventSelectAndDrag } from './hooks/usePreventSelectAndDrag'
import { Logic } from './components/cube/Logic'

const App: React.FC = () => {
  const showDisplay = useDataSelector(data => data.showDisplay === 'yes')
  const actions = useDataActions()

  usePreventSelectAndDrag()

  const logic = useMemo(() => new Logic(), [])

  return (
    <div className="grid">
      <Display />
      <div className="wrapper">
        <div className="arrow" onMouseDown={() => actions.toggleDisplay()}>
          <FontAwesomeIcon icon={showDisplay ? faArrowLeft : faArrowRight} />
        </div>
        <div className="center">
          <Cube perspective={perspective} sideWidth={sideWidth} logic={logic} />
        </div>
        <div className="deconstruct" onClick={() => logic.deconstruct()}>
          РАЗОБРАТЬ
        </div>
      </div>
    </div>
  )
}

export default App
