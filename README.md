# earthmender

earthmender is a clean, mobile-first rebuild of the original Streamlit project.
This version is intentionally lighter:

- `Next.js` for the product UI
- `FastAPI` for waste detection using your `best.pt`
- `Appwrite` integrated for cloud database sync, OAuth, user profiles, image storage, and real-time updates

## Run the app

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

## Run the detector

```powershell
cd detector_service
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

If your model is not placed at `detector_service\models\best.pt`, set:

```powershell
$env:EARTHMENDER_MODEL_PATH="C:\Users\USER\Documents\Python Project\EarthMender-AI\best.pt"
```

Then go back to the app root and start Next.js.

## What ships in this clean rebuild

- launch-ready homepage
- report studio with high-precision geolocation, Camera-First Zero-Text accessibility (automatic AI scanning, optional inputs, auto-generated metadata), and multilingual audio voice guides (English, Yorùbá, Pidgin) with speech synthesis fallback
- detector proxy route
- territory board
- report history and status updates
- operational insights
- learning module

## Setup notes

- frontend and local data guide: `docs/SETUP.md`
- Appwrite backend database/storage setup script: `setup-appwrite.js`
- detector service notes: `detector_service/README.md`

