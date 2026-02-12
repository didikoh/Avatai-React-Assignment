import { useState } from 'react'
import type { FormEvent } from 'react'

type TodoFormProps = {
  onAddTodo: (title: string) => void
}

export const TodoForm = ({ onAddTodo }: TodoFormProps) => {
  const [draftTitle, setDraftTitle] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    const normalizedTitle = draftTitle.trim()
    if (!normalizedTitle) {
      return
    }

    onAddTodo(normalizedTitle)
    setDraftTitle('')
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        className="todo-input"
        aria-label="New task title"
        placeholder="What should be done today?"
        value={draftTitle}
        onChange={(event) => setDraftTitle(event.target.value)}
      />
      <button className="primary-button" type="submit" disabled={!draftTitle.trim()}>
        Add Task
      </button>
    </form>
  )
}
