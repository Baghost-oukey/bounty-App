"use client";

import { User } from "lucide-react";
import React from "react";

interface StepSummaryProps {
  firstName: string;
  lastName: string;
  nik: string;
  jenisKelamin: string;
  tanggalLahir: string;
  fotoProfil: string;
  labelAlamat: string;
  customLabelAlamat: string;
  alamatLengkap: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  kelurahan: string;
  kodePos: string;
  catatanAlamat: string;
  latitude: number;
  longitude: number;
  nomorHp: string;
  defaultEmail: string;
}

export default function StepSummary({
  firstName,
  lastName,
  nik,
  jenisKelamin,
  tanggalLahir,
  fotoProfil,
  labelAlamat,
  customLabelAlamat,
  alamatLengkap,
  provinsi,
  kabupaten,
  kecamatan,
  kelurahan,
  kodePos,
  catatanAlamat,
  latitude,
  longitude,
  nomorHp,
  defaultEmail,
}: StepSummaryProps) {
  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h3 className="text-xl font-bold text-blue-600 uppercase tracking-tight">
          Ringkasan Biodata Anda
        </h3>
        <p className="text-xs text-slate-400 font-light mt-1 leading-relaxed">
          Tinjau kembali seluruh data diri Anda sebelum menyelesaikan proses registrasi.
        </p>
      </div>

      <div className="bg-slate-50/60 border border-slate-200/50 rounded-3xl divide-y divide-slate-200/60 text-sm shadow-sm">
        {/* Personal details info */}
        <div className="p-6 space-y-4">
          <p className="font-bold text-blue-600/80 uppercase tracking-wider text-[11px]">Biodata Anda</p>
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {fotoProfil && (
              <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-200 border-2 border-white shadow-sm shrink-0 animate-in fade-in zoom-in-90 duration-300">
                <img src={fotoProfil} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5 text-slate-700 flex-1 w-full">
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-400 text-[10px] font-light uppercase tracking-wider">Nama Lengkap</span>
                <span className="font-semibold text-slate-800 text-sm sm:text-base">{firstName} {lastName}</span>
              </div>
              {nik && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-slate-400 text-[10px] font-light uppercase tracking-wider">ID / NIK</span>
                  <span className="font-semibold text-slate-800 font-mono text-sm sm:text-base">{nik}</span>
                </div>
              )}
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-400 text-[10px] font-light uppercase tracking-wider">Jenis Kelamin</span>
                <span className="font-semibold text-slate-800 text-sm sm:text-base">
                  {jenisKelamin === "LAKI_LAKI" 
                    ? "Laki-laki" 
                    : jenisKelamin === "PEREMPUAN" 
                    ? "Perempuan" 
                    : jenisKelamin === "LAINNYA" 
                    ? "Lainnya" 
                    : "-"}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-400 text-[10px] font-light uppercase tracking-wider">Tanggal Lahir</span>
                <span className="font-semibold text-slate-800 text-sm sm:text-base">{tanggalLahir || "-"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Account details info */}
        <div className="p-6 space-y-4">
          <p className="font-bold text-blue-600/80 uppercase tracking-wider text-[11px]">Detail Akun</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5 text-slate-700 w-full">
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-400 text-[10px] font-light uppercase tracking-wider">Email</span>
              <span className="font-semibold text-slate-800 text-sm sm:text-base select-all">{defaultEmail}</span>
            </div>
            {nomorHp && (
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-400 text-[10px] font-light uppercase tracking-wider">Nomor HP</span>
                <span className="font-semibold text-slate-800 text-sm sm:text-base select-all">+62 {nomorHp}</span>
              </div>
            )}
          </div>
        </div>

        {/* Residential Address info */}
        <div className="p-6 space-y-5">
          <p className="font-bold text-blue-600/80 uppercase tracking-wider text-[11px]">Alamat Anda</p>
          <div className="text-slate-700 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[10px] font-light uppercase tracking-wider">Label Alamat:</span>
              <span className="font-semibold px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                {labelAlamat === "Lainnya" ? customLabelAlamat || "Alamat" : labelAlamat}
              </span>
            </div>
            
            <div className="flex flex-col gap-1 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
              <span className="text-slate-400 text-[10px] font-light uppercase tracking-wider">Alamat Lengkap</span>
              <span className="font-semibold text-slate-800 text-xs sm:text-sm leading-relaxed">{alamatLengkap}</span>
              {catatanAlamat && (
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <span className="text-slate-400 text-[10px] font-light uppercase tracking-wider block mb-0.5">Catatan Tambahan</span>
                  <span className="font-semibold text-slate-650 italic text-xs">"{catatanAlamat}"</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-400 text-[10px] font-light uppercase tracking-wider">Provinsi</span>
                <span className="font-semibold text-slate-800 text-xs sm:text-sm">{provinsi}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-400 text-[10px] font-light uppercase tracking-wider">Kota / Kabupaten</span>
                <span className="font-semibold text-slate-800 text-xs sm:text-sm">{kabupaten}</span>
              </div>
              {kecamatan && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-slate-400 text-[10px] font-light uppercase tracking-wider">Kecamatan</span>
                  <span className="font-semibold text-slate-800 text-xs sm:text-sm">{kecamatan}</span>
                </div>
              )}
              {kelurahan && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-slate-400 text-[10px] font-light uppercase tracking-wider">Kelurahan</span>
                  <span className="font-semibold text-slate-800 text-xs sm:text-sm">{kelurahan}</span>
                </div>
              )}
              {kodePos && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-slate-400 text-[10px] font-light uppercase tracking-wider">Kode Pos</span>
                  <span className="font-semibold text-slate-800 font-mono text-xs sm:text-sm">{kodePos}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-center text-slate-400 leading-relaxed max-w-md mx-auto">
        Dengan mengklik "Ya, Selesaikan Pendaftaran", data Anda akan disimpan secara permanen pada sistem.
      </p>
    </div>
  );
}
