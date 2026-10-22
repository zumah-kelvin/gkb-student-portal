# GKB Technologies — Student Project & Engineering Prototype Portal

Dedicated academic engineering platform for university and polytechnic students to request custom hardware prototypes, submit final-year Capstone ideas, and access technical mentorship from GKB Technologies.

## Features
- **Project Proposal Submission**: Detailed student intake form capturing student credentials, institution (KNUST, UG Legon, ATU, KsTU, etc.), department, project category, target defense deadline, sensor requirements, and estimated budget in GHS.
- **One-Click WhatsApp Dispatch**: Instantly formats project scopes and opens a direct chat with CEO Zumah Kelvin (`+233 55 211 7787`) with complete hardware specifications.
- **Verified Prototype Catalog & Idea Bank**: Curated repository of tested academic projects across IoT, Solar/Energy, Smart Agriculture, Biometrics, and Healthcare, each with Bill of Materials (BOM) and complexity timelines.
- **Template Autofill**: "Use As Project Template" button instantly pre-fills the proposal intake form with verified schematics and sensor requirements.
- **Academic Mentorship Framework**: Step-by-step guidance covering schematic simulations (Proteus/EasyEDA), clean plagiarism-free firmware (C++/MicroPython), thesis Chapters 3 & 4 documentation (block diagrams, flowcharts), and pre-defense mock rehearsals.
- **Direct Support & Sensor Sourcing**: Fast helpdesk for component burnout, urgent sensor requests, and hardware troubleshooting.

## Local Setup & Development

```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
npm run preview
```

## Environment Configuration (`.env`)
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_OR_PUBLISHABLE_KEY
```

## Independent Netlify Deployment

1. Initialize git and push to a new GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for GKB Student Project Portal"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/gkb-student-portal.git
   git push -u origin main
   ```
2. In the Netlify Dashboard:
   - Click **Add new site → Import an existing project**.
   - Select the `gkb-student-portal` GitHub repository.
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Add environment variables: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Click **Deploy Site**.
