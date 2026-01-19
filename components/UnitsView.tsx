
import React, { useMemo } from 'react';
import { RAW_PLAYER_DATA } from '../data';
import { PlayerData } from '../types';

/**
 * UnitsView Component
 * Répartition tactique basée sur le Score Final (rang) 
 * avec équilibrage dynamique de la Force de Frappe (55% Alpha / 45% Bravo).
 */
const UnitsView: React.FC = () => {
  const { alphaSquad, bravoSquad, alphaReplacements, bravoReplacements, stats } = useMemo(() => {
    const sortedByRank = [...RAW_PLAYER_DATA].sort((a, b) => b.scoreFinal - a.scoreFinal);
    
    const top40 = sortedByRank.slice(0, 40);
    const replacementsPool = sortedByRank.slice(40, 60);

    const totalTop40Power = top40.reduce((acc, p) => acc + p.power, 0);
    const targetAlphaRatio = 0.55;

    const alphaSquad: PlayerData[] = [];
    const bravoSquad: PlayerData[] = [];
    
    let currentAlphaPower = 0;
    let currentTotalProcessedPower = 0;

    top40.forEach((player) => {
      currentTotalProcessedPower += player.power;
      
      const potentialAlphaRatio = (currentAlphaPower + player.power) / currentTotalProcessedPower;
      const needsAlpha = potentialAlphaRatio <= targetAlphaRatio + 0.05; 

      if ((needsAlpha && alphaSquad.length < 20) || bravoSquad.length >= 20) {
        alphaSquad.push(player);
        currentAlphaPower += player.power;
      } else {
        bravoSquad.push(player);
      }
    });

    const alphaReplacements: PlayerData[] = [];
    const bravoReplacements: PlayerData[] = [];
    
    replacementsPool.forEach((p, index) => {
      if (index % 2 === 0) alphaReplacements.push(p);
      else bravoReplacements.push(p);
    });

    const alphaPower = alphaSquad.reduce((acc, p) => acc + p.power, 0);
    const bravoPower = bravoSquad.reduce((acc, p) => acc + p.power, 0);

    return {
      alphaSquad,
      bravoSquad,
      alphaReplacements,
      bravoReplacements,
      stats: {
        alphaPower,
        bravoPower,
        alphaPercent: (alphaPower / totalTop40Power) * 100,
        bravoPercent: (bravoPower / totalTop40Power) * 100
      }
    };
  }, []);

  const formatNum = (val: number) => {
    return new Intl.NumberFormat('fr-FR').format(val);
  };

  const UnitCard = ({ 
    title, 
    players, 
    replacements, 
    power, 
    percent, 
    variant 
  }: { 
    title: string; 
    players: PlayerData[]; 
    replacements: PlayerData[]; 
    power: number; 
    percent: number; 
    variant: 'alpha' | 'bravo';
  }) => {
    const isAlpha = variant === 'alpha';
    const accentColor = isAlpha ? 'text-indigo-400' : 'text-rose-400';
    const bgColor = isAlpha ? 'bg-indigo-600' : 'bg-rose-600';
    const borderColor = isAlpha ? 'border-indigo-500/30' : 'border-rose-500/30';
    const gradient = isAlpha 
      ? 'from-indigo-600/20 to-transparent' 
      : 'from-rose-600/20 to-transparent';

    return (
      <div className={`flex flex-col h-full bg-slate-900/80 border ${borderColor} rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md`}>
        <div className={`p-8 bg-gradient-to-b ${gradient} border-b ${borderColor}`}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-10 ${bgColor} rounded-full`}></div>
              <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none">{title}</h3>
            </div>
            <div className="text-right">
              <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Status</span>
              <span className="inline-flex items-center px-2 py-1 rounded bg-green-500/10 text-green-400 text-[10px] font-bold border border-green-500/20">
                OPÉRATIONNEL
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 bg-black/20 rounded-2xl p-4 border border-white/5">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Puissance de Feu</p>
              <p className={`text-2xl font-mono font-bold ${accentColor}`}>{formatNum(power)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Distribution</p>
              <p className="text-3xl font-black text-white leading-none">{percent.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-3 overflow-y-auto max-h-[600px] scrollbar-thin">
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Personnel de Combat ({players.length})</span>
            <div className="h-px flex-1 mx-4 bg-slate-800"></div>
          </div>
          
          {players.map((p, i) => (
            <div key={p.name} className="group relative flex items-center justify-between p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800/60 transition-all border border-transparent hover:border-slate-700/50">
              <div className="flex items-center space-x-4">
                <span className="w-6 text-[10px] font-mono text-slate-600 text-center">{(i + 1).toString().padStart(2, '0')}</span>
                <div>
                  <div className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{p.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">RANK #{p.rank}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-semibold text-slate-400">{formatNum(p.power)}</div>
                <div className={`text-[10px] font-bold ${accentColor}`}>SCORE {p.scoreFinal.toFixed(1)}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-black/40 border-t border-slate-800">
          <div className="flex items-center space-x-2 mb-4">
            <svg className={`w-4 h-4 ${accentColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Unité de Réserve (10)</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {replacements.map(p => (
              <div key={p.name} className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900 border border-slate-800/50 text-slate-400 hover:text-slate-200 transition-colors">
                <span className="text-[11px] font-medium truncate pr-2">{p.name}</span>
                <span className="text-[9px] font-mono text-slate-600">#{p.rank}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <svg className="w-32 h-32 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20 mb-4 uppercase tracking-widest">
            Tactical Overview
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight uppercase mb-2">Déploiement Stratégique</h2>
          <p className="text-slate-400 max-w-2xl leading-relaxed">
            Répartition par <span className="text-white font-bold">mélange de rangs</span> optimisée. 
            Chaque unité possède un panel équilibré de joueurs tout en respectant l'objectif : 
            <span className="text-indigo-400 font-bold ml-1">55% Alpha</span> / <span className="text-rose-400 font-bold ml-1">45% Bravo</span>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <UnitCard 
          title="Unité Alpha"
          players={alphaSquad}
          replacements={alphaReplacements}
          power={stats.alphaPower}
          percent={stats.alphaPercent}
          variant="alpha"
        />
        <UnitCard 
          title="Unité Bravo"
          players={bravoSquad}
          replacements={bravoReplacements}
          power={stats.bravoPower}
          percent={stats.bravoPercent}
          variant="bravo"
        />
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-1">Rapport de Cohésion</h4>
            <p className="text-sm text-slate-400 max-w-sm">
              La mixité des rangs au sein des unités favorise l'entraide et l'équilibre lors des missions simultanées.
            </p>
          </div>
        </div>
        
        <div className="flex divide-x divide-slate-800">
          <div className="px-8 text-center">
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Effectifs</p>
            <p className="text-3xl font-black text-white">60</p>
          </div>
          <div className="px-8 text-center">
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Actifs</p>
            <p className="text-3xl font-black text-indigo-400">40</p>
          </div>
          <div className="px-8 text-center">
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Réserves</p>
            <p className="text-3xl font-black text-rose-500">20</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitsView;
