import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Package, DollarSign, Target } from 'lucide-react';

import { translations, Language } from '../translations';

interface MetricsPanelProps {
  revenue: number;
  volume: number;
  volumeLitre: number;
  brandsCount: number;
  targetRevenue: number;
  totalHappiness: number;
  lang: Language;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({
  revenue,
  volume,
  volumeLitre,
  brandsCount,
  targetRevenue,
  totalHappiness,
  lang
}) => {
  const t = translations[lang];
  const progress = Math.min((revenue / targetRevenue) * 100, 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-0 border-2 border-swiss-dark bg-swiss-dark">
      <div className="bg-white p-6 border-r-2 border-swiss-dark">
        <p className="label-micro mb-2">{t.totalNSR}</p>
        <p className="value-display">CHF {revenue.toLocaleString()}</p>
        <div className="mt-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-swiss-red" />
          <span className="text-[10px] font-bold uppercase text-gray-400">Net Sales Revenue</span>
        </div>
      </div>

      <div className="bg-white p-6 border-r-2 border-swiss-dark">
        <p className="label-micro mb-2">{t.totalVolume}</p>
        <div className="flex flex-col">
          <p className="value-display">{volume.toLocaleString()} <span className="text-xs font-normal">Bottles</span></p>
          <p className="font-mono text-[10px] font-bold text-swiss-red">{volumeLitre.toLocaleString()} Litres</p>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-300" />
          <span className="text-[10px] font-bold uppercase text-gray-400">Total Volume</span>
        </div>
      </div>

      <div className="bg-white p-6 border-r-2 border-swiss-dark">
        <p className="label-micro mb-2">{t.brandsSold}</p>
        <p className="value-display">{brandsCount}</p>
        <div className="mt-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-swiss-red" />
          <span className="text-[10px] font-bold uppercase text-gray-400">Portfolio Breadth</span>
        </div>
      </div>

      <div className="bg-white p-6 border-r-2 border-swiss-dark">
        <p className="label-micro mb-2 uppercase">{t.satisfaction}</p>
        <p className="value-display">{totalHappiness.toFixed(0)} <span className="text-xs font-normal">/ 30</span></p>
        <div className="mt-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-swiss-red" />
          <span className="text-[10px] font-bold uppercase text-gray-400">Partner Happiness</span>
        </div>
      </div>

      <div className="bg-white p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <p className="label-micro">{t.targetProgress}</p>
          <p className="font-mono font-bold text-swiss-red">{progress.toFixed(1)}%</p>
        </div>
        <div className="mt-4 relative h-4 bg-gray-100 border-2 border-swiss-dark">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-swiss-red"
          />
        </div>
      </div>
    </div>
  );
};
