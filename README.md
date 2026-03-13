# Lulu.ai - AI Nutrition & Exercise Tracker

## Overview
Lulu.ai is a comprehensive health platform featuring AI calorie scanning, smart workout tracking, and a virtual health coach. 

## Features
- **AI Calorie Scanner**: Upload food photos for instant macro analysis and nutritional breakdown.
- **Smart Dashboard & User Settings**: Real-time stats, daily goals, and highly customizable user preferences.
- **Exercise Library**: Curated workouts with logging, filtering, and progress tracking.
- **Coach Lulu**: AI-powered chat assistant providing tailored health advice and guidance.
- **Progress Analytics**: Visual weight, macronutrients, and health trends using animated charts.
- **Community Forum**: A platform to share updates, routines, and interact with other users.
- **Hydration Tracking**: Built-in dedicated module to log and evaluate daily water intake.
- **Admin Dashboard**: Comprehensive control panel to manage users, moderation, and systemic stats.
- **Full Authentication**: Secure user registration, authentication, and session management.

## Core Components
### Frontend (`frontend/src/`)
- **Pages**:
  - `Dashboard.jsx`: Central hub for user statistics and quick actions.
  - `Scanner.jsx`: Image upload and AI food identification interface.
  - `Coach.jsx`: Interface for interaction with the AI health coach.
  - `Exercises.jsx`: Library mapping and workout logging section.
  - `Progress.jsx`: Comprehensive data visualization page.
  - `Community.jsx`: Social feed and user-to-user interaction module.
  - `AdminDashboard.jsx`: Private admin-only management system.
  - `Settings.jsx`: User preference controls and account details management.
- **Components**:
  - `Layout.jsx` & `Sidebar.jsx`: Standardize view structure and site navigation mechanism.
  - `WaterTracker.jsx`: Integrated, highly focused module explicitly for tracking hydration goals.
  - `CreateContentModal.jsx`: Modal system allowing users to easily post content to the community.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Recharts
- **Backend**: FastAPI, Python (Ready for integration)

## How to Run

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (already done):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Backend (Optional for Demo)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the API server:
   ```bash
   uvicorn main:app --reload
   ```
