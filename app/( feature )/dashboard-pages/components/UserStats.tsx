import { CheckCircle2, Zap, Star, TrendingUp } from "lucide-react";

const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

// Mock user stats — replace with real data from DB later
const STATS = [
    { icon: <CheckCircle2 className="w-4 h-4 text-green-500" />, label: "Bounty selesai",    value: "12" },
    { icon: <Zap className="w-4 h-4 text-blue-500" />,          label: "Bounty diambil",     value: "5" },
    { icon: <Star className="w-4 h-4 text-amber-500" />,        label: "Rating kamu",        value: "4.9" },
    { icon: <TrendingUp className="w-4 h-4 text-purple-500" />, label: "Total pendapatan",   value: formatRupiah(1_250_000) },
];

export default function UserStats({ name = "Ahmad Fauzi" }: { name?: string }) {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Selamat pagi" : hour < 15 ? "Selamat siang" : hour < 18 ? "Selamat sore" : "Selamat malam";
    const firstName = name.split(" ")[0];

    return (
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-3xl p-6 flex flex-col gap-4">
            {/* Greeting */}
            <div>
                <p className="text-sm opacity-60">{greeting} 👋</p>
                <h2 className="text-2xl font-bold mt-0.5">{firstName}!</h2>
                <p className="text-xs opacity-50 mt-1">Ini ringkasan aktivitasmu hari ini.</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2">
                {STATS.map((s) => (
                    <div key={s.label} className="bg-background/10 rounded-2xl px-3.5 py-3">
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <span className="opacity-80">{s.icon}</span>
                        </div>
                        <p className="text-lg font-bold leading-none">{s.value}</p>
                        <p className="text-[10px] opacity-50 mt-1">{s.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
