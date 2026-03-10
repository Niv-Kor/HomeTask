# Notch — Frontend Code Interview

## Background

Welcome to Notch! We're excited to meet you.

This exercise simulates how we actually work. You'll receive a product spec (like a Linear ticket), an existing codebase with some rough edges, and a mock API. Your job is to turn the spec into a working feature.

We're evaluating:

- How you break down a product requirement into deliverables
- Whether you read and understand existing code before building on top of it
- Component architecture and state management decisions
- How you handle real-world API behavior (slow responses, errors, inconsistent shapes)
- Your communication through code, commits, and documentation

**We expect you to use AI tools.** Copilot, ChatGPT, Claude — whatever you normally use. We use them too. What we evaluate is whether *you* understand what you're building. Be ready to explain every decision in the follow-up interview.

## Setup

**Prerequisites:** Node 18+

**Frontend:**

```
npm install
npm run dev
```

Runs on http://localhost:5173

**API server:**

```
cd api-server
npm install
npm start
```

Runs on http://localhost:3001 — the frontend proxies `/api` to it automatically.

## Before You Start

Explore the codebase and run the app. The skeleton has **4 bugs** — the kind that happen in real codebases. Find them, fix them, and briefly document each fix in your submission notes. We're giving you the count so you know when you've found them all.

**Make a separate commit for each part.** This lets us see your progression. Don't squash your history.

---

## Product Spec

**Project:** Test Lab
**Goal:** Give our support team a way to configure test scenarios for AI chatbot policies, run them against the agent, and review results.

### Context

Notch policies define how our AI agent handles different types of customer interactions (refunds, account recovery, shipping, etc.). The support team needs a tool to verify that policies behave correctly before they go live. They write test cases — simulated customer messages — run them against the policy's agent, and review whether the response meets expectations.

A skeleton UI exists with a policies list, basic routing, and a mock API server with seed data. The API simulates agent execution with a realistic delay.

### What We Need

**1. Browse & Run Tests**

Users should be able to select a policy from the list and see its test cases. Each test case has a name, category, status, score, and creation date. Users need to be able to trigger a test run from the UI — the API simulates LLM execution and takes a few seconds to respond. The result should appear inline without a page refresh.

Not all policies are in a testable state. The UI should handle this gracefully.

**2. Create Test Cases**

Users need a way to add new test cases to a policy. A test case consists of:

- A **name** and **category** (from the policy's defined categories)
- A **prompt template** — the simulated customer message. Support teams reuse similar test structures across different customers, so the prompt should support **template variables** (like `{{customer_name}}` or `{{account_id}}`) that can be inserted into the text
- **Expected outcome** — what sentiment the agent's response should have (positive, neutral, or negative), and optionally specific keywords that should appear in the response

After creating a test case, the user should land back on the test list.

### Acceptance Criteria

- Users can navigate from the policy list to a policy's test cases
- Test cases display in a structured format with all relevant fields
- Running a test shows clear feedback during execution and displays the result
- The app handles loading states, API errors, and edge cases in the data
- Creating a test case works end-to-end with all specified fields
- The codebase bugs are identified and resolved

### Bonus (if time allows)

Pick one:
- Write tests for one component and one hook (Vitest + Testing Library are installed)
- Keyboard navigation for the test case list
- Optimistic updates when creating a test case

---

## Time

We expect this takes **around 1.5 hours**. If you're spending significantly more, you're probably over-engineering. The two spec items are the core. The bonus is genuinely optional — don't sacrifice working features to attempt it.

**Working code > perfect code.** We'd rather see both features functional with rough edges than one polished to perfection and the other missing.

## Submitting

Create a GitHub repo and share the link with your interviewer. Include brief notes on:

- What you built and any decisions worth explaining
- The 4 bugs you found and how you fixed them
- Anything you'd improve with more time

## What Comes Next

The follow-up interview is a design discussion, not more coding. We'll use your submission as the starting point for conversations like:

- How would you persist form state if the user closes the browser mid-flow?
- How would you scale the test runner to handle 100+ concurrent runs with progress?
- What would you add to the prompt template editor (autocomplete, undo/redo, preview)?
- How would you approach error boundaries and fault isolation?
