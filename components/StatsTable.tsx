import React from 'react';
import { PlayerData, SortKey, SortOrder } from '../types.ts';

interface StatsTableProps {
  data: PlayerData[];
  onSort: (key: SortKey) => void;
  sortKey: SortKey;
  sortOrder: SortOrder;
}

const StatsTable: React.FC<StatsTableProps> = ({ data, onSort, sortKey, sortOrder }) => {
  const formatNum = (val: number) => {
    return new Intl.NumberFormat('fr-FR').format(val);
  };

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return (
      <svg className="w-3 h-3 ml-1 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    );
    return sortOrder === 'asc' 
      ? <svg className="w-3 h-3 ml-1 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
      : <svg className="w-3 h-3 ml-1 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;
  };

  const headers: { key: SortKey; label: string; align: 'left' | 'right' }[] = [
    { key: 'rank', label: 'Rang', align: 'left' },
    { key: 'name', label: 'Joueur', align: 'left' },
    { key: 'donations', label: 'Donations', align: 'right' },
    { key: 'vs', label: 'VS', align: 'right' },
    { key: 'power', label: 'Puissance', align: 'right' },
    { key: 'scoreFinal', label: 'Score Final', align: 'right' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-700">
        <thead className="bg-slate-900/50">
          <tr>
            {headers.map((header) => (
              <th
                key={header.key}
                onClick={() => onSort(header.key)}
                className={`px-6 py-4 cursor-pointer group text-xs font-semibold text-slate-400 uppercase tracking-wider select-none hover:bg-slate-700/30 transition-colors ${header.align === 'right' ? 'text-right' : 'text-left'}`}
              >
                <div className={`flex items-center ${header.align === 'right' ? 'justify-end' : ''}`}>
                  {header.label}
                  {getSortIcon(header.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50 bg-slate-800">
          {data.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                Aucun joueur trouvé.
              </td>
            </tr>
          ) : (
            data.map((player) => (
              <tr 
                key={player.name} 
                className="hover:bg-slate-700/40 transition-colors group"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-400">
                  #{player.rank}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">
                    {player.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 text-right font-mono">
                  {formatNum(player.donations)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 text-right font-mono">
                  {formatNum(player.vs)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 text-right font-mono">
                  {formatNum(player.power)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                    player.scoreFinal >= 150 ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                    player.scoreFinal >= 100 ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                    'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                  }`}>
                    {player.scoreFinal.toFixed(2)}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StatsTable;