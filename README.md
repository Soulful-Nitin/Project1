# MESSMETER 🍲📊
### *“Measure the Meal. Improve the Mess.”*

> **Smart Hostel Mess Food Quality Analytics & Feedback Platform**  
> Turn daily student dining reviews into actionable kitchen insights, transparent complaint resolution, and data-driven meal improvements.

---

## 🌟 Overview & Core Philosophy

**MessMeter** is a modern, responsive full-stack platform designed for residential universities and collegiate hostel mess management. It bridges the communication gap between students and mess administration through a continuous feedback loop:

$$\textbf{COLLECT} \longrightarrow \textbf{ANALYZE} \longrightarrow \textbf{IDENTIFY} \longrightarrow \textbf{ACT} \longrightarrow \textbf{IMPROVE}$$

1. **Collect**: Students rate daily meals across 6 distinct culinary dimensions and file complaints with optional photo evidence.
2. **Analyze**: MongoDB aggregation pipelines compute multi-week trends, meal slot rankings, and sentiment distributions.
3. **Identify**: Natural Language Processing (NLP) identifies recurring complaints (excess oil, oversalted curries, delayed serving).
4. **Act**: Mess supervisors adjust recipes, calibrate equipment, update meal schedules, and resolve student grievances.
5. **Improve**: Food quality rises, food waste decreases, and student satisfaction is restored.

---

## 🚀 Key Features

### 🎓 Student Experience
- **Interactive Daily Menu**: View breakfast, lunch, snacks, and dinner schedules with dish details, calories, and vegetarian indicators.
- **6-Parameter Rating Matrix**: Rate meals on **Taste**, **Food Quality**, **Hygiene**, **Freshness**, **Quantity**, and **Variety** (1–5 stars each).
- **Quick Tag Pills**: Select tags like *“Too oily”*, *“Too spicy”*, *“Too salty”*, *“Cold food”*, *“Fresh”*, *“Good quantity”*, *“Excellent”*.
- **Written Feedback with Live Sentiment Preview**: Integrated NLP estimator previews tone before submission.
- **Transparent Complaint System**: Report issues across categories (*Food Quality, Hygiene, Foreign Object, Temperature, Shortage, Late Serving*), attach photo evidence, and toggle **Anonymous Mode**.
- **Live Complaint Resolution Timeline**: Track complaints step-by-step (*Submitted → Under Review → In Progress → Resolved*) with official supervisor responses.
- **My Rating History & Scorecard**: Personal history of all past meal reviews and campus-wide mess satisfaction leaderboards.

### 🛡️ Mess Administrator & Warden Portal
- **Executive Analytics Dashboard**: Live KPI cards for **Overall Mess Score**, **Average Rating**, **Hygiene Score**, **Total Feedback**, and **Active Complaints** (all computed from MongoDB aggregations).
- **Interactive Recharts Visualizations**:
  - 📈 **Rating & Hygiene Trends**: Filter by 7 Days, 30 Days, or 3 Months.
  - 📊 **Meal Slot Performance**: Compare Breakfast vs Lunch vs Snacks vs Dinner.
  - 🎯 **6-Parameter Quality Radar**: Multi-attribute radar plot.
  - 🍲 **Dish Performance Table**: Searchable, sortable satisfaction leaderboard for all menu items.
- **Data-Driven AI Kitchen Insights**: Real-time actionable insights dynamically derived from live database metrics (identifying top-performing meals, lowest-rated dishes, hygiene warnings, and most-discussed topics).
- **Calendar Menu & Dish Management**: Schedule daily menus, assign dishes, set serving windows, and add new dishes to the catalog.
- **Grievance Resolution Hub**: Filter complaints by status/category/priority, update workflows, and issue official corrective action responses that notify the student.
- **AI Sentiment & Topic Analytics**: Sentiment distribution (% Positive, % Neutral, % Negative), top topic frequency charts, and searchable feedback feeds.
- **Executive Reports & Data Export**: Weekly and Monthly audit summaries, printable PDF-ready layouts, and 1-click **CSV Exports** (Ratings, Feedback, Complaints).

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, React Router v6, Recharts, Axios, Lucide Icons |
| **Backend** | Node.js, Express.js, TypeScript, Mongoose, JWT, bcryptjs, Helmet, Morgan |
| **Database** | MongoDB (with automatic fallback to zero-config in-memory MongoDB Server for instant out-of-the-box local operation) |
| **Security** | Role-Based Access Control (`student` vs `admin`), HTTP security headers, CORS, JWT auth middleware |

---

## 📂 Project Architecture

```text
messmeter/
├── package.json               # Root workspace scripts (dev, build, seed)
│
├── client/                    # Frontend React + TypeScript + Vite
│   ├── src/
│   │   ├── components/        # Navbar, Footer, StarRating, MetricCard, Modal, Skeletons
│   │   ├── context/           # AuthContext (with 1-Click Demo Login)
│   │   ├── pages/             # Landing, Login, Register, Student & Admin Dashboards
│   │   ├── services/          # Typed Axios API client
│   │   ├── types/             # TypeScript domain interfaces
│   │   ├── App.tsx            # Protected role routing
│   │   └── main.tsx
│   ├── tailwind.config.js
│   └── vite.config.ts
│
└── server/                    # Backend Node.js + Express + TypeScript
    ├── src/
    │   ├── analytics/         # MongoDB native aggregation pipelines & AI insights
    │   ├── config/            # Database connection with graceful fallback
    │   ├── controllers/       # Auth, Meal, Dish, Rating, Feedback, Complaint, Report
    │   ├── middleware/        # JWT auth, role authorization, centralized error handler
    │   ├── models/            # Mongoose schemas (User, Meal, Dish, Rating, Feedback, Complaint)
    │   ├── routes/            # Express REST routes
    │   ├── scripts/           # Comprehensive database seeder
    │   ├── services/          # Sentiment analysis engine & AI insight generator
    │   ├── app.ts             # Express app setup
    │   └── server.ts          # Server entrypoint
    ├── tsconfig.json
    └── .env.example
```

---

## ⚡ Quick Start & Running Locally

### 1. Prerequisites
- **Node.js (v18+)** and **npm**

### 2. Install All Dependencies
From the root repository directory:
```bash
npm run install:all
```

### 3. Seed the Database
Populate the database with **120+ verified students, 3 admins, 35+ dishes, 3 weeks of meals, 1000+ ratings, 500+ feedbacks, and 45+ complaints**:
```bash
npm run seed
```

*(Note: If you do not have MongoDB running locally on port 27017, the server will automatically launch an in-memory MongoDB server instance seamlessly without any configuration required!)*

### 4. Start Development Servers
```bash
npm run dev
```
- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## 🔑 Demo Accounts & Instant Login

MessMeter features a **1-Click Quick Demo Login** button directly in the navigation bar and on the login page:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Student** | `student@messmeter.com` | `student123` | View menu, rate meals, file complaints, view scorecards |
| **Admin** | `admin@messmeter.com` | `admin123` | Analytics dashboard, menu scheduler, grievance manager, reports |
| **Hostel Warden** | `warden@messmeter.com` | `warden123` | Admin & inspection view |
| **Mess Head** | `manager@messmeter.com` | `manager123` | Admin kitchen operations |

---

## 📊 REST API Reference

### Authentication
- `POST /api/auth/register` — Register a new student account
- `POST /api/auth/login` — Sign in and obtain JWT
- `GET /api/auth/me` — Retrieve authenticated user profile

### Meals & Menu
- `GET /api/meals/today?date=YYYY-MM-DD` — Retrieve today's meals with user rating status
- `GET /api/meals` — List scheduled meals with date/mealType filters
- `POST /api/meals` — *(Admin)* Create a meal slot
- `PUT /api/meals/:id` — *(Admin)* Update a meal slot
- `DELETE /api/meals/:id` — *(Admin)* Remove a meal slot

### Dishes
- `GET /api/dishes` — List dish catalog
- `POST /api/dishes` — *(Admin)* Add new dish to catalog

### Ratings & Feedback
- `POST /api/ratings` — Submit multi-parameter rating and written feedback
- `GET /api/ratings/my` — Get authenticated student's rating history
- `GET /api/feedback` — List written feedback with sentiment/topic filters

### Complaints
- `POST /api/complaints` — File a complaint (supports anonymous mode and photos)
- `GET /api/complaints/my` — Get student's filed complaints
- `GET /api/complaints` — *(Admin)* List all complaints with filters
- `PUT /api/complaints/:id` — *(Admin)* Update status, priority, and post admin response

### Analytics (MongoDB Aggregation Endpoints)
- `GET /api/analytics/overview` — High-level KPI scorecard metrics
- `GET /api/analytics/trends?days=30` — Daily rating and hygiene trends
- `GET /api/analytics/meals` — Performance comparison by meal slot
- `GET /api/analytics/dishes` — Dish satisfaction rankings
- `GET /api/analytics/quality` — 6-parameter quality breakdown
- `GET /api/analytics/sentiment` — Sentiment breakdown and top topic mentions
- `GET /api/analytics/complaints` — Complaints grouped by category, status, priority
- `GET /api/analytics/insights` — Dynamic AI-generated operational recommendations

### Reports & Export
- `GET /api/reports/summary?type=weekly|monthly` — Audit summary
- `GET /api/reports/export?dataset=ratings|feedback|complaints` — Download raw CSV data

---

## 🌐 Production Deployment Guide

1. **Environment Variables**:
   Create a `.env` in `server/` with:
   ```env
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/messmeter?retryWrites=true&w=majority
   JWT_SECRET=your_production_secret_key
   CLIENT_URL=https://your-messmeter-client.vercel.app
   ```
2. **Build**:
   ```bash
   npm run build
   ```
3. **Start Production Server**:
   ```bash
   cd server && npm start
   ```

---

## 📄 License
This project is licensed under the MIT License. Built for collegiate mess improvement initiatives.
