
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-[#FBFBFD] shadow-2xl relative overflow-hidden">
      {/* Apple-style Header */}
      <header className="px-8 pt-10 pb-6 sticky top-0 z-40 bg-[#FBFBFD]/80 backdrop-blur-lg">
        <div className="flex justify-between items-end">
          <div className="animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-3xl font-extrabold text-[#1D1D1F] leading-none">Capillaire</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mt-2">Natural Intelligence</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#2d4a22] transition-transform active:scale-90 tap-highlight-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-8 pb-32 no-scrollbar">
        {children}
      </main>

      {/* Apple-style Floating Navigation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[360px] z-50">
        <nav className="apple-blur border border-white/40 shadow-2xl shadow-black/5 rounded-[32px] px-2 py-2 flex justify-between items-center">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex-1 flex flex-col items-center py-2.5 rounded-2xl transition-all tap-highlight-none ${activeTab === 'home' ? 'bg-white shadow-sm text-[#2d4a22]' : 'text-gray-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === 'home' ? 2 : 1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[9px] font-bold mt-1">Início</span>
          </button>
          <button 
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 flex flex-col items-center py-2.5 rounded-2xl transition-all tap-highlight-none ${activeTab === 'schedule' ? 'bg-white shadow-sm text-[#2d4a22]' : 'text-gray-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === 'schedule' ? 2 : 1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-[9px] font-bold mt-1">Plano</span>
          </button>
          <button 
            onClick={() => setActiveTab('chat')}
            className={`flex-1 flex flex-col items-center py-2.5 rounded-2xl transition-all tap-highlight-none ${activeTab === 'chat' ? 'bg-white shadow-sm text-[#2d4a22]' : 'text-gray-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === 'chat' ? 2 : 1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="text-[9px] font-bold mt-1">Guia</span>
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex-1 flex flex-col items-center py-2.5 rounded-2xl transition-all tap-highlight-none ${activeTab === 'profile' ? 'bg-white shadow-sm text-[#2d4a22]' : 'text-gray-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === 'profile' ? 2 : 1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
            <span className="text-[9px] font-bold mt-1">Ajustes</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Layout;
