"use server";
import { createClient } from "@supabase/supabase-js";

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function createAssignment(data) {
  const supabase = supabaseAdmin();

  const { error } = await supabase.from("assignment").insert(data);
  if (error) throw error;
  return { success: true };
}
export async function getTeacherAssignments(teacherId) {
  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("assignment")
    .select("id, title, description, class_course_id, due_date")
    .eq("teacher_id", teacherId);

  if (error) throw error;
  return data;
}
export async function getAssignmentSubmissions(assignmentId) {
  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("assignment_submission")
    .select(`
      student:student(id, full_name),
      file_url,
      grade,
      submitted_at
    `)
    .eq("assignment_id", assignmentId);

  if (error) throw error;
  return data;
}
export async function gradeSubmission(studentId, assignmentId, grade) {
  const supabase = supabaseAdmin();

  const { error } = await supabase
    .from("assignment_submission")
    .update({ grade })
    .match({ student_id: studentId, assignment_id: assignmentId });

  if (error) throw error;
  return { success: true };
}
