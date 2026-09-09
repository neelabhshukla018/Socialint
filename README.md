# 🚀 SocialIntel — AI-Powered Social Intelligence Platform

<p align="center">
  <strong>Transform raw social media signals into actionable intelligence, sentiment analysis, and influence mapping.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Express-5.1-black?style=for-the-badge&logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/Prisma-8.0_Postgres-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/Google_Gemini-GenAI-8E75B2?style=for-the-badge&logo=google" alt="Google Gemini" />
  <img src="https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk" alt="Clerk" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
</p>

---

## 📖 Overview

**SocialIntel** is a comprehensive, enterprise-grade social intelligence and analytics platform designed to track brands, individuals, and viral campaigns across multiple social ecosystems. Powered by **Google Gemini** for generative intelligence and **Apify** for web-scale scraping, SocialIntel automates the process of data collection, sentiment evaluation, audience breakdown, and influence network visualization.

---

## ✨ Key Features

- **🤖 AI-Powered Post Analysis**:
  - Semantic content classification and key takeaway extraction using Google Gemini models.
  - Multi-dimensional sentiment scoring (Positive, Neutral, Negative) with intensity ratings.
  - Contextual engagement evaluation and virality indicators.

- **🌐 Multi-Platform Data Ingestion**:
  - Integrated scraping engine (via Apify) targeting Instagram posts, comments, reels, and profiles.
  - Extensible data connectors for **X (Twitter)**, **YouTube**, and **Telegram**.

- **📈 Trend & Momentum Radar**:
  - Live tracking of trending keywords, hashtags, and topic spikes.
  - Momentum metrics calculating growth velocity and ranking over time.

- **👥 Audience & Psychographic Insights**:
  - Deep breakdown of demographic segments, audience affinity, and sentiment behavior.
  - Visual charts showing audience distribution and engagement habits.

- **🕸️ Influence & Network Mapping**:
  - Interactive node-and-link network mapping depicting influencer connections, interaction strengths, and communication hubs.
  - Quantitative influence scoring based on reach, mentions, and reply frequency.

- **📑 Automated Executive Reports**:
  - Generate comprehensive analytical digests and exportable intelligence summaries.

- **🔐 Enterprise Authentication**:
  - Secure authentication and user identity management powered by **Clerk** (supporting SSO, OAuth, and email login).

- **🎨 Modern Dark-Mode UI**:
  - Built with Next.js 16 App Router, React 19, Tailwind CSS v4, Framer Motion, and Recharts.
  - Interactive widgets, bento grids, 3D card perspectives, and micro-animations.

---

## 🛠️ Architecture & Tech Stack

### Frontend
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Visualizations**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Authentication**: [@clerk/nextjs](https://clerk.com/)

### Backend
- **Runtime & Framework**: [Node.js](https://nodejs.org/) with [Express 5](https://expressjs.com/)
- **Language**: TypeScript (`tsx` execution engine)
- **Database & ORM**: PostgreSQL with [Prisma](https://www.prisma.io/) (using `@prisma/orm-postgres`)
- **AI & LLMs**: [Google Gemini GenAI SDK](https://github.com/google/generative-ai-js) (`@google/genai`)
- **Web Scraping**: [Apify Client](https://docs.apify.com/api/client/js/)
- **Authentication Middleware**: [@clerk/express](https://clerk.com/)

---

## 📂 Project Structure

```bash
Socialint/
├── backend/                       # Express + Prisma Backend API
│   ├── migrations/                # Database migration history
│   ├── src/
│   │   ├── controllers/           # API request handlers
│   │   ├── middleware/            # Auth & validation middlewares
│   │   ├── prisma/                # Prisma schema, contracts & client
│   │   │   ├── contract.prisma    # Data models & enums
│   │   │   └── db.ts              # Database connection instance
│   │   ├── routes/                # Express API route declarations
│   │   │   ├── analytics.routes.ts
│   │   │   ├── audience.routes.ts
│   │   │   ├── dataSource.routes.ts
│   │   │   ├── influence.routes.ts
│   │   │   ├── post.routes.ts
│   │   │   ├── postAnalysis.routes.ts
│   │   │   ├── report.routes.ts
│   │   │   ├── settings.routes.ts
│   │   │   └── trend.routes.ts
│   │   ├── services/              # Business logic & 3rd-party integrations
│   │   │   ├── analytics.service.ts
│   │   │   ├── audience.service.ts
│   │   │   ├── dataSource.service.ts
│   │   │   ├── instagram.service.ts
│   │   │   ├── postAnalysis.service.ts # Gemini AI & Apify pipelines
│   │   │   └── trend.service.ts
│   │   ├── app.ts                 # Express application configuration
│   │   └── server.ts              # Entry point (HTTP server)
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                      # Next.js 16 Web Application
    ├── app/                       # App Router structure
    │   ├── analytics/             # Detailed metrics & analytics
    │   ├── audience/              # Audience psychographics & demographics
    │   ├── components/            # Reusable UI components & layouts
    │   │   ├── ui/                # Aceternity-style visual elements (bento, cards, etc.)
    │   │   ├── Dashboard.tsx      # Main user command center
    │   │   └── LandingPage.tsx    # Interactive marketing landing page
    │   ├── create-profile/        # Profile & entity onboarding wizard
    │   ├── data-sources/          # Social platform connection manager
    │   ├── influence/             # Visual influencer network graph
    │   ├── posts-analysis/        # Real-time post & sentiment inspector
    │   ├── reports/               # Executive report generation & exports
    │   ├── settings/              # User preferences & account configuration
    │   ├── sign-in/ & sign-up/    # Clerk authentication views
    │   ├── trends/                # Trending hashtags & topics dashboard
    │   ├── globals.css            # Custom CSS & Tailwind tokens
    │   ├── layout.tsx             # Root layout with ClerkProvider
    │   └── page.tsx               # Entry router (signed-in vs guest)
    ├── src/
    │   └── lib/                   # API client utilities & helpers
    ├── package.json
    └── tsconfig.json
```

---

## ⚡ Quick Start

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (version 20.x or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) (version 15 or higher)
- [Git](https://git-scm.com/)

Accounts / API Keys needed:
- **[Clerk Account](https://clerk.com/)** for authentication.
- **[Google AI Studio](https://aistudio.google.com/)** key for Gemini AI.
- **[Apify Account](https://apify.com/)** API token for automated social scrapers.

---

### 1. Clone the Repository

```bash
git clone https://github.com/neelabhshukla018/Socialint.git
cd Socialint
```

---

### 2. Backend Setup

1. **Navigate to the backend folder and install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env` file in the `backend/` directory:
   ```env
   # Server Port
   PORT=5000

   # Database Connection
   DATABASE_URL="postgresql://user:password@localhost:5432/socialintel_db?schema=public"

   # Authentication (Clerk)
   CLERK_PUBLISHABLE_KEY="pk_test_..."
   CLERK_SECRET_KEY="sk_test_..."

   # AI & Data Ingestion
   GEMINI_API_KEY="your_google_gemini_api_key"
   GEMINI_MODEL="gemini-2.5-flash"
   APIFY_API_TOKEN="your_apify_api_token"
   ```

3. **Database Migration & Prisma Setup**:
   ```bash
   npm run contract:emit
   ```

4. **Start the backend development server**:
   ```bash
   npm run dev
   ```
   *The backend will boot up at `http://localhost:5000`.*

---

### 3. Frontend Setup

1. **Open a new terminal, navigate to `frontend/` and install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env.local` file in the `frontend/` directory:
   ```env
   # Backend API Endpoint
   NEXT_PUBLIC_API_URL="http://localhost:5000"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
   CLERK_SECRET_KEY="sk_test_..."

   # Clerk Routing paths
   NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
   NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"
   ```

3. **Start the frontend application**:
   ```bash
   npm run dev
   ```
   *The frontend application will be live at `http://localhost:3000`.*

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API status and greeting |
| `GET` | `/api/health` | Healthcheck verification |
| `GET` / `POST` | `/api/data-sources` | Manage connected platforms (Instagram, X, etc.) |
| `GET` / `POST` | `/api/posts` | Fetch and query collected social media posts |
| `POST` | `/api/post-analysis/analyze` | Run Gemini AI sentiment & engagement analysis on posts |
| `GET` | `/api/trends` | Retrieve trending topics, hashtags, and momentum |
| `GET` | `/api/audience` | Query audience demographic and behavioral insights |
| `GET` | `/api/influence` | Retrieve influencer network nodes and connection edges |
| `GET` / `POST` | `/api/reports` | Generate and view intelligence reports |
| `GET` / `PUT` | `/api/settings` | Retrieve and update user preferences |

---

## 🛡️ Security & Best Practices

- **Token Isolation**: Secrets such as `GEMINI_API_KEY`, `APIFY_API_TOKEN`, and `CLERK_SECRET_KEY` are kept strictly in backend environment variables and are never leaked to the client bundle.
- **Protected Endpoints**: Clerk session middleware validates active tokens before granting access to sensitive profile and analysis endpoints.
- **Rate-Limiting & Scraping Safety**: Scraping jobs are dispatched asynchronously to prevent blocking the Node.js event loop.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
