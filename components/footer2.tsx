import Link from "next/link";
import { Logo } from "@/components/logo";
import { FaInstagram, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

const SECTIONS = [
    {
        title: "Layanan",
        links: [
            { name: "Bersih-Bersih",     href: "/layanan-bersih" },
            { name: "Antar Jemput",      href: "/layanan-antar-jemput" },
            { name: "Jasa Titip",        href: "/layanan-jastip" },
            { name: "Tenaga Kerja",      href: "/layanan-tenaga-kerja" },
            { name: "Bantuan Digital",   href: "/layanan-bantuan-digital" },
            { name: "Bimbingan Belajar", href: "/layanan-bimbingan" },
        ],
    },
    {
        title: "Perusahaan",
        links: [
            { name: "Tentang Kami", href: "#" },
            { name: "Blog",         href: "#" },
            { name: "Karir",        href: "#" },
            { name: "Kontak",       href: "#" },
        ],
    },
    {
        title: "Dukungan",
        links: [
            { name: "Pusat Bantuan", href: "#" },
            { name: "Dokumentasi",  href: "#" },
            { name: "Status",       href: "#" },
            { name: "Komunitas",    href: "#" },
        ],
    },
];

const SOCIALS = [
    { icon: <FaInstagram className="w-4 h-4" />, href: "#", label: "Instagram" },
    { icon: <FaTwitter   className="w-4 h-4" />, href: "#", label: "Twitter"   },
    { icon: <FaLinkedin  className="w-4 h-4" />, href: "#", label: "LinkedIn"  },
    { icon: <FaGithub    className="w-4 h-4" />, href: "#", label: "GitHub"    },
];

export function Footer2() {
    return (
        <footer className="bg-blue-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Top grid */}
                <div className="grid grid-cols-2 gap-10 lg:grid-cols-5">

                    {/* Brand */}
                    <div className="col-span-2 flex flex-col gap-5">
                        <Link href="/" className="flex items-center gap-2.5 w-fit">
                            <Logo className="w-7 h-7 text-white" />
                            <span className="text-lg font-bold tracking-tight">Bounty</span>
                        </Link>

                        <p className="text-sm text-blue-100/80 leading-relaxed max-w-xs">
                            Platform gig economy lokal yang menghubungkan pengguna dengan pekerja terdekat untuk menyelesaikan berbagai kebutuhan sehari-hari.
                        </p>

                        {/* Badge */}
                        <div className="flex items-center gap-2 w-fit">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-xs font-semibold text-green-400">
                                Layanan aktif 24 jam
                            </span>
                        </div>

                        {/* Socials */}
                        <div className="flex items-center gap-2">
                            {SOCIALS.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    aria-label={s.label}
                                    className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 hover:border-white/30 transition-all"
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {SECTIONS.map((section) => (
                        <div key={section.title} className="flex flex-col gap-4">
                            <h3 className="text-[11px] font-bold text-white/50 uppercase tracking-widest">
                                {section.title}
                            </h3>
                            <ul className="flex flex-col gap-2.5">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-white/70 hover:text-white transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div className="mt-14 border-t border-white/20" />

                {/* Bottom bar */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-white/50">
                        © {new Date().getFullYear()} Bounty. Hak cipta dilindungi.
                    </p>
                    <div className="flex items-center gap-5">
                        {[
                            { name: "Syarat & Ketentuan", href: "#" },
                            { name: "Kebijakan Privasi",  href: "#" },
                        ].map((l) => (
                            <Link
                                key={l.name}
                                href={l.href}
                                className="text-xs text-white/50 hover:text-white transition-colors underline underline-offset-2"
                            >
                                {l.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer2;
