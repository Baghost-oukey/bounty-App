"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { completeUserProfile } from "@/app/actions/profile";
import { ChevronRight, ChevronLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Modular Child Components
import SidebarStepper from "./TimelineSidebarForm";
import StepPersonalAddress from "./FormLayoutBiodata";
import StepAccountDetails from "./FormUsername";
import StepSummary from "./FormPreview";
import StepReceipt from "./FormSelesai";

// MapPickerModal is imported dynamically due to Leaflet SSR constraint
const MapPickerModal = dynamic(() => import("./Map"), { ssr: false });

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
      
      {/* ── Left Stepper Panel (Sidebar) ── */}
      <SidebarStepper currentStep={currentStep} steps={STEPS} />

      {/* ── Right Form Panel (Content & Navigation) ── */}
      <div className="lg:col-span-8 p-6 lg:p-10 flex flex-col justify-between bg-white max-h-[90vh] overflow-y-auto">
        
        {/* Step Body */}
        <div className="flex-1">
          {error && (
            <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl p-4 text-xs font-medium flex items-center gap-2.5 animate-in fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
              {error}
            </div>
          )}

          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {currentStep === 1 && (
              <StepPersonalAddress
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                nik={nik}
                setNik={setNik}
                jenisKelamin={jenisKelamin}
                setJenisKelamin={setJenisKelamin}
                tanggalLahir={tanggalLahir}
                setTanggalLahir={setTanggalLahir}
                fotoProfil={fotoProfil}
                setFotoProfil={setFotoProfil}
                labelAlamat={labelAlamat}
                setLabelAlamat={setLabelAlamat}
                customLabelAlamat={customLabelAlamat}
                setCustomLabelAlamat={setCustomLabelAlamat}
                alamatLengkap={alamatLengkap}
                provinsi={provinsi}
                setProvinsi={setProvinsi}
                kabupaten={kabupaten}
                setKabupaten={setKabupaten}
                kecamatan={kecamatan}
                setKecamatan={setKecamatan}
                kelurahan={kelurahan}
                setKelurahan={setKelurahan}
                kodePos={kodePos}
                setKodePos={setKodePos}
                catatanAlamat={catatanAlamat}
                setCatatanAlamat={setCatatanAlamat}
                latitude={latitude}
                longitude={longitude}
                nomorHp={nomorHp}
                setNomorHp={setNomorHp}
                defaultEmail={defaultEmail}
                handleAutoGPS={handleAutoGPS}
                locating={locating}
                setMapOpen={setMapOpen}
                handleFileChange={handleFileChange}
              />
            )}

            {currentStep === 2 && (
              <StepAccountDetails username={username} setUsername={setUsername} />
            )}

            {currentStep === 3 && (
              <StepSummary
                firstName={firstName}
                lastName={lastName}
                nik={nik}
                jenisKelamin={jenisKelamin}
                tanggalLahir={tanggalLahir}
                fotoProfil={fotoProfil}
                labelAlamat={labelAlamat}
                customLabelAlamat={customLabelAlamat}
                alamatLengkap={alamatLengkap}
                provinsi={provinsi}
                kabupaten={kabupaten}
                kecamatan={kecamatan}
                kelurahan={kelurahan}
                kodePos={kodePos}
                catatanAlamat={catatanAlamat}
                latitude={latitude}
                longitude={longitude}
                nomorHp={nomorHp}
                defaultEmail={defaultEmail}
              />
            )}

            {currentStep === 4 && <StepReceipt countdown={countdown} />}
          </div>
        </div>

        {/* Bottom Actions Panel (Buttons & Warnings) */}
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
                  className="h-11 rounded-2xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/15 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-blue-600/30 transition-all cursor-pointer"
                >
                  Next
                  <ChevronRight size={16} />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="h-11 rounded-2xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/15 flex items-center gap-2 disabled:opacity-50 hover:shadow-blue-600/30 transition-all cursor-pointer"
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
