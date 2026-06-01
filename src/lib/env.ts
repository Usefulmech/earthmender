export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  detectorApiUrl: (process.env.DETECTOR_API_URL || "").replace(/\/$/, ""),
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
};

export const hasDetector = Boolean(env.detectorApiUrl);

export const hasSupabase = Boolean(env.supabaseUrl && env.supabaseAnonKey);
