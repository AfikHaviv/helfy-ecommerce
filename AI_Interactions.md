# AI Interactions Documentation

---

## Models Used

| Phase | Model | Tool | Reason |
|---|---|---|---|
| Planning & Blueprint | Claude Sonnet (claude.ai) | Web Claude chat | Best for architectural thinking and document generation |
| Phase 1 - Database | Claude Sonnet 4.5 | Cline in VS Code | Code generation with file system access |
| Phase 2 - Backend | Claude Sonnet 4.5 | Cline in VS Code | Code generation with file system access |
| Phase 3 - Frontend | Claude Sonnet 4.5 | Cline in VS Code | Code generation with file system access |

---

## Tools & Plugins Used
- **Cline** — VS Code extension for agentic coding
- **Claude.ai** — Used for planning
- **MySQL Workbench** — Manual database verification
- **Postman** — API endpoint testing

---

## Planning & Architecture Phase

### Goal
Generate a production-grade `initial.md` bootstrap document to guide Cline.

### Prompt 1 — Initial request from Cline
```markdown
You are a senior fullstack architect. Before writing a single line of code, your job is to generate a file called initial.md - a complete AI bootstrap document that will be used to guide you in generating a production grade eCommerce platform from scratch.
Read the following assignment requirements carefully and use them as your single source of truth.
Tech Stack:
Frontend: React.js with a modern, visually premium UI
Backend: Node.js with Express
Database: MySQL
Styling: Any modern styling library (Tailwind CSS, Framer Motion, etc.)
Auth: JWT or Session-based

Required features:
Authentication: Full login/sign-up flow with JWT or session management
Product Catalog: Search, filter, and detailed product views
Cart & Checkout: Persistent cart and a multi-step checkout process
Account Section: Order history and profile management

The initial.md you generate must include:
1. A strict folder structure for both the frontend and backend that supports multi-team maintainability
2. Naming conventions and coding standards that the AI must follow consistently across the entire project
3. A database schema covering all entities required by the features above
4. All backend API routes organized by domain, mapped to the required features
5. A complete frontend page list with the exact route path for each page
6. A phased execution plan: Phase 1 (Database + seed data), Phase 2 (Backend), Phase 3 (Frontend), where each phase ends with an explicit, verifiable success condition
7. An explicit list of things the AI must never do:  shortcuts, anti-patterns, and assumptions to avoid

For every technology decision you make that is not explicitly named in the requirements above, you must flag it in a dedicated section called "Architectural Decisions" and explain why you chose it

Write initial.md in clear, imperative language as if instructing a junior AI that will execute it blindly. Be specific, not vague. Every decision must be explicit - leave nothing to interpretation.
Do not generate any code yet. Only generate initial.md.
```
Output: Too excessive `initial.md` document with 1000+ lines of instructions, much of which is redundant or overly detailed for an AI to follow effectively. 

### Prompt 2 — Trim excessive output
```markdown
This file is too excessive. Rewrite initial.md with the following constraints:
Remove all natural language explanations around code blocks, lt the code speaks for itself
The phased execution plan must have a maximum of 5 bullet tasks per phase and exactly 3 success criteria per phase not more
The anti-patterns/prohibitions list must be trimmed to the 10 most critical ones only
Remove all npm install commands, verification commands, and bash snippets, those are not architectural decisions
Remove all "Task X.X" breakdowns, replace with a single ordered bullet list per phase
The folder structure must show directory trees only, no inline descriptions next to filenames
Remove the "Page Responsibilities" section entirely, component names are self explanatory
Remove the "Code Quality Standards" component structure template
The rewritten file should be roughly half the length of the current one. Every line must either define a decision, a constraint, or a structure. If it does neither, cut it.
```
Output: Much more concise `initial.md` that is easier for Cline to follow, with clear structures and constraints without excessive explanations. The phased execution plan is now more focused with fewer tasks and clear success criteria, and the prohibitions list is streamlined to the most critical points.

### Prompt 3 — Remove out-of-scope libraries
```markdown
Remove Yup from the technology stack, frontend validation will use HTML5 constraint validation with controlled inputs only. Remove Multer, config/multer.js, middleware/upload.js, and all product image upload/delete admin routes, file uploads are out of scope for this project. Update the document accordingly.
```
Output: `initial.md` updated to remove some non relevant libraries with some adjustments

### Prompt 4 - Asking Cline to understand the plan and ask for clarifications
```markdown
Okay now before starting, Read initial.md in full and confirm you understand the complete project architecture. List any ambiguities or missing information before we begin. Do not generate any code yet.
```
Output: Cline confirms understanding of the architecture and lists a few clarifying questions, which are then clarified before proceeding to code generation.

### Prompt 5 - Clairifications
```markdown
1. Generate a session ID on first cart action and store it in a cookie. No express-session needed.
2. Use public Unsplash URLs for seed data. No local files.
3. Skip forgot/reset password for now — remove those two routes entirely.
4. Use format ORD-{timestamp}-{random 4 digits}.
5. Hardcode 10% tax rate as a constant in utils/constants.js.
6. Mark orders as payment_status: 'paid' automatically on creation. Payment processing is UI only.
7. Flat rate $10 shipping, free if order subtotal exceeds $100. Store thresholds in utils/constants.js
8. Yes, use admin@helfy123.com / Admin123! for both admin accounts in seed data.
9. Yes, implement it as dark mode
10. Yes, create OrderDetail.jsx — it was missing from the folder structure by mistake. Add it under /pages/Account/ and update initial.md accordingly.
```
output: Cline acknowledges the clarifications and updates `initial.md` accordingly before starting code generation.

---

## Create a new task for phase 1 to better manage the context window

### Goal
Execute Phase 1 tasks as defined in `initial.md` to set up the database schema and seed data.

### Prompt 6 - Starting with phase 1 - database
```markdown
Read initial.md and execute Phase 1. Do not begin Phase 2 until I confirm success criteria are met
```
Output: Cline executes Phase 1, creating the database schema and seed data scripts as per the instructions in `initial.md`. After completion, Cline lists the success criteria for Phase 1 and I verify them manually using MySQL Workbench before confirming to proceed to Phase 2.

Issue: Cline fails to execute MySQL commands due to MySQL not being in the system PATH, I had to intervene manually to add the MySQL bin folder to the system PATH before Cline could
---
## Create a new task for phase 2

### Goal
Execute Phase 2 tasks as defined in `initial.md` tos set up the backend API routes and controllers.

### Prompt 7 - Starting with phase 2 - backend
```markdown
Read initial.md in full. Phase 1 is complete and verified — the database exists with all 13 tables and seed data. Execute Phase 2 as defined in initial.md. Build the complete backend in this order: server setup and middleware first, then utilities, then models, then controllers, then routes. Do not begin Phase 3 until I confirm the Phase 2 success criteria are met.
```
Output: Cline executes Phase 2, generating the backend code according to the structures and standards defined in `initial.md`. After completion, Cline lists the success criteria for Phase 2 and I verify them manually using Postman to test the API endpoints before confirming to proceed to Phase 3.

Issue: Cline kept generating explanations and justifications for code choices instead of just generating code, which slowed down progress significantly. I had to prompt Cline multiple times to stop explaining and just generate code, which is a critical issue to address in future iterations for better efficiency under time constraints.

Another issue: Cline generated code that referenced environment variables for database credentials, which were not defined in `initial.md` which prevented the AI from successfully generating working code. I had to clarify that the database password should be an empty string and that no .env file should be used, which is a critical architectural decision that should have been defined in `initial.md` to avoid this issue.
---


### Prompt 8 - constraingt on explanations during code generation
```markdown
Read initial.md. Models layer is complete. Generate the controllers layer only — all 6 controller files (auth, user, product, category, cart, order). Do not touch any existing files. Do not generate models, routes, or server.js. Do not explain anything, just write the code. When controllers are done, stop and wait.
```

## Create a new task for phase 3
### Goal
Execute Phase 3 tasks as defined in `initial.md` to set up the frontend React application.

### Prompt 9 - Starting with phase 3 - frontend
```markdown
Read initial.md. Backend is complete. Execute Phase 3 but with reduced scope — implement only these pages in this exact order: Login, Signup, Products, ProductDetail, Cart, Checkout. Skip Account, OrderHistory, OrderDetail, OrderConfirmation, and NotFound. Build the full component tree, contexts, and API layer first, then pages. UI must look premium using Tailwind and Framer Motion. Stop when Checkout is complete.
```

Output: Cline executes Phase 3 with the reduced scope, generating the frontend code according to the structures and standards defined in `initial.md`. Due to time constraints, I had to manually reduce the scope of Phase 3 to focus on core features, which is a critical decision that the AI cannot make on its own based on business value, and should be defined in `initial.md` for future iterations.


## Create a new task for phase 4 - Testing & Final Touches

### Goal 
Execute tasks to perform testing, bug fixes, and final adjustments to the application.

### Prompt 10 - Phase 4 - Testing & Final Touches
```markdown
Read initial.md. All 3 phases are complete. Do not generate any new files. Perform a full diagnostic check in this exact order: Verify all files in the folder structure defined in initial.md exist on disk Check all import statements across controllers, routes, and models for consistency — flag any mismatches Check that server.js registers all middleware and mounts all routes correctly Check that all protected routes use the protect middleware and admin routes use authorize Check that all controllers use asyncHandler and throw ApiError correctly Check that the frontend axios instance points to the correct backend URL Check that all frontend API service files match the backend route definitions in initial.md Check that AuthContext and CartContext are correctly wrapped in App.jsx Check that all protected frontend routes use ProtectedRoute For each check report: ✅ if correct, ❌ if broken, and the exact fix needed. Do not fix anything yet — only report.
```

Output: Cline performs the diagnostic checks and reports the results in a clear format, indicating which areas are correct and which are broken, along with the exact fixes needed for any issues found. I then review the report and decide which fixes to implement manually based on the severity and time constraints.

### Prompt 11 - Implementing critical fixes
```markdown
Read the @/DIAGNOSTIC_REPORT.md and make the critical fixes, the must fixes and the shopuld fixes. ignore the missing frontend pages for now.
```

Output: Cline implements the critical fixes as defined in the diagnostic report, improving the overall functionality and stability of the application. I then perform a final round of testing to verify that the critical issues have been resolved before considering the project complete.




