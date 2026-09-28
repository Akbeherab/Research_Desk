# Winter Research Desk (Winter 2026–27)

A focused, calm, and rigorous academic workspace designed for Indian undergraduate students across disciplines (Computer Science, AI/ML, Electrical & Electronics, Mechanical Engineering, Chemistry, Physics, Life Sciences, Mathematics, and Interdisciplinary Studies) preparing for and applying to winter research internships.

Built with **React 19**, **TypeScript**, **Tailwind CSS**, and **Vite**, inspired by the refined, considered UI/UX of modern tools

---

## 🌟 Key Features Implemented

### 1. Start Here & Onboarding
- **Hero Narrative:** *"Your winter research internship starts before the first email."*
- **6-Stage Interactive Roadmap:** `Prepare → Explore → Read → Reach out → Follow up → Interview`.
- **Personalized Plan Builder:** Multi-discipline preference capture (Degree, Year, Broad Interests, Tools, Baseline Project, Availability Dates, and Work Mode) with starting recommendations.
- **Honest Progress Metrics:** LocalStorage-backed counters (Saved Contacts, Applications Recorded, Due Follow-ups, Roadmap Progress) with truthful empty states upon first launch.

### 2. Faculty Directory (1,411 Indexed IIT Professors)
- **Direct Structured Data:** Imported directly from the provided public compilation across IIT Bombay, IIT Indore, IIT Kharagpur, IIT Gandhinagar, IIT Delhi, IIT Guwahati, IIT Palakkad, IIT Jammu, IIT Ropar, IIT BHU, and others.
- **Multi-Factor Filtering:** Search by professor name, campus, department, or domain keyword.
- **Transparent Relevance:** Explains why a result appears based on keyword overlap (no fabricated AI fit percentages).
- **Detail Slide-Over Drawer:** Contact info, Google Scholar query link, official web search, editable personal research-fit notes, and a dedicated scratchpad to record one relevant paper.
- **CSV & JSON Import:** Custom data loader with column mapping and deduplication.

### 3. DRDO Directory (All 50 Labs & Facilities)
- **Complete Import:** All 50 DRDO laboratories, autonomous societies (e.g. ADA), and test ranges (e.g. ITR, PXE).
- **Mandatory Source Disclaimer:** Clear notices that supplied contacts represent director/executive offices rather than dedicated student recruitment desks.
- **5-Step Application Route Checklist:** Guides students to look for official circulars at `drdo.gov.in`, verify documents (NOC/bonafide only if requested), follow formal training cells, or send a structured inquiry.
- **Dual Display:** Switchable desktop data table and responsive card grid.

### 4. Email Studio (Zero AI API Requirement + Optional Groq AI Polish)
- **5 Academic Templates:**
  - **Template A:** Specific professor outreach (paper connection, baseline project, realistic task).
  - **Template B:** Student with limited research experience (foundational study, small project).
  - **Template C:** DRDO application-process inquiry.
  - **Template D:** First follow-up (7–10 days later with optional technical update).
  - **Template E:** Final follow-up.
- **Live Preview & Placeholder Detector:** Highlights unresolved brackets (e.g. `[Name]`, `[start date]`, `[link]`) and prevents accidental sending of unpersonalized drafts.
- **One-Click Actions:** Copy subject, copy body, copy complete email, and `mailto:` client launcher (with an honest advisory that attachments must be added manually).
- **Pre-Send Personalization Checklist:** 8 essential academic criteria.
- **Groq AI Integration:** Optional academic tone review powered by Groq (`llama-3.3-70b-versatile`) using `VITE_GROQ_API_KEY` stored in `.env`.

### 5. My Applications (Personal Tracker & Follow-up Workflow)
- **9 Standard Academic Statuses:** *Shortlisted*, *Reading their work*, *Draft ready*, *Applied*, *Follow-up sent*, *Replied*, *Interview*, *Offer*, *Closed*.
- **Follow-up Reminders:** Automatically flags applications that have passed the 7–10 day follow-up window. One-click "Log Sent" increments follow-up count and schedules the next checkpoint.
- **Export & Backup:**
  - CSV export with spreadsheet formula injection protection (escapes `=`, `+`, `-`, `@`).
  - Full JSON backup and restore.

### 6. 6-Week Research Preparation Roadmap
- Interactive checkboxes with persistent state.
- Tangible week-by-week deliverables (e.g., Week 1 research statement, Week 2 reproducible baseline, Week 3 paper notes, Week 5 application batch).
- Discipline-specific tooling tracks (AI/Data Science, Systems/Networking, Electronics/Robotics, Experimental Sciences).
- Embedded interactive paper-notes scratchpad.

### 7. Resources & Decision Tools
- **Practical Guides:** 1-Page Academic CV, Reproducible GitHub README, 3-Pass Paper Reading, Finding Official Pages, Interview Preparation.
- **"Before You Accept" Checklist:** Supervised scope, dates, accommodation, NOC requirements, and NDA/confidentiality.
- **Opportunity Notice Board:** Save official institutional fellowship notices with deadlines and eligibility criteria.

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js `v18+` (Tested on Node `v26.7.0`)
- npm `v9+`

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration (Optional)
Create a `.env` file if you wish to enable AI email polish:
```env
VITE_GROQ_API_KEY=your_groq_api_key_here
```
*(The core application operates completely client-side without any backend or API requirements. The Groq key enables optional AI tone review in Email Studio).*

### 3. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 📂 Source Data Provenance & Structure

| Dataset | File Location | Record Count | Status |
| :--- | :--- | :--- | :--- |
| **IIT Faculty Directory** | [`src/data/iitFaculty.json`](src/data/iitFaculty.json) | 1,411 records | Public compilation from IITs. Sourced from the supplied Google Sheet. Tagged as `directory-listed`. |
| **DRDO Laboratories** | [`src/data/drdoLabs.json`](src/data/drdoLabs.json) | 50 facilities | Imported verbatim from supplied community list. All marked as `unverified` with clear notice to check `drdo.gov.in`. |
| **Templates & Logic** | [`src/data/emailTemplates.ts`](src/data/emailTemplates.ts) | 5 templates | Complete deterministic parameter rendering. |
| **Roadmap Framework** | [`src/data/roadmapData.ts`](src/data/roadmapData.ts) | 6 weeks | 22 actionable milestones. |
| **Research Guides** | [`src/data/resourcesData.ts`](src/data/resourcesData.ts) | 6 guides | Formatted academic best practice manuals. |

---

## ⚠️ Integrity, Disclaimers & Real Limitations

1. **No Institutional Affiliation:** Winter Research Desk is an independent open-source student helper tool. It is not affiliated with, endorsed by, or sponsored by IITs, DRDO, or the Ministry of Defence.
2. **Unverified Director Contacts:** The supplied DRDO director emails represent administrative leadership, not student internship coordinators. Students are guided to look for official training cell notices or send a polite procedural inquiry (Template C).
3. **No Automatic Background Notifications:** Because this is an entirely client-side privacy-first application (with data safely stored in `localStorage`), follow-up reminders appear when the user visits the website. No background emails or push notifications are dispatched.
4. **Data Portability:** Users can download a full `.json` backup or `.csv` export anytime from the header to safeguard their progress across devices or browser cache clears.
