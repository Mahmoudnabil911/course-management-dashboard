# Course Management Dashboard

A modern, responsive web application for managing educational courses. Built with Angular 21 (Standalone Components), styled with Tailwind CSS v4, and backed by a mock JSON Server REST API.

---

## Technologies Used
- **Framework**: Angular 21 (Strictly Standalone Architecture)
- **Styling**: Tailwind CSS v4 (Integrated via PostCSS)
- **Data Mocking**: JSON Server (REST Endpoints)
- **Unit Testing**: Vitest & Angular TestBed

## Features Implemented
- **Course Management (CRUD)**:
  - **View Courses**: Grid view & Table view toggle.
  - **Search & Filters**: Search by course name, and filter by status and category.
  - **Add & Edit Course**: Built using Angular **Reactive Forms** with live input validation indicators.
  - **Safe Navigation**: Uses `{ replaceUrl: true }` when redirecting after form submission to secure the history stack.
  - **Delete with Confirmation**: Fully integrated delete safety checking via a custom reusable Modal.
- **Bonus Features**:
  - **Pagination & Sorting**: Adjustable page sizes and interactive column sorting.
  - **Toast Notifications**: Stackable, auto-dismissible alerts built using Angular Signals.
  - **Skeleton Loader**: Content skeletons for loading states in both grid and table views.
  - **Unsaved Changes Guard**: Modern functional `CanDeactivate` guard warning users of unsaved form inputs.
  - **Lazy Loading**: Route-based chunk loading using modern standalone components syntax.
- **Architecture & Code Quality**:
  - Complete separation of concerns: All components use strictly external HTML templates (`templateUrl`) for maximum readability.
  - Dedicated `src/app/features/courses/` folder structure containing modularized models, pages, components, and services.

---

## How to Run the Project

Follow these steps to run the application locally:

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Run the Mock API Server
This will start the mock REST API on `http://localhost:3000` using `json-server`:
\`\`\`bash
npm run mock-api
\`\`\`

### 3. Run the Angular Application
Run this in a separate terminal to start the development server on `http://localhost:4200`:
\`\`\`bash
ng serve
\`\`\`

### 4. Running Unit Tests (Optional)
\`\`\`bash
npm run test -- --watch=false
\`\`\`

---

## Mock API & Technical Notes
- **Data Source**: The application uses **JSON Server** to perform full CRUD operations, which is the preferred approach for this task. It serves the courses database from `db.json` via the `/courses` endpoint.
- **CORS Handling**: Implemented a robust `PUT`-based update method in the `CourseService` to resolve CORS preflight browser limitations effectively.

---

## Submission Details

| Field | Candidate Input |
|---|---|
| **Candidate Name** | Mahmoud Nabil Elkholy |
| **Task Name** | Course Management Dashboard |
| **GitHub Repository Link** | https://github.com/Mahmoudnabil911/course-management-dashboard |
| **Live Demo Link, if available** | N/A - Local Mock API used |
| **Notes** | JSON Server Mock API is set up. All requested bonus features (Lazy Loading, Guards, Skeleton Loaders, Pagination, Toast Notifications) are fully implemented. Component templates have been strictly separated into `.html` files for clean architecture. |