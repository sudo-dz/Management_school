import 'dotenv/config';
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const teacherId = "6109f245-44f5-4269-8061-aa3fb174c516";

  console.log("Fetching remarks from teacher:", teacherId);

  const { data: remarks, error: remarksError } = await supabase
    .from("remark")
    .select("*, student(*)")
    .eq("teacher_id", teacherId);

  if (remarksError) throw remarksError;
  if (!remarks.length) return console.log("No remarks found for this teacher.");

  console.log("Remarks:", remarks);
}

main().catch(console.error);
