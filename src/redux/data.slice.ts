import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type IShowDisplay = 'yes' | 'no'

const initialState: {
  showDisplay: IShowDisplay
} = {
  showDisplay: localStorage.getItem('showdisplay') === 'no' ? 'no' : 'yes',
}

export const dataSlice = createSlice({
  initialState,
  name: 'data',
  reducers: {
    toggleDisplay: (state, action: PayloadAction<void>) => {
      state.showDisplay = state.showDisplay === 'no' ? 'yes' : 'no'
      localStorage.setItem('showdisplay', state.showDisplay)
    },
  },
})

export const dataActionCreators = dataSlice.actions
export const dataReducer = dataSlice.reducer
