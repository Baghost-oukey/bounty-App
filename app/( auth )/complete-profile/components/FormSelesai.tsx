"use client";

import { CheckCircle2 } from "lucide-react";
import React from "react";

interface StepReceiptProps {
  countdown: number;
}

export default function StepReceipt({ countdown }: StepReceiptProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 space-y-6 animate-in fade-in">
      <div className="w-20 h-20 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center animate-bounce">
        <CheckCircle2 size={44} />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-slate-800">
          Pendaftaran Selesai!
        </h3>
        <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
          Selamat, akun Bounty Anda telah selesai secara sukses.
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3.5 inline-flex items-center gap-3 select-none">
        <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
        <span className="text-xs text-slate-500 font-medium">
          Mengalihkan ke dashboard dalam <strong className="text-blue-600 font-bold">{countdown}</strong> detik...
        </span>
      </div>
    </div>
  );
}
