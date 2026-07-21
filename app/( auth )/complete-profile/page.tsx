import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import OnboardingForm from "./components/OnboardingForm";

export const metadata = {
  title: "Complete Your Profile | Bounty",
  description: "Lengkapi data diri Anda untuk menyelesaikan registrasi akun Bounty Anda.",
};

export default async function CompleteProfilePage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login-pages");
  }

  // Check if they are already registered in the Postgres db
  const dbUser = await prisma.pengguna.findUnique({
    where: { email: user.email! },
    include: { profil: true },
  });

  // If already registered and has a profile, redirect to dashboard
  if (dbUser && dbUser.profil) {
    redirect("/dashboard-pages");
  }

  // Pass default metadata from Google / Social Auth if available
  const defaultFullName = user.user_metadata?.full_name || user.user_metadata?.name || "";
  const defaultEmail = user.email || "";

  return (
    <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <OnboardingForm
        defaultFullName={defaultFullName}
        defaultEmail={defaultEmail}
      />
    </div>
  );
}
