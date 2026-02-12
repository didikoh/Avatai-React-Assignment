import { configureStore } from '@reduxjs/toolkit'
import { saveTodosToStorage } from '../utils/todoStorage'
import todosReducer from './todosSlice'

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
})

let previousTodosReference = store.getState().todos.todos

store.subscribe(() => {
  const { status, todos } = store.getState().todos
  if (status !== 'ready') {
    return
  }

  if (previousTodosReference === todos) {
    return
  }

  previousTodosReference = todos
  saveTodosToStorage(todos)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
