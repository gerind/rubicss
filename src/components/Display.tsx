import React from 'react'
import { DISPLAY_WIDTH } from '../core/constants'
import { useDataSelector } from '../hooks/useSelector'

const Display: React.FC = () => {
  const showDisplay = useDataSelector(data => data.showDisplay === 'yes')

  const style: React.CSSProperties = {
    transition: 'all .8s linear',
    width: `${DISPLAY_WIDTH}px`,
  }
  if (!showDisplay) {
    style.transform = 'translate(-100%, 0)'
    style.marginRight = `-${DISPLAY_WIDTH}px`
  }

  return (
    <div className="display" style={style}>
      <div className="instruction">
        <h1>Элементы управления</h1>
        <p>ArrowLeft - перейти к левой грани</p>
        <p>ArrowRight - перейти к правой грани</p>
        <p>ArrowUp - перейти к верхней грани</p>
        <p>ArrowDown - перейти к нижней грани</p>
        <p>R - поворот правой грани по часовой стрелке</p>
        <p>L - поворот левой грани по часовой стрелке</p>
        <p>U - поворот верхней грани по часовой стрелке</p>
        <p>D - поворот нижней грани по часовой стрелке</p>
        <p>F - поворот передней грани по часовой стрелке</p>
        <p>+Shift, чтобы повернуть против часовой стрелки</p>
      </div>
    </div>
  )
}

export default Display
