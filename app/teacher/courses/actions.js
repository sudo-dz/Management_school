"use server";
import { createClient } from "@supabase/supabase-js";

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function getTeacherCourses(teacherId) {
  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("class_course")
    .select(`
      id,
      class(name),
      course(name)
    `)
    .eq("teacher_id", teacherId);

  if (error) throw error;
  return data;
}
