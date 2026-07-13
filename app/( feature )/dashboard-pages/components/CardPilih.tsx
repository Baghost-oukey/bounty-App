import Link from "next/link";
import { ArrowRight, PlusCircle, Zap } from "lucide-react";

export default function QuickActions() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Ajukan Bounty — blue-500 */}
            <Link
                href="/order-pages"
                className="group flex flex-col justify-between bg-blue-500 hover:bg-blue-600 text-white rounded-3xl p-5 transition-all min-h-[140px]"
            >
                <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center">
                    <PlusCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                    <p className="text-xs font-semibold opacity-70 mb-0.5">Kamu butuh bantuan?</p>
                    <h3 className="text-base font-bold leading-snug">Ajukan Bounty Kegiatan</h3>
                    <div className="flex items-center gap-1 mt-2 text-xs font-semibold opacity-70 group-hover:opacity-100 transition-opacity">
                        Mulai sekarang <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                </div>
            </Link>

            {/* Ambil Bounty — blue-700 */}
            <Link
                href="/bounty"
                className="group flex flex-col justify-between bg-blue-700 hover:bg-blue-800 text-white rounded-3xl p-5 transition-all min-h-[140px]"
            >
                <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                    <p className="text-xs font-semibold opacity-70 mb-0.5">Cari penghasilan?</p>
                    <h3 className="text-base font-bold leading-snug">Ambil Bounty Tersedia</h3>
                    <div className="flex items-center gap-1 mt-2 text-xs font-semibold opacity-70 group-hover:opacity-100 transition-opacity">
                        Lihat bounty <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                </div>
            </Link>
        </div>
    );
}
