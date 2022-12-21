import React from 'react'
import Cube from './components/cube/Cube'
import { perspective, sideWidth } from './core/constants'

const App: React.FC = () => {
  return (
    <div className="center">
      <Cube perspective={perspective} sideWidth={sideWidth} />
    </div>
  )
}

export default App
