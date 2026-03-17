import React from 'react';
import { motion } from 'motion/react';
import { MapPin, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { Outlet } from '../types';
import { OUTLETS } from '../constants';

import { translations, Language } from '../translations';

interface TerritoryMapProps {
  outlets: Outlet[];
  completedOutlets: string[];
  onSelectOutlet: (id: string) => void;
  currentOutletId: string | null;
  lang: Language;
}

export const TerritoryMap: React.FC<TerritoryMapProps> = ({
  outlets,
  completedOutlets,
  onSelectOutlet,
  currentOutletId,
  lang
}) => {
  const t = translations[lang];

  return (
    <div className="relative w-full bg-white border-2 border-swiss-dark overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      {/* Swiss Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '24px 24px' }} />

      <div className="relative p-10">
        <div className="flex justify-between items-end mb-12 border-b-4 border-swiss-dark pb-6">
          <div>
      <h2 className="text-4xl font-black mb-2">{t.territoryMap}</h2>
            <p className="label-micro">{t.firstClientVisit}</p> 
  <p className="label-micro">{t.selectOutlet}</p>
          </div>
          <div className="text-right">
             <p className="font-mono font-bold text-swiss-red">CH-HORECA-2026</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-swiss-dark bg-swiss-dark">
          {outlets.map((outlet) => {
            const isCompleted = completedOutlets.includes(outlet.id);
            const isSelected = currentOutletId === outlet.id;
            
            return (
              <motion.button
                key={outlet.id}
                whileHover={{ backgroundColor: isCompleted ? '#f0fdf4' : '#fff5f5' }}
                onClick={() => onSelectOutlet(outlet.id)}
                className={`p-8 text-left transition-all relative group bg-white border-r border-b border-swiss-dark last:border-r-0 ${
                  isCompleted ? 'opacity-80' : ''
                } ${isSelected ? 'ring-4 ring-swiss-red ring-inset' : ''}`}
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="font-mono text-xs font-bold text-gray-400">0{outlets.indexOf(outlet) + 1}</span>
                  {isCompleted ? (
                    <CheckCircle2 size={24} className="text-emerald-500" />
                  ) : (
                    <div className="w-6 h-6 border-2 border-swiss-dark rounded-full group-hover:bg-swiss-red transition-colors" />
                  )}
                </div>
                
                <h3 className="font-black text-2xl mb-1 leading-tight">{outlet.name}</h3>
                <p className="label-micro text-gray-400 mb-8">{outlet.location} / {outlet.type}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-bold text-gray-400 uppercase">Difficulty</span>
                    <div className="flex gap-0.5 mt-1">
                      {[1, 2, 3].map(i => (
                        <div key={i} className={`w-3 h-1 ${i <= outlet.difficulty ? 'bg-swiss-red' : 'bg-gray-200'}`} />
                      ))}
                    </div>
                  </div>
                  <ArrowRight size={16} className={`transition-transform ${isCompleted ? 'text-emerald-500' : 'group-hover:translate-x-1'}`} />
                </div>

                {isCompleted && (
                  <div className="absolute top-0 right-0 p-2">
                    <div className="bg-emerald-500 text-white text-[8px] font-bold px-2 py-0.5 uppercase tracking-widest">
                      {t.completed}
                    </div>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
