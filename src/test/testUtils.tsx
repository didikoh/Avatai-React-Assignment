import { configureStore } from '@reduxjs/toolkit'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import todosReducer, { type TodosState } from '../store/todosSlice'

const defaultTodosState: TodosState = {
  status: 'ready',
  error: null,
  todos: [],
  filter: 'all',
  searchQuery: '',
  currentPage: 1,
  pageSize: 6,
}

type RenderWithProvidersOptions = {
  route?: string
  preloadedTodosState?: Partial<TodosState>
}

export const makeTestStore = (preloadedTodosState?: Partial<TodosState>) =>
  configureStore({
    reducer: {
      todos: todosReducer,
    },
    preloadedState: {
      todos: {
        ...defaultTodosState,
        ...preloadedTodosState,
      },
    },
  })

export const renderWithProviders = (
  ui: ReactElement,
  { route = '/tasks', preloadedTodosState }: RenderWithProvidersOptions = {},
) => {
  const store = makeTestStore(preloadedTodosState)

  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </Provider>,
    ),
  }
}
