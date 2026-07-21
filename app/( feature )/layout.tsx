import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import Navbar from "./( users )/components/navbar";

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login-pages");
  }

  // Check if user exists in our prisma postgres db
  const dbUser = await prisma.pengguna.findUnique({
    where: { email: user.email! },
    include: { profil: true },
  });

  if (!dbUser || !dbUser.profil) {
    redirect("/complete-profile");
  }

  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      {/* Account-focused Navbar */}
      <Navbar />
      
      {/* Dashboard Main Content */}
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
    </div>
  );
}

