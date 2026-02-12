import { useEffect, useState } from 'react'
import { PaginationControls } from '../components/PaginationControls'
import { TodoFilters } from '../components/TodoFilters'
import { TodoForm } from '../components/TodoForm'
import { TodoList } from '../components/TodoList'
import { TodoSearch } from '../components/TodoSearch'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  addTodo,
  deleteTodo,
  editTodo,
  initializeTodos,
  reloadTodosFromApi,
  selectSearchQuery,
  selectTodoPagination,
  selectTodoStats,
  selectTodosError,
  selectTodosFilter,
  selectTodosStatus,
  setCurrentPage,
  setFilter,
  setSearchQuery,
  toggleTodo,
} from '../store/todosSlice'

export const TasksPage = () => {
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectTodosStatus)
  const error = useAppSelector(selectTodosError)
  const activeFilter = useAppSelector(selectTodosFilter)
  const searchQuery = useAppSelector(selectSearchQuery)
  const todoStats = useAppSelector(selectTodoStats)
  const pagination = useAppSelector(selectTodoPagination)
  const [searchDraft, setSearchDraft] = useState(() => searchQuery)
  const debouncedSearch = useDebouncedValue(searchDraft)

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(initializeTodos())
    }
  }, [dispatch, status])

  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearch))
  }, [debouncedSearch, dispatch])

  const shouldShowInitialLoading = status === 'loading' && todoStats.all === 0
  const shouldShowList = !(status === 'error' && todoStats.all === 0)

  return (
    <section className="todo-app" aria-labelledby="task-manager-title">
      <header className="app-header">
        <p className="eyebrow">Mini Task Manager</p>
        <h1 id="task-manager-title">Plan, track, and finish what matters.</h1>
        <p className="subtitle">
          Local changes are persisted in localStorage. Reload from API replaces
          current task data.
        </p>
      </header>

      <TodoForm onAddTodo={(title) => dispatch(addTodo(title))} />

      <TodoSearch
        value={searchDraft}
        isDebouncing={searchDraft !== debouncedSearch}
        onSearchChange={setSearchDraft}
      />

      <TodoFilters
        activeFilter={activeFilter}
        stats={todoStats}
        onFilterChange={(filter) => dispatch(setFilter(filter))}
      />

      {shouldShowInitialLoading ? (
        <p className="state-message">Loading tasks...</p>
      ) : null}

      {status === 'error' ? (
        <div className="state-error" role="alert">
          <p>{error ?? 'Failed to load tasks.'}</p>
          <button
            className="secondary-button"
            type="button"
            onClick={() => void dispatch(reloadTodosFromApi())}
          >
            Retry
          </button>
        </div>
      ) : null}

      {shouldShowList ? (
        <>
          <TodoList
            todos={pagination.items}
            onToggleTodo={(id) => dispatch(toggleTodo(id))}
            onDeleteTodo={(id) => dispatch(deleteTodo(id))}
            onEditTodo={(id, title) => dispatch(editTodo({ id, title }))}
          />
          <PaginationControls
            currentPage={pagination.currentPage}
            pageCount={pagination.pageCount}
            startItem={pagination.startItem}
            endItem={pagination.endItem}
            totalItems={pagination.totalItems}
            onPageChange={(page) => dispatch(setCurrentPage(page))}
          />
        </>
      ) : null}

      <footer className="app-footer">
        <p>{todoStats.active} active tasks remaining.</p>
        <button
          className="ghost-button"
          type="button"
          onClick={() => void dispatch(reloadTodosFromApi())}
        >
          Reload from API
        </button>
      </footer>
    </section>
  )
}
