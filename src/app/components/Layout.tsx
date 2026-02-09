import React from 'react';
import { cn } from '../../lib/utils';
import { LogOut, User } from 'lucide-react';

type Tab = 'orders' | 'pricing' | 'data' | 'settings';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onLogout: () => void;
  userEmail?: string;
}

export function Layout({ children, activeTab, onTabChange, onLogout, userEmail = "user@komerc.cz" }: LayoutProps) {
  const tabs: { id: Tab; label: string }[] = [
    { id: 'orders', label: 'Orders' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'data', label: 'Data' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center mr-8">
                {/* Logo Placeholder */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#0072BC] rounded-md flex items-center justify-center text-white font-bold text-lg">
                    K
                  </div>
                  <span className="font-bold text-xl text-gray-900 tracking-tight">Komerc</span>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                      "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full transition-colors",
                      activeTab === tab.id
                        ? "border-[#0072BC] text-[#0072BC]"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                        <User size={16} />
                     </div>
                     <span className="hidden md:inline-block font-medium">{userEmail}</span>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="ml-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    title="Log out"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-screen-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
