import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mtyoxbzwmdixlzjmyxws.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10eW94Ynp3bWRpeGx6am15eHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MjY1MTMsImV4cCI6MjA3MjAwMjUxM30.c1-Mt1jvN6C3M77Zs38ihJARi-71nmdyPj80ewcu-TE";

export const supabase = createClient(supabaseUrl, supabaseKey);
