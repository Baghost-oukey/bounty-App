"use client";

import React from "react";
import { User, Image as ImageIcon } from "lucide-react";

interface FormPersonalDetailsProps {
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  nik: string;
  setNik: (val: string) => void;
  jenisKelamin: "LAKI_LAKI" | "PEREMPUAN" | "LAINNYA" | "";
  setJenisKelamin: (val: "LAKI_LAKI" | "PEREMPUAN" | "LAINNYA" | "") => void;
  tanggalLahir: string;
  setTanggalLahir: (val: string) => void;
  fotoProfil: string;
  setFotoProfil: (val: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormPersonalDetails({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  nik,
  setNik,
  jenisKelamin,
  setJenisKelamin,
  tanggalLahir,
  setTanggalLahir,
  fotoProfil,
  setFotoProfil,
  handleFileChange,
}: FormPersonalDetailsProps) {
  return (
    <div className="space-y-5 animate-in fade-in">
      <div>
        <h3 className="text-xl font-bold text-blue-600 uppercase">
        Detail Identitas Mu
        </h3>
        <p className="text-xs font-light mt-1">
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
          <span className=" uppercase flex items-center gap-1 text-base font-bold">
            <ImageIcon size={20} />
            Foto Profil
          </span>
          <div className="flex flex-wrap gap-2 items-center mt-3">
            <input
              type="file"
              id="avatar-upload-inner"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="avatar-upload-inner"
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
          <label className="text-base font-bold text-blue-600 uppercase">
            Nama Pertama
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Bagus"
            className="w-full bg-slate-50/50 border border-slate-200 mt-3 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-base font-bold text-blue-600 uppercase">
            Nama Terakhir
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Putra"
            className="w-full bg-slate-50/50 border mt-3 border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all font-medium"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-base font-bold text-blue-600 uppercase">
          Masukan Nomor NIK (Optional)
        </label>
        <input
          type="text"
          value={nik}
          onChange={(e) => setNik(e.target.value.replace(/\D/g, ""))}
          placeholder="Masukkan NIK 16 digit"
          maxLength={16}
          className="w-full bg-slate-50/50 border mt-3 border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono tracking-wider font-semibold"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-base font-bold text-blue-600 uppercase">
            Gender
          </label>
          <select
            value={jenisKelamin}
            onChange={(e) => setJenisKelamin(e.target.value as any)}
            className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all font-medium cursor-pointer"
          >
            <option value="">Pilih Jenis Kelamin</option>
            <option value="LAKI_LAKI">Laki-Laki</option>
            <option value="PEREMPUAN">Perempuan</option>
            <option value="LAINNYA">Lainnya</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-base font-bold text-blue-600 uppercase">
            Tanggal Lahir
          </label>
          <input
            type="date"
            value={tanggalLahir}
            onChange={(e) => setTanggalLahir(e.target.value)}
            className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all font-medium cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
