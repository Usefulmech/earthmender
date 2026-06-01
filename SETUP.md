## Setup guide (earthmender)

### Google sign in / sign up (NextAuth + Google)

You’ll set up a Google OAuth app, then add a few environment variables.

#### Create Google OAuth credentials
In Google Cloud Console:

- **APIs & Services → OAuth consent screen**
  - **User type**: External (recommended for public apps) or Internal (Workspace-only).
  - **Scopes**: `openid`, `email`, `profile`
  - If consent screen is in **Testing**, add your email under **Test users** (otherwise only test users can sign in).

- **APIs & Services → Credentials → Create Credentials → OAuth client ID**
  - **Application type**: Web application
  - **Authorized JavaScript origins**
    - Dev: `http://localhost:3000`
    - Prod: `https://YOUR_DOMAIN`
  - **Authorized redirect URIs**
    - Dev: `http://localhost:3000/api/auth/callback/google`
    - Prod: `https://YOUR_DOMAIN/api/auth/callback/google`

Copy:
- **Client ID** → `GOOGLE_CLIENT_ID`
- **Client secret** → `GOOGLE_CLIENT_SECRET`

#### Add local environment variables
Create `.env.local` in the repo root (same folder as `package.json`):

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-a-random-secret

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Generate a secret (PowerShell):

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Restart the app
Environment variables are read at startup, so restart:

```powershell
npm run dev
```

### Supabase (optional right now)

Supabase is optional unless you want real database sync / user storage.

In Supabase:
- Create a project
- **Project Settings → API**
  - Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
  - Copy **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Add to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Detector service (FastAPI) + Next.js proxy

Next.js proxies detection requests to the detector service via:
- `DETECTOR_API_URL` (used by `src/app/api/detect/route.ts`)

Local example (detector on port 8000):

```env
DETECTOR_API_URL=http://127.0.0.1:8000
```

### Deploy detector service to Render (CPU)

This repo includes a Render blueprint (`render.yaml`) to deploy the FastAPI detector.

#### Model format recommendation (speed)
- **CPU**: prefer **ONNX** (`best.onnx`) with `onnxruntime` for faster inference.
- **GPU**: TensorRT is fastest, but adds operational complexity. ONNX is still a good baseline.

#### How to provide the model on Render
Recommended approach:
- Host the model file somewhere reachable (private bucket + signed URL, or public URL), and set:
  - `EARTHMENDER_MODEL_URL=https://.../best.onnx` (preferred) or `.../best.pt`

The service will download it on startup into `detector_service/models/`.

#### Wire the frontend to Render
After deploy, set `DETECTOR_API_URL` in your Next.js environment to the Render service URL:

```env
DETECTOR_API_URL=https://your-detector-service.onrender.com
```

