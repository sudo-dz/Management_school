"use server";
import { createClient } from "@supabase/supabase-js";

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function sendNotification(senderProfileId, receiverProfileId, title, message) {
  const supabase = supabaseAdmin();

  const { error } = await supabase.from("notification").insert({
    sender_profile_id: senderProfileId,
    receiver_profile_id: receiverProfileId,
    title,
    message,
  });

  if (error) throw error;
  return { success: true };
}
export async function getTeacherNotifications(profileId) {
  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("notification")
    .select("*")
    .eq("sender_profile_id", profileId);

  if (error) throw error;
  return data;
}
