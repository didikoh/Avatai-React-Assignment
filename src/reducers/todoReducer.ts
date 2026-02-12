import type { Todo, TodoFilter, TodoStatus } from '../types/todo'

export type TodoState = {
  status: TodoStatus
  error: string | null
  todos: Todo[]
  filter: TodoFilter
}

export type TodoStats = {
  all: number
  active: number
  completed: number
}

type TodoAction =
  | { type: 'loadStart' }
  | { type: 'loadSuccess'; payload: Todo[] }
  | { type: 'loadFailure'; payload: string }
  | { type: 'addTodo'; payload: string }
  | { type: 'deleteTodo'; payload: number }
  | { type: 'toggleTodo'; payload: number }
  | { type: 'editTodo'; payload: { id: number; title: string } }
  | { type: 'setFilter'; payload: TodoFilter }

export const initialTodoState: TodoState = {
  status: 'idle',
  error: null,
  todos: [],
  filter: 'all',
}

const getNextTodoId = (todos: Todo[]): number => {
  const maxId = todos.reduce((highest, todo) => Math.max(highest, todo.id), 0)
  return maxId + 1
}

export const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case 'loadStart':
      return {
        ...state,
        status: 'loading',
        error: null,
      }

    case 'loadSuccess':
      return {
        ...state,
        status: 'ready',
        error: null,
        todos: action.payload,
      }

    case 'loadFailure':
      return {
        ...state,
        status: 'error',
        error: action.payload,
      }

    case 'addTodo': {
      const normalizedTitle = action.payload.trim()
      if (!normalizedTitle) {
        return state
      }

      return {
        ...state,
        todos: [
          {
            id: getNextTodoId(state.todos),
            title: normalizedTitle,
            completed: false,
          },
          ...state.todos,
        ],
      }
    }

    case 'deleteTodo':
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      }

    case 'toggleTodo':
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo,
        ),
      }

    case 'editTodo': {
      const normalizedTitle = action.payload.title.trim()
      if (!normalizedTitle) {
        return state
      }

      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id ? { ...todo, title: normalizedTitle } : todo,
        ),
      }
    }

    case 'setFilter':
      return {
        ...state,
        filter: action.payload,
      }

    default:
      return state
  }
}

export const selectVisibleTodos = (
  todos: Todo[],
  filter: TodoFilter,
): Todo[] => {
  switch (filter) {
    case 'active':
      return todos.filter((todo) => !todo.completed)
    case 'completed':
      return todos.filter((todo) => todo.completed)
    case 'all':
    default:
      return todos
  }
}

export const selectTodoStats = (todos: Todo[]): TodoStats => {
  const completed = todos.filter((todo) => todo.completed).length
  return {
    all: todos.length,
    active: todos.length - completed,
    completed,
  }
}
