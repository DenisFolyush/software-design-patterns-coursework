# HR Management System

Human Resource Management System (HRMS) — a course project demonstrating REST API development, object-oriented design, and GoF design patterns.

## Current capability

The initial service boundary is available:

```text
GET /api/v1/health -> 200 {"status":"ok"}
POST /api/v1/employees -> 201 employee record
GET /api/v1/employees -> 200 employee records
GET /api/v1/employees/:id -> 200 employee record
```

## Run locally

Requires Node.js 22 or later.

```bash
npm start
```

Run the test suite with:

```bash
npm test
```
