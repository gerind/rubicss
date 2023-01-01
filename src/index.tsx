import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import NoMobile from './components/NoMobile'
import { isMobileDevice } from './core/utils'
import './index.scss'
import { store } from './redux/store'

const container = document.getElementById('root')!
const root = createRoot(container)

if (isMobileDevice()) root.render(<NoMobile />)
else
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  )
