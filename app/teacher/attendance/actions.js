"use server";
import { createClient } from "@supabase/supabase-js";

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function getStudentsInClassCourse(classCourseId) {
  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("class_course")
    .select(`
      class:class(id, name),
      course:course(name),
      class!inner.class_student_rel:class(id, students:student(id, full_name))
    `)
    .eq("id", classCourseId);

  if (error) throw error;
  return data;
}
export async function markAttendance({ studentId, classCourseId, date, status, reason }) {
  const supabase = supabaseAdmin();

  const { error } = await supabase.from("attendance").insert({
    student_id: studentId,
    class_course_id: classCourseId,
    date,
    status,
    reason,
  });

  if (error) throw error;
  return { success: true };
}
export async function getAttendance(classCourseId, date) {
  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("attendance")
    .select("id, status, reason, student:student(id, full_name)")
    .eq("class_course_id", classCourseId)
    .eq("date", date);

  if (error) throw error;
  return data;
}
