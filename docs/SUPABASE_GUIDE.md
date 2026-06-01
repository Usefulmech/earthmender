# Supabase guide for earthmender

This clean rebuild is local-first on purpose, but it is shaped so Supabase can be added next without changing the product direction.

## What Supabase should own later

- user accounts
- private workspaces
- synced reports
- report images
- future team collaboration

## Suggested tables

### `profiles`

- `id uuid primary key`
- `email text`
- `full_name text`
- `created_at timestamptz default now()`

### `workspaces`

- `id uuid primary key`
- `name text`
- `owner_id uuid references profiles(id)`
- `created_at timestamptz default now()`

### `reports`

- `id uuid primary key`
- `workspace_id uuid references workspaces(id)`
- `title text`
- `notes text`
- `location_label text`
- `latitude double precision`
- `longitude double precision`
- `severity text`
- `status text`
- `recommended_action text`
- `image_path text`
- `created_at timestamptz default now()`

### `detections`

- `id uuid primary key`
- `report_id uuid references reports(id)`
- `label text`
- `confidence double precision`
- `bbox jsonb`
- `created_at timestamptz default now()`

## Storage

Create a bucket named `report-images`.

## First integration pass

1. Enable Email auth in Supabase.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Replace local browser persistence with inserts/selects against `reports`.
4. Store uploaded files in `report-images`.
5. Keep the detector service exactly as it is.

## Why this order works

- you keep the UI and detector unchanged
- auth and sync become the only moving parts
- the personal tool becomes SaaS-ready without another rewrite
