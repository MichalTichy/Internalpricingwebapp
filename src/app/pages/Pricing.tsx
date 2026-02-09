import React, { useState } from 'react';
import { PricingStep1 } from '../components/pricing/PricingStep1';
import { PricingStep2 } from '../components/pricing/PricingStep2';
import { PricingStep3 } from '../components/pricing/PricingStep3';
import { Order } from './Orders';

interface PricingProps {
  initialOrder?: Order | null;
}

export function Pricing({ initialOrder }: PricingProps) {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);

  // If initial order is passed, logic to determine step:
  // For prototype, we'll start at Step 1 unless specific logic.
  // Actually, let's say if order status is 'in_progress', go to Step 2.
  React.useEffect(() => {
    if (initialOrder) {
      if (initialOrder.status === 'in_progress') {
        setStep(2);
        // Mock file name for step 2
      } else if (initialOrder.status === 'completed') {
        setStep(3);
      } else {
        setStep(1);
      }
    }
  }, [initialOrder]);

  const handleUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    // Simulate upload process
    setTimeout(() => {
      setStep(2);
    }, 1000);
  };

  const handlePricingComplete = () => {
    setStep(3);
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      {/* Progress Stepper */}
      <div className="mb-8">
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center w-full">
            {[
              { id: 1, name: 'Upload Budget' },
              { id: 2, name: 'Pricing' },
              { id: 3, name: 'Export' },
            ].map((s, stepIdx, steps) => (
              <li key={s.name} className={`${stepIdx !== steps.length - 1 ? 'flex-1' : ''} flex items-center`}>
                <span className="flex items-center text-sm font-medium">
                   <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                       step > s.id 
                         ? 'bg-[#0072BC] border-[#0072BC] text-white' 
                         : step === s.id 
                         ? 'bg-white border-[#0072BC] text-[#0072BC]' 
                         : 'bg-white border-gray-300 text-gray-500'
                     }`}>
                       {step > s.id ? (
                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                         </svg>
                       ) : (
                         <span>{s.id}</span>
                       )}
                   </span>
                   <span className={`ml-3 text-sm font-medium whitespace-nowrap ${step === s.id ? 'text-[#0072BC]' : 'text-gray-500'}`}>
                       {s.name}
                   </span>
                </span>
                
                {stepIdx !== steps.length - 1 && (
                    <div className={`flex-1 mx-4 h-0.5 ${step > s.id ? 'bg-[#0072BC]' : 'bg-gray-200'}`}></div>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className="h-full">
        {step === 1 && <PricingStep1 onUpload={handleUpload} />}
        {step === 2 && <PricingStep2 onNext={handlePricingComplete} fileName={file?.name || 'Pelhřimov_Budget_v1.xlsx'} />}
        {step === 3 && <PricingStep3 fileName={file?.name || 'Pelhřimov_Budget_v1.xlsx'} />}
      </div>
    </div>
  );
}