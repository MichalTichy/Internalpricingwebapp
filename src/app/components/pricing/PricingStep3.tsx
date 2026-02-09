import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Download, FileSpreadsheet, CheckCircle } from 'lucide-react';

interface PricingStep3Props {
  fileName: string;
}

export function PricingStep3({ fileName }: PricingStep3Props) {
  const [isExporting, setIsExporting] = useState(false);
  const [hasExported, setHasExported] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    // Mock export
    setTimeout(() => {
      setIsExporting(false);
      setHasExported(true);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="text-center mb-8">
        <div className="mx-auto h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Pricing Complete</h2>
        <p className="text-gray-500 mt-2">Your budget has been priced and is ready for export.</p>
      </div>

      <Card className="p-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-lg w-full">
            <FileSpreadsheet className="h-8 w-8 text-green-600 mr-4" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">{fileName || 'Exported_Budget.xlsx'}</h4>
              <p className="text-xs text-gray-500">Ready for download</p>
            </div>
            <div className="text-sm font-medium text-gray-900">
               124 KB
            </div>
          </div>

          <div className="w-full pt-4">
             <Button 
               className="w-full" 
               size="lg" 
               onClick={handleExport} 
               isLoading={isExporting}
               disabled={hasExported}
             >
               <Download className="mr-2 h-5 w-5" />
               {hasExported ? 'Exported Successfully' : 'Export to Excel'}
             </Button>
             
             {hasExported && (
               <p className="text-center text-sm text-green-600 mt-3 font-medium">
                 File downloaded successfully!
               </p>
             )}
          </div>
        </div>
      </Card>
    </div>
  );
}
