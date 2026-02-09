import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { CatalogueModal } from './CatalogueModal';
import { formatCurrency } from '../../../lib/utils';
import { Search, RotateCcw, Calculator, ArrowRight, ArrowLeftRight } from 'lucide-react';

interface PricingRow {
  id: string;
  isHeader?: boolean;
  matchProbability?: number; // 0-1
  index: string; // PČ
  supplier: string;
  discount: number;
  position: string;
  description: string;
  unit: string;
  quantity: number;
  deliveryPrice: number;
  assemblyPrice: number;
  // Computed
  deliveryTotal?: number;
  assemblyTotal?: number;
  finalPriceUnit?: number;
  lineTotal?: number;
}

interface PricingStep2Props {
  onNext: () => void;
  fileName: string;
}

const MOCK_DATA: PricingRow[] = [
  { id: 'h1', isHeader: true, index: '', supplier: '', discount: 0, position: '', description: 'Chlazení - Multisplit', unit: '', quantity: 0, deliveryPrice: 0, assemblyPrice: 0 },
  { id: '1', index: '1.1', matchProbability: 0.95, supplier: 'Daikin', discount: 15, position: 'K1', description: 'Venkovní jednotka 3MXM52N', unit: 'ks', quantity: 1, deliveryPrice: 45000, assemblyPrice: 3500 },
  { id: '2', index: '1.2', matchProbability: 0.85, supplier: 'Daikin', discount: 15, position: 'K1.1', description: 'Vnitřní jednotka FTXM25N', unit: 'ks', quantity: 2, deliveryPrice: 12500, assemblyPrice: 2500 },
  { id: '3', index: '1.3', matchProbability: 0.65, supplier: 'Daikin', discount: 15, position: 'K1.2', description: 'Vnitřní jednotka FTXM35N', unit: 'ks', quantity: 1, deliveryPrice: 14500, assemblyPrice: 2500 },
  { id: 'h2', isHeader: true, index: '', supplier: '', discount: 0, position: '', description: 'Rozvody chladu', unit: '', quantity: 0, deliveryPrice: 0, assemblyPrice: 0 },
  { id: '4', index: '2.1', matchProbability: 0.45, supplier: 'Generic', discount: 0, position: '', description: 'CU potrubí 6/10 izolované', unit: 'm', quantity: 45, deliveryPrice: 280, assemblyPrice: 120 },
  { id: '5', index: '2.2', matchProbability: 0.9, supplier: 'Generic', discount: 0, position: '', description: 'Kabel CYKY-J 3x1.5', unit: 'm', quantity: 60, deliveryPrice: 18, assemblyPrice: 25 },
  { id: '6', index: '2.3', matchProbability: 0.75, supplier: 'Aspen', discount: 10, position: '', description: 'Čerpadlo kondenzátu Mini Orange', unit: 'ks', quantity: 3, deliveryPrice: 2100, assemblyPrice: 800 },
];

export function PricingStep2({ onNext, fileName }: PricingStep2Props) {
  const [rows, setRows] = useState<PricingRow[]>(MOCK_DATA);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  // Helper to calculate totals
  const calculateRow = (row: PricingRow) => {
    if (row.isHeader) return row;
    
    const deliveryTotal = row.deliveryPrice * row.quantity; // Discount logic could be applied here if needed (e.g. price * (1-discount/100))
    // Let's assume discount is already applied or applied differently. For simplicity:
    // Final Unit Price = (Delivery Price * (1 - Discount/100)) + Assembly Price
    const discountedDelivery = row.deliveryPrice * (1 - row.discount / 100);
    const finalPriceUnit = discountedDelivery + row.assemblyPrice;
    const assemblyTotal = row.assemblyPrice * row.quantity;
    const lineTotal = finalPriceUnit * row.quantity;

    return {
      ...row,
      deliveryTotal,
      assemblyTotal,
      finalPriceUnit,
      lineTotal
    };
  };

  // Initial calculation
  React.useEffect(() => {
    setRows(prev => prev.map(calculateRow));
  }, []);

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setRows(prev => prev.map(calculateRow));
      setIsRecalculating(false);
    }, 800);
  };

  const handleInputChange = (id: string, field: keyof PricingRow, value: any) => {
    setRows(prev => prev.map(row => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    }));
  };

  const handleSearchReset = (rowId: string) => {
    const originalRow = MOCK_DATA.find(r => r.id === rowId);
    if (originalRow) {
      setRows(prev => prev.map(row => {
        if (row.id === rowId) {
          return calculateRow(originalRow);
        }
        return row;
      }));
    }
  };

  const openCatalogueModal = (rowId: string) => {
    setSelectedRowId(rowId);
    setModalOpen(true);
  };

  const handleCatalogueSelect = (item: any) => {
    // Update the row with selected item data
    if (selectedRowId) {
      setRows(prev => prev.map(row => {
        if (row.id === selectedRowId) {
          return {
             ...row,
             description: item.description,
             supplier: item.manufacturer,
             deliveryPrice: item.price,
             assemblyPrice: item.assembly,
             matchProbability: 1.0, // Selected manually, so 100% confidence
             unit: item.unit
          };
        }
        return row;
      }));
      setModalOpen(false);
      handleRecalculate(); // Auto recalc on selection
    }
  };

  const selectedRow = rows.find(r => r.id === selectedRowId);

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Top Info Bar */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex gap-6 text-sm">
           <div>
             <span className="block text-xs text-gray-500 uppercase font-semibold">Order</span>
             <span className="font-medium text-gray-900">088N / Pelhřimov SPŠ</span>
           </div>
           <div>
             <span className="block text-xs text-gray-500 uppercase font-semibold">File</span>
             <span className="font-medium text-gray-900">{fileName}</span>
           </div>
           <div>
             <span className="block text-xs text-gray-500 uppercase font-semibold">Date</span>
             <span className="font-medium text-gray-900">{new Date().toLocaleDateString()}</span>
           </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleRecalculate} isLoading={isRecalculating}>
            <Calculator className="mr-2 h-4 w-4" />
            Recalculate
          </Button>
          <Button onClick={onNext}>
            Proceed to Export
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm flex flex-col">
        <div className="overflow-auto flex-1">
          <table className="min-w-full divide-y divide-gray-200 border-separate border-spacing-0">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 border-b border-gray-200 z-20 w-16">Match</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 w-12">PČ</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 min-w-[150px]">Description</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 w-24">Supplier</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 w-20">Rabat %</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 w-16">Unit</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 w-16">Qty</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 w-24">Del. Unit</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 bg-gray-100 w-24">Del. Total</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 w-24">Assm. Unit</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 bg-gray-100 w-24">Assm. Total</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 bg-blue-50 w-24">Final Unit</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 bg-blue-100 w-28 font-bold text-gray-700">Total</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 w-24 sticky right-0 bg-gray-50 z-20">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map((row) => (
                row.isHeader ? (
                  <tr key={row.id} className="bg-gray-100">
                    <td colSpan={14} className="px-3 py-2 text-sm font-bold text-gray-900 border-b border-gray-200">
                      {row.description}
                    </td>
                  </tr>
                ) : (
                  <tr key={row.id} className="hover:bg-blue-50/30 group">
                    <td className="px-3 py-2 whitespace-nowrap sticky left-0 bg-white group-hover:bg-blue-50/30 border-r border-gray-100">
                        <div 
                          className={`w-10 h-6 flex items-center justify-center rounded text-xs font-bold text-white ${
                            (row.matchProbability || 0) >= 0.8 ? 'bg-green-500' : 
                            (row.matchProbability || 0) >= 0.7 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          title={`Confidence: ${(row.matchProbability || 0) * 100}%`}
                        >
                          {Math.round((row.matchProbability || 0) * 100)}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{row.index}</td>
                      <td className="px-3 py-2 min-w-[200px]">
                        <input 
                          type="text" 
                          className="w-full bg-transparent border-none focus:ring-1 focus:ring-[#0072BC] rounded px-1 py-0.5 text-sm"
                          value={row.description}
                          onChange={(e) => handleInputChange(row.id, 'description', e.target.value)}
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <input 
                          type="text" 
                          className="w-full bg-transparent border-none focus:ring-1 focus:ring-[#0072BC] rounded px-1 py-0.5 text-sm"
                          value={row.supplier}
                          onChange={(e) => handleInputChange(row.id, 'supplier', e.target.value)}
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right">
                        <input 
                          type="number" 
                          className="w-full bg-transparent border-none focus:ring-1 focus:ring-[#0072BC] rounded px-1 py-0.5 text-sm text-right"
                          value={row.discount}
                          onChange={(e) => handleInputChange(row.id, 'discount', parseFloat(e.target.value))}
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right">
                        <input 
                          type="text" 
                          className="w-full bg-transparent border-none focus:ring-1 focus:ring-[#0072BC] rounded px-1 py-0.5 text-sm text-right"
                          value={row.unit}
                          onChange={(e) => handleInputChange(row.id, 'unit', e.target.value)}
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right">
                        <input 
                          type="number" 
                          className="w-full bg-transparent border-none focus:ring-1 focus:ring-[#0072BC] rounded px-1 py-0.5 text-sm text-right font-medium"
                          value={row.quantity}
                          onChange={(e) => handleInputChange(row.id, 'quantity', parseFloat(e.target.value))}
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right">
                        <input 
                          type="number" 
                          className="w-full bg-transparent border-none focus:ring-1 focus:ring-[#0072BC] rounded px-1 py-0.5 text-sm text-right"
                          value={row.deliveryPrice}
                          onChange={(e) => handleInputChange(row.id, 'deliveryPrice', parseFloat(e.target.value))}
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right text-sm text-gray-500 bg-gray-50/50">
                        {formatCurrency(row.deliveryTotal || 0)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right">
                        <input 
                          type="number" 
                          className="w-full bg-transparent border-none focus:ring-1 focus:ring-[#0072BC] rounded px-1 py-0.5 text-sm text-right"
                          value={row.assemblyPrice}
                          onChange={(e) => handleInputChange(row.id, 'assemblyPrice', parseFloat(e.target.value))}
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right text-sm text-gray-500 bg-gray-50/50">
                        {formatCurrency(row.assemblyTotal || 0)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium text-gray-700 bg-blue-50/30">
                        {formatCurrency(row.finalPriceUnit || 0)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-bold text-gray-900 bg-blue-100/50 border-l border-blue-100">
                        {formatCurrency(row.lineTotal || 0)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-center sticky right-0 bg-white group-hover:bg-blue-50/30 border-l border-gray-100">
                         <div className="flex justify-center gap-1">
                           <button 
                              className="p-1.5 text-gray-400 hover:text-[#0072BC] hover:bg-blue-50 rounded transition-colors"
                              title="Search Catalogue"
                              onClick={() => handleSearchReset(row.id)}
                           >
                             <Search size={16} />
                           </button>
                           <button 
                              className="p-1.5 text-gray-400 hover:text-[#0072BC] hover:bg-blue-50 rounded transition-colors"
                              title="Replace Item"
                              onClick={() => openCatalogueModal(row.id)}
                           >
                             <ArrowLeftRight size={16} />
                           </button>
                         </div>
                      </td>
                    </tr>
                  )
              ))}
            </tbody>
            <tfoot className="bg-gray-100 font-bold sticky bottom-0 z-10 border-t-2 border-gray-300">
              <tr>
                <td colSpan={12} className="px-6 py-3 text-right text-gray-900">Total Price:</td>
                <td className="px-6 py-3 text-right text-gray-900 text-base">
                  {formatCurrency(rows.reduce((sum, row) => sum + (row.lineTotal || 0), 0))}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <CatalogueModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        onSelect={handleCatalogueSelect}
        currentItem={selectedRow}
      />
    </div>
  );
}
