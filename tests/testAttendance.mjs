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
  const teacherId = "72b69d81-b51b-4cd1-bbed-f13a752794a5";

  console.log("Fetching class_courses for teacher:", teacherId);

  const { data: schedule, error: scheduleError } = await supabase
    .from("schedule")
    .select("class_course_id")
    .eq("teacher_id", teacherId);

  if (scheduleError) throw scheduleError;
  if (!schedule.length) return console.log("No class_courses found for this teacher.");

  const classCourseIds = schedule.map(s => s.class_course_id);

  const { data: attendance, error: attendanceError } = await supabase
    .from("attendance")
    .select("*, student(*)")
    .in("class_course_id", classCourseIds);

  if (attendanceError) throw attendanceError;
  console.log("Attendance records:", attendance);
}

main().catch(console.error);
