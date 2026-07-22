"use client";

import React from "react";
import { MapPin, Map, Loader2 } from "lucide-react";

interface FormAddressDetailsProps {
  labelAlamat: string;
  setLabelAlamat: (val: string) => void;
  customLabelAlamat: string;
  setCustomLabelAlamat: (val: string) => void;
  alamatLengkap: string;
  provinsi: string;
  setProvinsi: (val: string) => void;
  kabupaten: string;
  setKabupaten: (val: string) => void;
  kecamatan: string;
  setKecamatan: (val: string) => void;
  kelurahan: string;
  setKelurahan: (val: string) => void;
  kodePos: string;
  setKodePos: (val: string) => void;
  catatanAlamat: string;
  setCatatanAlamat: (val: string) => void;
  latitude: number;
  longitude: number;
  handleAutoGPS: () => void;
  locating: boolean;
  setMapOpen: (val: boolean) => void;
}

export default function FormAddressDetails({
  labelAlamat,
  setLabelAlamat,
  customLabelAlamat,
  setCustomLabelAlamat,
  alamatLengkap,
  provinsi,
  setProvinsi,
  kabupaten,
  setKabupaten,
  kecamatan,
  setKecamatan,
  kelurahan,
  setKelurahan,
  kodePos,
  setKodePos,
  catatanAlamat,
  setCatatanAlamat,
  latitude,
  longitude,
  handleAutoGPS,
  locating,
  setMapOpen,
}: FormAddressDetailsProps) {
  return (
    <div className="space-y-5 animate-in fade-in">
      <div>
        <h3 className="text-xl font-bold text-blue-600 uppercase">
          Informasi Alamat
        </h3>
        <p className="text-xs font-light mt-1">
          Lengkapi alamat tinggal utama Anda. Klik alamat untuk menggunakan map pemilih.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-base text-blue-600 font-bold uppercase">
            Kategori Tempat Tinggal Anda
          </label>
          <select
            value={labelAlamat}
            onChange={(e) => setLabelAlamat(e.target.value)}
            className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl mt-2 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all font-medium cursor-pointer"
          >
            <option value="Rumah">Rumah</option>
            <option value="Kantor">Kantor</option>
            <option value="Apartemen">Apartemen</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        {labelAlamat === "Lainnya" && (
          <div className="space-y-1.5 animate-in fade-in duration-200">
            <label className="text-base font-bold text-slate-500 uppercase">
              Label Alamat
            </label>
            <input
              type="text"
              value={customLabelAlamat}
              onChange={(e) => setCustomLabelAlamat(e.target.value)}
              placeholder="Kost, Toko, dll"
              className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all font-medium"
            />
          </div>
        )}
      </div>

      {/* Street Address / Alamat Lengkap with Map Picker Trigger & GPS Button */}
      <div className="space-y-1.5 relative">
        <div className="flex justify-between items-center">
          <label className="text-base mb-2 font-bold text-blue-600 uppercase flex items-center gap-1">
            Alamat Lengkap
          </label>
          <button
            type="button"
            onClick={handleAutoGPS}
            disabled={locating}
            className="text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-full cursor-pointer disabled:opacity-50"
          >
            {locating ? (
              <>
                <Loader2 size={10} className="animate-spin text-blue-500" />
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
            className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all font-medium resize-none cursor-pointer"
          />
          <span 
            onClick={() => setMapOpen(true)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer p-1"
          >
            <Map size={16} />
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-base font-bold text-blue-600 uppercase ">
         Detial Alamat Tambahan (Opsional)
        </label>
        <input
          type="text"
          value={catatanAlamat}
          onChange={(e) => setCatatanAlamat(e.target.value)}
          placeholder="Contoh: Pagar warna hitam, samping warung kelontong..."
          className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl mt-2 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all font-medium"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-base font-bold text-blue-600 uppercase flex items-center gap-1">
            Provinsi 
          </label>
          <input
            type="text"
            value={provinsi}
            onChange={(e) => setProvinsi(e.target.value)}
            placeholder="DKI Jakarta"
            className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-base font-bold text-blue-600 uppercase flex items-center gap-1">
           Kota / Kabupaten 
          </label>
          <input
            type="text"
            value={kabupaten}
            onChange={(e) => setKabupaten(e.target.value)}
            placeholder="Jakarta Selatan"
            className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5 sm:col-span-1">
          <label className="text-base font-bold text-blue-600 uppercase  flex items-center gap-1">
            Kecamatan
          </label>
          <input
            type="text"
            value={kecamatan}
            onChange={(e) => setKecamatan(e.target.value)}
            placeholder="Kebayoran Baru"
            className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all font-medium"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-1">
          <label className="text-base font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
           Kelurahan
          </label>
          <input
            type="text"
            value={kelurahan}
            onChange={(e) => setKelurahan(e.target.value)}
            placeholder="Melawai"
            className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all font-medium"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-1">
          <label className="text-base font-bold text-blue-600 uppercase tracking-wider">
           Kode Pos
          </label>
          <input
            type="text"
            value={kodePos}
            onChange={(e) => setKodePos(e.target.value.replace(/\D/g, ""))}
            maxLength={5}
            placeholder="12160"
            className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all font-medium"
          />
        </div>
      </div>
    </div>
  );
}
