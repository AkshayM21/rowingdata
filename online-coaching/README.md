# C150 Online Coaching

A performance analytics platform built for the Columbia University Lightweight Rowing Team, providing coaches with data-driven insights for athlete development and race selection.

<h1 align="center">
	<img src="public/C150_homepage.png" alt="C150 Homepage">
</h1>

## Overview

This project addresses a real coaching challenge: lightweight rowing coaches lacked accessible tools to analyze athlete physiological data from RP3 rowing machines. C150 Online Coaching provides a centralized platform where coaches can:

- **Track athlete performance** over time with detailed metrics
- **Analyze force curves** and stroke consistency
- **Monitor training stress** using heart rate zone calculations
- **Compare race results** across the team

## Key Features

- **Google OAuth Authentication** - Secure role-based access for coaches and athletes
- **Automated Data Processing** - Upload RP3 CSV files and get instant analysis
- **Force Profile Visualization** - Plot force curves with variance analysis
- **Training Stress Scores** - Calculate hrTSS from heart rate data
- **Race Results Dashboard** - Track boat class rankings and performance trends

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 17, Material-UI 5 |
| Backend | Flask (Python 3.9) |
| Database | Firebase Firestore |
| Storage | Firebase Cloud Storage |
| Auth | Firebase Authentication + Google OAuth |
| Hosting | Google Cloud Run (Docker) |
| Data Science | pandas, NumPy, matplotlib |
| ML (WIP) | TensorFlow - stroke classification |

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  React Frontend │────▶│   Flask API     │────▶│    Firebase     │
│   (Cloud Run)   │     │  (Cloud Run)    │     │  (Firestore +   │
│                 │◀────│                 │◀────│   Storage)      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Data Processing

The platform processes RP3 rowing machine CSV exports, extracting:

- **Stroke metrics**: power, stroke rate, stroke length, energy per stroke
- **Force curves**: raw force data per stroke for profile analysis
- **Heart rate**: pulse data for training stress calculations
- **Variance analysis**: IMSE (Integrated Mean Squared Error) for stroke consistency

---

## Getting Started

### Prerequisites

- Node.js 16+
- Python 3.9+
- Firebase project with Firestore and Storage enabled
- Google Cloud project for OAuth

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AkshayM21/rowingdata.git
   cd rowingdata/online-coaching
   ```

2. **Set up environment variables**
   ```bash
   # Frontend
   cp .env.example .env
   # Edit .env with your Firebase configuration

   # Backend
   cp api/.env.example api/.env
   cp api/firebase-service-account.example.json api/firebase-service-account.json
   # Edit with your credentials
   ```

3. **Install frontend dependencies**
   ```bash
   npm install
   ```

4. **Set up backend**
   ```bash
   cd api
   python -m venv venv
   source venv/bin/activate  # or `venv\Scripts\activate` on Windows
   pip install -r requirements.txt
   ```

5. **Run locally**
   ```bash
   # Terminal 1 - Backend
   cd api && flask run

   # Terminal 2 - Frontend
   npm start
   ```

### Configuration Files

| File | Purpose |
|------|---------|
| `.env` | Frontend Firebase configuration |
| `api/.env` | Backend environment variables |
| `api/firebase-service-account.json` | Firebase Admin SDK credentials |
| `api/credentials.json` | Google OAuth credentials (for email features) |

## Project Structure

```
online-coaching/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   ├── providers/          # Context providers (Auth, Dialogs)
│   ├── services/           # Firebase configuration
│   └── Pages/              # Page components
├── api/
│   ├── app.py              # Flask application & routes
│   ├── CSVs/               # Sample data (anonymized)
│   ├── parsing.py          # RP3 data parsing logic
│   └── requirements.txt    # Python dependencies
└── README.md
```

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api` | GET | Health check |
| `/auth` | GET | Verify Firebase token and user role |
| `/workouts` | GET | Fetch all workouts for a rower |
| `/graphs` | GET | Retrieve force profile and stroke variance PNGs |
| `/sors` | GET | Fetch RP3 test results |
| `/rowers` | GET | Get list of all rower IDs |
| `/settings` | POST | Save rower FTP and HR zone settings |
| `/submit` | POST | Upload and process new workout CSV |

## License

This project was developed for Columbia University Lightweight Rowing. Sample data has been anonymized for portfolio purposes.

## Contact

**Akshay Manglik** - [GitHub](https://github.com/AkshayM21)
