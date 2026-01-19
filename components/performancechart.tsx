
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { PlayerData } from '../types';

interface PerformanceChartProps {
  data: PlayerData[];
  type: 'scoreFinal' | 'power';
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, type }) => {
  // Map data to chart format
  const chartData = data.map(p => ({
    name: p.name,
    value: type === 'power' ? Math.round(p.power / 1000000) : p.scoreFinal
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-2xl">
          <p className="text-sm font-bold text-white mb-1">{label}</p>
          <p className="text-xs text-indigo-400">
            {type === 'power' ? 'Puissance: ' : 'Score: '}
            <span className="font-mono">{payload[0].value}{type === 'power' ? 'M' : ''}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const color = type === 'power' ? '#f43f5e' : '#6366f1';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={chartData} 
        layout="vertical" 
        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
        <XAxis 
          type="number" 
          stroke="#94a3b8" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis 
          dataKey="name" 
          type="category" 
          stroke="#94a3b8" 
          fontSize={11} 
          width={80}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#334155', opacity: 0.4 }} />
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={color} fillOpacity={1 - (index * 0.08)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PerformanceChart;
