# Course Management Dashboard

A modern, responsive web application for managing educational courses. Built with Angular 21, styled with Tailwind CSS v4, and backed by a mock JSON Server REST API.

---

## Features Implemented

- **Course Management (CRUD)**:
  - **View Courses**: Grid view & Table view toggle.
  - **Search & Filters**: Search by course name or instructor, and filter by status and category.
  - **Add & Edit Course**: Built using Angular **Reactive Forms** with live input validation indicators (names, duration, price, and status).
  - **Safe Navigation**: Uses `{ replaceUrl: true }` when redirecting after form submission to secure history stack.
  - **Delete with Confirmation**: Fully integrated delete safety checking via a customized Modal.
- **Bonus Features**:
  - **Pagination**: Adjustable page sizes (5, 10, 20 items per page).
  - **Sorting**: Interactive sorting by name, instructor, category, price, duration, and status.
  - **Toast Notifications**: Stackable notifications for success, warning, info, and errors.
  - **Skeleton Loader**: Content skeletons for loading states in both grid and table views.
  - **Unsaved Changes Guard**: Modern functional `CanDeactivate` guard warning users of unsaved inputs.
  - **Lazy Loading**: Route-based chunk loading using modern standalone components syntax.

---

## Technologies Used

- **Framework**: Angular 21
- **Styling**: Tailwind CSS v4 (Strictly Tailwind variables and utility classes)
- **Data Mocking**: JSON Server (REST Endpoints)
- **Unit Testing**: Vitest & Angular TestBed

---

## How to Run the Project

Follow these steps to run the application locally:

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Mock API Server
This will start the mock REST API on `http://localhost:3000` using `json-server`:
```bash
npm run mock-api
```

### 3. Run the Angular Application
Run this in a separate terminal to start the development server on `http://localhost:4200`:
```bash
npm start
```

### 4. Running Unit Tests
Run the Vitest tests:
```bash
npm test
```

---

## Mock API & Technical Notes

- The mock API is hosted using `json-server` on port 3000, serving courses database endpoints `/courses`.
- Stands on Angular's latest standalone architecture.
- Folder structure follows the recommended guidelines, placing feature-related services and models under `src/app/features/courses/`.

---

## Submission Details

| Field | Candidate Input |
|---|---|
| **Candidate Name** | Mahmoud Nabil |
| **Task Name** | Course Management Dashboard |
| **GitHub Repository Link** | *[Provided by user upon commit]* |
| **Live Demo Link** | *[Optional/Provided if available]* |
| **Notes** | JSON Server Mock API is set up and fully active. Unit tests run and pass successfully. |
