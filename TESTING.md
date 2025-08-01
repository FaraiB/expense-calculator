# Testing Guide

This document explains how to run tests for the Expense Calculator application.

## Test Structure

### Backend Tests

- **Location**: `backend/tests/`
- **Framework**: Jest + Supertest
- **Database**: SQLite test database
- **Coverage**: API endpoints, validation, calculations

### Frontend Tests

- **Location**: `frontend/src/components/__tests__/`
- **Framework**: Vitest + React Testing Library
- **Coverage**: Component rendering, user interactions, form validation

## Running Tests

### Backend Tests

```bash
# Navigate to backend directory
cd backend

# Run all tests
npm test

# Run tests in watch mode (reruns when files change)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Frontend Tests

```bash
# Navigate to frontend directory
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Run All Tests

```bash
# From the root directory
cd backend && npm test && cd ../frontend && npm test
```

## Test Coverage

### Backend API Tests (`backend/tests/api.test.js`)

#### GET /api/expenses

- ✅ Returns empty array when no expenses exist
- ✅ Returns all expenses with correct data

#### POST /api/expenses

- ✅ Creates new expense with correct data
- ✅ Validates required fields
- ✅ Validates date format (YYYY-MM)
- ✅ Validates numeric fields
- ✅ Calculates totals automatically

#### GET /api/expenses/:id

- ✅ Returns specific expense by ID
- ✅ Returns 404 for non-existent expense

#### PUT /api/expenses/:id

- ✅ Updates existing expense
- ✅ Returns 404 for non-existent expense
- ✅ Validates data when updating

#### DELETE /api/expenses/:id

- ✅ Deletes existing expense
- ✅ Returns 404 for non-existent expense

#### Calculations

- ✅ Calculates total correctly (sum of all expenses)
- ✅ Calculates amount to pay correctly (formula: (total except condominio / 2) - condominio)

### Frontend Component Tests (`frontend/src/components/__tests__/ExpenseForm.test.tsx`)

#### Basic Rendering

- ✅ Renders all expense fields
- ✅ Displays calculate button
- ✅ Displays clear button

#### Form Functionality

- ✅ Formats currency input correctly
- ✅ Handles empty input
- ✅ Calculates total correctly
- ✅ Submits form with correct data
- ✅ Clears form when clear button is clicked

#### Edit Mode

- ✅ Shows update button when editing
- ✅ Populates form with initial data

#### Loading States

- ✅ Shows loading state when loading prop is true

## Test Configuration

### Backend Test Setup (`backend/tests/setup.js`)

- Uses separate test database (`test-database.sqlite`)
- Cleans up data after each test
- Configures test environment

### Frontend Test Setup (`frontend/src/test/setup.ts`)

- Configures jsdom environment
- Mocks fetch for API calls
- Mocks jsPDF for PDF generation
- Sets up testing utilities

## Test Commands Summary

| Command                                | Description                      |
| -------------------------------------- | -------------------------------- |
| `cd backend && npm test`               | Run backend tests once           |
| `cd backend && npm run test:watch`     | Run backend tests in watch mode  |
| `cd backend && npm run test:coverage`  | Run backend tests with coverage  |
| `cd frontend && npm test`              | Run frontend tests once          |
| `cd frontend && npm run test:watch`    | Run frontend tests in watch mode |
| `cd frontend && npm run test:coverage` | Run frontend tests with coverage |

## Adding New Tests

### Backend Tests

1. Create test file in `backend/tests/`
2. Use Jest + Supertest for API testing
3. Follow the pattern in `api.test.js`

### Frontend Tests

1. Create test file in `frontend/src/components/__tests__/`
2. Use Vitest + React Testing Library
3. Follow the pattern in `ExpenseForm.test.tsx`

## Test Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Tests should clean up after themselves
3. **Descriptive Names**: Test names should clearly describe what they test
4. **Coverage**: Aim for high test coverage of critical functionality
5. **Mocking**: Mock external dependencies (APIs, PDF generation)

## Current Test Status

- ✅ **Backend**: 15 tests passing
- ✅ **Frontend**: 1 test passing (basic setup)
- 🔄 **Frontend**: More comprehensive tests needed

## Next Steps

1. **Add more frontend tests** for:

   - ExpenseList component
   - PDF generation functionality
   - Error handling
   - Loading states

2. **Add integration tests** for:

   - Full user workflows
   - API integration
   - PDF download functionality

3. **Add performance tests** for:
   - Large datasets
   - PDF generation with many records
