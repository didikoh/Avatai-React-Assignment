import type { Todo } from '../types/todo'

const TODO_STORAGE_KEY = 'avatai.todo-manager.v1'

type PersistedTodos = {
  todos: Todo[]
}

const isPersistedTodos = (value: unknown): value is PersistedTodos => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const record = value as Record<string, unknown>
  return (
    Array.isArray(record.todos) &&
    record.todos.every((todo) => {
      if (typeof todo !== 'object' || todo === null) {
        return false
      }

      const todoRecord = todo as Record<string, unknown>
      return (
        typeof todoRecord.id === 'number' &&
        typeof todoRecord.title === 'string' &&
        typeof todoRecord.completed === 'boolean'
      )
    })
  )
}

export const loadTodosFromStorage = (): Todo[] | null => {
  try {
    const rawValue = window.localStorage.getItem(TODO_STORAGE_KEY)
    if (!rawValue) {
      return null
    }

    const parsed: unknown = JSON.parse(rawValue)
    if (!isPersistedTodos(parsed)) {
      return null
    }

    return parsed.todos
  } catch {
    return null
  }
}

export const saveTodosToStorage = (todos: Todo[]): void => {
  try {
    const payload: PersistedTodos = { todos }
    window.localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // Storage is optional; ignore persistence failures.
  }
}
