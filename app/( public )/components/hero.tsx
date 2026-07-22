import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, PhoneCallIcon } from "lucide-react";
import { LogoCloud } from "@/components/logo-cloud";
import Link from "next/link";

export function HeroSection() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute inset-0 isolate hidden overflow-hidden contain-strict lg:block pointer-events-none"
      >
        <div className="absolute inset-0 -top-14 isolate -z-10 bg-[radial-gradient(35%_80%_at_49%_0%,--theme(--color-foreground/.08),transparent)] contain-strict pointer-events-none" />
      </div>

      {/* main content */}

      <div className="relative flex flex-col items-center justify-center gap-5 pt-40 pb-30 px-4 sm:px-6">
        {/* X Content Faded Borders */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-1 size-full overflow-hidden"
        >
          <div className="absolute inset-y-0 left-4 w-px bg-linear-to-b from-transparent via-border to-border md:left-8" />
          <div className="absolute inset-y-0 right-4 w-px bg-linear-to-b from-transparent via-border to-border md:right-8" />
          <div className="absolute inset-y-0 left-8 w-px bg-linear-to-b from-transparent via-border/50 to-border/50 md:left-12" />
          <div className="absolute inset-y-0 right-8 w-px bg-linear-to-b from-transparent via-border/50 to-border/50 md:right-12" />
        </div>

        <h1
          className={cn(
            "fade-in slide-in-from-bottom-10 animate-in text-balance fill-mode-backwards text-center text-4xl tracking-tight delay-100 duration-500 ease-out md:text-5xl lg:text-6xl",
            "text-shadow-[0_0px_50px_theme(--color-foreground/.2)]",
          )}
        >
          Selesaikan masalah Anda <br /> Hanya dengan satu kali{" "}
          <span className="text-blue-700 font-bold">Klik</span>
        </h1>

        <p className="fade-in slide-in-from-bottom-10 mx-auto max-w-md animate-in fill-mode-backwards text-center text-base  delay-200 duration-500 ease-out sm:text-lg md:text-xl">
          Bounty Membantumu dalam menyelesaikan permasalahan yang kamu miliki
          hanya dengan Pengajuan
        </p>

        <div className="fade-in slide-in-from-bottom-10 flex animate-in flex-row flex-wrap items-center justify-center gap-3 fill-mode-backwards pt-2 delay-300 duration-500 ease-out">
          <Button render={<Link href="/login-pages" />} className="rounded-full cursor-pointer animate-none" size="lg" variant="secondary">
            <span className="flex items-center gap-1.5 cursor-pointer">
              <PhoneCallIcon data-icon="inline-start" /> Hubungi Kami
            </span>
          </Button>
          <Button render={<Link href="/login-pages" />} className="rounded-full cursor-pointer animate-none" size="lg">
            <span className="flex items-center gap-1.5 cursor-pointer">
              Coba Sekarang <ArrowRightIcon data-icon="inline-end" />
            </span>
          </Button>
        </div>
      </div>

      {/* Infinite Slider */}
      <LogoCloud />
    </div>
  );
}
