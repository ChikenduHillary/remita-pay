import React from 'react';
import { Check } from 'lucide-react';
import { PaymentStep } from '../types';

interface StepIndicatorProps {
  currentStep: PaymentStep;
}

const steps = [
  { key: 'input', label: 'Enter RRR', description: 'Provide invoice reference' },
  { key: 'review', label: 'Review Invoice', description: 'Confirm payment details' },
  { key: 'payment', label: 'Make Payment', description: 'Scan QR code' },
  { key: 'success', label: 'Complete', description: 'Payment confirmed' },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const getCurrentStepIndex = (step: PaymentStep): number => {
    const stepMap: Record<string, number> = {
      input: 0,
      loading: 0,
      review: 1,
      payment: 2,
      processing: 2,
      success: 3,
      error: -1,
    };
    return stepMap[step] ?? 0;
  };

  const currentIndex = getCurrentStepIndex(currentStep);

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <div key={step.key} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                <div
                  className={`
                    relative flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm
                    transition-all duration-300
                    ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isActive
                        ? 'bg-blue-500 text-white ring-4 ring-blue-100'
                        : 'bg-gray-200 text-gray-500'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check size={18} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`
                      flex-1 h-0.5 mx-4 transition-all duration-300
                      ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                    `}
                  />
                )}
              </div>
              <div className="mt-3 text-center">
                <p
                  className={`
                    text-sm font-medium transition-colors
                    ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}
                  `}
                >
                  {step.label}
                </p>
                <p className="text-xs text-gray-400 mt-1 hidden sm:block">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};