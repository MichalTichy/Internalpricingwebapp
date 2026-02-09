import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { UploadCloud, FileSpreadsheet } from 'lucide-react';

interface PricingStep1Props {
  onUpload: (file: File) => void;
}

export function PricingStep1({ onUpload }: PricingStep1Props) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Upload Budget File</h2>
        <p className="text-gray-500 mt-2">Upload an Excel file (.xlsx, .xlsm) to begin pricing.</p>
      </div>

      <Card 
        className={`p-10 border-2 border-dashed transition-colors cursor-pointer ${
          isDragging ? 'border-[#0072BC] bg-blue-50' : 'border-gray-300 hover:border-[#0072BC] hover:bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-16 w-16 bg-blue-100 text-[#0072BC] rounded-full flex items-center justify-center">
            <UploadCloud size={32} />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Excel files (.xlsx, .xlsm)
            </p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".xlsx,.xlsm"
            onChange={handleFileChange}
          />
        </div>
      </Card>

      <div className="mt-8">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Files</h3>
        <div className="space-y-2">
          {/* Mock recent files */}
          {['Rozpočet_2026_v1.xlsx', 'Pelhřimov_export.xlsm'].map((file, i) => (
             <div key={i} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
               <div className="flex items-center">
                 <FileSpreadsheet className="h-5 w-5 text-green-600 mr-3" />
                 <span className="text-sm font-medium text-gray-700">{file}</span>
               </div>
               <Button variant="ghost" size="sm" onClick={() => {
                 const mockFile = new File([""], file, { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                 onUpload(mockFile);
               }}>Select</Button>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}