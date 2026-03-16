import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, BarChart3, Map as MapIcon, RefreshCcw, Info, Globe, ChevronDown } from 'lucide-react';
import { GameState } from './types';
import { OUTLETS } from './constants';
import { MetricsPanel } from './components/MetricsPanel';
import { TerritoryMap } from './components/TerritoryMap';
import { OutletView } from './components/OutletView';
import { translations, Language } from './translations';

const CokeBottle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 250" className={className} fill="currentColor">
    {/* Cap */}
    <path d="M42 10h16v6H42z" />
    {/* Neck */}
    <path d="M45 16c0 0-2 10-2 20s2 30 2 30h10s2-20 2-30-2-20-2-20H45z" />
    {/* Body - Iconic Contour Shape */}
    <path d="M45 66c-10 10-15 25-15 45s5 40 10 60c5 20 5 40 5 55 0 10-2 15-5 15h20c-3 0-5-5-5-15 0-15 0-35 5-55 5-20 10-40 10-60s-5-35-15-45H45z" />
    {/* Label area */}
    <path d="M32 110h36v25H32z" fill="white" opacity="0.2" />
  </svg>
);

const INITIAL_STATE: GameState = {
  level: 1,
  totalRevenue: 0,
  totalVolume: 0,
  totalVolumeLitre: 0,
  territoryOutlets: OUTLETS.map(o => o.id),
  completedOutlets: [],
  completedBrands: [],
  totalHappiness: 0,
  currentOutletId: null,
};

const TARGET_REVENUE = 3200;
const TARGET_VOLUME = 1000; // This is now Litres target
const TARGET_BRANDS = 3;
const TARGET_HAPPINESS = 30; // Max happiness is 10 per outlet

export default function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [showIntro, setShowIntro] = useState(true);
  const [lang, setLang] = useState<Language>('en');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const t = translations[lang];

  const currentOutlet = OUTLETS.find(o => o.id === gameState.currentOutletId);
  const revenuePerLitre = gameState.totalVolumeLitre > 0 ? gameState.totalRevenue / gameState.totalVolumeLitre : 0;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toUpperCase() === 'HERO2026') {
      setIsAuthorized(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPassword('');
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-swiss-dark flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border-4 border-swiss-dark p-12 max-w-md w-full shadow-[16px_16px_0px_0px_rgba(255,0,0,1)]"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-swiss-red flex items-center justify-center text-white border-2 border-swiss-dark">
              <Trophy size={24} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">Secure Access</h2>
          </div>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label className="label-micro mb-2 block">Enter Mission Code</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-4 border-4 font-mono font-bold text-xl focus:outline-none transition-colors ${
                  passwordError ? 'border-swiss-red bg-red-50' : 'border-swiss-dark focus:border-swiss-red'
                }`}
                placeholder="••••••••"
                autoFocus
              />
              {passwordError && (
                <p className="text-[10px] font-black text-swiss-red uppercase mt-2">Invalid Access Code</p>
              )}
            </div>
            <button type="submit" className="swiss-button-primary w-full py-4 text-xl">
              Authorize
            </button>
          </form>
          <p className="mt-8 text-[10px] font-bold text-gray-400 uppercase text-center tracking-widest">
            Restricted Personnel Only
          </p>
        </motion.div>
      </div>
    );
  }

  const handleSelectOutlet = (id: string) => {
    if (gameState.completedOutlets.includes(id)) return;
    setGameState(prev => ({ ...prev, currentOutletId: id }));
  };

  const handleCompleteOutlet = (revenue: number, volume: number, volumeLitre: number, happiness: number, brandId: string) => {
    setGameState(prev => ({
      ...prev,
      totalRevenue: prev.totalRevenue + revenue,
      totalVolume: prev.totalVolume + volume,
      totalVolumeLitre: prev.totalVolumeLitre + volumeLitre,
      totalHappiness: prev.totalHappiness + happiness,
      completedOutlets: [...prev.completedOutlets, prev.currentOutletId!],
      completedBrands: prev.completedBrands.includes(brandId) 
        ? prev.completedBrands 
        : [...prev.completedBrands, brandId],
      currentOutletId: null,
    }));
  };

  const resetGame = () => setGameState(INITIAL_STATE);

  return (
    <div className="min-h-screen bg-swiss-gray flex flex-col">
      {/* Swiss Header */}
      <header className="bg-white border-b-4 border-swiss-dark sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-swiss-red flex items-center justify-center text-white border-2 border-swiss-dark shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Trophy size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter leading-none">{t.title}</h1>
              <p className="label-micro text-swiss-red">{t.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-10">
             <div className="hidden lg:flex flex-col items-end">
                <span className="label-micro">{t.systemStatus}</span>
                <span className="font-mono text-xs font-bold text-emerald-600 uppercase">{t.liveMarketSync}</span>
             </div>

             {/* Language Selector */}
             <div className="relative">
               <button 
                 onClick={() => setShowLangMenu(!showLangMenu)}
                 className="swiss-button-secondary flex items-center gap-2 px-4 py-2"
               >
                 <Globe size={18} />
                 <span className="font-bold uppercase text-xs">{lang}</span>
                 <ChevronDown size={14} />
               </button>
               <AnimatePresence>
                 {showLangMenu && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: 10 }}
                     className="absolute right-0 mt-2 w-32 bg-white border-2 border-swiss-dark shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50"
                   >
                     {(['en', 'de', 'fr'] as Language[]).map((l) => (
                       <button
                         key={l}
                         onClick={() => {
                           setLang(l);
                           setShowLangMenu(false);
                         }}
                         className={`w-full text-left px-4 py-2 text-xs font-bold uppercase transition-colors hover:bg-swiss-red hover:text-white ${lang === l ? 'bg-gray-100' : ''}`}
                       >
                         {l === 'en' ? 'English' : l === 'de' ? 'Deutsch' : 'Français'}
                       </button>
                     ))}
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>

             <button onClick={resetGame} className="swiss-button-secondary p-2">
               <RefreshCcw size={20} />
             </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {showIntro ? (
            <motion.div 
              key="intro" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto py-20"
            >
              <div className="bg-white border-4 border-swiss-dark p-16 shadow-[16px_16px_0px_0px_rgba(255,0,0,1)]">
                <h2 className="text-7xl font-black mb-8 leading-[0.9] tracking-tighter">
                  {t.introTitle.split(' ').map((word, i) => 
                    word.toLowerCase() === 'revenue' ? <span key={i} className="text-swiss-red">{word} </span> : word + ' '
                  )}
                </h2>
                <p className="text-2xl font-bold text-gray-600 mb-12 leading-snug">
                  {t.introSubtitle}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-swiss-dark border-2 border-swiss-dark mb-12">
                  <div className="bg-white p-8">
                    <h4 className="label-micro mb-4">{t.pillar1Title}</h4>
                    <p className="text-sm font-bold leading-tight uppercase">{t.pillar1Desc}</p>
                  </div>
                  <div className="bg-white p-8">
                    <h4 className="label-micro mb-4">{t.pillar2Title}</h4>
                    <p className="text-sm font-bold leading-tight uppercase">{t.pillar2Desc}</p>
                  </div>
                  <div className="bg-white p-8">
                    <h4 className="label-micro mb-4">{t.pillar3Title}</h4>
                    <p className="text-sm font-bold leading-tight uppercase">{t.pillar3Desc}</p>
                  </div>
                </div>

                <button 
                  onClick={() => setShowIntro(false)}
                  className="swiss-button-primary px-16 py-6 text-2xl w-full md:w-auto"
                >
                  {t.startButton}
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-10">
              {/* Persistent Dashboard */}
              <MetricsPanel 
                revenue={gameState.totalRevenue}
                volume={gameState.totalVolume}
                volumeLitre={gameState.totalVolumeLitre}
                brandsCount={gameState.completedBrands.length}
                targetRevenue={TARGET_REVENUE}
                totalHappiness={gameState.totalHappiness}
                lang={lang}
              />
              
              <AnimatePresence mode="wait">
                {gameState.currentOutletId && currentOutlet ? (
                  <motion.div
                    key="outlet" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                  >
                    <OutletView 
                      outlet={currentOutlet}
                      onCancel={() => setGameState(prev => ({ ...prev, currentOutletId: null }))}
                      onComplete={handleCompleteOutlet}
                      lang={lang}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="space-y-10"
                  >
                    <TerritoryMap 
                      outlets={OUTLETS}
                      completedOutlets={gameState.completedOutlets}
                      onSelectOutlet={handleSelectOutlet}
                      currentOutletId={gameState.currentOutletId}
                      lang={lang}
                    />

                    {gameState.completedOutlets.length === OUTLETS.length && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-white border-4 border-swiss-dark p-16 shadow-[16px_16px_0px_0px_rgba(255,0,0,1)]"
                      >
                        <div className="flex flex-col md:flex-row gap-12 items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-6">
                              <Trophy className="text-swiss-red" size={48} />
                              <h3 className="text-5xl font-black uppercase tracking-tighter leading-none">{t.missionAccomplished}</h3>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-1 bg-swiss-dark border-2 border-swiss-dark mb-8">
                              <div className="bg-gray-50 p-6">
                                <p className="label-micro mb-1">{t.revenueScore}</p>
                                <p className="text-3xl font-black">{(Math.min(10, (gameState.totalRevenue / TARGET_REVENUE) * 10)).toFixed(1)}/10</p>
                              </div>
                              <div className="bg-gray-50 p-6">
                                <p className="label-micro mb-1">{t.volumeScore}</p>
                                <p className="text-3xl font-black">{(Math.min(10, (gameState.totalVolumeLitre / TARGET_VOLUME) * 10)).toFixed(1)}/10</p>
                              </div>
                              <div className="bg-gray-50 p-6">
                                <p className="label-micro mb-1">{t.brandScore}</p>
                                <p className="text-3xl font-black">{(Math.min(10, (gameState.completedBrands.length / TARGET_BRANDS) * 10)).toFixed(1)}/10</p>
                              </div>
                              <div className="bg-gray-50 p-6">
                                <p className="label-micro mb-1">{t.efficiencyScore}</p>
                                <p className="text-3xl font-black">{(Math.min(10, (gameState.totalHappiness / TARGET_HAPPINESS) * 10)).toFixed(1)}/10</p>
                              </div>
                            </div>

                            <div className="bg-swiss-dark text-white p-8 mb-8">
                              <h4 className="text-xl font-black uppercase mb-2">{t.finalScore}</h4>
                              <div className="text-7xl font-black text-swiss-red">
                                {(
                                  (Math.min(10, (gameState.totalRevenue / TARGET_REVENUE) * 10) * 0.3) +
                                  (Math.min(10, (gameState.totalVolumeLitre / TARGET_VOLUME) * 10) * 0.2) +
                                  (Math.min(10, (gameState.completedBrands.length / TARGET_BRANDS) * 10) * 0.2) +
                                  (Math.min(10, (gameState.totalHappiness / TARGET_HAPPINESS) * 10) * 0.3)
                                ).toFixed(1)}<span className="text-2xl text-white">/10</span>
                              </div>
                            </div>
                          </div>

                          <div className="w-full md:w-80 bg-gray-100 p-8 border-2 border-swiss-dark">
                            <h4 className="label-micro mb-4 flex items-center gap-2"><Info size={14}/> {t.algorithmTitle}</h4>
                            <p className="text-xs font-bold leading-relaxed uppercase opacity-70">
                              {t.algorithmDesc}
                            </p>
                            <div className="mt-8 pt-8 border-t-2 border-gray-200">
                              <button onClick={resetGame} className="swiss-button-primary w-full py-4 text-lg">
                                {t.restartSimulation}
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Swiss Footer */}
      <footer className="bg-white border-t-4 border-swiss-dark py-8 mt-auto">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <CokeBottle className="h-10 w-auto text-swiss-red" />
            <p className="label-micro">{t.division}</p>
          </div>
          <div className="flex gap-8">
             <span className="label-micro text-swiss-red">{t.schweiz}</span>
             <span className="label-micro">{t.suisse}</span>
             <span className="label-micro">{t.svizzera}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
