import type { Todo } from '../types/todo'

const TODOS_API_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=20'

type TodoApiItem = {
  userId: number
  id: number
  title: string
  completed: boolean
}

const isTodoApiItem = (value: unknown): value is TodoApiItem => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const record = value as Record<string, unknown>
  return (
    typeof record.userId === 'number' &&
    typeof record.id === 'number' &&
    typeof record.title === 'string' &&
    typeof record.completed === 'boolean'
  )
}

export const fetchInitialTodos = async (
  signal?: AbortSignal,
): Promise<Todo[]> => {
  const response = await fetch(TODOS_API_URL, { signal })

  if (!response.ok) {
    throw new Error(
      `Failed to load tasks. Server responded with status ${response.status}.`,
    )
  }

  const payload: unknown = await response.json()

  if (!Array.isArray(payload)) {
    throw new Error('Failed to load tasks. Unexpected API response format.')
  }

  return payload.filter(isTodoApiItem).map((todo) => ({
    id: todo.id,
    userId: todo.userId,
    title: todo.title,
    completed: todo.completed,
  }))
}
