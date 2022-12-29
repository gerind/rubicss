import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DEFAULT_TRANSITION_TIME } from '../core/constants'

export type IShowDisplay = 'yes' | 'no'

const initialState: {
  showDisplay: IShowDisplay
  transitionTime: number
} = {
  showDisplay: localStorage.getItem('showdisplay') === 'no' ? 'no' : 'yes',
  transitionTime: DEFAULT_TRANSITION_TIME,
}

export const dataSlice = createSlice({
  initialState,
  name: 'data',
  reducers: {
    toggleDisplay: (state, action: PayloadAction<void>) => {
      state.showDisplay = state.showDisplay === 'no' ? 'yes' : 'no'
      localStorage.setItem('showdisplay', state.showDisplay)
    },
    changeTransitionTime: (state, action: PayloadAction<number>) => {
      state.transitionTime = action.payload
    },
  },
})

export const dataActionCreators = dataSlice.actions
export const dataReducer = dataSlice.reducer
