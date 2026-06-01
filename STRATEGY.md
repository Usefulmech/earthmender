# EarthMender — Product Strategy & Sustainability Roadmap

> **Living Document** — Updated as features ship. Last sync: April 2026 (MVP Phase).

---

## Executive Summary

EarthMender is a civic waste-intelligence platform connecting **Menders** (reporters on the ground) with **Operators** (waste collectors and PSPs). The core value proposition is converting informal, fragmented waste sightings into structured, actionable environmental data — and monetizing that data layer while keeping the civic action layer free.

> The analogy: OpenStreetMap powers free civic use, but **commercial products are built on top of the data**. EarthMender does the same for waste.

---

## Part 1 — Sustainability Architecture

### 1.1 Data Flywheel (The Core Engine)

The platform is self-reinforcing:

```
Mender snaps report → AI classifies waste type & severity
        ↓
Operator acts on it → Resolution logged
        ↓
Data grows richer → AI gets smarter → Better recommendations
        ↓
Better outcomes → More trust → More Menders & Operators join
```

Each completed report cycle improves the next one. This is the **moat** — a dataset of geotagged, classified Nigerian waste events that no competitor can easily replicate.

### 1.2 Trust Score System
**Status: `[x] Shipped — Database trust score integration. Every mender profile is initialized with a trust score of 50. Resolving a report adds +10 to the reporting mender's score in real-time, syncing directly with the Appwrite backend.`**

- Every Mender starts at 50 trust (scalable range 1 to 10000).
- Reports that get resolved by Operators confirm the Mender's accuracy → score goes up by 10 points.
- Spam or low-quality reports (no photo, vague location) flag → score goes down.
- High-trust Menders unlock: Verified badge, leaderboard visibility, priority on Operator queue.

> This prevents spam, rewards quality, and builds a self-governing community without manual moderation.

### 1.3 Operator Coverage Accountability
**Status: `[x] Shipped — coverageLGA stored on Operator profile`**

Operators declare their LGA. The platform surfaces unresolved reports in their declared territory. This creates passive accountability — Operators are incentivised to keep their zone green.

### 1.4 AI Classification & Community Dataset
**Status: `[ ] Planned — FastAPI endpoint, Phase 2`**

- Each uploaded image + AI label pair becomes a training data point.
- Over time, EarthMender builds a **Nigeria-specific waste classification dataset** — something that doesn't exist today.
- This dataset is an asset with standalone value (research, government, NGO licensing).

---

## Part 2 — Revenue Streams

### 2.1 🏢 Operator SaaS Subscription *(Primary B2B Revenue)*
**Status: `[ ] Planned — pricing tier, Phase 3`**

**Who pays:** Licensed PSPs (e.g., LAWMA-accredited operators), private waste companies (Visionscape, Wecyclers commercial arm), and eventually state/municipal waste agencies.

**What they get:**
- Full Operator dashboard (Queue, Map, Insights)
- Real-time alerts for new reports in their LGA
- Monthly resolution rate reports (exportable)
- API access to zone-level heatmaps

**Pricing Model (Draft):**
| Tier | Price | Limits |
|---|---|---|
| Starter (PSP) | ₦15,000/month | 1 LGA, 2 users |
| Growth | ₦45,000/month | 5 LGAs, 10 users |
| Enterprise (State/Municipal) | Custom | Unlimited zones, white-label |

> **Implementation note:** Gating the Operator dashboard behind a subscription needs an `isSubscribed` flag on the profile + a payment integration (Paystack is the obvious choice for Nigeria).

---

### 2.2 📊 Data Intelligence Reports *(B2G / B2B2G Revenue)*
**Status: `[ ] Planned — Phase 4`**

**Who pays:** Lagos State Ministry of Environment, NESREA, international NGOs (GEF, UNEP), development banks (AfDB, World Bank IFC), FMCG sustainability desks (Nestlé, Unilever).

**What they buy:**
- Quarterly waste pressure reports by LGA
- Trend analysis: "Plastic volume up 40% in Alimosho since Q1"
- Custom data pulls: "Show me all E-waste sightings in Ikeja corridor over 12 months"
- Anonymised, aggregated CSV/API exports for research

**Pricing Model:** ₦500,000–₦5,000,000 per commissioned report depending on scope.

> This is the **highest margin** revenue stream. No incremental cost — the data exists from regular platform use.

---

### 2.3 ♻️ Recycler Referral Commission *(Partnership Revenue)*
**Status: `[ ] Planned — depends on logistics partnership deals`**

**Partners:** Wecyclers, Scrapays, Hinckley E-Waste, EPRON.

**How it works:**
1. Mender reports PET plastic dump.
2. AI recommends nearest Wecyclers hub.
3. Mender taps "Request Pickup."
4. Wecyclers is notified. If pickup happens, EarthMender earns 5–10% of the waste value or a flat ₦500 referral fee.

**Implementation note:** Requires a partner webhook/API or even just a WhatsApp Business handoff in the short term. The Drop-off Hubs feature is the **foundation** for this.

---

### 2.4 🌍 Carbon Credit Integration *(Long-Term High-Value)*
**Status: `[ ] Research phase — Phase 5+`**

**The opportunity:** Under Verra's VCS or Gold Standard frameworks, **verified waste diversion from landfill generates carbon credits**. A tonne of PET plastic diverted = roughly 1.5–2 tCO2e avoided.

**EarthMender's role:**
- The platform already timestamps, geolocates, and classifies waste.
- With minor additions (weight estimation via AI, Operator confirmation), each resolved report can become a **verified diversion event**.
- Stack 10,000 events → apply for VCS project certification → sell credits on Xpansiv or directly to corporates.

**Revenue potential:** $10–$25 per credit. Even at 1,000 tCO2e/year verified, that's **$10,000–$25,000 ARR from carbon alone** — growing exponentially as the platform scales.

> This is the **biggest long-term bet** and the most defensible moat vs any competitor.

---

### 2.5 🎯 Brand Sustainability Sponsorships *(B2B Marketing Revenue)*
**Status: `[ ] Planned — Phase 3+`**

**Who pays:** FMCG companies with Nigerian plastic footprints (Coca-Cola HBC Nigeria, Nestlé, Unilever, Guinness).

**What they get:**
- "Powered by [Brand]" on the EarthMender cleanup events feature
- Monthly impact reports: "Your sponsorship funded 240 cleanup events resolving 1.2 tonnes of waste"
- ESG reporting data (increasingly mandatory for listed companies)
- Co-branded Mender rewards (e.g., "Top Mender of the Month, sponsored by Nestlé Nigeria")

**Pricing:** ₦2M–₦10M/year per sponsor depending on visibility tier.

---

### 2.6 🏆 Premium Mender Features *(Freemium / Consumer Revenue)*
**Status: `[ ] Planned — Phase 4`**

Keep core reporting free. Charge for:
- **Verified EarthMender badge** — shareable digital certificate for CVs, LinkedIn
- **Impact passport** — personalised PDF of all your reports + environmental impact (tonnes diverted, zones cleaned)
- **Leaderboard visibility** — compete for Top Mender in your LGA
- **Early access to AI features**

**Price:** ₦500–₦2,000/year. Low ARPU but high volume potential.

---

### Part 2.7 🌍 Camera-First Zero-Text Accessibility Flow
**Status: `[x] Shipped (May 2026)`**

To resolve language and literacy barriers for local users (including elderly community menders), the reporting workflow uses a simplified **Camera-First Snap and Send** structure:
- **Snap-First Landing Screen**: The app opens directly to a camera/gallery selection card. Text fields and impact tags are hidden until a photo is snapped or selected, keeping the experience simple.
- **Multilingual Audio Voice Guides**: Audio voice guides are integrated on the landing screen (English, Yorùbá, and Pidgin) to read reporting instructions out loud. Playback attempts to use high-quality local MP3 assets with a seamless fallback to the browser's native Web Speech Synthesis API (`yo-NG` and `en-NG` locale settings) if files are missing.
- **Inline Camera Viewfinder & Capture**: Features a custom in-app video stream viewfinder utilizing `navigator.mediaDevices.getUserMedia`. Users can preview their camera stream in real-time, switch front/back cameras, and capture snapshots instantly, providing a seamless mobile camera experience.
- **High-Precision Geolocation**: GPS locks are fetched with zero cache (`maximumAge: 0`) and high accuracy to bypass network proxies. A real-time accuracy radius badge is displayed in meters, showing GPS precision (Excellent, Coarse, or Weak).
- **Optional Text Fields with AI Suggestion Placeholders**: The Title and Landmarks inputs are optional. To make input even easier, the Report Title input's placeholder dynamically updates to show the AI's predicted dominant label (for example, `Plastic Bottle Sighting (AI suggested)`). If left blank, the application automatically generates:
  - **Title**: Derived from the AI detector's dominant class (for example, `"Plastic Bottle Sighting"`) or defaults to `"Waste Sighting"`.
  - **Location**: Formatted to include the geolocated precision radius (for example, `"GPS Geolocated Spot (within 8m)"`).
- **Single Submit Control**: Consolidated into a single submit button that handles scanning, saving, and disabled states without confusing double-click actions.

---

## Part 3 — AI Detection Feature Roadmap

### Phase 2 Target: FastAPI MVP Endpoint

**Single endpoint, three outputs:**

```
POST /detect
Input:  { image: base64 | multipart }
Output: {
  waste_types: ["PET Plastic", "Carton"],  // classification
  severity: "moderate",                     // volume/spread estimate
  confidence: 0.87,
  recommended_action: "Nearest Wecyclers hub: 1.2km NW",
  suggested_title: "Mixed plastic dump, roadside"
}
```

**Model stack (recommended):**
- YOLOv8n (object detection, fine-tuned on TACO dataset + Nigerian additions)
- FastAPI + Uvicorn (async, lightweight)
- Hosted on a ₦5,000/month VPS or Railway.app free tier for MVP

**Features unlocked by this endpoint (ship order):**

| Feature | Status | Notes |
|---|---|---|
| Waste type classifier | `[ ]` | Core model, Phase 2 |
| Auto-fill report title | `[ ]` | From classification tags |
| Severity estimator | `[ ]` | Bounding box area heuristic |
| Hub recommendation | `[ ]` | Distance calc from logistics-directory.ts |
| Confidence indicator | `[ ]` | Show to Operator in queue |
| Community dataset builder | `[ ]` | Log confirmed detections |
| Hotspot predictor | `[ ]` | Time-series on Appwrite data, Phase 3 |

---

## Part 4 — Implementation Milestone Tracker

```
PHASE 1 — MVP Auth & Core Platform (April 2026)
[x] Appwrite Auth (OAuth via Google)
[x] Operator & Mender role system
[x] Profile creation & persistence
[x] Report CRUD (Appwrite cloud)
[x] Map with density heatmap
[x] Insights board
[x] Drop-off Hubs directory (logistics-directory.ts)
[x] Navigation per role
[x] Sign-out redirect to home
[x] Inline Camera Viewfinder for report captures
[x] Operator direction routing (Google Maps GPS integration)
[x] Trust Score live updates upon report resolution
[x] Appwrite image uploads and image rendering on Operator cards

PHASE 2 — AI Detection (Q2 2026)
[ ] FastAPI server setup
[ ] YOLOv8 model fine-tuning on Nigerian waste images
[ ] /detect endpoint live
[x] Auto-fill report title & severity from AI (Zero-Text flow)
[ ] Hub recommendation post-detection
[ ] Confidence indicator in Operator queue

PHASE 3 — Monetisation Layer 1 (Q3 2026)
[ ] Paystack integration for Operator subscriptions
[ ] Subscription gating on Operator dashboard
[ ] Partner outreach: Wecyclers, Scrapays referral API
[ ] Brand sponsorship pitch deck + landing page

PHASE 4 — Data Products (Q4 2026)
[ ] Automated data report builder
[ ] B2G sales pipeline (Lagos State, NESREA)
[ ] Premium Mender features (badge, impact passport)
[ ] Leaderboard & gamification

PHASE 5 — Carbon & Scale (2027)
[ ] Weight estimation via AI (tonnes per report)
[ ] Verra VCS project registration
[ ] Carbon credit pipeline setup
[ ] White-label Operator offering for municipalities
```

---

## Key Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Operators don't pay for SaaS in Nigeria | Lead with free tier, charge for analytics/API; target state agencies first who have procurement budgets |
| Data quality is low without incentives | Trust score system rewards quality; AI validation catches obvious spam |
| Carbon credit certification is complex | Partner with a certified project developer (e.g., South Pole, Terrapass Africa) rather than self-certifying |
| AI model accuracy on Nigerian waste images | Start with a TACO-based model and use community confirmations to build local training data over time |
| Appwrite pricing at scale | Appwrite Cloud free tier covers MVP; evaluate self-hosting on Nigerian VPS (AWS Lagos, or Hetzner) at 10k+ users |
