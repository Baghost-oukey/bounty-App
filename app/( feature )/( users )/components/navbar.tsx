"use client";

import Logo from "@/assets/logo/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { User, LogOut, Bell, ChevronDown, MapPin, Mail, Phone, Calendar, Hash, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getProfileStatus } from "@/app/actions/profile";

const Navbar = () => {
  const [sticky, setSticky] = useState(false);
  const [profile, setProfile] = useState<{ name: string; email: string; role: string } | null>(null);
  const [dbUserDetail, setDbUserDetail] = useState<any | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setSticky(window.scrollY >= 50);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    async function loadProfile() {
      const res = await getProfileStatus();
      if (res.authenticated && res.registered && res.dbUser) {
        setDbUserDetail(res.dbUser);
        setProfile({
          name: res.dbUser.profil?.namaLengkap || res.dbUser.username,
          email: res.dbUser.email,
          role: "Member",
        });
      } else if (res.user) {
        setProfile({
          name: res.user.user_metadata?.full_name || res.user.email?.split("@")[0] || "User",
          email: res.user.email || "",
          role: "Member",
        });
      }
    }
    loadProfile();
  }, []);

  const handleLogout = async () => {
    const { createClient } = await import("@/utils/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  // Fallback to defaults
  const user = profile || {
    name: "Loading...",
    email: "loading...",
    role: "Member",
  };

  const getInitials = (name: string) => {
    if (!name || name === "Loading...") return "U";
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // Format date to local Indonesian format
  const formatBirthdate = (dateStr: any) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  // Get primary address from user details
  const getPrimaryAddress = () => {
    if (!dbUserDetail?.alamat || dbUserDetail.alamat.length === 0) return null;
    return dbUserDetail.alamat.find((a: any) => a.alamatUtama) || dbUserDetail.alamat[0];
  };

  const address = getPrimaryAddress();

  return (
    <div className="sticky top-0 z-50 w-full bg-transparent">
      <header className="bg-transparent">
        <div className="max-w-7xl mx-auto w-full px-4 py-4 sm:px-6">
          <nav
            className={cn(
              "w-full flex items-center h-16 justify-between gap-4 transition-all duration-500",
              sticky
                ? "p-2.5 bg-background/80 backdrop-blur-lg border border-border/40 shadow-2xl shadow-primary/5 rounded-full px-6"
                : "bg-transparent border-transparent"
            )}
          >
            {/* Logo and Brand Name */}
            <Link href="/" className="flex items-center gap-2 select-none">
              <Logo />
              <span className="font-bold text-lg tracking-tight text-foreground">
                Bounty
              </span>
            </Link>

            {/* Navigation links */}
            <div className="flex items-center gap-4">

              {/* Profile Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      type="button"
                      className="p-1 pr-3 rounded-full hover:bg-muted/80 flex items-center gap-2.5 transition-colors border border-transparent hover:border-border/30 cursor-pointer outline-none"
                    />
                  }
                >
                  {dbUserDetail?.profil?.fotoProfil ? (
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-border shadow-md select-none shrink-0">
                      <img
                        src={dbUserDetail.profil.fotoProfil}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm shadow-md select-none shrink-0">
                      {getInitials(user.name)}
                    </div>
                  )}
                  <div className="hidden md:flex flex-col items-start text-left select-none">
                    <span className="text-sm font-semibold text-foreground leading-none mb-0.5">
                      {user.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-medium rounded-full leading-none">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown size={14} className="text-muted-foreground hidden md:block" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl p-1.5">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal px-2.5 py-2">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold leading-none text-foreground">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground mt-1">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setProfileModalOpen(true)}
                    className="rounded-xl cursor-pointer"
                  >
                    <User size={16} className="mr-2 opacity-70" />
                    <span>Profil Saya</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="rounded-xl cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    <LogOut size={16} className="mr-2 opacity-70" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </nav>
        </div>
      </header>

      {/* ── User Details Modal ── */}
      {profileModalOpen && dbUserDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">Detail Akun Saya</span>
              <button 
                onClick={() => setProfileModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-full hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Profile Card Summary */}
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 border-2 border-slate-100 flex-shrink-0 flex items-center justify-center">
                  {dbUserDetail.profil?.fotoProfil ? (
                    <img 
                      src={dbUserDetail.profil.fotoProfil} 
                      alt="Avatar" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <User size={24} className="text-slate-400" />
                  )}
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-base leading-none">
                    {dbUserDetail.profil?.namaLengkap || "User"}
                  </h4>
                  <p className="text-xs text-teal-600 font-semibold font-mono leading-none">
                    @{dbUserDetail.username}
                  </p>
                  <span className="inline-block text-[9px] px-2 py-0.5 bg-slate-200 text-slate-600 font-bold rounded-full uppercase tracking-wider">
                    Member
                  </span>
                </div>
              </div>

              {/* Personal Details */}
              <div className="space-y-3">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Personal Information</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3 flex items-center gap-2.5">
                    <User size={14} className="text-slate-400" />
                    <div>
                      <span className="text-slate-400 font-medium block text-[9px]">Jenis Kelamin</span>
                      <span className="font-semibold text-slate-700">
                        {dbUserDetail.profil?.jenisKelamin === "LAKI_LAKI" 
                          ? "Laki-laki" 
                          : dbUserDetail.profil?.jenisKelamin === "PEREMPUAN" 
                          ? "Perempuan" 
                          : "Lainnya"}
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3 flex items-center gap-2.5">
                    <Calendar size={14} className="text-slate-400" />
                    <div>
                      <span className="text-slate-400 font-medium block text-[9px]">Tanggal Lahir</span>
                      <span className="font-semibold text-slate-700">
                        {formatBirthdate(dbUserDetail.profil?.tanggalLahir)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-3">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Information</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3 flex items-center gap-2.5">
                    <Mail size={14} className="text-slate-400 animate-pulse" />
                    <div className="overflow-hidden">
                      <span className="text-slate-400 font-medium block text-[9px]">Alamat Email</span>
                      <span className="font-semibold text-slate-700 truncate block">
                        {dbUserDetail.email}
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3 flex items-center gap-2.5">
                    <Phone size={14} className="text-slate-400" />
                    <div>
                      <span className="text-slate-400 font-medium block text-[9px]">Nomor Telepon</span>
                      <span className="font-semibold text-slate-700">
                        {dbUserDetail.nomorHp ? `+62 ${dbUserDetail.nomorHp}` : "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div className="space-y-3">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Address Details</h5>
                {address ? (
                  <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 text-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="font-semibold text-slate-600 text-[10px] px-2 py-0.5 bg-slate-200/60 rounded-full">
                        {address.labelAlamat}
                      </span>
                      <div className="text-[9px] font-mono text-slate-400 flex items-center gap-1">
                        <MapPin size={10} className="text-teal-500" />
                        {address.latitude.toFixed(4)}, {address.longitude.toFixed(4)}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-slate-400 font-medium block text-[9px]">Alamat Lengkap</span>
                      <p className="font-semibold text-slate-700 leading-relaxed">
                        {address.alamatLengkap}
                      </p>
                    </div>

                    {address.catatan && (
                      <div className="space-y-1">
                        <span className="text-slate-400 font-medium block text-[9px]">Catatan Tambahan</span>
                        <p className="font-medium text-slate-500 italic">
                          "{address.catatan}"
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-slate-100 pt-3 text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[9px]">Kecamatan</span>
                        <span className="font-semibold text-slate-700">{address.kecamatan}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">Kelurahan</span>
                        <span className="font-semibold text-slate-700">{address.kelurahan}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">Kota / Kabupaten</span>
                        <span className="font-semibold text-slate-700">{address.kabupaten}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">Provinsi</span>
                        <span className="font-semibold text-slate-700">{address.provinsi}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Belum ada alamat tinggal yang terdaftar.</p>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end">
              <Button
                onClick={() => setProfileModalOpen(false)}
                className="h-10 px-6 rounded-2xl text-xs font-bold bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/15"
              >
                Tutup
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
