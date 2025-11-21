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

  console.log("Fetching assignments for teacher:", teacherId);

  const { data: assignments, error: assignmentsError } = await supabase
    .from("assignment")
    .select("*")
    .eq("teacher_id", teacherId);

  if (assignmentsError) throw assignmentsError;
  if (!assignments.length) return console.log("No assignments found for this teacher.");

  console.log("Assignments:", assignments);

  // Optional: fetch submissions for the first assignment
  const assignmentId = assignments[0].id;
  const { data: submissions, error: submissionsError } = await supabase
    .from("assignment_submission")
    .select("*, student(*)")
    .eq("assignment_id", assignmentId);

  if (submissionsError) throw submissionsError;
  console.log("Submissions for assignment", assignmentId, ":", submissions);
}

main().catch(console.error);
