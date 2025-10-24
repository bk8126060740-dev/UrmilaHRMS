import { createAction, props } from '@ngrx/store'
import { clientState } from './state.state'

export const editFormValue = createAction('editFormValue', props<clientState>())
export const clearFormValue = createAction('clearFormValue')






