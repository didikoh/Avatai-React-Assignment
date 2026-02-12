# Architecture Notes - Mini Task Manager

## 1. Goals and Constraints
The assignment requires a small SPA that:
- loads initial todos from API
- supports local add/edit/delete/toggle operations
- supports `All`, `Active`, `Completed` filters

The API (`jsonplaceholder`) is read-only, so only initial hydration comes from backend. All user actions after load are local state updates.

In this implementation I also completed all optional enhancements:
- pagination
- localStorage persistence
- debounced search
- routing
- Redux Toolkit integration
- unit tests

## 2. Why This Structure
I split the app by domain responsibility:

- `src/store/todosSlice.ts`
  - single source of truth for todo state
  - async thunks for initial load/reload
  - reducers for local mutations
  - memoized selectors for filtered/paginated views
- `src/store/store.ts`
  - Redux store setup
  - subscription that persists todos to localStorage
- `src/pages/TasksPage.tsx`
  - page-level orchestration of controls and list UI
- `src/components/*`
  - focused UI units (form, filters, search, list, pagination)
- `src/api/todos.ts`
  - API request and response validation
- `src/utils/todoStorage.ts`
  - isolated storage concerns
- `src/test/*` and `*.test.tsx`
  - state and UI behavior coverage

This keeps business logic in slice/selectors and keeps components mostly presentation-driven.

## 3. State Management Choice
I intentionally moved from `useReducer` to Redux Toolkit because optional enhancements create cross-cutting state concerns:
- filter
- search query
- pagination
- async lifecycle states
- persistence trigger points

Redux Toolkit makes state transitions explicit and testable while avoiding boilerplate through Immer and action creators.

Why not Context-only or plain local state:
- would require custom memoization and action plumbing across more files
- selector reuse and composability would be weaker
- testing derived state behavior is cleaner with slice + selectors

## 4. Data Flow
### Initial boot
1. `TasksPage` dispatches `initializeTodos` when status is `idle`.
2. Thunk checks localStorage snapshot first.
3. If no snapshot exists, thunk fetches API todos.
4. State transitions: `idle -> loading -> ready` (or `error`).

### Local updates
Actions mutate state locally:
- `addTodo`
- `editTodo`
- `toggleTodo`
- `deleteTodo`
- `setFilter`
- `setSearchQuery`
- `setCurrentPage`

### Persistence
Store subscription writes todos to localStorage only when:
- status is `ready`
- todo array reference changed

This avoids repeated unnecessary writes.

### Search + Pagination
- `useDebouncedValue` delays search dispatches.
- selectors derive filtered list and paginated view (`selectTodoPagination`).
- page is reset to `1` when filter/search changes to keep UX consistent.

## 5. Routing Design
Routing uses React Router with three pages:
- `/tasks`: primary task manager
- `/about`: enhancement summary
- fallback route: not-found page

`/` redirects to `/tasks`.

Reasoning:
- demonstrates SPA routing without overcomplicating task flows
- preserves assignment requirement while proving route composition skills

## 6. Error Handling
Error handling is explicit in two layers:

1. `src/api/todos.ts`
- validates HTTP status
- validates payload shape

2. `todosSlice` + UI
- stores error message in state
- renders user-visible alert and retry button
- provides explicit reload-from-API action

## 7. Trade-offs
What this design optimizes:
- predictable behavior
- clear testability
- maintainability as features grow

Trade-offs accepted:
- persistence is snapshot-based and not version-migrated
- pagination is client-side only (fine for current dataset)
- no backend write sync (API is read-only anyway)

## 8. Tests Implemented
Unit and component tests cover:
- reducer transitions for add/edit/toggle/delete
- selector behavior for filtering/search/pagination
- route rendering and not-found recovery
- debounced search behavior in `TasksPage`

This gives confidence around the new optional features and regression-prone logic.

## 9. If More Time Was Available
I would add:
1. accessibility hardening (live regions, richer keyboard flow, stricter semantics)
2. E2E tests (Playwright/Cypress) for full route and persistence flows
3. localStorage schema versioning and migration guardrails
4. optional server-state abstraction (React Query) if write-capable backend becomes available

Current implementation stays intentionally practical while satisfying both required and optional assignment scope.
