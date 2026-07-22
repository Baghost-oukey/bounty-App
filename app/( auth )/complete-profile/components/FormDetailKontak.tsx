"use client";

import React from "react";
import { Mail } from "lucide-react";

interface FormContactDetailsProps {
  nomorHp: string;
  setNomorHp: (val: string) => void;
  defaultEmail: string;
}

export default function FormContactDetails({
  nomorHp,
  setNomorHp,
  defaultEmail,
}: FormContactDetailsProps) {
  return (
    <div className="space-y-5 animate-in fade-in">
      <div>
        <h3 className="text-base font-bold text-blue-600 uppercase">
          Informasi Kontak
        </h3>
        <p className="text-sm mt-1">
          Informasi email dan nomor HP aktif Anda untuk konfirmasi pesanan bounty.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-base font-bold text-blue-600 uppercase">
          Alamat Email
        </label>
        <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-500 font-medium select-none mt-3">
          <Mail size={16} className="text-slate-400" />
          <span>{defaultEmail}</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-base font-bold text-blue-600 uppercase">
          Nomor Aktif HP
        </label>
        <div className="relative mt-3">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 select-none">
            <span className="text-sm font-bold text-slate-500">+62</span>
          </div>
          <input
            type="tel"
            value={nomorHp}
            onChange={(e) => setNomorHp(e.target.value.replace(/\D/g, ""))}
            placeholder="8123456789"
            className="w-full bg-slate-50/50 border border-slate-200 pl-14 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all font-medium"
          />
        </div>
      </div>
    </div>
  );
}
