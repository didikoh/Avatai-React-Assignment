export type Todo = {
  id: number
  userId?: number
  title: string
  completed: boolean
}

export type TodoFilter = 'all' | 'active' | 'completed'

export type TodoStatus = 'idle' | 'loading' | 'ready' | 'error'
