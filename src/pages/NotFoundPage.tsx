import { Link } from 'react-router-dom'

export const NotFoundPage = () => (
  <section className="info-page">
    <h1>Page Not Found</h1>
    <p>The page you requested does not exist.</p>
    <Link className="secondary-link" to="/tasks">
      Go to task manager
    </Link>
  </section>
)
