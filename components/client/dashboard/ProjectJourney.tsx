'use client';

import React from 'react';
import { useClientDashboard } from '@/lib/client/ClientDashboardContext';
import {
  StepCheckIcon,
  StepRulerIcon,
  StepPaletteIcon,
  StepPaymentIcon,
  StepMaskingIcon,
  StepMaterialIcon,
  StepSignoffIcon,
  StepFactoryIcon,
  StepToolsIcon,
  StepQcIcon,
  StepKeyIcon,
  StepShieldIcon,
} from '../icons/ClientIcons';

const STEP_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  booking: StepCheckIcon,
  measurement: StepRulerIcon,
  dqc1: StepPaletteIcon,
  payment_10: StepPaymentIcon,
  masking: StepMaskingIcon,
  dqc2: StepMaterialIcon,
  payment_40: StepSignoffIcon,
  production: StepFactoryIcon,
  // legacy/fallback mappings
  design: StepPaletteIcon,
  installation: StepToolsIcon,
  qc: StepQcIcon,
  handover: StepKeyIcon,
  warranty: StepShieldIcon,
};

export default function ProjectJourney() {
  const { data } = useClientDashboard();
  const steps = data.journeySteps;

  const currentStepIndex = steps.findIndex((s) => s.status === 'in_progress');
  const phaseDisplay = currentStepIndex !== -1
    ? `Phase ${currentStepIndex + 1} of ${steps.length}`
    : `Phase ${steps.length} of ${steps.length}`;

  return (
    <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-black/[0.03] mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-1">
        <h2 className="text-xl sm:text-[23px] font-extrabold text-gray-950 tracking-tight">
          Project Journey
        </h2>
        <span className="text-xs sm:text-sm font-semibold text-gray-500">
          {phaseDisplay}
        </span>
      </div>

      {/* Stepper Timeline */}
      <div className="overflow-x-auto pb-4 pt-2 -mx-2 px-2 scrollbar-none">
        <div className="min-w-[880px] flex items-start justify-between relative">
          {steps.map((step, index) => {
            const IconComponent = STEP_ICON_MAP[step.icon] || StepCheckIcon;
            const isCompleted = step.status === 'completed';
            const isInProgress = step.status === 'in_progress';
            const isLast = index === steps.length - 1;

            return (
              <div
                key={step.id}
                className="relative flex-1 flex flex-col items-center group"
              >
                {/* Connecting Line to next step */}
                {!isLast && (
                  <div
                    className={`absolute top-5 left-1/2 w-full h-[2.5px] z-0 ${
                      index < currentStepIndex
                        ? 'bg-black'
                        : index === currentStepIndex
                        ? 'bg-gradient-to-r from-black via-gray-300 to-[#E8E4DC]'
                        : 'bg-[#EAE6DE]'
                    }`}
                  />
                )}

                {/* Step Circle Node */}
                <div className="relative z-10 flex items-center justify-center">
                  {isCompleted && (
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {isInProgress && (
                    <div className="w-11 h-11 rounded-full bg-[#DC2626] text-white flex items-center justify-center ring-4 ring-[#DC2626]/20 shadow-md transition-transform group-hover:scale-105">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                  )}

                  {!isCompleted && !isInProgress && (
                    <div className="w-10 h-10 rounded-full bg-[#FBF9F5] border border-gray-300 text-gray-400 flex items-center justify-center transition-colors group-hover:border-gray-400">
                      <IconComponent className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Step Text Info */}
                <div className="mt-3 text-center">
                  <div
                    className={`text-sm tracking-tight ${
                      isInProgress
                        ? 'font-extrabold text-[#DC2626]'
                        : isCompleted
                        ? 'font-bold text-gray-900'
                        : 'font-semibold text-gray-500'
                    }`}
                  >
                    {step.name}
                  </div>
                  <div
                    className={`text-[10.5px] tracking-wider uppercase mt-0.5 ${
                      isInProgress
                        ? 'font-extrabold text-[#DC2626]'
                        : 'font-semibold text-gray-400'
                    }`}
                  >
                    {step.dateOrStatus}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
