import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { Todo } from '../types/todo'

type TodoItemProps = {
  todo: Todo
  onToggleTodo: (id: number) => void
  onDeleteTodo: (id: number) => void
  onEditTodo: (id: number, title: string) => void
}

export const TodoItem = ({
  todo,
  onToggleTodo,
  onDeleteTodo,
  onEditTodo,
}: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState(todo.title)
  const editInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus()
    }
  }, [isEditing])

  const handleSave = (): void => {
    const normalizedTitle = draftTitle.trim()
    if (!normalizedTitle) {
      return
    }

    onEditTodo(todo.id, normalizedTitle)
    setIsEditing(false)
  }

  const handleCancel = (): void => {
    setDraftTitle(todo.title)
    setIsEditing(false)
  }

  const handleStartEdit = (): void => {
    setDraftTitle(todo.title)
    setIsEditing(true)
  }

  const handleTitleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSave()
    } else if (event.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <li className={`todo-item ${todo.completed ? 'is-completed' : ''}`}>
      <div className="todo-main">
        <input
          className="todo-checkbox"
          type="checkbox"
          checked={todo.completed}
          disabled={isEditing}
          aria-label={`Mark "${todo.title}" as ${
            todo.completed ? 'active' : 'completed'
          }`}
          onChange={() => onToggleTodo(todo.id)}
        />

        {isEditing ? (
          <input
            ref={editInputRef}
            className="edit-input"
            value={draftTitle}
            onChange={(event) => setDraftTitle(event.target.value)}
            onKeyDown={handleTitleKeyDown}
          />
        ) : (
          <p className="todo-title">{todo.title}</p>
        )}
      </div>

      <div className="item-actions">
        {isEditing ? (
          <>
            <button
              className="secondary-button"
              type="button"
              onClick={handleSave}
              disabled={!draftTitle.trim()}
            >
              Save
            </button>
            <button className="ghost-button" type="button" onClick={handleCancel}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="secondary-button"
              type="button"
              onClick={handleStartEdit}
            >
              Edit
            </button>
            <button
              className="ghost-button danger-button"
              type="button"
              onClick={() => onDeleteTodo(todo.id)}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  )
}
