import { combineReducers } from 'redux'
import { ADD_TODO, DELETE_TODO, TOGGLE_TODO, EDIT_TODO, SET_VISIBILITY_FILTER, VisibilityFilters, CLEAR_COMPLETED } from './actions'
const { SHOW_ALL } = VisibilityFilters

function visibilityFilter(state = SHOW_ALL, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter
    default:
      return state
  }
}
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case DELETE_TODO:
      return [
        ...state.slice(0, action.index),
        ...state.slice(action.index + 1)
      ]
    case TOGGLE_TODO:
      return [
        ...state.slice(0, action.index),
        Object.assign({}, state[action.index], {
          completed: action.ifCompleted
        }),
        ...state.slice(action.index + 1)
      ]
    case EDIT_TODO:
      return [
        ...state.slice(0, action.index),
        Object.assign({}, state[action.index], {
          text: action.text
        }),
        ...state.slice(action.index + 1)
      ]
    case CLEAR_COMPLETED:
      return [
        ...state.filter(todo => !todo.completed)
      ]
    default:
      return state
  }
}

const todoApp = combineReducers({
  visibilityFilter,
  todos
})

export default todoApp