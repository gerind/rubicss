import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {},
})

export type DispatchType = typeof store.dispatch
export type StateType = ReturnType<typeof store.getState>
