import { describe, expect, it } from 'vitest'
import type { RootState } from './store'
import todosReducer, {
  addTodo,
  deleteTodo,
  editTodo,
  selectFilteredTodos,
  selectTodoPagination,
  setCurrentPage,
  setFilter,
  setSearchQuery,
  toggleTodo,
  type TodosState,
} from './todosSlice'

const buildState = (partial?: Partial<TodosState>): TodosState => ({
  status: 'ready',
  error: null,
  todos: [],
  filter: 'all',
  searchQuery: '',
  currentPage: 1,
  pageSize: 6,
  ...partial,
})

const asRootState = (todosState: TodosState): RootState =>
  ({ todos: todosState }) as RootState

describe('todosSlice reducers', () => {
  it('adds a todo with trimmed title and resets page to first page', () => {
    const initialState = buildState({
      currentPage: 3,
      todos: [{ id: 5, title: 'Existing task', completed: false }],
    })

    const nextState = todosReducer(initialState, addTodo('  New task  '))

    expect(nextState.todos[0]).toEqual({ id: 6, title: 'New task', completed: false })
    expect(nextState.currentPage).toBe(1)
  })

  it('does not add todo for blank input', () => {
    const initialState = buildState()
    const nextState = todosReducer(initialState, addTodo('   '))
    expect(nextState.todos).toHaveLength(0)
  })

  it('updates, toggles, and deletes todos', () => {
    const initialState = buildState({
      todos: [{ id: 1, title: 'Write docs', completed: false }],
    })

    const editedState = todosReducer(initialState, editTodo({ id: 1, title: 'Write tests' }))
    const toggledState = todosReducer(editedState, toggleTodo(1))
    const deletedState = todosReducer(toggledState, deleteTodo(1))

    expect(editedState.todos[0].title).toBe('Write tests')
    expect(toggledState.todos[0].completed).toBe(true)
    expect(deletedState.todos).toHaveLength(0)
  })
})

describe('todosSlice selectors', () => {
  const todos = [
    { id: 1, title: 'Alpha task', completed: false },
    { id: 2, title: 'Beta report', completed: true },
    { id: 3, title: 'Another beta draft', completed: false },
    { id: 4, title: 'Gamma note', completed: false },
    { id: 5, title: 'Delta follow-up', completed: true },
    { id: 6, title: 'Epsilon plan', completed: false },
    { id: 7, title: 'Zeta checklist', completed: false },
  ]

  it('filters by completion and search query', () => {
    const state = buildState({
      todos,
      filter: 'active',
      searchQuery: 'beta',
    })

    const filtered = selectFilteredTodos(asRootState(state))
    expect(filtered.map((todo) => todo.id)).toEqual([3])
  })

  it('paginates filtered results', () => {
    const state = buildState({ todos })
    const pageTwoState = todosReducer(state, setCurrentPage(2))
    const pagination = selectTodoPagination(asRootState(pageTwoState))

    expect(pagination.pageCount).toBe(2)
    expect(pagination.currentPage).toBe(2)
    expect(pagination.items).toHaveLength(1)
    expect(pagination.items[0].id).toBe(7)
    expect(pagination.startItem).toBe(7)
    expect(pagination.endItem).toBe(7)
  })

  it('resets to first page when filter or search changes', () => {
    const baseState = buildState({ currentPage: 2, todos })
    const filteredState = todosReducer(baseState, setFilter('completed'))
    const searchedState = todosReducer(baseState, setSearchQuery('alpha'))

    expect(filteredState.currentPage).toBe(1)
    expect(searchedState.currentPage).toBe(1)
  })
})
