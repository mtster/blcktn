# Agent Protocols: Blackton Development

## Context
Blackton is a high-performance, dark-mode carbon auditing dashboard. It is currently in the **scaffolding phase**. The UI is built with React, Tailwind, and Framer Motion. The extraction logic uses Google Gemini.

## Current State
- **Frontend**: Scaffolding complete (Landing, Dashboard, Admin, Pricing).
- **Styling**: Premium "Glassmorphism" aesthetic established.
- **Logic**: Gemini integration (`services/gemini.ts`) is ready but running on mock inputs in the UI.
- **Backend**: Supabase schema is defined (`supabase/schema.sql`) but not yet connected to the React frontend.

## Development Priorities for Agents
When working on this codebase, prioritize the following:

1.  **Strict Styling Adherence**:
    -   Maintain the `#050505` background.
    -   Use `white/5`, `white/10` for borders/backgrounds.
    -   Use `emerald-500` for primary actions and accents.
    -   **Never** introduce white backgrounds or dark text unless inside a specific "paper" component.

2.  **Supabase Integration**:
    -   The next major task is connecting `pages/Dashboard.tsx` and `components/FileUploadModal.tsx` to the Supabase `audits` table.
    -   Replace the mock `processUtilityBill` call with a flow that:
        1.  Uploads file to Supabase Storage.
        2.  Sends URL/Blob to Gemini.
        3.  Saves result to `audits` table.

3.  **Authentication**:
    -   Implement the Login flow using Supabase Auth.
    -   Protect `/dashboard` and `/admin` routes with an `<AuthGuard>` component.

4.  **Admin Features**:
    -   Connect `pages/AdminPage.tsx` to fetch real user profiles from the `profiles` table.

## Code Standards
-   **TypeScript**: No `any` types allowed in new code. Define interfaces in `types.ts`.
-   **Components**: Functional components only. Use `React.FC`.
-   **Animations**: Use `framer-motion` for all transitions. `initial={{ opacity: 0 }}` -> `animate={{ opacity: 1 }}`.

## Known Issues
-   The "Blank Screen" on Vercel is due to missing build steps or native browser execution limits. Ensure the deployment pipeline handles `.tsx` compilation (e.g., Vite).

---

## **Session Debrief**

### What was fixed:
-   **`/prio56` Route Order:** The admin route was moved to the top of the `Routes` block in `App.tsx` to prevent it from being overshadowed by other routes.
-   **Admin Guard Logic:** The `MasterAdminLayout` was updated to handle the auth loading state more gracefully before redirecting.
-   **Debugging:** Added extensive `console.log` statements to `App.tsx` to trace route and auth status in production.

### New Features:
-   **Mobile Debugger (`components/MobileDebugger.tsx`):** A floating debugger icon was added for non-localhost environments. It captures all console logs and errors, allowing for inspection and copying on live deployments.
-   **Version Footer:** A static build version (`v1.0.4`) was added to the footer in `App.tsx` to help verify deployment updates.

### New Table Names or Environment Variables:
-   None.

### Current Known Bugs & Next Steps:
-   **Primary Bug:** The `/prio56` route is still being ignored on the production Vercel deployment, causing a redirect to the base URL.
-   **Next Steps:** The primary objective is to use the newly implemented **Mobile Debugger** on the live site to capture the console logs. These logs should reveal why the routing or the admin guard is failing.
