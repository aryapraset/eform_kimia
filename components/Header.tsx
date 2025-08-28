
import React from 'react';

interface HeaderProps {
  setView: (view: 'dashboard' | 'form' | 'add-chemical-form' | 'history') => void;
}

const Header: React.FC<HeaderProps> = ({ setView }) => {
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7 2a.5.5 0 01.5.5V3h5V2.5a.5.5 0 011 0V3h1a2 2 0 012 2v1H3V5a2 2 0 012-2h1V2.5A.5.5 0 016.5 2H7zM3 8v7a2 2 0 002 2h10a2 2 0 002-2V8H3zm4.5 1.5a.5.5 0 000 1h3a.5.5 0 000-1h-3zM8 12a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                <path d="M5.337 11.163a.75.75 0 01.976-.235l1.08 0.432a.75.75 0 01.235.976l-1.08 2.7a.75.75 0 01-.976.235l-1.08-.432a.75.75 0 01-.235-.976l1.08-2.7zM14.663 11.163a.75.75 0 00-.976-.235l-1.08.432a.75.75 0 00-.235.976l1.08 2.7a.75.75 0 00.976.235l1.08-.432a.75.75 0 00.235-.976l-1.08-2.7z" />
            </svg>
            <div>
                <h1 className="text-xl md:text-2xl font-bold">Sistem Ketertelusuran Bahan Kimia</h1>
                <p className="text-sm text-gray-200">Lab BBSPJIHPMM</p>
            </div>
        </div>
        <nav className="flex space-x-2">
            <button onClick={() => setView('dashboard')} className="px-4 py-2 rounded-md bg-secondary hover:bg-opacity-80 transition duration-300 flex items-center space-x-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                 <span className="hidden md:inline">Dashboard</span>
            </button>
            <button onClick={() => setView('history')} className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 transition duration-300 flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="hidden md:inline">Riwayat</span>
            </button>
            <button onClick={() => setView('add-chemical-form')} className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 transition duration-300 flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a8.046 8.046 0 00-3.61-3.61M5.572 15.428a8.046 8.046 0 013.61-3.61m0 0a8.046 8.046 0 017.22 0m-7.22 0V3m0 8.818a4 4 0 00-4 4V19h8v-2.182a4 4 0 00-4-4z" />
                </svg>
                <span className="hidden md:inline">Tambah Bahan</span>
            </button>
            <button onClick={() => setView('form')} className="px-4 py-2 rounded-md bg-accent hover:bg-opacity-80 transition duration-300 flex items-center space-x-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                 <span className="hidden md:inline">Input Penggunaan</span>
            </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
