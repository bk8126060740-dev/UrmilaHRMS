import { Action, createReducer, on } from "@ngrx/store"
import { clientState, initialState } from './state.state'
import { editFormValue, clearFormValue } from "./state.action"

export function editFormReducer(state: clientState | undefined,action: Action<any>){
    return _editFormReducer(state,action)
}

const _editFormReducer = createReducer(initialState,
    on(editFormValue,(state,action)=>{
    return {
        ...state,                   
        name : action.name,
        description : action.description,
        id : action.id
    }
}),
on(clearFormValue,(state)=>{
    return {
        ...state,
        name : '',
        description : '',
        id : 0
    }
})

)

