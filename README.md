# Nigeria Immigration Service (NIS) — Staff Management System

A full-stack web application built for the **Nigeria Immigration Service** to digitize and centralize personnel administration. The system provides a hierarchy-aware platform where **Service Headquarters (SHQ)**, **Zonal Heads**, **Formation Heads** and **individual officers** manage staff records, view workforce analytics, handle deployments, review leave applications, and report/track incidents — all backed by Firebase.

---

## Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Architecture](#architecture)
  - [Routing & Access Control](#routing--access-control)
  - [State Management (Zustand Stores)](#state-management-zustand-stores)
  - [Services Layer](#services-layer)
  - [Analytics & Statistics](#analytics--statistics)
  - [UI Components](#ui-components)
- [Roles & Permissions](#roles--permissions)
- [Data Model (Firestore)](#data-model-firestore)
- [Firebase Configuration](#firebase-configuration)
  - [Security Rules](#security-rules)
  - [Composite Indexes](#composite-indexes)
  - [Cloud Functions](#cloud-functions)
- [Pages & Routes](#pages--routes)
- [Export & Reporting](#export--reporting)
- [Theming](#theming)
- [Scripts](#scripts)
- [Development Notes](#development-notes)

---

## Overview

The NIS Staff Management System replaces manual, paper-based personnel administration with a role-based web portal. It is organized around the Service's real-world command hierarchy:

1. **Service Headquarters (SHQ)** — national-level oversight of all staff, admins, analytics, deployments, leave and incidents.
2. **Zonal Head** — manages staff, deployments, leave and incidents within one of the 8 zones (ZONEA – ZONEH).
3. **Formation Head** — manages staff, leave and incidents within a single formation (e.g. a state command, airport command, training school, or border facility).
4. **Staff / Officer** — self-service portal to view their own profile, deployment history, apply for leave and file incident reports.

The application is a **React SPA** (Vite + Tailwind CSS) with **Firebase** as the backend (Authentication, Cloud Firestore, Cloud Functions, Analytics). Charts are rendered with **Recharts**, forms are built with **Formik**, and client-side state is managed with **Zustand**.

---

## Core Features

### Authentication & Roles
- **Admin login** via Firebase Email/Password (redirects to the appropriate dashboard based on the admin's `zone`/`formation`).
- **Staff login** with **Service Number** + password (signs in with `{serviceNumber}@nis.gov.ng`).
- Session persistence via Firebase Auth, plus a `ProtectedRoute` guard for the admin area.

### Staff Registration (SHQ only)
- Multi-section personnel form: Personal Information, Service Details, Contact Information, Origin (State/LGA), and Identification Numbers (NIN, BVN, NHF).
- Auto-generates a temporary 10-character password and creates the Firebase Auth account; the officer's sign-in email is derived from the service number.
- Credentials are displayed once in a dialog (survives page reloads for 5 minutes via `sessionStorage`).
- Client-side validation: `NISXXXXX` service-number format, Nigerian phone numbers (`0XXXXXXXXXX`), 11-digit NIN, 10-digit BVN/NHF.

### Admin Registration (SHQ only)
- Registers a new admin for a zone + formation + role (HRM, PRS, ACCOUNTS, PROVOST, FORMATION HEAD, INVESTIGATIONS, UNIT HEAD).
- Auto-generates the admin email (`{role}{formation}admin@nis.gov.ng`) and a temporary password.
- Uses a **re-authentication** flow: creates the new user, signs the current admin out, signs them back in with their own password, then refreshes the page.

### Staff Roster Dashboards
- **SHQ**: all staff across the Service. **Zone**: all staff in the zone. **Formation**: all staff in the formation.
- Search across 17 fields, rank-seniority sorting (custom rank levels), sticky-table layout, edit-in-place modal, and a full read-only staff detail dialog with deployment timeline.
- Export to **Excel, CSV and PDF** (SHQ/zonal/formation rosters).

### Analytics Dashboards (Staff Strength)
- **National (SHQ)**: interactive drill-down (National → Zone → Formation) with clickable bar charts and a breadcrumb trail.
- **Zonal**: filtered analytics for one zone with clickable formation bars.
- **Formation**: rank/sex filters for a single formation.
- Visualizations:
  - KPI cards (total strength, formations, zones, male/female breakdown with percentage bars).
  - Staff strength by zone (clickable).
  - Staff strength by formation (clickable).
  - Staff strength by rank.
  - **Rank pyramid** (male left / female right).
  - **Sex distribution donut**.
  - **Sex ratio by formation** grouped bars.
- Filters: zone, formation, rank, sex, and date range (on date of first appointment).

### Deployment / Posting (SHQ & Zonal)
- Multi-select staff (checkboxes + select-all-filtered) and post them to a target formation.
- Each deployment is recorded as an **append-only history entry** (`deploymentHistory` array, `arrayUnion`): `fromZone`, `fromFormation`, `toZone`, `toFormation`, `deployedAt`, `deployedBy`.
- Staff already at the target formation are skipped; success/failure banners confirm the outcome.

### Leave Management
- **Staff**: apply for leave (Annual, Maternity, Paternity, Casual, Study, Study Leave With/Without Pay). Validates past start dates and inverted date ranges; auto-computes number of days.
- **Staff**: view own applications live (real-time subscription) with status badges and admin comments.
- **Admins (SHQ / Zonal / Formation)**: review applications scoped to their level, approve or reject (with an optional comment), see reviewer identity (`reviewedBy`, `reviewedByName`, `reviewedAt`), and view full application details.
- Status flow: `pending → approved | rejected` (enforced by Firestore rules).

### Incident Reporting
- **Staff**: report incidents from a predefined list (Security Threat, Migration Irregularity, Smuggling Activity, Border Violation, Forgery/Document Fraud, Human Trafficking, Other) with a free-text report (min 20 characters).
- **Staff**: track their own reports with status (`pending` / `attended`) and timestamps.
- **Admins**: real-time scoped list (all / by zone / by formation), search, mark reports as **attended**, and clear (delete) reports with a confirmation dialog.

### UI / UX
- Responsive layout: fixed sidebar on desktop, hamburger + overlay drawer on mobile.
- **Light / Dark / System** theme toggle persisted to `localStorage` (`nis-theme`).
- Reusable design system: `Button` (5 variants × 3 sizes), `LoadingSpinner`, status badges, modal dialogs, breadcrumbs, KPI cards.
- Dark-mode-aware styling throughout with custom Tailwind design tokens.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 19 (Vite 8) |
| Language | JavaScript (JSX, ES modules) |
| Styling | Tailwind CSS 4 (with custom `@theme` tokens), CSS |
| UI libraries | Material UI (@mui/material, @emotion) — installed, minimal usage |
| Icons | react-icons (Feather icons) |
| Charts | Recharts 3 |
| Forms | Formik |
| Client state | Zustand 5 |
| Routing | react-router-dom 7 |
| Data exports | SheetJS (xlsx), jsPDF + jspdf-autotable |
| Nigerian geo-data | nigerian-states-and-lgas |
| Backend (BaaS) | Firebase (Auth, Firestore, Analytics, Cloud Functions v2) |
| Tooling | ESLint 10 (react-hooks, react-refresh), Vite |

---

## Project Structure

```
NIS/
├── .env                          # Firebase config (gitignored)
├── .gitignore
├── eslint.config.js              # ESLint flat config
├── firebase.json                 # Firebase project config
├── firestore.rules               # Firestore security rules
├── firestore.indexes.json        # Composite indexes
├── index.html                    # SPA entry HTML
├── package.json
├── vite.config.js
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── functions/                    # Firebase Cloud Functions (Node 18)
│   ├── index.js                  # createAdmin callable function
│   └── package.json
└── src/
    ├── main.jsx                  # App bootstrap (ThemeProvider > AuthProvider)
    ├── App.jsx                   # RouterProvider
    ├── firebase.js               # Firebase init + auth/db exports
    ├── index.css                 # Tailwind import, theme tokens
    ├── assets/images/            # NIS logo
    ├── components/
    │   ├── buttons/Button.jsx            # Polymorphic button/link
    │   ├── dashboard/                    # Charts, KPI cards, filters, breadcrumb, staff detail dialog
    │   ├── deployment/                   # DeploymentHistory + StaffDetailsDialog
    │   ├── export/ExportButtons.jsx      # Excel/CSV/PDF export buttons
    │   ├── forms/                        # Staff + Admin registration forms
    │   ├── incident/                     # Incident report form, badge, my-reports list
    │   ├── layout/                       # RootLayout, ProtectedRoute
    │   ├── leave/                        # AdminLeaveDashboard, application form/list, badge
    │   ├── searchbar/SearchBar.jsx       # (placeholder — empty file)
    │   ├── sidebar/SideBar.jsx           # Role-aware navigation + theme toggle
    │   └── spiner/LoadingSpinner.jsx
    ├── constants/
    │   ├── incidentTypes.js      # 7 incident categories
    │   └── leaveTypes.js         # 7 leave types
    ├── contexts/
    │   ├── AuthContext.jsx       # Firebase auth state + admin profile
    │   └── ThemeContext.jsx      # light/dark/system theming
    ├── hooks/
    │   ├── useLeaveApplications.js      # Real-time leave subscriptions
    │   ├── useStaffStats.js             # SHQ stats selectors
    │   ├── useZonalStaffStats.js        # Zonal stats selectors
    │   └── useFormationStaffStats.js    # Formation stats selectors
    ├── pages/
    │   ├── WelcomePage.jsx
    │   ├── LoginPages/           # AdminLoginPage, StaffLoginPage
    │   ├── staffPages/StaffPage.jsx     # Officer self-service portal
    │   ├── ServiceHeadPages/            # All staff/admins, analytics, deployment, leave
    │   ├── ZonalHeadPages/              # Zonal staff, analytics, deployment, leave
    │   ├── FormationHeadPage/           # Formation staff, analytics, leave
    │   ├── IncidentPage/IncidentPage.jsx
    │   └── StatsDebugPage.jsx           # Dev-only selector verification
    ├── router/mainRouter.jsx            # All routes
    ├── selectors/staffStats.js          # Pure stats functions + rank/zone/formation constants
    ├── services/
    │   ├── leaveService.js       # Leave CRUD + subscriptions
    │   └── incidentService.js    # Incident CRUD + subscriptions
    ├── stores/                   # Zustand stores
    │   ├── admin-data/adminDataStore.jsx
    │   ├── staff-store/staffStore.js
    │   ├── shq-store/            # allStaffStore, allAdminStore, shqLeaveStore
    │   ├── zonal-store/          # zonalStaffStore, zonalLeaveStore
    │   ├── formation-store/      # formationStaffStore, formationLeaveStore
    │   ├── incident-store/incidentStore.js
    │   └── locations/locations.js
    └── utils/exportStaff.js      # Excel/CSV/PDF export helpers
```

---

## Getting Started

### Prerequisites
- Node.js 18+ (Cloud Functions target Node 18)
- npm
- A Firebase project (Auth, Firestore, Analytics enabled)
- Firebase CLI (`npm i -g firebase-tools`) — optional, only for rules/functions deployment

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd NIS

# 2. Install dependencies
npm install

# 3. Create the .env file from the template below
# (copy the keys listed in "Environment Variables")

# 4. Start the dev server
npm run dev
```

Open the printed local URL (default `http://localhost:5173`).

### Installing Cloud Functions (optional)
```bash
cd functions
npm install
```

---

## Environment Variables

All Firebase configuration is read from environment variables at build time (Vite exposes them via `import.meta.env`). Create a `.env` file in the project root with **at least** these keys:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

> **Security note:** `.env` is gitignored. Never commit real Firebase keys/secrets.

---

## Architecture

### Routing & Access Control

The router is defined in `src/router/mainRouter.jsx` using `createBrowserRouter`:

- Public routes: `/` (Welcome), `/admin-login`, `/staff-login`, `/staff-dashboard`.
- Protected admin area: `/dashboard/*` wrapped in `<ProtectedRoute>` and `<RootLayout>` (sidebar shell).

**`ProtectedRoute`** (`src/components/layout/ProtectedRoute.jsx`):
- Shows a full-screen spinner while auth is loading.
- Redirects unauthenticated users to `/admin-login`.
- Redirects authenticated users *without* an admin document to `/`.

**`DashboardRedirect`** (the index route at `/dashboard`):
- `zone === "SHQ" && formation === "SHQ"` → `/dashboard/all-staff`
- `zone === formation` (a zone-level admin) → `/dashboard/zonal-staff`
- otherwise (formation-level admin) → `/dashboard/formation-staff`

**`SideBar`** builds role-aware navigation sections (Overview, Staff Management, Administration, Operations) from `adminData.zone`/`formation`. Only SHQ admins see register-staff, register-admin, all-admins, national analytics and deployment links; zonal admins get zonal staff/analytics/deployment/leave; formation admins get formation staff/analytics/leave. Incident Reports is available to all admin levels.

### State Management (Zustand Stores)

| Store | Purpose |
|---|---|
| `admin-data/adminDataStore` | Current admin profile (`{zone, formation, role, email}`) for the signed-in admin; `fetchAdminData(uid)`, `setAdminData`, `clearAdminData`. |
| `staff-store/staffStore` | Staff login (`login(serviceNumber, password)` builds `{serviceNumber}@nis.gov.ng`), logout, staff profile. |
| `shq-store/allStaffStore` | `fetchAllStaff()` (all `staff` docs), `addStaff`, `updateStaff`. |
| `shq-store/allAdminStore` | `fetchAllAdmins()`, `updateAdmin`. |
| `shq-store/shqLeaveStore` | Real-time `subscribe()` to all `leaveApplications` (ordered by `appliedAt` desc) + approve/reject wrappers. |
| `zonal-store/zonalStaffStore` | Staff scoped by the admin's `zone`. |
| `zonal-store/zonalLeaveStore` | Real-time leave subscription filtered by `zone`. |
| `formation-store/formationStaffStore` | Staff scoped by the admin's `formation`. |
| `formation-store/formationLeaveStore` | Real-time leave subscription filtered by `formation`. |
| `incident-store/incidentStore` | Real-time incident subscription; automatically picks **all / by zone / by formation** based on the admin's scope; `markAttended`, `clearReport`. |
| `locations/locations` | Wraps `nigerian-states-and-lgas`: `states` and `getLgas(state)` for the registration form. |

All Firestore-scoped stores read the signed-in admin's document (`admins/{uid}`) to determine the zone/formation scope.

### Services Layer

Thin modules that encapsulate all Firestore access:

**`src/services/leaveService.js`**
- `createLeaveApplication({officerId, profile, leaveData})` — computes `numberOfDays`, writes denormalized officer info, `status: "pending"`, `appliedAt` server timestamp, null review fields.
- Fetch/subscribe variants: my (`by officerId`), all, by zone, by formation — always ordered by `appliedAt` desc.
- `approveLeaveApplication(leaveId, adminUid, adminName)` / `rejectLeaveApplication(leaveId, adminUid, adminName, comment)` — stamp review metadata.

**`src/services/incidentService.js`**
- `reportIncident({officerId, profile, incidentData})` — writes denormalized officer info, `status: "pending"`, `reportedAt` server timestamp.
- Fetch/subscribe variants: my, all, by zone, by formation — sorted by `reportedAt` desc.
- `markIncidentAttended(reportId)` / `deleteIncidentReport(reportId)`.

### Analytics & Statistics

`src/selectors/staffStats.js` contains pure, memoized-friendly functions plus the canonical domain constants:

- **Ranks** (`RANKS`, `RANK_LEVELS`): 16 ranks `IA3 → CG` with a seniority level map (`getRankLevel`).
- **Zones** (`ZONES`): `SHQ`, `ZONEA`–`ZONEH`.
- **Formations** (`FORMATIONS`): zones, 36 state commands (`ABSC`–`ZASC`), training schools (`NITSOL`, `NITSA`, `ITSK`), and special facilities (`MMIA`, `NAIA`, `NFBC`, `SEBC`, `IDBC`, `RVMC`).
- Stats: `getTotalStrength`, `getCountByZone`, `getCountByFormation`, `getRankDistribution`, `getSexDistribution`, `getRankBySex` (pyramid data), `getSexRatioByFormation`, `getFormationsByZone`, `getFilteredStaff`.
- `applyFilters` supports `zone`, `formation`, `rank`, `sex` and `dateRange` (on `dateOfFirstAppointment`).

These are consumed by the hooks `useStaffStats`, `useZonalStaffStats` and `useFormationStaffStats` (each wraps a store with `useMemo`). `StatsDebugPage` (`/dashboard/stats-debug`) renders every selector's raw output for verification.

### UI Components

- **Charts** (`src/components/dashboard/`): `StrengthByZoneChart`, `StrengthByFormationChart` (clickable bars for drill-down), `StrengthByRankChart`, `RankPyramidChart` (sign-stacked horizontal bars, male green `#006636` / female gold `#D4A76A`), `SexDistributionChart` (donut), `SexRatioByFormationChart` (grouped bars).
- **Dashboard chrome**: `KPICards`, `DashboardFilters` (zone/formation/rank/sex), `Breadcrumb` (National → Zone → Formation).
- **Details**: `StaffDetailDialog` (dashboard variant) and `StaffDetailsDialog` (deployment variant) — read-only profiles with an embedded `DeploymentTimeline`.
- **Leave**: `AdminLeaveDashboard` (shared admin review table: search, status pills, approve/reject, reject-comment modal, details dialog), `LeaveApplicationForm`, `LeaveApplicationList`, `LeaveStatusBadge`.
- **Incident**: `IncidentReportForm`, `MyIncidentReportList`, `IncidentStatusBadge`.
- **Misc**: `Button`, `LoadingSpinner`, `ExportButtons`, `SideBar`. (`SearchBar.jsx` is currently an empty placeholder.)

---

## Roles & Permissions

| Capability | SHQ Admin | Zonal Head | Formation Head | Staff (Officer) |
|---|:---:|:---:|:---:|:---:|
| View all staff (national) | ✔ | ✖ | ✖ | ✖ |
| View zone staff | — | ✔ (own zone) | ✖ | ✖ |
| View formation staff | — | — | ✔ (own formation) | ✖ |
| Register staff | ✔ | ✖ | ✖ | ✖ |
| Register admin | ✔ | ✖ | ✖ | ✖ |
| View all admins / reset admin password | ✔ | ✖ | ✖ | ✖ |
| National analytics | ✔ | ✖ | ✖ | ✖ |
| Zonal analytics | — | ✔ | ✖ | ✖ |
| Formation analytics | — | — | ✔ | ✖ |
| Deploy staff | ✔ | ✔ (within zone) | ✖ | ✖ |
| Review leave applications | ✔ (all) | ✔ (zone) | ✔ (formation) | ✖ |
| Review incident reports | ✔ (all) | ✔ (zone) | ✔ (formation) | ✖ |
| View/edit own profile | ✖ | ✖ | ✖ | ✔ |
| Apply for leave | ✖ | ✖ | ✖ | ✔ |
| File incident report | ✖ | ✖ | ✖ | ✔ |
| View own leave/incidents/deployment history | ✖ | ✖ | ✖ | ✔ |

The sidebar, `DashboardRedirect`, Firestore rules and store-level queries all enforce this hierarchy.

---

## Data Model (Firestore)

### `staff/{staffId}` — personnel records
`title, surname, firstName, middleName, gender, dateOfBirth, serviceNumber, rank, formation, zone, dateOfFirstAppointment, email, phoneNumber, stateOfOrigin, lgaOfOrigin, nin, bvn, nhf, permanentAddress, authUid, deploymentHistory[]`

`deploymentHistory[]` entries: `{ fromZone, fromFormation, toZone, toFormation, deployedAt, deployedBy }`

### `admins/{uid}` — admin accounts (document ID = Firebase Auth UID)
`zone, formation, role, email`

Roles: `HRM`, `PRS`, `ACCOUNTS`, `PROVOST`, `FORMATION HEAD`, `INVESTIGATIONS`, `UNIT HEAD`

### `leaveApplications/{leaveId}`
`officerId, surname, firstName, middleName, serviceNo, rank, email, zone, formation, leaveType, startDate, endDate, numberOfDays, reason, status ("pending"|"approved"|"rejected"), appliedAt, reviewedBy, reviewedByName, reviewedAt, adminComment`

### `incidentReports/{reportId}`
`officerId, surname, firstName, middleName, serviceNo, rank, email, zone, formation, incidentType, report, status ("pending"|"attended"), reportedAt, attendedAt`

---

## Firebase Configuration

### Security Rules (`firestore.rules`)

Rules version 2, with a **default deny** for all other paths:

- **`staff`** — any authenticated user can read; create allowed when `request.auth.uid == data.authUid` (self-registration safety); update/delete only for authenticated admins.
- **`admins`** — authenticated users can read; writes only by existing admins.
- **`leaveApplications`** — create allowed only for self (`officerId == uid`), status must start as `"pending"`, and no review fields can be injected; read allowed for self or admins; update restricted to admins, only touching `status/reviewedBy/reviewedByName/reviewedAt/adminComment`, and status may only move to `approved`/`rejected`; delete only by admins.
- **`incidentReports`** — create allowed only for self with `status == "pending"` and no `attendedAt`; read for self or admins; update only by admins touching `status/attendedAt`; delete only by admins.

### Composite Indexes (`firestore.indexes.json`)

Required for combined `where` + `orderBy` queries:

- `leaveApplications`: `zone + appliedAt`, `formation + appliedAt`, `officerId + appliedAt`
- `incidentReports`: `officerId + reportedAt`, `zone + reportedAt`, `formation + reportedAt`

Deploy with `firebase deploy --only firestore:rules,firestore:indexes`.

### Cloud Functions (`functions/index.js`)

- **`createAdmin`** (v2 `onCall`) — creates a Firebase Auth user with a generated 10-character password, writes the `admins/{uid}` document (`zone`, `formation`, `role`, `email`), and returns `{ success, password }` to the caller.
- Node 18 runtime, dependencies: `firebase-admin`, `firebase-functions`.

> Note: the current `AdminRegistrationForm` performs admin creation client-side (create user → sign out → re-authenticate). The callable function provides a server-side alternative.

---

## Pages & Routes

| Route | Page | Access |
|---|---|---|
| `/` | WelcomePage — choose Staff or Admin login | Public |
| `/admin-login` | AdminLoginPage | Public |
| `/staff-login` | StaffLoginPage | Public |
| `/staff-dashboard` | StaffPage — officer self-service | Staff |
| `/dashboard` (index) | DashboardRedirect | Admin |
| `/dashboard/all-staff` | AllStaffDashboard | SHQ |
| `/dashboard/all-admins` | AllAdminsDashboard | SHQ |
| `/dashboard/analytics` | StaffStrengthDashboard (national) | SHQ |
| `/dashboard/deployment` | DeploymentPage | SHQ |
| `/dashboard/leave` | ServiceHeadLeaveApplications | SHQ |
| `/dashboard/register-staff` | RegistrationForm | SHQ |
| `/dashboard/register-admin` | AdminRegistrationForm | SHQ |
| `/dashboard/zonal-staff` | ZonalStaffDashboard | Zonal |
| `/dashboard/zonal-analytics` | ZonalStaffStrengthDashboard | Zonal |
| `/dashboard/zonal-deployment` | ZonalDeploymentPage | Zonal |
| `/dashboard/zonal-leave` | ZonalLeaveApplications | Zonal |
| `/dashboard/formation-staff` | FormationStaffDashboard | Formation |
| `/dashboard/formation-analytics` | FormationStaffStrengthDashboard | Formation |
| `/dashboard/formation-leave` | FormationLeaveApplications | Formation |
| `/dashboard/incidents` | IncidentPage | All admin levels |
| `/dashboard/stats-debug` | StatsDebugPage | Dev/verification |

---

## Export & Reporting

`src/utils/exportStaff.js` provides three export utilities over a fixed 18-column schema (names, service number, rank, formation, zone, gender, phone, email, state/LGA, DOB, first appointment, NIN, BVN, NHF, address):

- `exportToExcel(staff, filename)` — SheetJS `.xlsx` workbook.
- `exportToCSV(staff, filename)` — client-side CSV download.
- `exportToPDF(staff, filename)` — landscape A4 PDF via `jspdf` + `jspdf-autotable`.

`ExportButtons` wraps these into a toolbar (Excel/CSV/PDF) and is used on the All-Staff, Zonal-Staff and Formation-Staff dashboards.

---

## Theming

Theme management lives in `src/contexts/ThemeContext.jsx`:

- Three modes: `light`, `dark`, `system` (follows `prefers-color-scheme`), persisted as `nis-theme` in `localStorage`.
- Dark mode toggles the `dark` class on `<html>` using Tailwind's `@custom-variant dark`.
- Custom color tokens (`src/index.css`): `nis-primary` (maroon `#463032`), `nis-secondary` (green `#006636`), `nis-tertiary` (gold `#F8CB9C`) — each with light/dark variants and a `.force-light` override for the welcome/login screens.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint on the whole project |

Cloud Functions scripts (run inside `functions/`):
`npm run serve` (emulators), `npm run shell`, `npm run deploy`, `npm run logs`.

---

## Development Notes

- **Staff emails are derived**: staff login uses `{serviceNumber}@nis.gov.ng`; admin emails use the pattern `{role}{formation}admin@nis.gov.ng` (both auto-generated during registration).
- **Admin display name** is consistently the email prefix (`adminData?.email?.split("@")[0]`), used for `deployedBy` and `reviewedByName` audit fields.
- **Real-time data**: leave and incident lists use Firestore `onSnapshot` subscriptions; new/updated records appear without refresh.
- **Denormalization**: officer details (name, service number, rank, zone, formation) are copied into each leave/incident document so lists are readable without joins.
- **Known duplication**: the `ZONE_FORMATIONS` mapping exists in `AllStaffDashbord.jsx`, `DeploymentPage.jsx`, `ZonalStaffDashboard.jsx`, `FormationStaffDashboard.jsx`, and `ZonalDeploymentPage.jsx`. `StaffDetailDialog` and `StaffDetailsDialog` are near-duplicates. A shared module could consolidate these.
- **`SearchBar.jsx`** is an empty placeholder; search is currently implemented inline on each page.
- **`StatsDebugPage`** is a developer verification page (raw selector output + charts) and is not part of the production navigation.
- Seeding is manual: add documents to the Firestore `staff`/`admins` collections (and create Auth accounts) to populate the dashboards.

---

## License

Project built for the **Nigeria Immigration Service** as course work (RAD5_TECHX). Copyright © Nigeria Immigration Service.
