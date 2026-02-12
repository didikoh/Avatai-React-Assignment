import {
  createAsyncThunk,
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
import { fetchInitialTodos } from '../api/todos'
import type { Todo, TodoFilter, TodoStatus } from '../types/todo'
import { loadTodosFromStorage } from '../utils/todoStorage'
import type { RootState } from './store'

export type TodosState = {
  status: TodoStatus
  error: string | null
  todos: Todo[]
  filter: TodoFilter
  searchQuery: string
  currentPage: number
  pageSize: number
}

export type TodoStats = {
  all: number
  active: number
  completed: number
}

export type TodoPagination = {
  items: Todo[]
  totalItems: number
  pageCount: number
  currentPage: number
  startItem: number
  endItem: number
}

const INITIAL_PAGE_SIZE = 6

const initialState: TodosState = {
  status: 'idle',
  error: null,
  todos: [],
  filter: 'all',
  searchQuery: '',
  currentPage: 1,
  pageSize: INITIAL_PAGE_SIZE,
}

const getNextTodoId = (todos: Todo[]): number => {
  const maxId = todos.reduce((highest, todo) => Math.max(highest, todo.id), 0)
  return maxId + 1
}

const getErrorMessage = (error: unknown): string =>
  error instanceof Error
    ? error.message
    : 'Unexpected error happened while loading tasks.'

export const initializeTodos = createAsyncThunk<
  Todo[],
  void,
  { rejectValue: string }
>('todos/initialize', async (_, { rejectWithValue }) => {
  const persistedTodos = loadTodosFromStorage()
  if (persistedTodos !== null) {
    return persistedTodos
  }

  try {
    return await fetchInitialTodos()
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const reloadTodosFromApi = createAsyncThunk<
  Todo[],
  void,
  { rejectValue: string }
>('todos/reload', async (_, { rejectWithValue }) => {
  try {
    return await fetchInitialTodos()
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const normalizedTitle = action.payload.trim()
      if (!normalizedTitle) {
        return
      }

      state.todos.unshift({
        id: getNextTodoId(state.todos),
        title: normalizedTitle,
        completed: false,
      })
      state.currentPage = 1
    },

    deleteTodo: (state, action: PayloadAction<number>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload)
    },

    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.todos.find((item) => item.id === action.payload)
      if (todo) {
        todo.completed = !todo.completed
      }
    },

    editTodo: (
      state,
      action: PayloadAction<{
        id: number
        title: string
      }>,
    ) => {
      const normalizedTitle = action.payload.title.trim()
      if (!normalizedTitle) {
        return
      }

      const todo = state.todos.find((item) => item.id === action.payload.id)
      if (todo) {
        todo.title = normalizedTitle
      }
    },

    setFilter: (state, action: PayloadAction<TodoFilter>) => {
      if (state.filter === action.payload) {
        return
      }

      state.filter = action.payload
      state.currentPage = 1
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      const normalizedQuery = action.payload.trim()
      if (state.searchQuery === normalizedQuery) {
        return
      }

      state.searchQuery = normalizedQuery
      state.currentPage = 1
    },

    setCurrentPage: (state, action: PayloadAction<number>) => {
      const nextPage = Math.max(1, action.payload)
      if (state.currentPage === nextPage) {
        return
      }

      state.currentPage = nextPage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeTodos.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(initializeTodos.fulfilled, (state, action) => {
        state.status = 'ready'
        state.error = null
        state.todos = action.payload
      })
      .addCase(initializeTodos.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload ?? 'Failed to load tasks.'
      })
      .addCase(reloadTodosFromApi.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(reloadTodosFromApi.fulfilled, (state, action) => {
        state.status = 'ready'
        state.error = null
        state.todos = action.payload
        state.currentPage = 1
      })
      .addCase(reloadTodosFromApi.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload ?? 'Failed to reload tasks.'
      })
  },
})

export const {
  addTodo,
  deleteTodo,
  toggleTodo,
  editTodo,
  setFilter,
  setSearchQuery,
  setCurrentPage,
} = todosSlice.actions

const selectTodosState = (state: RootState): TodosState => state.todos

export const selectTodosStatus = (state: RootState): TodoStatus =>
  selectTodosState(state).status

export const selectTodosError = (state: RootState): string | null =>
  selectTodosState(state).error

export const selectTodosFilter = (state: RootState): TodoFilter =>
  selectTodosState(state).filter

export const selectSearchQuery = (state: RootState): string =>
  selectTodosState(state).searchQuery

export const selectAllTodos = (state: RootState): Todo[] => selectTodosState(state).todos

export const selectTodoStats = createSelector(
  [selectAllTodos],
  (todos): TodoStats => {
    const completed = todos.filter((todo) => todo.completed).length
    return {
      all: todos.length,
      active: todos.length - completed,
      completed,
    }
  },
)

export const selectFilteredTodos = createSelector(
  [selectAllTodos, selectTodosFilter, selectSearchQuery],
  (todos, filter, searchQuery) => {
    const normalizedQuery = searchQuery.toLowerCase()

    return todos.filter((todo) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && !todo.completed) ||
        (filter === 'completed' && todo.completed)

      const matchesSearch =
        normalizedQuery.length === 0 ||
        todo.title.toLowerCase().includes(normalizedQuery)

      return matchesFilter && matchesSearch
    })
  },
)

export const selectTodoPagination = createSelector(
  [selectFilteredTodos, selectTodosState],
  (filteredTodos, todosState): TodoPagination => {
    const totalItems = filteredTodos.length
    const pageCount = Math.max(1, Math.ceil(totalItems / todosState.pageSize))
    const currentPage = Math.min(Math.max(todosState.currentPage, 1), pageCount)
    const startIndex = (currentPage - 1) * todosState.pageSize
    const endIndex = startIndex + todosState.pageSize

    return {
      items: filteredTodos.slice(startIndex, endIndex),
      totalItems,
      pageCount,
      currentPage,
      startItem: totalItems === 0 ? 0 : startIndex + 1,
      endItem: Math.min(endIndex, totalItems),
    }
  },
)

export default todosSlice.reducer
