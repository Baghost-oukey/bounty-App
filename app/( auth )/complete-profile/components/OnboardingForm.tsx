"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { completeUserProfile } from "@/app/actions/profile";
import { Check, User, Mail, Phone, MapPin, Calendar, CheckCircle2, ChevronRight, ChevronLeft, ArrowRight, ShieldCheck, Image as ImageIcon, Map, Loader2 } from "lucide-react";
import Logo from "@/assets/logo/logo";
import { Button } from "@/components/ui/button";

// Import MapPickerModal dynamically to avoid window undefined SSR errors with Leaflet
const MapPickerModal = dynamic(() => import("./MapPickerModal"), { ssr: false });

interface Props {
  defaultFullName: string;
  defaultEmail: string;
}

type StepId = 1 | 2 | 3 | 4;

interface StepConfig {
  id: StepId;
  label: string;
}

const STEPS: StepConfig[] = [
  { id: 1, label: "Personal & Address" },
  { id: 2, label: "Account Details" },
  { id: 3, label: "Summary" },
  { id: 4, label: "Receipt" },
];

export default function OnboardingForm({ defaultFullName, defaultEmail }: Props) {
  const [currentStep, setCurrentStep] = useState<StepId>(1);

  // ── Group 1: Personal Details ──
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nik, setNik] = useState(""); // optional mock NIK
  const [jenisKelamin, setJenisKelamin] = useState<"LAKI_LAKI" | "PEREMPUAN" | "LAINNYA" | "">("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [fotoProfil, setFotoProfil] = useState("");

  // ── Group 2: Residential Address ──
  const [labelAlamat, setLabelAlamat] = useState("Rumah");
  const [customLabelAlamat, setCustomLabelAlamat] = useState("");
  const [alamatLengkap, setAlamatLengkap] = useState("");
  const [provinsi, setProvinsi] = useState("");
  const [kabupaten, setKabupaten] = useState("");
  const [kecamatan, setKecamatan] = useState("");
  const [kelurahan, setKelurahan] = useState("");
  const [kodePos, setKodePos] = useState("");
  const [catatanAlamat, setCatatanAlamat] = useState("");
  const [latitude, setLatitude] = useState(-6.2297);
  const [longitude, setLongitude] = useState(106.8295);

  // ── Group 3: Contact Details ──
  const [nomorHp, setNomorHp] = useState("");

  // ── Step 2: Account Details ──
  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);

  // Map modal and locating states
  const [mapOpen, setMapOpen] = useState(false);
  const [locating, setLocating] = useState(false);

  // Prefill first name, last name & avatar from Supabase metadata on load
  useEffect(() => {
    if (defaultFullName) {
      const parts = defaultFullName.split(" ");
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
    }
    
    // Fetch user metadata directly from Supabase for avatar
    async function fetchMetadata() {
      const { createClient } = await import("@/utils/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.avatar_url || user?.user_metadata?.picture) {
        setFotoProfil(user.user_metadata.avatar_url || user.user_metadata.picture);
      }
    }
    fetchMetadata();
  }, [defaultFullName]);

  // Handle countdown on success step
  useEffect(() => {
    if (currentStep === 4) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            window.location.href = "/dashboard-pages";
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentStep]);

  // Request browser geolocation permission and reverse geocode
  const handleAutoGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolokasi tidak didukung oleh browser Anda.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setLatitude(lat);
        setLongitude(lon);
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
            {
              headers: {
                "Accept-Language": "id-ID,id;q=0.9,en;q=0.8",
                "User-Agent": "BountyAppOnboardingMapPicker/1.0"
              }
            }
          );
          const data = await response.json();
          if (data && data.address) {
            const addr = data.address;
            const prov = addr.state || addr.region || "";
            const kab = addr.city || addr.regency || addr.municipality || addr.county || "";
            const kec = addr.city_district || addr.district || addr.suburb || kab || "-";
            const kel = addr.village || addr.subdistrict || addr.neighbourhood || addr.quarter || kec || "-";

            setProvinsi(prov);
            setKabupaten(kab);
            setKecamatan(kec);
            setKelurahan(kel);
            setKodePos(addr.postcode || "");
            
            const parts = [
              addr.road,
              addr.residential,
              addr.neighbourhood,
              addr.village || addr.subdistrict || addr.neighbourhood || addr.quarter,
              addr.city_district || addr.district || addr.suburb,
              addr.city || addr.regency || addr.municipality || addr.county,
              addr.state || addr.region
            ].filter(Boolean);
            setAlamatLengkap(data.display_name || parts.join(", "));
          }
        } catch (err) {
          console.error("Reverse geocoding error:", err);
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        console.error(err);
        alert("Gagal mengakses lokasi. Pastikan izin lokasi diberikan.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleMapConfirm = (res: any) => {
    setLatitude(res.latitude);
    setLongitude(res.longitude);
    setAlamatLengkap(res.alamatLengkap);
    setProvinsi(res.provinsi);
    setKabupaten(res.kabupaten);
    setKecamatan(res.kecamatan);
    setKelurahan(res.kelurahan);
    setKodePos(res.kodePos);
    setMapOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran gambar terlalu besar. Maksimal 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setFotoProfil(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Validation per step
  const canGoNext = () => {
    if (currentStep === 1) {
      // Must complete personal details AND residential address AND contact details
      return (
        !!firstName.trim() &&
        !!lastName.trim() &&
        !!jenisKelamin &&
        !!tanggalLahir &&
        !!alamatLengkap.trim() &&
        !!provinsi.trim() &&
        !!kabupaten.trim() &&
        !!kecamatan.trim() &&
        !!kelurahan.trim() &&
        !!nomorHp.trim()
      );
    }
    if (currentStep === 2) {
      return !!username.trim() && /^[a-zA-Z0-9_]{3,15}$/.test(username);
    }
    return true;
  };

  const getMissingFields = () => {
    const missing: string[] = [];
    if (!firstName.trim()) missing.push("Nama Depan");
    if (!lastName.trim()) missing.push("Nama Belakang");
    if (!jenisKelamin) missing.push("Jenis Kelamin");
    if (!tanggalLahir) missing.push("Tanggal Lahir");
    if (!alamatLengkap.trim()) missing.push("Alamat Lengkap");
    if (!provinsi.trim()) missing.push("Provinsi");
    if (!kabupaten.trim()) missing.push("Kota/Kabupaten");
    if (!kecamatan.trim()) missing.push("Kecamatan");
    if (!kelurahan.trim()) missing.push("Kelurahan");
    if (!nomorHp.trim()) missing.push("Nomor HP");
    return missing;
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as StepId);
      setError(null);
    }
  };

  const handleBack = () => {
    if (currentStep > 1 && currentStep < 4) {
      setCurrentStep((prev) => (prev - 1) as StepId);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const activeLabel = labelAlamat === "Lainnya" ? customLabelAlamat.trim() || "Alamat" : labelAlamat;

    const res = await completeUserProfile({
      firstName,
      lastName,
      jenisKelamin: jenisKelamin || undefined,
      tanggalLahir: tanggalLahir || undefined,
      username,
      nomorHp: nomorHp || undefined,
      fotoProfil: fotoProfil || undefined,
      labelAlamat: activeLabel,
      alamatLengkap: alamatLengkap || undefined,
      provinsi: provinsi || undefined,
      kabupaten: kabupaten || undefined,
      kecamatan: kecamatan || undefined,
      kelurahan: kelurahan || undefined,
      kodePos: kodePos || undefined,
      catatanAlamat: catatanAlamat || undefined,
      latitude,
      longitude,
    });

    if (res.success) {
      setCurrentStep(4);
    } else {
      setError(res.error || "Gagal menyimpan data.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl bg-white rounded-[32px] shadow-2xl shadow-slate-100 border border-slate-100 flex flex-col lg:grid lg:grid-cols-12 overflow-hidden min-h-[650px] transition-all duration-300">
      
      {/* ── Left Stepper Panel (4 Cols) ── */}
      <div className="lg:col-span-4 bg-slate-50/50 p-6 lg:p-10 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-between">
        <div>
          {/* Logo / Branding */}
          <div className="flex items-center gap-2.5 mb-10 select-none">
            <Logo />
            <span className="font-bold text-xl tracking-tight text-slate-800">Bounty</span>
          </div>

          <h2 className="text-xl font-bold text-slate-800 leading-snug mb-8">
            Create account
          </h2>

          {/* Steps List */}
          <div className="space-y-6">
            {STEPS.map((step) => {
              const isCompleted = currentStep > step.id;
              const isActive = currentStep === step.id;

              return (
                <div key={step.id} className="flex items-center gap-4 group">
                  <div className="relative flex flex-col items-center">
                    {/* Circle */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all duration-300 ${
                        isCompleted
                          ? "bg-teal-500 border-teal-500 text-white"
                          : isActive
                          ? "bg-teal-50 border-teal-500 text-teal-600 border-2"
                          : "bg-white border-slate-200 text-slate-400"
                      }`}
                    >
                      {isCompleted ? <Check size={14} strokeWidth={3} /> : step.id}
                    </div>
                    {/* Vertical Connector Line */}
                    {step.id < 4 && (
                      <div
                        className={`w-[2px] h-8 my-1 transition-colors duration-300 ${
                          isCompleted ? "bg-teal-500" : "bg-slate-200"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex flex-col mb-9">
                    <span
                      className={`text-sm font-semibold transition-colors ${
                        isActive
                          ? "text-slate-800 font-bold text-base"
                          : isCompleted
                          ? "text-slate-500 font-medium"
                          : "text-slate-400 font-medium"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-[10px] font-bold text-slate-400 tracking-wider mt-12 uppercase select-none">
          <ShieldCheck size={14} className="text-teal-500 shrink-0" />
          <span>Secured Database Connection</span>
        </div>
      </div>

      {/* ── Right Form Panel (8 Cols) ── */}
      <div className="lg:col-span-8 p-6 lg:p-10 flex flex-col justify-between bg-white max-h-[90vh] overflow-y-auto">
        
        {/* Top/Body Portion */}
        <div className="flex-1">
          {error && (
            <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl p-4 text-xs font-medium flex items-center gap-2.5 animate-in fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
              {error}
            </div>
          )}

          {/* Form Step Content */}
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {/* STEP 1: Personal & Address Details */}
            {currentStep === 1 && (
              <div className="space-y-8">
                
                {/* ── Group 1: YOUR PERSONAL DETAILS ── */}
                <div className="space-y-5">
                  <div>
                    <h3 className="text-xs font-bold text-teal-600 uppercase tracking-widest">
                      Your Personal Details
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Masukkan identitas diri dan unggah foto profil resmi Anda.
                    </p>
                  </div>

                  {/* Avatar Upload & Preview */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 border-2 border-slate-100 flex-shrink-0 flex items-center justify-center relative">
                      {fotoProfil ? (
                        <img src={fotoProfil} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User size={24} className="text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 w-full space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <ImageIcon size={12} />
                        Foto Profil
                      </span>
                      <div className="flex flex-wrap gap-2 items-center">
                        <input
                          type="file"
                          id="avatar-upload"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="avatar-upload"
                          className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer shadow-sm hover:border-slate-300 transition-all flex items-center gap-1.5"
                        >
                          Pilih dari Perangkat
                        </label>
                        {fotoProfil && (
                          <button
                            type="button"
                            onClick={() => setFotoProfil("")}
                            className="text-[10px] text-rose-500 hover:text-rose-600 font-bold transition-colors cursor-pointer"
                          >
                            Hapus Foto
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Format JPG, PNG, atau WEBP. Maksimal 2MB.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        First Name <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Bagus"
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800 transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Last Name <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Putra"
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      National Identity Number / ID Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={nik}
                      onChange={(e) => setNik(e.target.value.replace(/\D/g, ""))}
                      placeholder="Masukkan NIK 16 digit"
                      maxLength={16}
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800 transition-all font-mono tracking-wider font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Gender <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <select
                        value={jenisKelamin}
                        onChange={(e) => setJenisKelamin(e.target.value as any)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800 transition-all font-medium cursor-pointer"
                      >
                        <option value="">Pilih Jenis Kelamin</option>
                        <option value="LAKI_LAKI">Laki-Laki</option>
                        <option value="PEREMPUAN">Perempuan</option>
                        <option value="LAINNYA">Lainnya</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Date of Birth <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        type="date"
                        value={tanggalLahir}
                        onChange={(e) => setTanggalLahir(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800 transition-all font-medium cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* ── Group 2: YOUR RESIDENTIAL ADDRESS ── */}
                <div className="space-y-5 pt-6 border-t border-slate-100 animate-in fade-in">
                  <div>
                    <h3 className="text-xs font-bold text-teal-600 uppercase tracking-widest">
                      Your Residential Address
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Lengkapi alamat tinggal utama Anda. Klik field alamat untuk menggunakan map pemilih.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Address Label / Label Alamat
                      </label>
                      <select
                        value={labelAlamat}
                        onChange={(e) => setLabelAlamat(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800 transition-all font-medium cursor-pointer"
                      >
                        <option value="Rumah">Rumah (Home)</option>
                        <option value="Kantor">Kantor (Office)</option>
                        <option value="Apartemen">Apartemen (Apartment)</option>
                        <option value="Lainnya">Lainnya (Custom)</option>
                      </select>
                    </div>

                    {labelAlamat === "Lainnya" && (
                      <div className="space-y-1.5 animate-in fade-in duration-200">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Custom Label
                        </label>
                        <input
                          type="text"
                          value={customLabelAlamat}
                          onChange={(e) => setCustomLabelAlamat(e.target.value)}
                          placeholder="Kost, Toko, dll"
                          className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800 transition-all font-medium"
                        />
                      </div>
                    )}
                  </div>

                  {/* Street Address / Alamat Lengkap with Map Picker Trigger & GPS Button */}
                  <div className="space-y-1.5 relative">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        Street Address / Alamat Lengkap <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleAutoGPS}
                        disabled={locating}
                        className="text-[10px] font-bold text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1 bg-teal-50 px-2.5 py-1 rounded-full cursor-pointer disabled:opacity-50"
                      >
                        {locating ? (
                          <>
                            <Loader2 size={10} className="animate-spin text-teal-500" />
                            Mendeteksi...
                          </>
                        ) : (
                          <>
                            <MapPin size={10} />
                            Gunakan Lokasi Saat Ini (GPS)
                          </>
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <textarea
                        rows={2}
                        value={alamatLengkap}
                        onClick={() => setMapOpen(true)}
                        readOnly
                        placeholder="Klik di sini untuk memilih lokasi Anda menggunakan peta..."
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800 transition-all font-medium resize-none cursor-pointer"
                      />
                      <span 
                        onClick={() => setMapOpen(true)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors cursor-pointer p-1"
                      >
                        <Map size={16} />
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Address Notes / Catatan Tambahan (Optional)
                    </label>
                    <input
                      type="text"
                      value={catatanAlamat}
                      onChange={(e) => setCatatanAlamat(e.target.value)}
                      placeholder="Contoh: Pagar warna hitam, samping warung kelontong..."
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800 transition-all font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        Province / Provinsi <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        value={provinsi}
                        onChange={(e) => setProvinsi(e.target.value)}
                        placeholder="DKI Jakarta"
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800 transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        City / Kota / Kabupaten <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        value={kabupaten}
                        onChange={(e) => setKabupaten(e.target.value)}
                        placeholder="Jakarta Selatan"
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5 sm:col-span-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        District / Kecamatan <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        value={kecamatan}
                        onChange={(e) => setKecamatan(e.target.value)}
                        placeholder="Kebayoran Baru"
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800 transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        Sub-district / Kelurahan <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        value={kelurahan}
                        onChange={(e) => setKelurahan(e.target.value)}
                        placeholder="Melawai"
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800 transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Postcode / Kode Pos (Optional)
                      </label>
                      <input
                        type="text"
                        value={kodePos}
                        onChange={(e) => setKodePos(e.target.value.replace(/\D/g, ""))}
                        maxLength={5}
                        placeholder="12160"
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800 transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* ── Group 3: CONTACT DETAILS ── */}
                <div className="space-y-5 pt-6 border-t border-slate-100">
                  <div>
                    <h3 className="text-xs font-bold text-teal-600 uppercase tracking-widest">
                      Contact Details
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Informasi email dan nomor HP aktif Anda untuk konfirmasi pesanan bounty.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Email Address
                    </label>
                    <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-500 font-medium select-none">
                      <Mail size={16} className="text-slate-400" />
                      <span>{defaultEmail}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Phone Number <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 select-none">
                        <span className="text-sm font-bold text-slate-500">+62</span>
                      </div>
                      <input
                        type="tel"
                        value={nomorHp}
                        onChange={(e) => setNomorHp(e.target.value.replace(/\D/g, ""))}
                        placeholder="8123456789"
                        className="w-full bg-slate-50/50 border border-slate-200 pl-14 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800 transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Account Details (Username) */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-teal-600 uppercase tracking-widest">
                    Your Account Details
                  </h3>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                    Tentukan username unik Anda untuk identitas di platform Bounty.
                  </p>
                </div>

                {/* Username */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Username <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold select-none">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ""))}
                      placeholder="username_anda"
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800 transition-all font-medium"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Hanya huruf, angka, dan underscore. Minimal 3 karakter.</p>
                </div>
              </div>
            )}

            {/* STEP 3: Summary */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-teal-600 uppercase tracking-widest">
                    Account Summary & Review
                  </h3>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                    Tinjau kembali seluruh data diri Anda sebelum menyelesaikan proses registrasi.
                  </p>
                </div>

                <div className="bg-slate-50/70 border border-slate-200/50 rounded-2xl divide-y divide-slate-100 text-xs">
                  {/* Personal details info */}
                  <div className="p-4 space-y-3">
                    <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Personal Details</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      {fotoProfil && (
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 border border-slate-200 shrink-0">
                          <img src={fotoProfil} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-slate-700 flex-1">
                        <div><span className="text-slate-400 font-medium">Nama Lengkap:</span> <span className="font-semibold">{firstName} {lastName}</span></div>
                        {nik && <div><span className="text-slate-400 font-medium">ID/NIK:</span> <span className="font-semibold font-mono">{nik}</span></div>}
                        <div><span className="text-slate-400 font-medium">Jenis Kelamin:</span> <span className="font-semibold">{jenisKelamin === "LAKI_LAKI" ? "Laki-laki" : jenisKelamin === "PEREMPUAN" ? "Perempuan" : "Lainnya"}</span></div>
                        <div><span className="text-slate-400 font-medium">Tgl Lahir:</span> <span className="font-semibold">{tanggalLahir}</span></div>
                      </div>
                    </div>
                  </div>

                  {/* Account details info */}
                  <div className="p-4 space-y-2">
                    <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Account Details</p>
                    <div className="grid grid-cols-2 gap-2 text-slate-700">
                      <div><span className="text-slate-400 font-medium">Username:</span> <span className="font-semibold font-mono text-teal-600">@{username}</span></div>
                      <div><span className="text-slate-400 font-medium">Email:</span> <span className="font-semibold">{defaultEmail}</span></div>
                      {nomorHp && <div><span className="text-slate-400 font-medium">Nomor HP:</span> <span className="font-semibold">+62 {nomorHp}</span></div>}
                    </div>
                  </div>

                  {/* Residential Address info */}
                  <div className="p-4 space-y-2">
                    <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Residential Address</p>
                    <div className="text-slate-700 space-y-1">
                      <div>
                        <span className="text-slate-400 font-medium">Label Alamat:</span>{" "}
                        <span className="font-semibold px-2 py-0.5 bg-slate-200/60 rounded-full text-[10px] text-slate-600">
                          {labelAlamat === "Lainnya" ? customLabelAlamat || "Alamat" : labelAlamat}
                        </span>
                      </div>
                      <div className="mt-1"><span className="text-slate-400 font-medium">Alamat:</span> <span className="font-semibold">{alamatLengkap}</span></div>
                      {catatanAlamat && <div><span className="text-slate-400 font-medium">Catatan Alamat:</span> <span className="font-semibold text-slate-600 italic">"{catatanAlamat}"</span></div>}
                      
                      <div className="grid grid-cols-2 gap-2 mt-2 border-t border-slate-100 pt-2 text-[11px]">
                        <div><span className="text-slate-400 font-medium">Provinsi:</span> <span className="font-semibold">{provinsi}</span></div>
                        <div><span className="text-slate-400 font-medium">Kota:</span> <span className="font-semibold">{kabupaten}</span></div>
                        {kecamatan && <div><span className="text-slate-400 font-medium">Kecamatan:</span> <span className="font-semibold">{kecamatan}</span></div>}
                        {kelurahan && <div><span className="text-slate-400 font-medium">Kelurahan:</span> <span className="font-semibold">{kelurahan}</span></div>}
                        {kodePos && <div><span className="text-slate-400 font-medium">Kode Pos:</span> <span className="font-semibold font-mono">{kodePos}</span></div>}
                        <div><span className="text-slate-400 font-medium">Koordinat (Lat/Lng):</span> <span className="font-semibold font-mono">{latitude}, {longitude}</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-center text-slate-400 leading-relaxed max-w-md mx-auto">
                  Dengan mengklik "Ya, Selesaikan Pendaftaran", data Anda akan disimpan secara permanen di database Bounty yang aman.
                </p>
              </div>
            )}

            {/* STEP 4: Success Receipt */}
            {currentStep === 4 && (
              <div className="flex flex-col items-center justify-center text-center py-10 space-y-6">
                <div className="w-20 h-20 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center animate-bounce">
                  <CheckCircle2 size={44} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-800">
                    Registration Completed!
                  </h3>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Selamat, akun Bounty Anda telah selesai diintegrasikan secara sukses ke database.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3.5 inline-flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                  <span className="text-xs text-slate-500 font-medium">
                    Mengalihkan ke dashboard dalam <strong className="text-teal-600 font-bold">{countdown}</strong> detik...
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions Panel (Buttons) */}
        {currentStep < 4 && (
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-4 select-none">
            {currentStep === 1 && !canGoNext() && (
              <div className="text-xs text-rose-500 font-semibold bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3 flex items-center gap-2 animate-in fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                <span>Harap lengkapi kolom wajib: <strong className="text-rose-700 font-bold">{getMissingFields().join(", ")}</strong></span>
              </div>
            )}
            <div className="flex items-center justify-between">
            {/* Back Button */}
            {currentStep > 1 ? (
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={loading}
                className="h-11 rounded-2xl text-xs font-bold border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all flex items-center gap-1.5"
              >
                <ChevronLeft size={16} />
                Back
              </Button>
            ) : (
              <div /> // Spacer
            )}

            {/* Next / Submit Button */}
            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                disabled={!canGoNext()}
                className="h-11 rounded-2xl text-xs font-bold bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/15 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-teal-500/30 transition-all"
              >
                Next
                <ChevronRight size={16} />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="h-11 rounded-2xl text-xs font-bold bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/15 flex items-center gap-2 disabled:opacity-50 hover:shadow-teal-500/30 transition-all"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    Ya, Selesaikan Pendaftaran
                    <ArrowRight size={16} />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      )}
      </div>

      {/* Map Picker Modal Component */}
      <MapPickerModal
        isOpen={mapOpen}
        onClose={() => setMapOpen(false)}
        onConfirm={handleMapConfirm}
        initialLat={latitude}
        initialLng={longitude}
      />
    </div>
  );
}
