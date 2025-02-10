// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ebjeczmxqboznygwjfxp.supabase.co"; // Your Supabase project URL
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViamVjem14cWJvem55Z3dqZnhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3ODg2NDUsImV4cCI6MjA1NDM2NDY0NX0.eUBg7cXwxtBB1H3ban4OQ29ql4H9DiQJp6l4wYYVX98"; // Your Supabase API key
export const supabase = createClient(supabaseUrl, supabaseKey);
