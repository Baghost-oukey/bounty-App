"use client";

import { Check, ShieldCheck } from "lucide-react";
import Logo from "@/assets/logo/logo";

interface StepConfig {
  id: number;
  label: string;
}

interface SidebarStepperProps {
  currentStep: number;
  steps: StepConfig[];
}

export default function SidebarStepper({ currentStep, steps }: SidebarStepperProps) {
  return (
    <div className="lg:col-span-4 bg-slate-50/50 p-6 lg:p-10 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-between select-none">
      <div>
        {/* Logo / Branding */}
        <div className="flex items-center gap-2.5 mb-10">
          <Logo />
          <span className="font-bold text-xl tracking-tight text-slate-800">Bounty</span>
        </div>

        <h2 className="text-xl font-bold text-slate-800 leading-snug mb-8">
          Langkah - Langkah
        </h2>

        {/* Steps List */}
        <div className="space-y-8">
          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;

            return (
              <div key={step.id} className="flex items-center gap-4 relative">
                <div className="relative flex flex-col items-center shrink-0">
                  {/* Circle */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all duration-300 ${
                      isCompleted
                        ? "bg-blue-500 border-blue-500 text-white"
                        : isActive
                        ? "bg-blue-50 border-blue-500 text-blue-600 border-2"
                        : "bg-white border-slate-200 text-slate-400"
                    }`}
                  >
                    {isCompleted ? <Check size={14} strokeWidth={3} /> : step.id}
                  </div>
                  {/* Vertical Connector Line */}
                  {step.id < steps.length && (
                    <div
                      className={`absolute top-8 w-[2px] h-8 transition-colors duration-300 ${
                        isCompleted ? "bg-blue-500" : "bg-slate-200"
                      }`}
                    />
                  )}
                </div>
                <div className="flex flex-col justify-center">
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
    </div>
  );
}
