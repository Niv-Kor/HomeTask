# Test Lab Feature Implementation

## Current State

The app has a working policies list, a test cases table (read-only), and a blank new-test page. The API layer in `src/lib/api.ts` already has `runTestCase` and `createTestCase` functions ready to use. Bug fixes (badge color, TestStatus casing, nullable score) are already applied.

## Data Flow

```
PoliciesList --click policy--> TestCasesPage
TestCasesPage --click Run--> runTestCase API --2-4s delay--> TestCasesPage (row updates)
TestCasesPage --click New--> CreateForm
CreateForm --submit--> createTestCase API --navigate back--> TestCasesPage
```

## Feature 1: Run Tests (in `src/pages/policy-tests.tsx`)

Three incremental steps:

**Step 1 — Add the Run button**

- Import `runTestCase` from `api.ts` and `Play` icon from `lucide-react`
- Replace the `{/* TODO */}` comment with a `<Button>` that calls `runTestCase(policyId, test.id)`

**Step 2 — Track loading state and update the row**

- Add a `runningTests` state (`Set<string>`) to track which test IDs are in-flight
- While running: disable the button, show a spinner icon
- On success: update the test in the `tests` array with the API response (status, score, agentResponse update inline)
- On error: show an alert or inline error

**Step 3 — Handle draft policies**

- The API returns 403 with `"Cannot test draft policies"` for draft policies
- In the error state, detect this message and show a friendly "Policy not testable" screen instead of a raw error

## Feature 2: Create Test Cases (in `src/pages/new-test.tsx`)

Four incremental steps:

**Step 4 — Basic form with name and category**

- Import `usePolicy` to load the policy's categories
- Add a text input for name and a `<select>` dropdown for category (populated from `policy.categories`)

**Step 5 — Prompt template with variable insertion**

- Add a `<textarea>` for the prompt
- Add clickable buttons for common template variables (`{{customer_name}}`, `{{order_id}}`, etc.)
- Clicking a button inserts the variable at the cursor position using a `ref` on the textarea

**Step 6 — Expected outcome (sentiment + keywords)**

- Add three toggle buttons for sentiment: positive / neutral / negative
- Add a keyword input: type a word, press Enter to add it as a tag, click X to remove

**Step 7 — Submit and navigate back**

- Import `createTestCase` from `api.ts` and `useNavigate` from react-router
- On form submit, call the API with all form fields
- On success, navigate to `/policies/:policyId/tests`
- Handle errors and show a loading state on the submit button
