import 'dotenv/config';
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const studentId = "76561b80-c0ef-4169-ba47-44ac59a3417f";

  const { data: grades, error } = await supabase
    .from("grade")
    .select("*, exam(*), student(*)")
    .eq("student_id", studentId);

  if (error) throw error;
  console.log("Grades for student:", grades);
}

main().catch(console.error);
