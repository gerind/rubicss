import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { StateType } from '../redux/store'

export const useStateSelector: TypedUseSelectorHook<StateType> = useSelector

export const useDataSelector: TypedUseSelectorHook<
  StateType['data']
> = selector => {
  return useStateSelector(state => selector(state.data))
}
