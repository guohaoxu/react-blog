export const ADD_TODO = 'ADD_TODO'
export const DELETE_TODO = 'DELETE_TODO'
export const TOGGLE_TODO = 'TOGGLE_TODO'
export const EDIT_TODO = 'EDIT_TODO'
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'
export const CLEAR_COMPLETED = 'CLEAR_COMPLETED'

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}

//actions creators
export function addTodo(text) {
  return { type: ADD_TODO, text }
}
export function deleteTodo(index) {
  return { type: DELETE_TODO, index }
}
export function toggleTodo(index, ifCompleted) {
  return { type: TOGGLE_TODO, index, ifCompleted }
}
export function setVisibilityFilter(filter) {
  return { type: SET_VISIBILITY_FILTER, filter }
}
export function clearCompleted() {
  return { type: CLEAR_COMPLETED }
}
export function editTodo(index, text) {
  return { type: EDIT_TODO, index, text}
}