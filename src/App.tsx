import { useEffect, useMemo, useReducer, useState } from 'react'
import { fetchInitialTodos } from './api/todos'
import { TodoFilters } from './components/TodoFilters'
import { TodoForm } from './components/TodoForm'
import { TodoList } from './components/TodoList'
import {
  initialTodoState,
  selectTodoStats,
  selectVisibleTodos,
  todoReducer,
} from './reducers/todoReducer'
import './App.css'

function App() {
  const [state, dispatch] = useReducer(todoReducer, initialTodoState)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    const loadTodos = async (): Promise<void> => {
      dispatch({ type: 'loadStart' })

      try {
        const todos = await fetchInitialTodos(controller.signal)
        dispatch({ type: 'loadSuccess', payload: todos })
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        const message =
          error instanceof Error
            ? error.message
            : 'Unexpected error happened while loading tasks.'

        dispatch({ type: 'loadFailure', payload: message })
      }
    }

    void loadTodos()

    return () => controller.abort()
  }, [reloadKey])

  const visibleTodos = useMemo(
    () => selectVisibleTodos(state.todos, state.filter),
    [state.filter, state.todos],
  )

  const todoStats = useMemo(() => selectTodoStats(state.todos), [state.todos])

  const shouldShowInitialLoading =
    state.status === 'loading' && state.todos.length === 0

  const shouldShowList =
    state.status !== 'loading' &&
    !(state.status === 'error' && state.todos.length === 0)

  return (
    <main className="app-shell">
      <section className="todo-app" aria-labelledby="task-manager-title">
        <header className="app-header">
          <p className="eyebrow">Mini Task Manager</p>
          <h1 id="task-manager-title">Plan, track, and finish what matters.</h1>
          <p className="subtitle">
            Initial tasks are loaded from JSONPlaceholder. Changes are managed in
            local application state.
          </p>
        </header>

        <TodoForm
          onAddTodo={(title) => dispatch({ type: 'addTodo', payload: title })}
        />

        <TodoFilters
          activeFilter={state.filter}
          stats={todoStats}
          onFilterChange={(filter) => dispatch({ type: 'setFilter', payload: filter })}
        />

        {shouldShowInitialLoading ? (
          <p className="state-message">Loading tasks...</p>
        ) : null}

        {state.status === 'error' ? (
          <div className="state-error" role="alert">
            <p>{state.error ?? 'Failed to load tasks.'}</p>
            <button
              className="secondary-button"
              type="button"
              onClick={() => setReloadKey((value) => value + 1)}
            >
              Retry
            </button>
          </div>
        ) : null}

        {shouldShowList ? (
          <TodoList
            todos={visibleTodos}
            onToggleTodo={(id) => dispatch({ type: 'toggleTodo', payload: id })}
            onDeleteTodo={(id) => dispatch({ type: 'deleteTodo', payload: id })}
            onEditTodo={(id, title) =>
              dispatch({ type: 'editTodo', payload: { id, title } })
            }
          />
        ) : null}

        <footer className="app-footer">
          <p>{todoStats.active} active tasks remaining.</p>
          <button
            className="ghost-button"
            type="button"
            onClick={() => setReloadKey((value) => value + 1)}
          >
            Reload from API
          </button>
        </footer>
      </section>
    </main>
  )
}

export default App
