import React from 'react';
import { motion } from 'motion/react';

import { translations, Language } from '../translations';

interface WaterfallChartProps {
  grossPrice: number;
  discounts: number;
  logistics: number;
  netNetPrice: number;
  lang: Language;
}

export const WaterfallChart: React.FC<WaterfallChartProps> = ({
  grossPrice,
  discounts,
  logistics,
  netNetPrice,
  lang
}) => {
  const t = translations[lang];
  const maxValue = Math.max(grossPrice, 10);
  const scale = (val: number) => (val / maxValue) * 100;

  const steps = [
    { label: t.gross, value: grossPrice, type: 'base', color: 'bg-swiss-dark' },
    { label: t.disc, value: -discounts, type: 'negative', color: 'bg-swiss-red' },
    { label: t.log, value: -logistics, type: 'negative', color: 'bg-gray-400' },
    { label: t.netNet, value: netNetPrice, type: 'result', color: 'bg-swiss-red' },
  ];

  let currentY = 0;

  return (
    <div className="w-full h-full flex flex-col p-6 bg-white border-2 border-swiss-dark">
      <div className="flex justify-between items-start mb-8">
        <h4 className="label-micro">{t.pricingWaterfall}</h4>
        <div className="text-right">
          <p className="text-[10px] font-bold text-gray-400 uppercase">{t.finalNSR}</p>
          <p className="font-mono font-bold text-xl">CHF {netNetPrice.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex-1 flex items-end justify-between gap-1 min-h-[180px]">
        {steps.map((step, i) => {
          const height = Math.abs(scale(step.value));
          const startY = currentY;
          if (step.type !== 'result') {
            currentY += scale(step.value);
          }

          return (
            <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                className={`w-full ${step.color} relative border-x border-swiss-dark`}
                style={{
                   marginBottom: step.type === 'negative' ? `${currentY}%` : '0%'
                }}
              >
                <div className="absolute -top-5 w-full text-center text-[9px] font-mono font-bold">
                  {step.value > 0 ? '+' : ''}{step.value.toFixed(1)}
                </div>
              </motion.div>
              
              <div className="mt-3 overflow-hidden w-full">
                <p className="text-[8px] font-bold uppercase tracking-tighter text-center whitespace-nowrap">
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
