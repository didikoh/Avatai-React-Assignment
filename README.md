# Mini Task Manager

React + TypeScript SPA implementing all required and optional items from `docs/Task.md`.

## Features
- Loads initial tasks from `https://jsonplaceholder.typicode.com/todos?_limit=20`
- Add, edit, delete, and toggle tasks locally
- Filter tasks by `All`, `Active`, and `Completed`
- Search tasks with debounce
- Paginate task list
- Persist tasks to localStorage
- Routing with dedicated pages
- Handles loading/error states with retry + reload from API
- Unit tests for state and UI flows

## Tech Choices
- React + TypeScript
- Redux Toolkit + React Redux
- React Router
- Native `fetch` for API calls
- Plain CSS for styling
- Vitest + React Testing Library

## Project Structure
- `src/api/todos.ts`: API request and response parsing
- `src/components/`: UI components
- `src/hooks/useDebouncedValue.ts`: debounce utility hook
- `src/pages/`: routed page components
- `src/store/todosSlice.ts`: Redux slice, async thunks, selectors
- `src/store/store.ts`: Redux store and localStorage persistence subscription
- `src/utils/todoStorage.ts`: localStorage load/save helpers
- `src/test/`: test setup and helpers
- `src/types/todo.ts`: shared types
- `docs/Architecture.md`: required architectural write-up

## Run
```bash
npm install
npm run dev
```

## Validation
```bash
npm run lint
npm run test
npm run build
```
