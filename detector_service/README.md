# detector service

This is the simple FastAPI replacement for the previous Modal-based plan.

## Run locally

```powershell
cd "C:\Users\USER\Documents\Python Project\earthmender\detector_service"
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

## Model lookup order

The service looks for your trained detector in this order:

1. `EARTHMENDER_MODEL_PATH`
2. `EARTHMENDER_MODEL_URL` (downloads into `detector_service/models/` on startup)
3. `detector_service\models\best.onnx` (preferred for CPU speed)
4. `detector_service\models\best.pt`
5. `C:\Users\USER\Documents\Python Project\EarthMender-AI\best.pt`

### ONNX vs .pt (speed advice)

- For **Render CPU** deploys, export to **ONNX** and run with `onnxruntime` (usually faster).
- Keep `best.pt` as a fallback.

## Test it

Health:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/health
```

When the frontend is running, `POST /api/detect` in Next.js will proxy files to this service automatically.
