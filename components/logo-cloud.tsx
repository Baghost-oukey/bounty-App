import { InfiniteSlider } from "@/components/infinite-slider";
import {
    Sparkles,
    Car,
    ShoppingBag,
    Hammer,
    Monitor,
    BookOpen,
    PawPrint,
    ChefHat,
    Wrench,
    PackageOpen,
    Palette,
    Camera,
} from "lucide-react";

const LAYANAN = [
    { icon: Sparkles,    label: "Bersih-Bersih"     },
    { icon: Car,         label: "Antar Jemput"       },
    { icon: ShoppingBag, label: "Jasa Titip"         },
    { icon: Hammer,      label: "Tenaga Kerja"       },
    { icon: Monitor,     label: "Bantuan Digital"    },
    { icon: BookOpen,    label: "Bimbingan Belajar"  },
    { icon: PawPrint,    label: "Perawatan Hewan"    },
    { icon: ChefHat,     label: "Jasa Masak"         },
    { icon: Wrench,      label: "Perbaikan Rumah"    },
    { icon: PackageOpen, label: "Packing & Moving"   },
    { icon: Palette,     label: "Desain Grafis"      },
    { icon: Camera,      label: "Fotografi"          },
];

export function LogoCloud() {
    return (
        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
            <InfiniteSlider gap={10} speed={40} speedOnHover={15}>
                {LAYANAN.map(({ icon: Icon, label }) => (
                    <div
                        key={label}
                        className="flex items-center gap-3 px-5 py-3 rounded-full border border-border/60 bg-background select-none whitespace-nowrap"
                    >
                        <Icon className="w-5 h-5 text-blue-600 shrink-0" strokeWidth={2} />
                        <span className="text-base font-medium text-foreground/80 tracking-tight">
                            {label}
                        </span>
                    </div>
                ))}
            </InfiniteSlider>
        </div>
    );
}
