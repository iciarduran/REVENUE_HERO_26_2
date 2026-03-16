import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Info, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Smile, Meh, Frown, Plus } from 'lucide-react';
import { Outlet, Brand, Format, BrandCategory } from '../types';
import { BRANDS, FORMATS, NSR_TABLE } from '../constants';

import { translations, Language } from '../translations';

interface OutletViewProps {
  outlet: Outlet;
  onCancel: () => void;
  onComplete: (revenue: number, volume: number, volumeLitre: number, happiness: number, brandId: string) => void;
  lang: Language;
}

export const OutletView: React.FC<OutletViewProps> = ({
  outlet,
  onCancel,
  onComplete,
  lang
}) => {
  const t = translations[lang];
  const [selectedBrand, setSelectedBrand] = useState<Brand>(BRANDS[0]);
  
  const allowedFormats = useMemo(() => {
    return FORMATS.filter(f => selectedBrand.allowedFormats.includes(f.id));
  }, [selectedBrand]);

  const [selectedFormat, setSelectedFormat] = useState<Format>(allowedFormats[0] || FORMATS[0]);

  useEffect(() => {
    if (!selectedBrand.allowedFormats.includes(selectedFormat.id)) {
      setSelectedFormat(allowedFormats[0] || FORMATS[0]);
    }
  }, [selectedBrand, allowedFormats, selectedFormat.id]);

  const [showResult, setShowResult] = useState(false);

  const metrics = useMemo(() => {
    const nsrPerBottle = NSR_TABLE[selectedBrand.id]?.[selectedFormat.id] || selectedBrand.baseNSRPerBottle;
    
    // 1. Brand Match (Customer Preference)
    const brandMatch = outlet.persona.preference.includes(selectedBrand.category);
    
    // 2. Format Match (Consumer Insight)
    let formatMatch = false;
    if (outlet.type === 'Bar' && selectedFormat.id.includes('rgb')) formatMatch = true;
    if (outlet.type === 'Restaurant' && selectedFormat.id.includes('pet')) formatMatch = true;
    if (outlet.type === 'Cafe' && selectedFormat.id.includes('can')) {
      // For Cafe, format match only counts if it's Energy or Coffee
      if (selectedBrand.category === BrandCategory.ENERGY || selectedBrand.category === BrandCategory.COFFEE) {
        formatMatch = true;
      }
    }

    // 3. Multiplier Logic
    let multiplier = 1.0;
    if (brandMatch && formatMatch) multiplier = 2.25; // Perfect Combo
    else if (brandMatch || formatMatch) multiplier = 1.3; // Good Choice
    else multiplier = 0.4; // Poor Choice - Penalize volume

    // 4. Volume Calculation
    const baseLitres = outlet.currentVolume;
    const estimatedVolumeLitre = Math.round(baseLitres * multiplier);
    
    // 5. Bottles derived from Litres
    const estimatedVolume = Math.round(estimatedVolumeLitre / selectedFormat.volumePerUnit);
    const estimatedRevenue = estimatedVolume * nsrPerBottle;

    // 6. Happiness Score (0-10)
    const happiness = (brandMatch ? 5 : 0) + (formatMatch ? 5 : 0);

    return {
      nsrPerBottle,
      estimatedVolume,
      estimatedVolumeLitre,
      estimatedRevenue,
      happiness,
      brandMatch,
      formatMatch
    };
  }, [selectedBrand, selectedFormat, outlet]);

  const [prevMetrics, setPrevMetrics] = useState({ revenue: 0, volume: 0, nsrPerBottle: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setPrevMetrics({
        revenue: metrics.estimatedRevenue,
        volume: metrics.estimatedVolume,
        nsrPerBottle: metrics.nsrPerBottle
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [metrics]);

  const getTrend = (current: number, prev: number) => {
    if (current > prev) return 'up';
    if (current < prev) return 'down';
    return 'neutral';
  };

  const customerFeedback = useMemo(() => {
    const isBrandMatch = outlet.persona.preference.includes(selectedBrand.category);
    if (isBrandMatch) return 'happy';
    return 'sad';
  }, [selectedBrand, outlet]);

  const consumerFeedback = useMemo(() => {
    if (metrics.brandMatch && metrics.formatMatch) return 'happy';
    if (metrics.brandMatch || metrics.formatMatch) return 'serious';
    return 'sad';
  }, [metrics.brandMatch, metrics.formatMatch]);

  const FeedbackIcon = ({ type }: { type: 'happy' | 'serious' | 'sad' }) => {
    if (type === 'happy') return <Smile className="text-emerald-500" size={32} />;
    if (type === 'serious') return <Meh className="text-amber-500" size={32} />;
    return <Frown className="text-swiss-red" size={32} />;
  };

  const translatedPersona = useMemo(() => {
    const id = outlet.id;
    return {
      description: id === 'zurich-bar' ? t.roleZurich : id === 'ticino-restaurant' ? t.roleTicino : id === 'urban-cafe' ? t.roleLausanne : outlet.persona.description,
      objection: id === 'zurich-bar' ? t.quoteZurich : id === 'ticino-restaurant' ? t.quoteTicino : id === 'urban-cafe' ? t.quoteLausanne : outlet.persona.objection,
      consumerInsight: id === 'zurich-bar' ? t.insightZurich : id === 'ticino-restaurant' ? t.insightTicino : id === 'urban-cafe' ? t.insightLausanne : outlet.persona.consumerInsight,
    };
  }, [outlet.id, t, outlet.persona]);

  const handleNegotiate = () => setShowResult(true);
  const handleConfirm = () => onComplete(
    metrics.estimatedRevenue, 
    metrics.estimatedVolume, 
    metrics.estimatedVolumeLitre, 
    metrics.happiness,
    selectedBrand.id
  );

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-8 border-b-2 border-swiss-dark pb-4">
        <button 
          onClick={onCancel}
          className="flex items-center gap-2 font-bold uppercase tracking-tighter hover:text-swiss-red transition-colors"
        >
          <ArrowLeft size={20} />
          {t.exitNegotiation}
        </button>
        <div className="flex items-center gap-4">
          <span className="label-micro">{t.currentOutlet}:</span>
          <span className="font-black text-xl uppercase">{outlet.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-1 bg-swiss-dark border-2 border-swiss-dark">
        {/* Left Column: Persona & Market Context */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-1">
          <div className="bg-white p-8 flex-1">
            <h4 className="label-micro mb-6">{t.outletPersona}</h4>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-swiss-red text-white flex items-center justify-center text-3xl font-black">
                {outlet.persona.name[0]}
              </div>
              <div>
                <p className="font-black text-xl leading-tight">{outlet.persona.name}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase">{translatedPersona.description}</p>
              </div>
            </div>
            
            <div className="border-l-4 border-swiss-red pl-4 py-2 mb-8 italic text-sm font-medium text-gray-700">
              "{translatedPersona.objection}"
            </div>

            <div className="mb-8 p-4 bg-gray-50 border border-gray-100">
              <p className="label-micro mb-2">{t.consumerInsightLabel}</p>
              <p className="text-xs font-medium leading-relaxed text-gray-600">
                {translatedPersona.consumerInsight}
              </p>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <h4 className="label-micro mb-4 uppercase tracking-widest">Deal Alignment</h4>
              <div className="flex justify-around items-center">
                <div className="flex flex-col items-center gap-2">
                  <FeedbackIcon type={customerFeedback} />
                  <span className="text-[9px] font-black uppercase text-gray-400">Customer</span>
                </div>
                <div className="w-px h-8 bg-gray-100" />
                <div className="flex flex-col items-center gap-2">
                  <FeedbackIcon type={consumerFeedback} />
                  <span className="text-[9px] font-black uppercase text-gray-400">Consumer</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column: Decisions & Controls */}
        <div className="col-span-12 lg:col-span-6 bg-white p-10">
          <h3 className="text-3xl font-black mb-10 border-b-4 border-swiss-dark pb-4">{t.decisionEngine}</h3>
          
          <div className="grid grid-cols-2 gap-10 mb-12">
            <div className="space-y-6">
              <label className="label-micro">{t.portfolioMix}</label>
              <div className="grid grid-cols-1 gap-1">
                {BRANDS.map(brand => (
                  <button
                    key={brand.id}
                    onClick={() => setSelectedBrand(brand)}
                    className={`flex items-center justify-between p-4 border-2 transition-all ${
                      selectedBrand.id === brand.id 
                      ? 'border-swiss-red bg-swiss-red text-white' 
                      : 'border-swiss-gray hover:border-swiss-dark'
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-tighter">{brand.name}</span>
                    <span className="text-[8px] font-bold opacity-60">{brand.category}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <label className="label-micro">{t.packArchitecture}</label>
              <div className="grid grid-cols-1 gap-1">
                {allowedFormats.map(format => (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format)}
                    className={`flex items-center justify-between p-4 border-2 transition-all ${
                      selectedFormat.id === format.id 
                      ? 'border-swiss-red bg-swiss-red text-white' 
                      : 'border-swiss-gray hover:border-swiss-dark'
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-tighter">{format.name}</span>
                    <span className="font-mono text-[10px] font-bold">CHF {(NSR_TABLE[selectedBrand.id]?.[format.id] || 0).toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-12">
            <button 
              onClick={handleNegotiate}
              className="flex-1 swiss-button-primary py-6 text-2xl"
            >
              {t.executeNegotiation}
            </button>
          </div>
        </div>

        {/* Right Column: Live Data Viz */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-1">
          {/* TOTAL NSR */}
          <div className="bg-white p-8 flex-1 flex flex-col justify-center relative overflow-hidden">
            <p className="label-micro mb-2">NET SALES REVENUE</p>
            <div className="flex items-baseline gap-2">
              <motion.p 
                key={metrics.estimatedRevenue}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-mono font-black text-4xl text-swiss-red"
              >
                CHF {metrics.estimatedRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.p>
              {getTrend(metrics.estimatedRevenue, prevMetrics.revenue) !== 'neutral' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`flex items-center ${getTrend(metrics.estimatedRevenue, prevMetrics.revenue) === 'up' ? 'text-emerald-500' : 'text-swiss-red'}`}
                >
                  {getTrend(metrics.estimatedRevenue, prevMetrics.revenue) === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                </motion.div>
              )}
            </div>
          </div>

          {/* ESTIMATED VOLUME */}
          <div className="bg-white p-8 flex-1 flex flex-col justify-center relative overflow-hidden">
            <p className="label-micro mb-2">ESTIMATED VOLUME</p>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <motion.p 
                  key={metrics.estimatedVolume}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-mono font-black text-4xl"
                >
                  {metrics.estimatedVolume} Bottles
                </motion.p>
                {getTrend(metrics.estimatedVolume, prevMetrics.volume) !== 'neutral' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`flex items-center ${getTrend(metrics.estimatedVolume, prevMetrics.volume) === 'up' ? 'text-emerald-500' : 'text-swiss-red'}`}
                  >
                    {getTrend(metrics.estimatedVolume, prevMetrics.volume) === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  </motion.div>
                )}
              </div>
              <p className="font-mono text-xs font-bold text-swiss-red mt-1">{metrics.estimatedVolumeLitre} Litres Total</p>
            </div>
          </div>

          {/* NSR / Bottle */}
          <div className="bg-white p-8 flex-1 flex flex-col justify-center relative overflow-hidden">
            <p className="label-micro mb-2">{t.nsrPerBottle}</p>
            <div className="flex items-baseline gap-2">
              <motion.p 
                key={metrics.nsrPerBottle}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-mono font-black text-4xl"
              >
                CHF {metrics.nsrPerBottle.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.p>
              {getTrend(metrics.nsrPerBottle, prevMetrics.nsrPerBottle) !== 'neutral' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`flex items-center ${getTrend(metrics.nsrPerBottle, prevMetrics.nsrPerBottle) === 'up' ? 'text-emerald-500' : 'text-swiss-red'}`}
                >
                  {getTrend(metrics.nsrPerBottle, prevMetrics.nsrPerBottle) === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                </motion.div>
              )}
            </div>
          </div>

          {/* HAPPINESS SCORE */}
          <div className="bg-white p-8 flex-1 flex flex-col justify-center relative overflow-hidden border-t-2 border-gray-100">
            <p className="label-micro mb-2">PARTNER SATISFACTION</p>
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-6 ${i < metrics.happiness ? 'bg-swiss-red' : 'bg-gray-200'}`}
                  />
                ))}
              </div>
              <span className="font-mono font-black text-2xl">{metrics.happiness}/10</span>
            </div>
            <div className="mt-4 flex flex-col gap-1">
              <div className={`flex items-center gap-1 text-[10px] font-bold uppercase ${metrics.brandMatch ? 'text-emerald-600' : 'text-gray-400'}`}>
                {metrics.brandMatch ? '😊 Customer Happy' : '😐 Brand Mismatch'}
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold uppercase ${metrics.formatMatch ? 'text-emerald-600' : 'text-gray-400'}`}>
                {metrics.formatMatch ? '😊 Consumer Happy' : '😐 Format Mismatch'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }}
              className="bg-white border-4 border-swiss-dark p-12 max-w-xl w-full shadow-[12px_12px_0px_0px_rgba(255,0,0,1)]"
            >
              <div className="text-center mb-10">
                <div className="w-24 h-24 bg-swiss-red text-white flex items-center justify-center mx-auto mb-8 border-4 border-swiss-dark">
                  <CheckCircle size={48} />
                </div>
                <h3 className="text-4xl font-black mb-4">{t.negotiationSuccess}</h3>
                <p className="font-bold text-gray-500 uppercase tracking-tighter">
                  {outlet.persona.name} {t.signedAgreement}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-1 bg-swiss-dark border-2 border-swiss-dark mb-10">
                <div className="bg-white p-6">
                  <p className="label-micro mb-2">{t.revenue}</p>
                  <p className="font-mono font-black text-xl leading-tight">CHF {metrics.estimatedRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
                <div className="bg-white p-6">
                  <p className="label-micro mb-2">{t.volume}</p>
                  <p className="font-mono font-black text-xl leading-tight">{metrics.estimatedVolume} Btl</p>
                  <p className="font-mono text-[10px] font-bold text-swiss-red">{metrics.estimatedVolumeLitre}L</p>
                </div>
                <div className="bg-white p-6">
                  <p className="label-micro mb-2 uppercase">{t.satisfaction}</p>
                  <p className="font-mono font-black text-xl leading-tight">{metrics.happiness}/10</p>
                  <div className="flex gap-1 mt-1">
                    <span className={metrics.brandMatch ? '' : 'opacity-20'}>😊</span>
                    <span className={metrics.formatMatch ? '' : 'opacity-20'}>😊</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleConfirm}
                className="swiss-button-primary w-full py-5 text-xl"
              >
                {t.syncDashboard}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

