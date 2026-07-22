"use client";

import React from "react";

interface StepAccountDetailsProps {
  username: string;
  setUsername: (val: string) => void;
}

export default function StepAccountDetails({ username, setUsername }: StepAccountDetailsProps) {
  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h3 className="text-xl font-bold text-blue-600 uppercase tracking-tight">
          Your Account Details
        </h3>
        <p className="text-xs text-slate-400 font-light mt-1 leading-relaxed">
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
            className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all font-medium"
          />
        </div>
        <p className="text-[10px] text-slate-400 mt-0.5">Hanya huruf, angka, dan underscore. Minimal 3 karakter.</p>
      </div>
    </div>
  );
}
