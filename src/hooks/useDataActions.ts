import { bindActionCreators } from '@reduxjs/toolkit'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { dataActionCreators } from '../redux/data.slice'

export function useDataActions() {
  const dispatch = useDispatch()
  return useMemo(
    () => bindActionCreators(dataActionCreators, dispatch),
    [dispatch]
  )
}
