import type { TodoFilter } from '../types/todo'
import type { TodoStats } from '../reducers/todoReducer'

type TodoFiltersProps = {
  activeFilter: TodoFilter
  stats: TodoStats
  onFilterChange: (filter: TodoFilter) => void
}

const FILTER_CONFIG: Array<{
  filter: TodoFilter
  label: string
  statKey: keyof TodoStats
}> = [
  { filter: 'all', label: 'All', statKey: 'all' },
  { filter: 'active', label: 'Active', statKey: 'active' },
  { filter: 'completed', label: 'Completed', statKey: 'completed' },
]

export const TodoFilters = ({
  activeFilter,
  stats,
  onFilterChange,
}: TodoFiltersProps) => (
  <div className="filter-group" role="tablist" aria-label="Task filters">
    {FILTER_CONFIG.map((item) => (
      <button
        key={item.filter}
        className={`filter-button ${activeFilter === item.filter ? 'is-active' : ''}`}
        type="button"
        role="tab"
        aria-selected={activeFilter === item.filter}
        onClick={() => onFilterChange(item.filter)}
      >
        {item.label}
        <span className="count-pill">{stats[item.statKey]}</span>
      </button>
    ))}
  </div>
)
