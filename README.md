# 🏛️ SOVEREIGN MEN'S CLUB DIGITAL PLATFORM
### Operational Digital Community Operating System

A production-ready full-stack operating platform for **Sovereign Men's Club**, designed to empower the complete member journey:

$$\mathbf{REGISTER \longrightarrow DEVELOP \longrightarrow CONNECT \longrightarrow LEAD \longrightarrow SERVE}$$

---

## 🏗️ SYSTEM ARCHITECTURE

```text
                    SOVEREIGN MEN'S CLUB
                           │
              ┌────────────┴────────────┐
              │                         │
        MEMBER EXPERIENCE         ADMIN EXPERIENCE
              │                         │
       Member Portal              Admin Portal
       Mentor Portal              Finance Portal
       Organizer Portal           Management Command
              │                         │
              └────────────┬────────────┘
                           │
                     FRONTEND API
                           │
                    AUTH / RBAC
                           │
                    BACKEND SERVICES
                           │
       ┌───────────────────┼───────────────────┐
       │                   │                   │
   Membership          Programs          Operations
       │                   │                   │
       ├ Events            ├ Learning          ├ Finance
       ├ Community         ├ Mentorship        ├ Reports
       ├ Attendance        ├ Fitness           ├ Notifications
       ├ Service           ├ Career            └ Communication
       └ Profiles          └ Business
                           │
                     PRISMA / DATABASE
                           │
              ┌────────────┼────────────┐
              │            │            │
           Google       Telegram     External
          Ecosystem      Bot API      Services
```

---

## ⚡ QUICK START

### 1. Prerequisites
- Node.js `>= 20.0.0`
- npm `>= 10.0.0`

### 2. Installation
```bash
# Clone and enter directory
cd soverign

# Install all workspace dependencies (server + client)
npm install
```

### 3. Database Initialization & Seed
```bash
# Generate Prisma Client & Push relational schema
npm run db:generate
npm run db:push

# Seed with realistic relational records, users, events, and programs
npm run db:seed
```

### 4. Run Development Environment
```bash
# Concurrently launches backend (port 5200) and frontend (port 5173)
npm run dev
```

* **Frontend Application:** [http://localhost:5173](http://localhost:5173)
* **Backend REST API:** [http://localhost:5200/api/v1](http://localhost:5200/api/v1)
* **Health Check:** [http://localhost:5200/api/health](http://localhost:5200/api/health)

---

## 🔑 TEST CREDENTIALS & DEMO ROLES

Every seeded account uses password: `Password123!`

| Role | Name | Email | Focus Area |
| :--- | :--- | :--- | :--- |
| **SUPER_ADMIN** | Marcus Vance | `admin@sovereign.club` | Executive Command, Member Approvals, Audit Stream |
| **ORGANIZER** | David Sterling | `organizer@sovereign.club` | Expedition Planning, QR Attendance Terminal |
| **MENTOR** | James "Iron" Thorne | `mentor@sovereign.club` | Mentee Guidance, Scheduled Sessions, Goals & Notes |
| **FINANCE_MANAGER** | Ethan Wright | `finance@sovereign.club` | Treasury Ledger, Dues Invoicing, Disbursements |
| **MEMBER** | Alexander Cole | `alex@sovereign.club` | Digital ID, RSVPs, Spartan Fitness, Community |

> **Interactive Demo Tester Bar:** At the top of the interface, click any role pill (e.g. `Super Admin`, `Brother (Alex)`) to immediately switch views without re-typing credentials.

---

## 🛡️ PORTAL CAPABILITIES

### 1. Member Portal
- **Command Center:** Welcome banner, membership status, upcoming RSVP'd expeditions, active Spartan fitness challenge preview, executive directives.
- **Digital Member ID:** Cryptographic card, tier privileges, live QR code for on-site physical check-in, verified service hours counter.
- **Events & Expeditions:** Summits, wilderness rucks, masterminds. 1-click RSVP registration and waitlist management.
- **Learning & Knowledge:** Curated modules, interactive lesson completion tracking (recalculates overall % completion live), book library, and Sovereign podcasts.
- **Mentorship Track:** Assigned mentor profile, scheduled 1-on-1 sessions with video links, accountability goals with checkboxes, and shared evaluation notes.
- **Spartan Fitness:** 10,000-pushups quarterly challenge with daily rep logging, Spartan conditioning protocol, workout session logger, and biometrics history.
- **Capital & Business:** Vetted co-investment syndicates, verified member business directory, executive career board with application submissions.
- **Community Service:** Active service projects, volunteer mobilization, and verified service hours logging.
- **Brotherhood Feed:** Post insights, respect/like posts with real-time counters, and threaded comments.
- **Profile:** Manage contact details, creed, profession, and linked Telegram username.

### 2. Admin Portal
- **Executive Dashboard:** Real-time database telemetry (active brothers, net treasury balance, pending applications, service hours), quick review actions, and security audit log stream.
- **Member Directory:** Search by name, member number, city, profession; filter by status and tier; issue verified credentials.
- **Applications Pipeline:** Review applicant credentials and "Why do you seek Sovereign Brotherhood?" answers from Google Forms and direct intake. Approve/Decline with recorded review notes.
- **Expedition Operations:** Publish new summits, configure capacity, view confirmed rosters.
- **Treasury & Ledger:** Invoices list, operational expense recording with receipts and categories, gross inflow vs outflow calculation.
- **Google & Telegram Ecosystem:** Manual Google Sheets synchronization trigger, webhook endpoint status, Telegram channel broadcast dispatcher.
- **Security Audit Trail:** Immutable system logs capturing every mutation, operator, IP address, and timestamp.

### 3. Mentor Portal
- View assigned mentees, track strategic goals, log counsel notes, and schedule sessions.

### 4. Organizer Portal
- Event roster overview, capacity monitoring, and physical check-in terminal accepting QR codes or member numbers.

### 5. Finance Portal
- Financial oversight, recording disbursements, dues invoice monitoring, and treasury balance telemetry.

---

## 🔗 INTEGRATIONS ARCHITECTURE

### Google Forms / Sheets Ingestion
- **Webhook Endpoint:** `POST /api/v1/integrations/google/forms-webhook`
  - Ingests intake submissions from Google Forms or Google Apps Script webhooks.
  - Automatically deduplicates and creates `MemberApplication` records for council review.
- **Manual Batch Sync:** `POST /api/v1/integrations/google/sync`
  - Pulls and ingests applicant records from linked Google Sheets spreadsheets.

### Telegram Community Bot
- **Account Linking:** `POST /api/v1/integrations/telegram/link`
  - Connects member accounts to Telegram usernames.
- **Channel Broadcast:** `POST /api/v1/integrations/telegram/broadcast`
  - Dispatches high-priority executive announcements to official Telegram channels.

---

## 🧪 TESTING

Run the comprehensive automated API test suite:
```bash
npm test
```

Verification includes:
- System Health Check
- Admin & Member Authentication
- Role-Based Access Control (403 Rejections on Unauthorized Endpoints)
- Real Database Metrics Aggregations
- Digital ID Verification
- Google Forms Webhook Ingestion Pipeline