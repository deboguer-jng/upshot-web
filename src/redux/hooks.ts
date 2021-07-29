import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from 'redux/store'

/**
 * Typed dispatch & selector hooks to use in place of
 * plain `useDispatch` and `useSelector`
 *
 * @see https://redux-toolkit.js.org/tutorials/typescript#define-typed-hooks
 */
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
