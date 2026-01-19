
import React from 'react';
import { AverageStats } from '../types';

interface DashboardCardsProps {
  averages: AverageStats;
  totalPlayers: number;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ averages, totalPlayers }) => {
  const formatNum = (val: number) => {
    return new Intl.NumberFormat('fr-FR', {
      notation: val > 1000000 ? 'compact' : 'standard',
      maximumFractionDigits: 1
    }).format(val);
  };

  const cards = [
    {
      label: 'Membres',
      value: totalPlayers,
      sub: 'Actifs cette semaine',
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      label: 'Donations Moy.',
      value: formatNum(averages.donations),
      sub: 'Par membre',
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-amber-500/10 border-amber-500/20'
    },
    {
      label: 'Points VS Moy.',
      value: formatNum(averages.vs),
      sub: 'Performance hebdo',
      icon: (
        <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: 'bg-rose-500/10 border-rose-500/20'
    },
    {
      label: 'Puissance Moy.',
      value: formatNum(averages.power),
      sub: 'Force de frappe',
      icon: (
        <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.691.346a2 2 0 01-1.908 0l-.691-.346a6 6 0 00-3.86-.517l-2.387.477a2 2 0 00-1.022.547V18a2 2 0 002 2h11a2 2 0 002-2v-2.572zM19 10V5a2 2 0 00-2-2H7a2 2 0 00-2 2v5a2 2 0 01-2 2 2 2 0 002 2h14a2 2 0 002-2 2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'bg-indigo-500/10 border-indigo-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <div 
          key={idx} 
          className={`p-6 rounded-2xl border ${card.color} shadow-lg backdrop-blur-sm hover:scale-[1.02] transition-transform duration-300`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
              {card.icon}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-slate-400 text-sm font-medium">{card.label}</p>
            <p className="text-3xl font-bold tracking-tight text-white">{card.value}</p>
            <p className="text-slate-500 text-xs">{card.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
