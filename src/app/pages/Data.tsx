import React, { useState, useRef } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { cn, formatCurrency, formatDate } from '../../lib/utils';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { 
  Search, 
  Trash2, 
  FileText, 
  ExternalLink, 
  Upload, 
  Filter
} from 'lucide-react';

type DataTab = 'items' | 'documents';

interface MockItem {
  id: string;
  description: string;
  price: number;
  manufacturer: string;
  assembly: number;
  template: string;
  source: string;
}

interface MockDocument {
  id: string;
  name: string;
  date: Date;
  itemCount: number;
}

const MOCK_ITEMS: MockItem[] = [
  { id: '1', description: 'Klimatizační jednotka 3.5kW', price: 12500, manufacturer: 'Daikin', assembly: 2500, template: 'Standard', source: 'Ceník 2025.xlsx' },
  { id: '2', description: 'CU potrubí 6/10', price: 280, manufacturer: '', assembly: 120, template: 'Materiál', source: 'Skladové zásoby.csv' },
  { id: '3', description: 'Konzole nástěnná 450mm', price: 450, manufacturer: 'Klimafix', assembly: 350, template: 'Příslušenství', source: 'Ceník 2025.xlsx' },
  { id: '4', description: 'Čerpadlo kondenzátu', price: 2100, manufacturer: 'Aspen', assembly: 800, template: 'Standard', source: 'Import_v2.xlsx' },
  { id: '5', description: 'Kabel CYKY-J 3x1.5', price: 18, manufacturer: 'Prakab', assembly: 25, template: 'Elektro', source: 'Skladové zásoby.csv' },
];

const MOCK_DOCUMENTS: MockDocument[] = [
  { id: '1', name: 'Ceník 2025.xlsx', date: new Date('2025-01-10'), itemCount: 1450 },
  { id: '2', name: 'Skladové zásoby.csv', date: new Date('2025-02-01'), itemCount: 320 },
  { id: '3', name: 'Import_v2.xlsx', date: new Date('2025-02-08'), itemCount: 85 },
];

export function Data() {
  const [activeTab, setActiveTab] = useState<DataTab>('items');
  const [items, setItems] = useState<MockItem[]>(MOCK_ITEMS);
  const [documents, setDocuments] = useState<MockDocument[]>(MOCK_DOCUMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  
  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Confirmation Modal State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = sourceFilter ? item.source === sourceFilter : true;
    return matchesSearch && matchesSource;
  });

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    setIsDeleting(true);
    // Mock delete API call
    setTimeout(() => {
      if (activeTab === 'items') {
        setItems(prev => prev.filter(item => item.id !== deleteId));
      } else {
        const docToDelete = documents.find(d => d.id === deleteId);
        setDocuments(prev => prev.filter(doc => doc.id !== deleteId));
        // Remove associated items
        if (docToDelete) {
           setItems(prev => prev.filter(item => item.source !== docToDelete.name));
        }
      }
      setIsDeleting(false);
      setDeleteId(null);
    }, 1000);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock upload and item generation
      const itemCount = Math.floor(Math.random() * 20) + 5;
      const newDoc: MockDocument = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        date: new Date(),
        itemCount: itemCount
      };
      
      setDocuments(prev => [newDoc, ...prev]);

      // Generate mock items for this document
      const newItems: MockItem[] = Array.from({ length: itemCount }).map((_, i) => ({
        id: Math.random().toString(36).substr(2, 9),
        description: `Imported Item ${i + 1} (${file.name.split('.')[0]})`,
        price: Math.floor(Math.random() * 5000) + 100,
        manufacturer: 'Imported Brand',
        assembly: Math.floor(Math.random() * 1000),
        template: 'Standard',
        source: newDoc.name
      }));
      
      setItems(prev => [...prev, ...newItems]);
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Switch to items view and filter by new document
      setSourceFilter(newDoc.name);
      setSearchTerm('');
      setActiveTab('items');
    }
  };

  const getDeleteModalTitle = () => {
    return activeTab === 'items' ? 'Delete Item' : 'Delete Document';
  };

  const getDeleteModalDescription = () => {
    if (activeTab === 'items') {
      return 'Are you sure you want to delete this catalogue item? This action cannot be undone.';
    } else {
      return 'Are you sure you want to delete this document? All associated items imported from this document will also be removed.';
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileChange} 
        accept=".xlsx,.xls,.csv,.xlsm"
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Management</h1>
          <p className="text-gray-500 mt-1">Manage catalogue items and source documents</p>
        </div>
        {activeTab === 'documents' && (
          <Button onClick={handleUploadClick}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        )}
      </div>

      {/* Internal Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('items')}
            className={cn(
              "whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors",
              activeTab === 'items'
                ? "border-[#0072BC] text-[#0072BC]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            Catalogue Items
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={cn(
              "whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors",
              activeTab === 'documents'
                ? "border-[#0072BC] text-[#0072BC]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            Source Documents
          </button>
        </nav>
      </div>

      <Card className="overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-sm w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={activeTab === 'items' ? "Search items..." : "Search documents..."}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-[#0072BC] focus:ring-1 focus:ring-[#0072BC] sm:text-sm transition duration-150 ease-in-out"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {activeTab === 'items' && (
              <div className="relative w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-500 focus:outline-none focus:border-[#0072BC] focus:ring-1 focus:ring-[#0072BC] sm:text-sm appearance-none"
                  value={sourceFilter || ''}
                  onChange={(e) => setSourceFilter(e.target.value || null)}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: `right 0.5rem center`,
                    backgroundRepeat: `no-repeat`,
                    backgroundSize: `1.5em 1.5em`,
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="">All Documents</option>
                  {documents.map(doc => (
                    <option key={doc.id} value={doc.name}>{doc.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          {/* Item count or specific actions */}
          <div className="text-sm text-gray-500 whitespace-nowrap ml-4">
            {activeTab === 'items' 
              ? `${filteredItems.length} items found` 
              : `${filteredDocuments.length} documents found`
            }
          </div>
        </div>

        {/* Content */}
        <div className="overflow-x-auto">
          {activeTab === 'items' ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manufacturer</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price / Unit</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Assembly</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.manufacturer || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{formatCurrency(item.price)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{formatCurrency(item.assembly)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FileText className="h-3 w-3 mr-1 text-gray-400" />
                        {item.source}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                       <div className="flex items-center justify-end gap-2">
                         <button 
                           className="text-gray-400 hover:text-[#0072BC]" 
                           title="Filter by this document"
                           onClick={() => setSourceFilter(item.source)}
                         >
                           <ExternalLink className="h-4 w-4" />
                         </button>
                         <button 
                            className="text-gray-400 hover:text-red-600" 
                            title="Delete"
                            onClick={() => handleDeleteClick(item.id)}
                         >
                           <Trash2 className="h-4 w-4" />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items Extracted</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-blue-50 rounded text-[#0072BC]">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="ml-3 text-sm font-medium text-gray-900">{doc.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(doc.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <Badge variant="secondary">{doc.itemCount}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                       <div className="flex items-center justify-end gap-2">
                         <Button size="sm" variant="outline" onClick={() => {
                           setSourceFilter(doc.name);
                           setSearchTerm('');
                           setActiveTab('items');
                         }}>
                           View Detail
                         </Button>
                         <button 
                            className="p-2 text-gray-400 hover:text-red-600" 
                            title="Delete"
                            onClick={() => handleDeleteClick(doc.id)}
                         >
                           <Trash2 className="h-4 w-4" />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          {(activeTab === 'items' ? filteredItems.length === 0 : filteredDocuments.length === 0) && (
             <div className="text-center py-12">
               <div className="mx-auto h-12 w-12 text-gray-300 flex items-center justify-center rounded-full bg-gray-50">
                 <Search className="h-6 w-6" />
               </div>
               <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
               <p className="mt-1 text-sm text-gray-500">
                 Try adjusting your search terms.
               </p>
             </div>
          )}
        </div>
      </Card>

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title={getDeleteModalTitle()}
        description={getDeleteModalDescription()}
        isLoading={isDeleting}
        confirmLabel="Delete"
      />
    </div>
  );
}