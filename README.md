# 101502928_comp3133_assignment2 Srushti

## Project Overview
This project is an Angular (version 17+) frontend application designed to interact with a GraphQL (Apollo) backend, originally built during Assignment 1. It provides a robust, production-grade architecture that adheres to enterprise layout best practices, incorporating lazy loading concepts via standalone component structures, Route Guards, Material Design UI, and comprehensive GraphQL integration.

## Technology Stack
- **Frontend Framework:** Angular 17 (Standalone Components)
- **UI Component Library:** Angular Material, Angular CDK
- **GraphQL Client:** Apollo Angular
- **Routing:** Angular Router (JWT Protected Routes)
- **Styling:** SCSS, Responsive Mobile-First Design
- **State/Reactivity:** RxJS

## Folder Structure
The source code under `src/app` provides a clean separation of concerns:
- `/core`: Singleton services (`auth.service.ts`, `employee.service.ts`), guards (`auth.guard.ts`), and graphql configurations.
- `/shared`: Reusable components (`navbar.component.ts`).
- `/features`: Feature modules divided into domains: `auth` and `employee`.

## Backend GraphQL Modifications Wait!
If your existing backend (Assignment 1) is missing the search functionality or exact mutations expected, verify or add the following schema updates:
\`\`\`graphql
type Query {
  # New or updated search functionality
  searchEmployeeByDesignationOrDepartment(department: String, designation: String): [Employee]
}

type Mutation {
  # Signup should return ID, username, email
  signup(username: String!, email: String!, password: String!): User
}
\`\`\`

## Setup & Run Instructions

### Approach 1: Running Manually
1. Navigate to the frontend directory:
   \`\`\`bash
   cd frontend
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install --legacy-peer-deps
   \`\`\`
3. Start the Angular Dev Server:
   \`\`\`bash
   npm run start
   \`\`\`
4. Application runs on http://localhost:4200. *(Ensure your backend server is running on http://localhost:4000)*

### Approach 2: Docker Compose (Full Stack)
Assuming the root folder contains `frontend` and `backend` folders with valid Dockerfiles:
1. Navigate to the root directory `101502928_comp3133_assignment2`.
2. Run Docker Compose:
   \`\`\`bash
   docker-compose up --build
   \`\`\`

## Deployment Steps
1. **Frontend (Vercel / Netlify):** 
   - Push your repository to GitHub. 
   - Connect Vercel to your Github Repository.
   - Choose **Angular** framework preset.
   - Set the build command to `npm run build` and output directory to `dist/frontend/browser`.
   - Update `src/environments/environment.prod.ts` with your live Backend URL.
2. **Backend (Render / Cyclic / Heroku):**
   - Connect your remote repository to your preferred Cloud provider.
   - Specify Node start script (`node server.js` or `npm start`).
   - Add environment variables (`MONGODB_URI`, `JWT_SECRET`, etc.).

## Application Capabilities & Design Features
- **Auth Features:** Login, Signup, Persistent Session (localStorage & Auth Service BehaviourSubject). Protected routes utilizing Angular's Functional Guards (`authGuard`).
- **Employee Directory:** Mat-Table showcasing employee information with seamless client-side filtering via debounced RxJS streams, custom pagination, and Material sorting.
- **Modals:** View Details and Create/Edit dialogs utilize dynamically populated `MatDialog`.
- **Validation:** High-quality, strict reactive forms with Angular Validators.
