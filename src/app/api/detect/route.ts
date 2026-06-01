import { NextResponse } from "next/server";

import { env, hasDetector } from "@/lib/env";
import type { DetectorResponse, DetectorStatusResponse } from "@/lib/types";

export const runtime = "nodejs";

const offlineSummary: DetectorResponse = {
  items: [],
  summary: {
    dominantLabel: null,
    itemCount: 0,
    suggestedSeverity: "moderate",
    guidance:
      "Detector service is offline, so EarthMender is staying in manual review mode for now.",
  },
};

export async function GET() {
  const payload: DetectorStatusResponse = hasDetector
    ? {
        configured: true,
        mode: "fastapi",
        message: "FastAPI detector service is configured.",
      }
    : {
        configured: false,
        mode: "offline",
        message: "No detector endpoint configured yet.",
      };

  return NextResponse.json(payload);
}

export async function POST(request: Request) {
  if (!hasDetector) {
    return NextResponse.json(
      {
        ...offlineSummary,
        error:
          "Add DETECTOR_API_URL in .env.local and run the FastAPI detector to enable AI scanning.",
      },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Add an image file before requesting detector analysis." },
      { status: 400 },
    );
  }

  const upstreamForm = new FormData();
  upstreamForm.append("file", file, file.name);

  try {
    const response = await fetch(`${env.detectorApiUrl}/detect`, {
      method: "POST",
      body: upstreamForm,
      cache: "no-store",
    });

    const text = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            text ||
            "The detector service responded, but it could not complete the request.",
        },
        { status: response.status },
      );
    }

    return new NextResponse(text, {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      {
        ...offlineSummary,
        error:
          "The detector service could not be reached. Check that the FastAPI server is running.",
      },
      { status: 502 },
    );
  }
}
