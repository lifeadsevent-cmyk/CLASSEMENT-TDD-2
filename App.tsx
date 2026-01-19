
import React, { useState, useMemo } from 'react';
import { RAW_PLAYER_DATA, ALLIANCE_AVERAGES } from './data.ts';
import { PlayerData, SortKey, SortOrder } from './types.ts';
import StatsTable from './components/StatsTable.tsx';
import DashboardCards from './components/DashboardCards.tsx';
import PerformanceChart from './components/PerformanceChart.tsx';
import UnitsView from './components/UnitsView.tsx';

/**
 * Main Application Component
 */
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'units'>('stats');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('scoreFinal');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Filter and Sort Logic
  const processedData = useMemo(() => {
    let data = [...RAW_PLAYER_DATA];

    // Filter by name
    if (searchTerm) {
      data = data.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Sort
    data.sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }

      const numA = valA as number;
      const numB = valB as number;
      return sortOrder === 'asc' ? numA - numB : numB - numA;
    });

    return data;
  }, [searchTerm, sortKey, sortOrder]);

  const topPlayers = useMemo(() => {
    return [...RAW_PLAYER_DATA]
      .sort((a, b) => b.scoreFinal - a.scoreFinal)
      .slice(0, 10);
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight">Alliance Leaderboard <span className="text-indigo-400">Pro</span></h1>
          </div>
          <nav className="flex items-center space-x-1 sm:space-x-4">
            <button 
              onClick={() => setActiveTab('stats')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'stats' ? 'bg-slate-800 text-white shadow-lg border border-slate-700' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
            >
              Leaderboard
            </button>
            <button 
              onClick={() => setActiveTab('units')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'units' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
            >
              Unités Tactiques
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {activeTab === 'stats' ? (
          <>
            <section id="dashboard">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 space-y-4 md:space-y-0">
                <div>
                  <h2 className="text-2xl font-bold">Vue d'ensemble</h2>
                  <p className="text-slate-400">Statistiques moyennes de l'alliance cette semaine.</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span>Données en temps réel</span>
                </div>
              </div>
              <DashboardCards averages={ALLIANCE_AVERAGES} totalPlayers={RAW_PLAYER_DATA.length} />
            </section>

            <section id="performance" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 shadow-inner">
                <h3 className="text-lg font-semibold mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Top 10 Scores Finaux
                </h3>
                <div className="h-72">
                  <PerformanceChart data={topPlayers} type="scoreFinal" />
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 shadow-inner">
                <h3 className="text-lg font-semibold mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Top 10 Puissance (Millions)
                </h3>
                <div className="h-72">
                  <PerformanceChart data={topPlayers} type="power" />
                </div>
              </div>
            </section>

            <section id="stats" className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Statistiques Détaillées</h2>
                  <p className="text-slate-400">Classement complet des {RAW_PLAYER_DATA.length} membres.</p>
                </div>
                
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher un joueur..."
                    className="block w-full md:w-80 pl-10 pr-3 py-2 border border-slate-700 rounded-xl leading-5 bg-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all sm:text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
                <StatsTable 
                  data={processedData} 
                  onSort={handleSort} 
                  sortKey={sortKey} 
                  sortOrder={sortOrder} 
                />
              </div>
            </section>
          </>
        ) : (
          <UnitsView />
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>© 2024 Alliance Leaderboard Pro - Généré dynamiquement.</p>
      </footer>
    </div>
  );
};

export default App;
