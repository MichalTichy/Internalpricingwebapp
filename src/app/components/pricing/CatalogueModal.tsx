import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../../lib/utils';
import { Search, Loader2 } from 'lucide-react';

interface CatalogueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: any) => void;
  currentItem: any; // The item being replaced
}

const MOCK_RESULTS = [
  { id: '101', description: 'Klimatizace nástěnná 3.5kW Set', manufacturer: 'Daikin', code: 'DAIK-35', unit: 'ks', price: 12500, assembly: 2500, score: 0.95, info: 'R32, A++/A+, WiFi ready, 21dB' },
  { id: '102', description: 'Klimatizace nástěnná 3.5kW Vnitřní', manufacturer: 'Toshiba', code: 'TOS-35-IN', unit: 'ks', price: 8900, assembly: 1500, score: 0.82, info: 'R32, A++, Inverter, 10m max pipe' },
  { id: '103', description: 'Klimatizace nástěnná 2.5kW Set', manufacturer: 'LG', code: 'LG-25', unit: 'ks', price: 11000, assembly: 2200, score: 0.76, info: 'R32, A++/A+, Plasmaster Ionizer' },
  { id: '104', description: 'Montážní sada pro klimatizace', manufacturer: 'Generic', code: 'MNT-SET', unit: 'kpl', price: 1500, assembly: 0, score: 0.45, info: 'Wall brackets 450mm, 4x bolts, anti-vibration' },
  { id: '105', description: 'Klimatizace Samsung WindFree 3.5kW', manufacturer: 'Samsung', code: 'SAM-WF-35', unit: 'ks', price: 13200, assembly: 2500, score: 0.72, info: 'WindFree cooling, AI Auto Comfort, R32' },
  { id: '106', description: 'Panasonic Etherea 3.5kW Set', manufacturer: 'Panasonic', code: 'PAN-ETH-35', unit: 'ks', price: 14500, assembly: 2500, score: 0.68, info: 'Nanoe X, Built-in WiFi, A+++/A++' },
  { id: '107', description: 'Mitsubishi MSZ-LN 3.5kW', manufacturer: 'Mitsubishi', code: 'MIT-LN-35', unit: 'ks', price: 16800, assembly: 2800, score: 0.65, info: '3D i-see sensor, Dual Barrier Coating, R32' },
  { id: '108', description: 'Sinclair Terrel 3.5kW', manufacturer: 'Sinclair', code: 'SIN-TER-35', unit: 'ks', price: 9500, assembly: 2200, score: 0.60, info: 'Plasma tec, Heater, I FEEL function' },
  { id: '109', description: 'Gree Fairy 3.5kW Set', manufacturer: 'Gree', code: 'GREE-FAI-35', unit: 'ks', price: 9200, assembly: 2200, score: 0.55, info: 'Cold plasma, Heated chassis, -22°C operation' },
  { id: '110', description: 'Aux Freedom 3.5kW', manufacturer: 'Aux', code: 'AUX-FRE-35', unit: 'ks', price: 8500, assembly: 2000, score: 0.50, info: 'Self-cleaning, 4D airflow, 0.5W standby' },
];

export function CatalogueModal({ isOpen, onClose, onSelect, currentItem }: CatalogueModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Settings
  const [limit, setLimit] = useState(50);
  const [threshold, setThreshold] = useState(0.5);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (currentItem) {
        setSearchTerm(currentItem.description || '');
      }
      // Reset state on open
      setResults(MOCK_RESULTS);
      setHasSearched(true);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentItem]);

  const handleSearch = () => {
    setIsSearching(true);
    setResults([]); // Clear previous results while searching
    
    // Mock search delay to demonstrate loading state
    setTimeout(() => {
      setResults(MOCK_RESULTS);
      setIsSearching(false);
      setHasSearched(true);
    }, 800);
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="relative z-[9999]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Background backdrop */}
      <div className="fixed inset-0 bg-gray-900/75 transition-opacity backdrop-blur-sm" onClick={onClose} />

      {/* Modal panel container */}
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl border border-gray-200">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-xl leading-6 font-semibold text-gray-900 mb-4" id="modal-title">
                Catalogue Selection
              </h3>
              
              <div className="flex flex-col gap-6">
                
                {/* Section A: Current Item Summary */}
                {currentItem && (
                  <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
                    <h4 className="text-xs font-bold text-[#0072BC] uppercase tracking-wider mb-2">Currently Pricing</h4>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                       <div className="font-medium text-gray-900 text-lg">{currentItem.description}</div>
                       <div className="flex gap-6 text-sm text-gray-600">
                          <div className="flex flex-col sm:flex-row sm:gap-2">
                             <span className="text-gray-500">Supplier:</span>
                             <span className="font-medium text-gray-900">{currentItem.supplier || 'N/A'}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:gap-2">
                             <span className="text-gray-500">Unit:</span>
                             <span className="font-medium text-gray-900">{currentItem.unit || 'N/A'}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:gap-2">
                             <span className="text-gray-500">Price:</span>
                             <span className="font-medium text-gray-900">{formatCurrency(currentItem.finalPriceUnit || 0)}</span>
                          </div>
                       </div>
                    </div>
                  </div>
                )}

                {/* Section B: Search Settings */}
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                     {/* Search Term */}
                     <div className="md:col-span-6 space-y-1">
                       <label className="block text-sm font-medium text-gray-700">Search Catalogue</label>
                       <div className="relative">
                         <input 
                            type="text" 
                            className="w-full rounded-md border border-gray-300 pl-3 pr-10 py-2 text-sm focus:ring-[#0072BC] focus:border-[#0072BC]"
                            placeholder="Search by name, code or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                         />
                         <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                       </div>
                     </div>

                     {/* Settings */}
                     <div className="md:col-span-2 space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Max Results</label>
                        <input 
                          type="number" 
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-[#0072BC] focus:border-[#0072BC]"
                          value={limit}
                          onChange={(e) => setLimit(parseInt(e.target.value))}
                        />
                     </div>
                     <div className="md:col-span-2 space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Threshold (0-1)</label>
                        <input 
                          type="number" 
                          step="0.1"
                          min="0"
                          max="1"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-[#0072BC] focus:border-[#0072BC]"
                          value={threshold}
                          onChange={(e) => setThreshold(parseFloat(e.target.value))}
                        />
                     </div>

                     {/* Search Button */}
                     <div className="md:col-span-2">
                       <Button className="w-full" onClick={handleSearch} disabled={isSearching}>
                         {isSearching ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                         Search
                       </Button>
                     </div>
                  </div>
                </div>

                {/* Section C: Results Table */}
                <div className="border border-gray-200 rounded-md overflow-hidden flex flex-col bg-white min-h-[300px]">
                  <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                     <h4 className="text-sm font-bold text-gray-700 uppercase">Search Results</h4>
                     {hasSearched && !isSearching && (
                       <span className="text-xs text-gray-500">{results.length} matches found</span>
                     )}
                  </div>
                  
                  <div className="overflow-auto flex-1 max-h-[400px]">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Match</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Supplier</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">Additional Info</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Price</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Assembly</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {isSearching ? (
                          <tr>
                            <td colSpan={7} className="px-4 py-20 text-center">
                              <div className="flex flex-col items-center justify-center text-gray-500">
                                <Loader2 className="h-10 w-10 animate-spin text-[#0072BC] mb-4" />
                                <p className="text-lg font-medium">Searching catalogue...</p>
                                <p className="text-sm">Fetching matches from vector database</p>
                              </div>
                            </td>
                          </tr>
                        ) : hasSearched && results.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-4 py-20 text-center text-gray-500">
                              <div className="flex flex-col items-center justify-center">
                                <Search className="h-10 w-10 text-gray-300 mb-4" />
                                <p className="text-lg font-medium text-gray-900">No results found</p>
                                <p className="text-sm max-w-xs mx-auto mt-1">
                                  Try adjusting your search terms or lowering the confidence threshold.
                                </p>
                              </div>
                            </td>
                          </tr>
                        ) : !hasSearched ? (
                           <tr>
                            <td colSpan={7} className="px-4 py-20 text-center text-gray-500">
                              <p>Enter search criteria above to find items.</p>
                            </td>
                          </tr>
                        ) : (
                          results.map((result) => (
                            <tr key={result.id} className="hover:bg-blue-50/50 transition-colors group">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                  result.score >= 0.8 ? 'bg-green-100 text-green-800 border-green-200' : 
                                  result.score >= 0.7 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-red-100 text-red-800 border-red-200'
                                }`}>
                                  {Math.round(result.score * 100)}% Match
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-medium text-gray-900">{result.description}</div>
                                <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                                  <span>{result.unit}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{result.manufacturer}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                <div className="line-clamp-2" title={result.info}>
                                  {result.info}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">{formatCurrency(result.price)}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-right">{formatCurrency(result.assembly)}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-center">
                                <Button size="sm" onClick={() => onSelect(result)} className="w-full">
                                  Select
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}