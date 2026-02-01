
import React, { useState, useEffect } from 'react';
import { VerificationResult, Activity } from './types.ts';
import { generateCertificateId, generateRandomActivity, maskNumber } from './utils.ts';
import { getOrganicInsight } from './services/geminiService.ts';
import { DISTRIBUTOR_REGISTRY, PRODUCT_IMAGE_URL, LOGO_URL, GOAT_MASCOT_URL, USA_EMBLEM_URL } from './constants.ts';

// --- Preloader Component ---
const Preloader: React.FC<{ insight: string; onFinish: () => void }> = ({ insight, onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLaughing, setIsLaughing] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const laughTimer = setTimeout(() => setIsLaughing(true), 800);
    const exitTimer = setTimeout(() => setIsExiting(true), 2500);
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
      onFinish();
    }, 3000);

    return () => {
      clearTimeout(laughTimer);
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center transition-all duration-700 ${isExiting ? 'opacity-0 scale-110 blur-xl pointer-events-none' : 'opacity-100'}`}>
      <div className="relative">
        {isLaughing && (
          <div className="absolute inset-0 z-0 flex items-center justify-center">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="absolute rounded-full blur-sm animate-fire"
                style={{
                  width: `${Math.random() * 15 + 5}px`,
                  height: `${Math.random() * 15 + 5}px`,
                  backgroundColor: i % 2 === 0 ? '#d4af37' : '#fcf6ba',
                  left: '50%',
                  top: '50%',
                  '--x': `${(Math.random() - 0.5) * 400}px`,
                  '--y': `${(Math.random() - 0.5) * 400}px`,
                  animationDuration: `${0.5 + Math.random() * 0.5}s`,
                } as any}
              />
            ))}
          </div>
        )}
        
        <div className={`relative z-10 transition-transform duration-200 ${isLaughing ? 'animate-pulse scale-110' : ''}`}>
          <img 
            src={GOAT_MASCOT_URL} 
            alt="Mascot" 
            className="w-48 md:w-64 drop-shadow-[0_10px_30px_rgba(184,134,11,0.2)]"
          />
        </div>
      </div>

      <div className="mt-8 text-center max-w-lg px-6">
        <h2 className="text-3xl md:text-5xl font-cinzel font-black tracking-[0.3em] gold-text mb-4">HORNY</h2>
        <p className="text-slate-400 text-xs md:text-sm italic animate-pulse px-4 font-medium">"{insight || 'Loading secure environment...'}"</p>
      </div>

      <style>{`
        @keyframes fire {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--x), var(--y)) scale(0); opacity: 0; }
        }
        .animate-fire { animation: fire linear infinite; }
      `}</style>
    </div>
  );
};

// --- Activity Feed ---
const ActivityPopup: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Generate an initial activity immediately
    const firstAct = generateRandomActivity();
    setActivities([firstAct]);

    const interval = setInterval(() => {
      const newAct = generateRandomActivity();
      setActivities(prev => [newAct, ...prev.slice(0, 2)]); // Show up to 3 activities
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col-reverse gap-3 pointer-events-none max-w-xs">
      {activities.map((act) => (
        <div key={act.id} className="bg-white/90 backdrop-blur-md border border-slate-200 p-3 rounded-2xl flex items-center gap-4 animate-slide-in shadow-xl w-72">
          <div className="bg-slate-100 p-2 rounded-xl text-2xl shadow-inner">
            {act.country.flag}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-0.5">
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-tighter">Live Verification</p>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mt-1"></span>
            </div>
            <p className="text-[13px] font-bold text-slate-900 leading-tight">{act.city}, {act.country.name}</p>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">{maskNumber(act.number)}</p>
          </div>
        </div>
      ))}
      <style>{`
        @keyframes slide-in { from { transform: translateX(-100%) scale(0.9); opacity: 0; } to { transform: translateX(0) scale(1); opacity: 1; } }
        .animate-slide-in { animation: slide-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  const [appReady, setAppReady] = useState(false);
  const [inputNumber, setInputNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [insight, setInsight] = useState<string>('');

  useEffect(() => {
    const init = async () => {
      try {
        const text = await getOrganicInsight("authorized distribution");
        setInsight(text);
      } catch (e) {
        setInsight("Premium organic verification for global distribution.");
      }
    };
    init();
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = inputNumber.trim();
    if (!cleanId) {
      setError('Please enter a valid ID.');
      return;
    }
    setError(null);
    setIsVerifying(true);
    setResult(null);

    await new Promise(r => setTimeout(r, 1500));
    const found = DISTRIBUTOR_REGISTRY.find(d => d.number === cleanId);
    
    setResult({
      isOriginal: !!found,
      distributor: found,
      inputNumber: cleanId,
      timestamp: new Date(),
      certificateId: generateCertificateId()
    });
    setIsVerifying(false);
  };

  return (
    <>
      <Preloader insight={insight} onFinish={() => setAppReady(true)} />
      
      {appReady && (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-amber-100 selection:text-amber-900 animate-fade-in pb-20">
          {/* Header - Transparent Glassmorphism */}
          <nav className="border-b border-slate-200 bg-white/30 backdrop-blur-md sticky top-0 z-40 transition-all">
            <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={LOGO_URL} alt="Logo" className="h-10 w-auto" />
                <span className="text-xl font-cinzel font-black gold-text">HORNY</span>
              </div>
              <div className="hidden md:flex gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span className="hover:text-amber-600 cursor-pointer transition-colors">Safety</span>
                <span className="hover:text-amber-600 cursor-pointer transition-colors">Compliance</span>
                <span className="hover:text-amber-600 cursor-pointer transition-colors">Support</span>
              </div>
            </div>
          </nav>

          <main className="max-w-3xl mx-auto px-6 pt-12">
            <div className="text-center mb-12">
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-amber-200/20 blur-3xl rounded-full"></div>
                <img src={PRODUCT_IMAGE_URL} alt="Product" className="relative w-48 mx-auto rounded-3xl shadow-xl border border-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Verification <span className="gold-text">Portal</span></h1>
              <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto leading-relaxed">Global Registry Access. Enter registered mobile number or license ID for instant authentication.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm mb-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
              <form onSubmit={handleVerify} className="space-y-6 relative z-10">
                <div>
                  <label className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] block mb-3">Partner Registry ID</label>
                  <input 
                    type="text" 
                    value={inputNumber} 
                    onChange={(e) => setInputNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Enter Mobile (e.g. 01888525124)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-xl focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all"
                  />
                  {error && <p className="mt-3 text-red-500 text-sm font-bold flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> {error}</p>}
                </div>
                <button 
                  type="submit" 
                  disabled={isVerifying}
                  className="w-full bg-gradient-to-r from-[#bf953f] to-[#aa771c] text-white font-black py-5 rounded-2xl text-lg hover:brightness-105 shadow-lg shadow-amber-900/10 transition-all disabled:opacity-50 active:scale-[0.98]"
                >
                  {isVerifying ? 'SEARCHING SECURE REGISTRY...' : 'VERIFY IDENTITY'}
                </button>
              </form>
            </div>

            {result && (
              <div className="animate-fade-in-up">
                {result.isOriginal ? (
                  <div className="text-center">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mb-8 flex items-center gap-4 justify-center">
                      <div className="bg-emerald-500 p-2 rounded-full shadow-lg shadow-emerald-500/20">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="text-emerald-700 font-black uppercase text-lg tracking-wide">Authorized Partner Confirmed</span>
                    </div>
                    
                    {/* Certificate with Watermark */}
                    <div className="bg-white border-[1px] border-slate-200 p-1 rounded-2xl shadow-2xl relative">
                        <div className="border-4 border-double border-[#d4af37] p-8 rounded-xl bg-white relative overflow-hidden text-left font-serif">
                           {/* Watermark Emblem */}
                           <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.05] grayscale">
                              <img src={USA_EMBLEM_URL} alt="USA Emblem" className="w-[80%] object-contain" />
                           </div>

                           <div className="absolute top-0 right-0 p-4 opacity-[0.03] font-sans text-7xl font-black pointer-events-none">OFFICIAL</div>
                           
                           <div className="relative z-10">
                             <div className="text-center mb-10">
                               <img src={LOGO_URL} alt="Logo" className="h-14 mx-auto mb-4" />
                               <h3 className="text-slate-900 text-2xl font-cinzel underline underline-offset-8 decoration-[#d4af37]/50 tracking-widest">DISTRIBUTION LICENSE</h3>
                             </div>
                             
                             <div className="space-y-6 text-slate-700">
                               <div>
                                  <p className="text-[10px] uppercase font-sans font-bold text-slate-400 tracking-widest mb-1">Authenticated Holder</p>
                                  <h2 className="text-4xl font-black text-[#8a6d3b] italic font-cinzel">{result.distributor?.name}</h2>
                               </div>
                               
                               <div className="grid grid-cols-2 gap-6 text-sm border-y border-slate-100 py-6 font-sans">
                                 <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Registry ID</p>
                                    <p className="text-slate-900 font-bold">{result.distributor?.number}</p>
                                 </div>
                                 <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">License No.</p>
                                    <p className="text-slate-900 font-bold">{result.distributor?.license}</p>
                                 </div>
                                 <div className="col-span-2">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Authorized Area</p>
                                    <p className="text-slate-900 font-bold">{result.distributor?.location}</p>
                                 </div>
                               </div>
                             </div>

                             <div className="mt-12 flex justify-between items-end">
                               <div>
                                  <p className="text-[9px] text-slate-400 uppercase font-sans font-bold tracking-tighter">Certification Date</p>
                                  <p className="text-sm text-slate-900 font-sans font-bold">{result.timestamp.toLocaleDateString()}</p>
                               </div>
                               <div className="text-right">
                                  <p className="text-[9px] text-slate-400 uppercase font-sans font-bold mb-2">Legal Authentication</p>
                                  <p className="font-signature text-3xl text-[#8a6d3b] leading-none mb-1">Marie E. Richmond</p>
                                  <div className="h-[1px] w-40 bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent ml-auto mb-2"></div>
                                  <p className="text-[8px] text-slate-400 uppercase font-sans tracking-[0.3em] font-black">Authorized Attorney at Law</p>
                               </div>
                             </div>
                           </div>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-4 justify-center no-print">
                      <button onClick={() => window.print()} className="bg-white border border-slate-200 hover:bg-slate-50 px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm">Save/Print License</button>
                      <a href={`https://wa.me/${result.distributor?.whatsappNumber}`} target="_blank" rel="noopener" className="bg-[#25D366] text-white px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-105 transition-all shadow-md shadow-green-500/20 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.394 0 12.03c0 2.12.553 4.189 1.601 6.03l-1.701 6.21 6.353-1.666c1.789.975 3.798 1.489 5.842 1.49h.005c6.634 0 12.032-5.395 12.035-12.031a11.785 11.785 0 00-3.414-8.514" /></svg>
                        Contact your Distributor
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border border-red-100 rounded-3xl p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Access Denied</h2>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto">The ID <span className="text-red-600 font-black">{result.inputNumber}</span> could not be verified in our global registry of authorized partners.</p>
                  </div>
                )}
              </div>
            )}
          </main>

          <ActivityPopup />
          
          <footer className="max-w-3xl mx-auto px-6 mt-12 text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
            <p>&copy; 2026 HORNY GLOBAL LOGISTICS. ALL RIGHTS RESERVED.</p>
          </footer>
        </div>
      )}

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @media print { 
            .no-print, nav, footer, .fixed { display: none !important; }
            body { background: white !important; padding: 0 !important; }
            main { padding: 0 !important; max-width: 100% !important; }
        }
      `}</style>
    </>
  );
};

export default App;
