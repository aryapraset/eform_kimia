import React, { useState } from 'react';
import { HistoryLog } from '../types';

interface HistoryProps {
    logs: HistoryLog[];
}

const History: React.FC<HistoryProps> = ({ logs }) => {
    const [filter, setFilter] = useState<'all' | 'usage' | 'stock_update'>('all');

    const filteredLogs = logs.filter(log => {
        if (filter === 'all') return true;
        return log.type === filter;
    });

    const getFormattedDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    }
    
    const activeFilterClasses = "bg-primary text-white";
    const inactiveFilterClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300";

    const renderLogItem = (log: HistoryLog) => {
        const key = log.id;
        if (log.type === 'usage') {
            return (
                <li key={key} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-red-100 rounded-full">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">
                           <span className="font-bold text-red-700">-{log.amountUsed.toLocaleString()} {log.unit}</span> {log.chemicalName} ({log.chemicalFormula})
                        </p>
                        <p className="text-sm text-gray-500">
                           Digunakan oleh <span className="font-medium text-gray-700">{log.user}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{getFormattedDate(log.date)}</p>
                    </div>
                </li>
            );
        }

        if (log.type === 'stock_update') {
            const isAddition = log.amountAdded >= 0;
            return (
                 <li key={key} className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center ${isAddition ? 'bg-green-100' : 'bg-yellow-100'} rounded-full`}>
                        {isAddition ? (
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                        ) : (
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                            </svg>
                        )}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">
                            <span className={`font-bold ${isAddition ? 'text-green-700' : 'text-yellow-700'}`}>{isAddition ? '+' : ''}{log.amountAdded.toLocaleString()} {log.unit}</span> {log.chemicalName} ({log.chemicalFormula})
                        </p>
                        <p className="text-sm text-gray-500">
                           Stok diupdate oleh <span className="font-medium text-gray-700">{log.user}</span>. Stok: {log.previousStock.toLocaleString()} → {log.newStock.toLocaleString()} {log.unit}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{getFormattedDate(log.date)}</p>
                    </div>
                </li>
            );
        }
        return null;
    }

    return (
        <section className="max-w-4xl mx-auto animate-fade-in">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl">
                <h2 className="text-3xl font-bold text-primary mb-2">Riwayat Aktivitas</h2>
                <p className="text-gray-500 mb-6">Lacak semua perubahan stok dan penggunaan bahan kimia.</p>
                
                <div className="flex space-x-2 mb-6 border-b pb-4">
                    <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-md font-medium transition ${filter === 'all' ? activeFilterClasses : inactiveFilterClasses}`}>Semua</button>
                    <button onClick={() => setFilter('stock_update')} className={`px-4 py-2 rounded-md font-medium transition ${filter === 'stock_update' ? activeFilterClasses : inactiveFilterClasses}`}>Update Stok</button>
                    <button onClick={() => setFilter('usage')} className={`px-4 py-2 rounded-md font-medium transition ${filter === 'usage' ? activeFilterClasses : inactiveFilterClasses}`}>Penggunaan</button>
                </div>
                
                {filteredLogs.length > 0 ? (
                    <ul className="space-y-6">
                        {filteredLogs.map(renderLogItem)}
                    </ul>
                ) : (
                    <div className="text-center py-12">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-gray-800">Tidak ada riwayat</h3>
                        <p className="mt-1 text-sm text-gray-500">Belum ada aktivitas yang cocok dengan filter ini.</p>
                    </div>
                )}

            </div>
        </section>
    );
};

export default History;
