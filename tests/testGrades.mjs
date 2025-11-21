import 'dotenv/config'; // Loads .env.local automatically
import { createClient } from "@supabase/supabase-js";

// Make sure these env vars exist
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
console.error("❌ Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment");
process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function main() {
// 🔹 Replace this with the real teacher UUID from your teacher table
const teacherId = "72b69d81-b51b-4cd1-bbed-f13a752794a5";

console.log("Fetching class_courses for teacher:", teacherId);

// 1️⃣ Get all class_course IDs for this teacher (from schedule)
const { data: schedule, error: scheduleError } = await supabase
.from("schedule")
.select("class_course_id")
.eq("teacher_id", teacherId);

if (scheduleError) throw scheduleError;
if (!schedule.length) {
console.log("No class_courses found for this teacher.");
return;
}

const classCourseIds = schedule.map(s => s.class_course_id);
console.log("Class course IDs:", classCourseIds);

// 2️⃣ Fetch exams for these class_courses
const { data: exams, error: examsError } = await supabase
.from("exam")
.select("*")
.in("class_course_id", classCourseIds);

if (examsError) throw examsError;
if (!exams.length) {
console.log("No exams found for these class_courses.");
return;
}
console.log("Exams for teacher:", exams);

// 3️⃣ Fetch grades for the first exam
const examId = exams[0].id;
const { data: grades, error: gradesError } = await supabase
.from("grade")
.select("*, student(*)")
.eq("exam_id", examId);

if (gradesError) throw gradesError;

if (!grades.length) {
console.log("No grades found for exam:", examId);
return;
}
console.log("Grades for exam", examId, ":", grades);
}

main().catch(err => {
console.error("ERROR:", err);
});
