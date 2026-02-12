import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TasksPage } from './TasksPage'
import { renderWithProviders } from '../test/testUtils'

describe('TasksPage', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('supports pagination through the task list', async () => {
    const todos = Array.from({ length: 8 }, (_, index) => ({
      id: index + 1,
      title: `Task ${index + 1}`,
      completed: false,
    }))

    renderWithProviders(<TasksPage />, {
      preloadedTodosState: {
        todos,
      },
    })

    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.queryByText('Task 7')).not.toBeInTheDocument()
    expect(screen.getByText('Showing 1-6 of 8')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Next' }))

    await waitFor(() => {
      expect(screen.getByText('Task 7')).toBeInTheDocument()
      expect(screen.getByText('Showing 7-8 of 8')).toBeInTheDocument()
    })
  })

  it('applies search query after debounce delay', async () => {
    renderWithProviders(<TasksPage />, {
      preloadedTodosState: {
        todos: [
          { id: 1, title: 'Alpha task', completed: false },
          { id: 2, title: 'Beta task', completed: false },
        ],
      },
    })

    fireEvent.change(screen.getByLabelText('Search tasks'), {
      target: { value: 'beta' },
    })

    expect(screen.getByText('Alpha task')).toBeInTheDocument()
    expect(screen.getByText('Beta task')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByText('Alpha task')).not.toBeInTheDocument()
      expect(screen.getByText('Beta task')).toBeInTheDocument()
    }, { timeout: 1200 })
  })
})
