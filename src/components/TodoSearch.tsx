type TodoSearchProps = {
  value: string
  isDebouncing: boolean
  onSearchChange: (value: string) => void
}

export const TodoSearch = ({
  value,
  isDebouncing,
  onSearchChange,
}: TodoSearchProps) => (
  <div className="search-row">
    <input
      className="todo-input"
      aria-label="Search tasks"
      placeholder="Search tasks"
      value={value}
      onChange={(event) => onSearchChange(event.target.value)}
    />
    <p className="search-hint">{isDebouncing ? 'Searching...' : 'Search ready'}</p>
  </div>
)
