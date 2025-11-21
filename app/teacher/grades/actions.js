import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const teacherId = "PUT_REAL_TEACHER_ID_HERE";

  // ① get class_course taught by teacher
  const { data: teaching, error: e0 } = await supabase
    .from("schedule")
    .select("class_course_id")
    .eq("teacher_id", teacherId);

  if (e0) throw e0;

  if (!teaching.length) {
    console.log("Teacher teaches no courses");
    return;
  }

  const courseIds = teaching.map(t => t.class_course_id);

  // ② fetch exams for these class_course
  const { data: exams, error: e1 } = await supabase
    .from("exam")
    .select("*")
    .in("class_course_id", courseIds);

  if (e1) throw e1;
  console.log("Exams:", exams);

  if (!exams.length) {
    console.log("No exams found");
    return;
  }

  const examId = exams[0].id;

  // ③ fetch grades for first exam
  const { data: grades, error: e2 } = await supabase
    .from("grade")
    .select("*, student(*)")
    .eq("exam_id", examId);

  if (e2) throw e2;

  console.log("Grades:", grades);
}

main().catch(console.error);
