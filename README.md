# 🌍 Earthmender

> **Empowering communities to heal the planet, one scan at a time.**

Earthmender is a modern, mobile-first civic technology platform designed to bridge the gap between everyday citizens ("Menders") and professional waste cleanup operators. By combining cutting-edge AI object detection with real-time geospatial tracking, Earthmender makes environmental cleanup fast, accessible, and highly efficient.

---

## ✨ Core Features

### 📸 AI-Powered Waste Detection
At the heart of Earthmender is a custom-trained computer vision model (powered by YOLOv8/FastAPI). Menders simply snap a photo of a waste hotspot. The AI instantly analyzes the image, classifies the waste type, assigns a priority severity, and automatically routes it to the appropriate local operator.

### 📍 Live Tracking Navigation (In-App)
Operators don't need to jump between external map apps. Earthmender features a fully integrated **Live Action Map** utilizing the Open Source Routing Machine (OSRM). When an operator clicks "Get Directions" on a report:
- The app generates an optimal driving route overlaid directly on the Leaflet map.
- A **live-tracking blue dot** taps into the browser's `watchPosition()` API, physically moving along the route as the operator drives to the target hotspot.

### 🛡️ Mender TrustScore
Quality reporting is rewarded! Earthmender features a dynamic reputation system. Menders earn **TrustPoints** for submitting accurate reports, getting their reports verified and resolved by operators, and engaging with the platform. A higher TrustScore grants Menders "Local Hero" status, ensuring their future reports are prioritized in the operator queue.

### 🎤 Zero-Text Reporting
We believe civic action should have zero barriers. The **Report Studio** requires absolutely no typing. It features:
- **Automatic metadata generation**: We seamlessly extract GPS coordinates, timestamps, and AI tags directly from the user's snapshot.
- **One-Tap Submission**: Users just snap a photo, and the AI handles the rest, making the reporting process entirely friction-free.

### ♻️ Live Available Collection Points
Earthmender empowers citizens to actively participate in the circular economy by providing real-time visibility into nearby recycling and drop-off hubs. Menders can easily locate active collection points to drop off sorted waste directly, fostering community-driven recycling efforts.

### ☁️ Robust Cloud Sync
Built on top of **Appwrite**, the platform seamlessly handles secure user authentication (OAuth), profile management, real-time database syncing between Menders and Operators, and cloud image storage.

---

## 🛠️ Technology Stack

**Frontend (Product UI):**
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS, Framer Motion
- **Maps**: React-Leaflet, OSRM API
- **State/Auth**: React Hooks, Appwrite Web SDK

**Backend (AI Detector Service):**
- **Framework**: FastAPI (Python)
- **AI/ML**: Custom `best.pt` model (YOLO format)
- **Deployment**: Uvicorn

---

## 🚀 Getting Started

### 1. Run the Web Platform

```powershell
# Install dependencies
npm install

# Setup your local environment variables
Copy-Item .env.example .env.local

# Start the Next.js development server
npm run dev
```

### 2. Run the AI Detector Service

Open a new terminal window:

```powershell
cd detector_service
pip install -r requirements.txt

# Start the FastAPI detector backend
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

*(Note: If your custom model is not located at `detector_service\models\best.pt`, you can specify its path by setting the `$env:EARTHMENDER_MODEL_PATH` variable before starting the server).*

---

## 📚 Documentation & Setup Notes

- **Frontend & Appwrite Setup**: Check out `docs/SETUP.md` for a detailed guide on configuring your local `.env` and Appwrite project.
- **Database Initialization**: Run `node setup-appwrite.js` to automatically provision the required Appwrite collections and storage buckets.
- **Detector Service Details**: See `detector_service/README.md` for API endpoint specs and model integration notes.

---

*This project is **v2 of the revamped Earthmender**, proudly submitted for the **3MTT Knowledge Showcase 1.0 2026**.*
