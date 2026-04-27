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

## 🏗️ Architecture & How It Works

PhishMind AI operates on a modern, decoupled architecture:

1.  **The Brain (Backend)**: Built with **Python (FastAPI)** and **PostgreSQL**. It orchestrates the generation of campaigns via the Gemini AI API, dispatches emails using Resend, and tracks critical interaction events (opens, clicks, reports). 
2.  **The Interface (Frontend)**: A sleek **React 18 + Vite** Single Page Application styled with **Tailwind CSS**. It provides security administrators with a command center to launch campaigns and visualize data via Recharts.
3.  **The Engine (Analytics)**: As users interact with simulations, the backend calculates risk adjustments. A click increases risk, while a report decreases it, continuously updating the organization's security posture profile.

---

## 🛠️ Getting Started

### Prerequisites
*   Node.js (v18+)
*   Python 3.10+
*   PostgreSQL
*   Gemini API Key
*   Resend API Key

### 1. Backend Setup (FastAPI)
Navigate to the backend directory, set up your virtual environment, and install dependencies:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Configure your environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials and API keys
```

Initialize the database and start the server:
```bash
python seed.py
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup (React + Vite)
Open a new terminal, navigate to the frontend directory, install dependencies, and start the development server:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` and will proxy API requests to your local backend.

---

## 👥 Meet the Developers

**PhishMind AI** is proudly developed and maintained by **Team SentraCore LLC**. 

At SentraCore, we specialize in building advanced, security-first solutions that bridge the gap between human behavior and technical defense. Our mission is to empower organizations with actionable intelligence to outsmart tomorrow's threats today.

*Developed with precision, security, and a relentless focus on the human element.*
