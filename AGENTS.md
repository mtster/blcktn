
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
