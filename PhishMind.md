# 🛡️ PhishMind AI

**Next-Generation Cyber Risk Intelligence & Awareness Platform**

PhishMind AI is an enterprise-grade platform designed to proactively measure, track, and mitigate human-layer security risks. By leveraging advanced AI models to generate hyper-realistic phishing simulations, PhishMind identifies vulnerabilities within your organization and provides targeted training to fortify your first line of defense.

---

## 🚀 Key Features

*   **🧠 AI-Powered Simulations**: Dynamically generated, sophisticated phishing campaigns utilizing Gemini AI to mimic real-world threat actors.
*   **📊 Dynamic Risk Scoring**: Real-time evaluation of employee vulnerability based on interaction metrics, creating a quantifiable Human Risk Score.
*   **🎯 Targeted Awareness**: Context-aware, just-in-time training modules deployed instantly when a simulated threat is engaged.
*   **📈 Enterprise Dashboard**: A dark-mode, minimal, and highly responsive React frontend offering deep analytics, campaign tracking, and risk trend visualization.
*   **⚡ High-Performance Backend**: A robust, event-driven FastAPI architecture backed by PostgreSQL, designed for scalability and strict security.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework**: [React 19](https://react.dev/) (Vite)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
*   **State Management**: [TanStack Query v5](https://tanstack.com/query)
*   **Charts**: [Recharts](https://recharts.org/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Routing**: [React Router 7](https://reactrouter.com/)

### Backend
*   **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
*   **ORM**: [SQLAlchemy](https://www.sqlalchemy.org/)
*   **Database**: [PostgreSQL](https://www.postgresql.org/)
*   **Validation**: [Pydantic v2](https://docs.pydantic.dev/)
*   **AI Engine**: [Google Gemini AI](https://ai.google.dev/)
*   **Email Service**: [Resend](https://resend.com/)

---

## 🏗️ Architecture & How It Works

PhishMind AI operates on a modern, decoupled architecture:

1.  **The Brain (Backend)**: Built with **Python (FastAPI)** and **PostgreSQL**. It orchestrates the generation of campaigns via the Gemini AI API, dispatches emails using Resend, and tracks critical interaction events (opens, clicks, reports). 
2.  **The Interface (Frontend)**: A sleek **React 18 + Vite** Single Page Application styled with **Tailwind CSS**. It provides security administrators with a command center to launch campaigns and visualize data via Recharts.
3.  **The Engine (Analytics)**: As users interact with simulations, the backend calculates risk adjustments. A click increases risk, while a report decreases it, continuously updating the organization's security posture profile.

---

## 🏃 Run Instructions

### Prerequisites
*   **Node.js**: v18.0.0 or higher
*   **Python**: v3.10.0 or higher
*   **PostgreSQL**: A running instance with a database created for PhishMind.
*   **API Keys**:
    *   `GOOGLE_API_KEY` (from [Google AI Studio](https://aistudio.google.com/))
    *   `RESEND_API_KEY` (from [Resend](https://resend.com/))

### 1. Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment:
    ```bash
    python -m venv venv
    # Windows:
    venv\Scripts\activate
    # macOS/Linux:
    source venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Configure environment:
    ```bash
    cp .env.example .env
    # Update .env with your DATABASE_URL, GOOGLE_API_KEY, and RESEND_API_KEY
    ```
5.  Seed the database (Initial data):
    ```bash
    python seed.py
    ```
6.  Start the FastAPI server:
    ```bash
    uvicorn main:app --reload --port 8000
    ```

### 2. Frontend Setup
1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    # OR if you prefer pnpm
    pnpm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Access the dashboard at `http://localhost:5173`.

---

## 👥 Meet the Developers

**PhishMind AI** is proudly developed and maintained by **Team SentraCore LLC**. 

At SentraCore, we specialize in building advanced, security-first solutions that bridge the gap between human behavior and technical defense. Our mission is to empower organizations with actionable intelligence to outsmart tomorrow's threats today.

*Developed with precision, security, and a relentless focus on the human element.*
