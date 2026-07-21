import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import IncomeTracker from "./components/StatistikPendapatan";
import QuickActions from "./components/CardPilih";
import RecentBounty from "./components/HistoryBounty";
import LiveStats from "./components/LiveCardContainer";
import UserStats from "./components/ModalHeader";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let name = "Pengguna";
    if (user) {
        const dbUser = await prisma.pengguna.findUnique({
            where: { email: user.email! },
            include: { profil: true },
        });
        if (dbUser?.profil?.namaLengkap) {
            name = dbUser.profil.namaLengkap;
        } else if (user.user_metadata?.full_name) {
            name = user.user_metadata.full_name;
        } else if (dbUser?.username) {
            name = dbUser.username;
        }
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* ── Main grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* ── Left column (2/3) ── */}
                <div className="lg:col-span-2 flex flex-col gap-5">

                    {/* Greeting + stats */}
                    <UserStats name={name} />

                    {/* Income tracker */}
                    <IncomeTracker />

                    {/* Quick action cards */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-foreground">Mulai dari sini</h3>
                        </div>
                        <QuickActions />
                    </div>
                </div>

                {/* ── Right column (1/3) ── */}
                <div className="flex flex-col gap-5">
                    <LiveStats />
                    <RecentBounty />
                </div>
            </div>
        </div>
    );
}
