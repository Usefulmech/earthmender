# earthmender setup

## 1. Frontend

From `C:\Users\USER\Documents\Python Project\earthmender`:

```powershell
Copy-Item .env.example .env.local
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

## 2. Detector service

From `C:\Users\USER\Documents\Python Project\earthmender\detector_service`:

```powershell
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Then make sure `.env.local` contains:

```env
DETECTOR_API_URL=http://127.0.0.1:8000
```

## 3. Model path

The detector checks these locations in order:

1. `EARTHMENDER_MODEL_PATH`
2. `detector_service\models\best.pt`
3. `C:\Users\USER\Documents\Python Project\EarthMender-AI\best.pt`

If your model already exists in the old project folder, you can use that path directly without duplicating the file.

## 4. Current storage mode

This rebuild saves reports in browser local storage for now. That means:

- the app works immediately without backend setup
- reports remain on the same browser/profile
- syncing across devices comes later with Supabase

## 5. Recommended next upgrade

When you are ready for cloud sync and auth:

- create a Supabase project
- add auth
- move local reports into a `reports` table
- store uploaded images in a `report-images` bucket

The schema direction is outlined in `docs/SUPABASE_GUIDE.md`.
