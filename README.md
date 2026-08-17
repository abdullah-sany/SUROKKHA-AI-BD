# SUROKKHA AI BD

**Your AI-powered safety companion for Bangladesh.**

A Bangladesh-focused AI healthcare safety platform prototype: AI first-aid guidance, an emergency hub, a hospital/facility finder, an ambulance directory, a verified emergency-contact directory, an AI prescription analyzer, a specialist guide, a personal health timeline, and an integration entry point into the external **RoktoSheba AI Blood Donation** platform.

> SUROKKHA AI BD is **not a doctor**. It does not diagnose disease, does not prescribe or change medication, and always escalates toward professional care when uncertain. See [Safety limitations](#safety-limitations) below.

---

## 1. Project overview

| | |
|---|---|
| **Problem** | In an emergency or health scare, people in Bangladesh often don't know the safest immediate step, the nearest verified hospital, or what an ambulance/emergency number actually is — and are especially vulnerable to acting on unverified or fabricated information at the worst possible time. |
| **Solution** | A single, calm, mobile-first app that gives conservative AI first-aid guidance, plain-language prescription explanations, and a directory of **verified** hospitals, ambulances, and emergency numbers — clearly separating what's officially verified from what's a sample/demo record, and never inventing a phone number, coordinate, or medical fact. |

## 2. Features

1. **AI First Aid** — structured guidance (situation / immediate steps / what not to do / warning signs / when to seek care) with a conservative 4-level safety classification and an emergency escalation banner.
2. **Emergency Hub** — one-tap access to ambulances, hospitals, verified emergency contacts, and "nearby help."
3. **Healthcare Directory / Hospital Finder** — search & filter by division, district, facility type, ownership, and verification status; sorts by real distance when location is available, never fakes a distance when it isn't.
4. **Ambulance Directory** — separate from the hospital directory by design (an ambulance is never assumed to belong to a hospital unless verified).
5. **Emergency Contact Directory** — only real, sourced numbers (999, 16263, 109 — see [Data sources](#data-sources)).
6. **AI Prescription Analyzer** — reads a prescription photo, transcribes only what it can read confidently, and explains it in plain language without ever changing a dose or diagnosing.
7. **Specialist Guide** — suggests *which type* of specialist may be relevant — never a diagnosis.
8. **Health Timeline** — a private, on-device-linked, user-deletable log of recent activity.
9. **Bangladesh healthcare & geography data**, structured to be replaced by an official DGHS registry import.
10. **RoktoSheba AI integration** — SUROKKHA AI BD deliberately does **not** duplicate a blood-donation platform. It links out to the existing [RoktoSheba AI Blood Donation](https://roktosheba-ai-blood-donation.netlify.app/) platform.
11. **Bangla + English** — a full i18n system; AI responses are requested in the user's chosen language.

## 3. Technology stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express, TypeScript
- **AI:** Google Gemini (`@google/generative-ai`), called **only from the server** — the API key never reaches the browser
- **Database:** SQLite (via `better-sqlite3`) behind a repository layer, designed to be swapped for PostgreSQL/Supabase/Firebase/MongoDB by reimplementing `server/src/repositories/*` — nothing outside that folder talks to SQL directly

## 4. Architecture

```
surokkha-ai-bd/
├── client/                       React + TypeScript + Vite + Tailwind
│   └── src/
│       ├── components/           ui/, home/, firstaid/, emergency/, healthcare/,
│       │                         ambulance/, prescription/, specialist/, timeline/, common/
│       ├── pages/                One file per route
│       ├── layouts/               AppShell, Sidebar (desktop), MobileNav, TopBar
│       ├── services/              apiClient + one thin service per feature (talks to server/ only)
│       ├── contexts/              LanguageContext, ToastContext
│       ├── hooks/                 useGeolocation, useDebounce, useVoiceInput, useTimeline
│       ├── translations/          en.ts, bn.ts + lookup helper
│       ├── ai/                    severity → visual-style mapping (no AI calls here)
│       ├── data/                  Bangladesh divisions/districts, RoktoSheba URL constant
│       └── types/
│
└── server/                       Express + TypeScript API (owns the Gemini key)
    └── src/
        ├── routes/ → controllers/ → services/ → repositories/    (strict layering)
        ├── services/gemini/       Gemini client + one prompt file per AI feature
        ├── repositories/          All SQL lives here; db.ts creates schema + seeds
        ├── data/seed/             Seed data — verified real records + labeled DEMO DATA
        ├── middleware/            error handling, rate limiting, upload validation, request validation
        └── types/
```

**AI safety pipeline (every AI feature follows this):** prompt with hard safety rules → Gemini call → **Zod schema validation** of the raw JSON → on failure, a safe, clearly-labeled fallback is shown instead of trusting malformed output. When `GEMINI_API_KEY` is not set, AI routes automatically serve clearly-labeled demo responses (`isDemoResponse: true`) instead of failing — useful for running the Innovation Fair demo without a live key, and disableable via `ALLOW_DEMO_FALLBACK=false`.

## 5. Data sources

| Record | Status | Source |
|---|---|---|
| National Emergency Service (999) | ✓ Verified | Official government service |
| National Health Helpline — Shasthyo Batayon (16263) | ✓ Verified | DGHS, Ministry of Health and Family Welfare |
| National Helpline for Violence Against Women & Children (109) | ✓ Verified | Ministry of Women and Children Affairs |
| Dhaka Medical College Hospital | ✓ Verified | Official hospital site / DGHS listing |
| Chittagong Medical College Hospital | ✓ Verified | Official hospital site |
| National Hospital Chattogram | ⚠ Needs verification | Third-party directory (not cross-checked against an official source) |
| All other facility/ambulance records | **DEMO DATA** | Sample placeholders demonstrating the data architecture — no invented phone numbers or coordinates |

Full detail is shown in-app at **Data Sources** (`/data-sources`), and every record carries `source` + `verified` + `lastVerifiedAt` fields end to end — the UI never shows a fake "verified" badge.

**Production next step:** replace `server/src/data/seed/*.json` with a real export from the DGHS / Ministry of Health and Family Welfare facility registry. The repository layer (`facilities.repository.ts`, `ambulances.repository.ts`) doesn't need to change.

## 6. Setup

### Prerequisites
- Node.js 18+
- A Google Gemini API key (optional — the app runs in demo mode without one) from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Install & run

```bash
# 1. Backend
cd server
cp .env.example .env
# Optionally paste a real key into GEMINI_API_KEY in .env
npm install
npm run dev              # starts on http://localhost:4000

# 2. Frontend (separate terminal)
cd client
cp .env.example .env
npm install
npm run dev               # starts on http://localhost:5173
```

Open `http://localhost:5173`. The database (`server/data/surokkha.sqlite`) is created and seeded automatically on first run.

### Production build

```bash
cd server && npm run build && npm start
cd client && npm run build   # outputs client/dist — serve with any static host
```

## 7. Environment variables

**`server/.env`**
```
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
GEMINI_API_KEY=                 # leave blank to run in demo mode
GEMINI_TEXT_MODEL=gemini-1.5-flash
GEMINI_VISION_MODEL=gemini-1.5-flash
DATABASE_URL=./data/surokkha.sqlite
ALLOW_DEMO_FALLBACK=true
MAX_UPLOAD_BYTES=5242880
```

**`client/.env`**
```
VITE_API_BASE_URL=http://localhost:4000/api
VITE_ROKTOSHEBA_URL=https://roktosheba-ai-blood-donation.netlify.app/
```

Never commit real `.env` files — both are gitignored.

## 8. Safety limitations

- **Not a diagnostic tool.** First Aid, Prescription, and Specialist features never diagnose a condition and are instructed to phrase suggestions as "may be relevant to," never "you have."
- **Never changes a prescription.** The analyzer only transcribes and explains what's legibly written; it flags unreadable text instead of guessing.
- **Conservative by design.** When the AI is uncertain about severity, it is instructed to escalate rather than downgrade.
- **No fabricated data.** Every phone number, coordinate, and emergency number is either sourced (see above) or explicitly absent — the app never displays a plausible-looking fake as if it were real.
- **No real-time claims.** The app does not claim live ambulance availability, hospital bed availability, or ED status — those are listed as clean future extension points, not faked.
- **Demo mode is always labeled.** Any AI response generated without a configured Gemini key carries `isDemoResponse: true` and a visible "Demo mode" notice in the UI — it's never silently blended with live output.

## 9. Innovation Fair demo flow

1. **First aid → emergency escalation:** On Home, type "I cut my hand and the bleeding is not stopping" → Get Help. The AI classifies it `URGENT`/`EMERGENCY`, shows structured guidance, and surfaces the emergency banner with one-tap links to Find Ambulance / Find Hospital.
2. **Prescription understanding:** Go to Prescription → upload a prescription photo → see extracted medicines explained in plain language, with confidence levels and an explicit notice for anything unreadable.
3. **Blood network:** From Home or the sidebar, tap **Need Blood?** → opens RoktoSheba AI Blood Donation in a new tab, demonstrating the connected-ecosystem approach without duplicating a donor platform inside SUROKKHA AI BD.

## 10. Future roadmap / extension points

These are deliberately **not** faked — they're clean seams to build against:

- Real-time ambulance tracking & hospital ED/bed availability (would plug into `facilities.repository.ts` / `ambulances.repository.ts`)
- Government DGHS API integration replacing the seed JSON
- RoktoSheba API integration (currently a simple external link)
- Bangla voice assistant, offline first-aid mode, PWA packaging, native apps
- Admin verification dashboard for the `verified` / `source` / `lastVerifiedAt` fields
- Family emergency sharing

## 11. Quality checklist

- [x] Home, AI First Aid, Emergency Hub, Healthcare Directory, Ambulance Directory, Emergency Contacts, Prescription Analyzer, Specialist Guide, Health Timeline, Data Sources, Settings all implemented and wired
- [x] Gemini integration (server-only) with schema-validated output and labeled demo fallback
- [x] Safety classification + emergency escalation banner
- [x] Browser geolocation with manual division/district fallback
- [x] Bangla/English i18n throughout
- [x] Mobile-first responsive layout (bottom nav + sheet) and desktop sidebar layout
- [x] API keys never exposed to the client; input/upload validation; rate limiting
- [x] Centralized error handling — no fabricated data anywhere in the seed set
- [x] Demo data clearly and separately labeled from verified data
- [x] `server` typechecks clean (`npm run typecheck`) and builds clean (`npm run build`)
- [x] `client` typechecks clean and `vite build` succeeds
- [x] End-to-end smoke tested (health check, AI demo flow, geolocation-based facility sort, CORS)
