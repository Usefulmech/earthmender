from io import BytesIO
import os
from pathlib import Path
from urllib.request import urlopen

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from ultralytics import YOLO


APP_ROOT = Path(__file__).resolve().parent
DEFAULT_MODEL_PATH = APP_ROOT / "models" / "best.pt"
DEFAULT_ONNX_PATH = APP_ROOT / "models" / "best.onnx"
FALLBACK_MODEL_PATH = APP_ROOT.parent.parent / "EarthMender-AI" / "best.pt"

GUIDANCE_BY_LABEL = {
    "plastic_bottle": "Separate bottles quickly so they do not slide into mixed drain waste.",
    "water_sachet": "Bag sachets together because they are easy to lose and hard to recover once mixed.",
    "polythene_bag": "Keep bags dry and contained to prevent wind spread and drain blockage.",
    "disposable": "Handle mixed disposable waste carefully and contain sharps if any are present.",
    "waste_container": "Check whether overflow or missed pickup is driving repeat dumping around the container.",
}


def resolve_model_path() -> Path | None:
    env_path = os.getenv("EARTHMENDER_MODEL_PATH")
    if env_path and Path(env_path).exists():
        return Path(env_path)
    if DEFAULT_ONNX_PATH.exists():
        return DEFAULT_ONNX_PATH
    if DEFAULT_MODEL_PATH.exists():
        return DEFAULT_MODEL_PATH
    if FALLBACK_MODEL_PATH.exists():
        return FALLBACK_MODEL_PATH
    return None


def ensure_model_from_url() -> None:
    model_url = os.getenv("EARTHMENDER_MODEL_URL")
    if not model_url:
        return

    models_dir = APP_ROOT / "models"
    models_dir.mkdir(parents=True, exist_ok=True)

    filename = model_url.split("?")[0].rstrip("/").split("/")[-1] or "best.onnx"
    target = models_dir / filename

    if target.exists():
        return

    with urlopen(model_url) as response:
        data = response.read()
        target.write_bytes(data)


ensure_model_from_url()
MODEL_PATH = resolve_model_path()
MODEL = YOLO(str(MODEL_PATH)) if MODEL_PATH else None

app = FastAPI(title="earthmender detector", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def suggest_severity(item_count: int, best_confidence: float) -> str:
    if item_count >= 6 or best_confidence >= 0.9:
        return "high"
    if item_count >= 3 or best_confidence >= 0.75:
        return "moderate"
    if item_count >= 1:
        return "low"
    return "moderate"


@app.get("/health")
def health():
    return {
        "configured": MODEL is not None,
        "model_path": str(MODEL_PATH) if MODEL_PATH else None,
        "model_type": MODEL_PATH.suffix if MODEL_PATH else None,
    }


@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    if MODEL is None:
        raise HTTPException(
            status_code=503,
            detail="No model was found. Set EARTHMENDER_MODEL_PATH or place best.pt in detector_service/models.",
        )

    raw = await file.read()
    if not raw:
        raise HTTPException(status_code=400, detail="The uploaded file was empty.")

    image = Image.open(BytesIO(raw)).convert("RGB")
    # Prefer lower resolution for CPU deploys. If you need better accuracy, raise imgsz.
    result = MODEL.predict(source=image, conf=0.25, imgsz=640, verbose=False)[0]

    items = []
    best_label = None
    best_confidence = 0.0

    names = result.names

    for box in result.boxes:
        class_id = int(box.cls[0].item())
        label = names[class_id] if isinstance(names, list) else names.get(class_id, str(class_id))
        try:
            import json, ast
            # Safely evaluate in case it's a string representation of a dict like "{'id': 1, 'name': 'plastic_bottle'}"
            parsed = ast.literal_eval(label)
            if isinstance(parsed, dict):
                label = parsed.get("name", parsed.get("class", label))
        except Exception:
            pass
        confidence = float(box.conf[0].item())
        coords = [float(value) for value in box.xyxy[0].tolist()]

        if confidence > best_confidence:
            best_confidence = confidence
            best_label = label

        items.append(
            {
                "label": label,
                "confidence": confidence,
                "bbox": {
                    "x1": coords[0],
                    "y1": coords[1],
                    "x2": coords[2],
                    "y2": coords[3],
                },
            }
        )

    guidance = (
        GUIDANCE_BY_LABEL.get(best_label, "Review the site and contain loose waste before it spreads.")
        if best_label
        else "No strong class was detected. Keep the report and continue with manual review."
    )

    return {
        "items": items,
        "model": MODEL_PATH.name if MODEL_PATH else None,
        "summary": {
            "dominantLabel": best_label,
            "itemCount": len(items),
            "suggestedSeverity": suggest_severity(len(items), best_confidence),
            "guidance": guidance,
        },
    }
