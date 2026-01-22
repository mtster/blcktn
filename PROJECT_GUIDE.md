
# Blackton: Project Guide

## 1. Executive Summary
**Blackton** is an enterprise-grade carbon auditing platform. It automates the extraction of energy usage data from utility bills (PDFs, Images) using Generative AI to ensure corporations meet SEC and CSRD climate disclosure requirements.

## 2. Technology Stack

### Frontend
-   **Framework**: React 18+ (SPA architecture).
-   **Language**: TypeScript.
-   **Styling**: Tailwind CSS (Utility-first).
-   **Animation**: Framer Motion (Complex micro-interactions).
-   **Routing**: React Router DOM (Client-side routing).

### AI & Data
-   **Intelligence**: Google Gemini SDK (`@google/genai`) via `gemini-3-flash-preview` model.
-   **Purpose**: Optical Character Recognition (OCR), entity extraction, and carbon calculation inference.

### Backend (Planned/Scaffolded)
-   **Platform**: Supabase.
-   **Database**: PostgreSQL.
-   **Auth**: Supabase Auth (Row Level Security enabled).
-   **Storage**: Supabase Storage buckets for raw bill retention.

## 3. Architecture Overview

### The Flow
1.  **Ingestion**: User uploads a utility bill via `FileUploadModal`.
2.  **Processing**: The browser converts the file to Base64 and sends it directly to Gemini API (Transient processing).
    *   *Note*: In production, this should proxy through a backend Edge Function to hide the API Key.
3.  **Visualization**: Extracted data (kWh, Provider, Dates) is parsed from JSON and displayed on the `Dashboard`.
4.  **Compliance**: Data is (to be) committed to the `audits` ledger in Supabase for audit trails.

### Project Structure
```
/
├── index.html          # Entry HTML with Import Maps and Process Shim
├── index.tsx           # React Root Mount
├── App.tsx             # Main Router Layout
├── types.ts            # Global TypeScript Interfaces
├── services/
│   └── gemini.ts       # AI Logic & API Configuration
├── components/
│   ├── Navbar.tsx      # Global Navigation
│   └── FileUploadModal.tsx # Core Upload Logic
├── pages/
│   ├── LandingPage.tsx # Marketing Front
│   ├── Dashboard.tsx   # User App
│   └── AdminPage.tsx   # System Management
└── supabase/
    └── schema.sql      # Database Definition
```

## 4. Environment Setup
To run this project, you need:
1.  **Node.js / Build Tool**: While the code is written in TSX, browsers cannot execute it natively. A bundler like **Vite** is required for development and production builds.
2.  **Environment Variables**:
    -   `API_KEY`: Your Google Gemini API Key.
    -   *Note*: Ensure this is set in your Vercel Project Settings or `.env` file.

## 5. Design Philosophy
**"Darkness & Precision"**
The UI uses a deep black palette (`#050505`) to convey sophistication and reduce eye strain for analysts. Emerald Green (`#10b981`) is reserved exclusively for success states, value creation, and primary actions, creating a psychological link between "Blackton" and "Positive Environmental Impact."
