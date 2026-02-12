import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { AboutPage } from './pages/AboutPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { TasksPage } from './pages/TasksPage'
import './App.css'

function App() {
  return (
    <main className="app-shell">
      <div className="app-frame">
        <header className="site-header">
          <p className="eyebrow">Avatai React Assignment</p>
          <nav className="site-nav" aria-label="Main navigation">
            <NavLink
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link-active' : ''}`
              }
              to="/tasks"
            >
              Tasks
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link-active' : ''}`
              }
              to="/about"
            >
              About
            </NavLink>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Navigate to="/tasks" replace />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </main>
  )
}

export default App
