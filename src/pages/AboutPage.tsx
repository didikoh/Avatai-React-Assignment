export const AboutPage = () => (
  <section className="info-page">
    <h1>Enhancements Implemented</h1>
    <ul>
      <li>Redux Toolkit based state management</li>
      <li>React Router multi-page navigation</li>
      <li>Debounced full-text search</li>
      <li>Client-side pagination</li>
      <li>localStorage persistence for tasks</li>
      <li>Unit tests with React Testing Library + Vitest</li>
    </ul>
    <p>
      The task list is restored from localStorage when available. If no local
      snapshot exists, tasks are loaded from JSONPlaceholder.
    </p>
  </section>
)
