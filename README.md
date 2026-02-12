# Mini Task Manager

Small React + TypeScript SPA implementing the assignment in `docs/Task.md`.

## Features
- Loads initial tasks from `https://jsonplaceholder.typicode.com/todos`
- Add, edit, delete, and toggle tasks locally
- Filter tasks by `All`, `Active`, and `Completed`
- Handles loading and error states with retry
- Uses functional components and hooks

## Tech Choices
- React + TypeScript
- `useReducer` for predictable state transitions
- Native `fetch` for API calls
- Plain CSS for styling

## Project Structure
- `src/api/todos.ts`: API request and response parsing
- `src/reducers/todoReducer.ts`: reducer, actions, and selectors
- `src/components/`: UI components
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
npm run build
```
