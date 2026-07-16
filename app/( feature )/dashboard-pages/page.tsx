import IncomeTracker from "./components/StatistikPendapatan";
import QuickActions from "./components/CardPilih";
import RecentBounty from "./components/HistoryBounty";
import LiveStats from "./components/LiveCardContainer";
import UserStats from "./components/ModalHeader";

export default function DashboardPage() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* ── Main grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* ── Left column (2/3) ── */}
                <div className="lg:col-span-2 flex flex-col gap-5">

                    {/* Greeting + stats */}
                    <UserStats name="Ahmad Fauzi" />

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
