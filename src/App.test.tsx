import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'
import { renderWithProviders } from './test/testUtils'

describe('App routing', () => {
  it('renders about page content when navigated to /about', () => {
    renderWithProviders(<App />, { route: '/about' })
    expect(screen.getByText('Enhancements Implemented')).toBeInTheDocument()
  })

  it('renders not found page for unknown route and returns to tasks', () => {
    renderWithProviders(<App />, { route: '/missing' })

    expect(screen.getByText('Page Not Found')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('link', { name: 'Go to task manager' }))
    expect(screen.getByText('Mini Task Manager')).toBeInTheDocument()
  })
})
