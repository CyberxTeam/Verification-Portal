
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- TYPES ---
export interface CountryData {
  name: string;
  code: string;
  prefix: string;
  flag: string;
  cities: string[];
}

export interface Activity {
  id: number;
  country: CountryData;
  city: string;
  number: string;
  timestamp: Date;
}

export interface DistributorInfo {
  name: string;
  number: string;
  location: string;
  license: string;
  facebookUrl: string;
  whatsappNumber: string;
}

export interface VerificationResult {
  isOriginal: boolean;
  distributor?: DistributorInfo;
  inputNumber: string;
  timestamp: Date;
  certificateId: string;
}

// --- CONSTANTS ---
export const BRAND_NAME = "OrganicTrust";
export const COUNTRIES: CountryData[] = [
  { name: 'Bangladesh', code: 'BD', prefix: '+880', flag: '🇧🇩', cities: ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi'] },
  { name: 'United Kingdom', code: 'GB', prefix: '+44', flag: '🇬🇧', cities: ['London', 'Manchester'] },
  { name: 'United States', code: 'US', prefix: '+1', flag: '🇺🇸', cities: ['New York', 'Los Angeles'] },
  { name: 'Saudi Arabia', code: 'SA', prefix: '+966', flag: '🇸🇦', cities: ['Riyadh', 'Jeddah'] },
  { name: 'UAE', code: 'AE', prefix: '+971', flag: '🇦🇪', cities: ['Dubai', 'Abu Dhabi'] },
  { name: 'Malaysia', code: 'MY', prefix: '+60', flag: '🇲🇾', cities: ['Kuala Lumpur'] }
];

export const DISTRIBUTOR_REGISTRY: DistributorInfo[] = [
  {
    name: 'Tarikul Islam',
    number: '01888525124',
    location: 'Rajshahi, Natore, Laxmipur Bazar',
    license: 'OT-REG-8852',
    facebookUrl: 'https://www.facebook.com/tarikulv3',
    whatsappNumber: '8801888525124'
  },
  {
    name: 'Premium Partner BD',
    number: '01757293124',
    location: 'Dhaka, Gulshan-2',
    license: 'OT-REG-7293',
    facebookUrl: 'https://www.facebook.com/tarikulv3',
    whatsappNumber: '8801888525124'
  }
];

export const PRODUCT_IMAGE_URL = 'https://organicproductcertified.top/wp-content/uploads/2026/02/Untitled-design.png';
export const LOGO_URL = 'https://organicproductcertified.top/wp-content/uploads/2026/01/Untitled-design-2.png';
export const CERTIFICATE_LOGO_URL = 'https://puremaxlabs.com/cdn/shop/files/puremaxlogo_180x.png?v=1613713596';
export const USA_EMBLEM_URL = 'https://img.freepik.com/premium-vector/usa-emblem-design_24908-14062.jpg?w=740';

// --- UTILS ---
export const maskNumber = (fullNumber: string): string => {
  if (fullNumber.length < 5) return fullNumber;
  return `${fullNumber.substring(0, 3)}****${fullNumber.substring(fullNumber.length - 2)}`;
};

export const generateRandomActivity = (): Activity => {
  const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
  const city = country.cities[Math.floor(Math.random() * country.cities.length)];
  const randomDigits = Math.floor(Math.random() * 9000000) + 1000000;
  return { id: Date.now(), country, city, number: `${country.prefix}${randomDigits}`, timestamp: new Date() };
};

// --- COMPONENTS ---

const Preloader: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsExiting(true), 2500);
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
      onFinish();
    }, 3200);
    return () => { clearTimeout(timer); clearTimeout(removeTimer); };
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center transition-all duration-1000 ${isExiting ? 'opacity-0 scale-110 blur-2xl pointer-events-none' : 'opacity-100'}`}>
      <div className="relative animate-bounce">
        <img src={LOGO_URL} alt="Logo" className="w-40 md:w-56 drop-shadow-2xl" />
      </div>
      <div className="mt-8 text-center">
        <h2 className="text-2xl md:text-4xl font-cinzel font-black tracking-[0.2em] text-emerald-800 mb-2">ORGANIC TRUST</h2>
        <div className="flex gap-1 justify-center">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-75"></div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-150"></div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-300"></div>
        </div>
        <p className="mt-4 text-emerald-600/60 text-[10px] uppercase font-bold tracking-widest">Securing Global Distribution</p>
      </div>
    </div>
  );
};

const ActivityPopup: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newAct = generateRandomActivity();
      setActivities(prev => [newAct, ...prev.slice(0, 1)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3 pointer-events-none">
      {activities.map((act) => (
        <div key={act.id} className="bg-white/80 backdrop-blur-xl border border-emerald-100 p-4 rounded-2xl flex items-center gap-4 animate-slide-in shadow-2xl w-80">
          <div className="bg-emerald-50 p-2 rounded-xl text-2xl shadow-inner border border-emerald-100">{act.country.flag}</div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Verified Organic Partner</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
            <p className="text-[13px] font-bold text-slate-800 leading-none">{act.city}, {act.country.name}</p>
            <p className="text-[10px] text-slate-400 font-mono mt-1">{maskNumber(act.number)}</p>
          </div>
        </div>
      ))}
      <style>{`
        @keyframes slide-in { from { transform: translateX(-40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-in { animation: slide-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  const [appReady, setAppReady] = useState(false);
  const [inputNumber, setInputNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [insight, setInsight] = useState('');

  useEffect(() => {
    const fetchInsight = async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: "Say a short trust-building sentence about certified organic products.",
        });
        setInsight(response.text || "Certified organic ensures pure, safe ingredients for your well-being.");
      } catch {
        setInsight("Verified organic quality guaranteed by global standards.");
      }
    };
    fetchInsight();
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputNumber) return;
    setIsVerifying(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 1800));
    const found = DISTRIBUTOR_REGISTRY.find(d => d.number === inputNumber);
    setResult({
      isOriginal: !!found,
      distributor: found,
      inputNumber,
      timestamp: new Date(),
      certificateId: 'OT-' + Math.random().toString(36).substr(2, 6).toUpperCase()
    });
    setIsVerifying(false);
  };

  return (
    <>
      <Preloader onFinish={() => setAppReady(true)} />
      {appReady && (
        <div className="min-h-screen bg-[#f7f9f7] text-slate-900 selection:bg-emerald-100 animate-fade-in pb-20">
          <nav className="border-b border-emerald-100 bg-white/50 backdrop-blur-md sticky top-0 z-40">
            <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={LOGO_URL} alt="Logo" className="h-10 w-auto" />
                <span className="text-xl font-cinzel font-black tracking-widest text-emerald-900">{BRAND_NAME}</span>
              </div>
              <div className="hidden md:flex gap-6 text-[10px] font-black uppercase tracking-widest text-emerald-700/60">
                <span className="cursor-pointer hover:text-emerald-900">Safety</span>
                <span className="cursor-pointer hover:text-emerald-900">Partners</span>
                <span className="cursor-pointer hover:text-emerald-900">Ethics</span>
              </div>
            </div>
          </nav>

          <main className="max-w-3xl mx-auto px-6 pt-12">
            <div className="text-center mb-12">
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-emerald-200/20 blur-3xl rounded-full"></div>
                <img src={PRODUCT_IMAGE_URL} alt="Product" className="relative w-48 mx-auto rounded-3xl shadow-2xl border-4 border-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight text-emerald-950">Verification <span className="text-emerald-600">Portal</span></h1>
              <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto leading-relaxed italic">"{insight}"</p>
            </div>

            <div className="bg-white border border-emerald-100 rounded-[2.5rem] p-10 shadow-xl mb-12 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-60"></div>
              <form onSubmit={handleVerify} className="space-y-6 relative z-10">
                <div>
                  <label className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.25em] block mb-4">Registry Identification</label>
                  <input 
                    type="text" 
                    value={inputNumber}
                    onChange={(e) => setInputNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Enter Registered Mobile Number"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xl focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/5 transition-all text-center"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isVerifying}
                  className="w-full bg-emerald-700 text-white font-black py-5 rounded-2xl text-lg hover:bg-emerald-800 shadow-lg shadow-emerald-900/10 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isVerifying ? 'SEARCHING REGISTRY...' : 'AUTHENTICATE NOW'}
                </button>
              </form>
            </div>

            {result && (
              <div className="animate-fade-in-up">
                {result.isOriginal ? (
                  <div className="text-center">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mb-8 flex items-center gap-4 justify-center">
                      <div className="bg-emerald-500 p-2 rounded-full shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="text-emerald-800 font-black uppercase text-lg tracking-wide">Authorized Partner Confirmed</span>
                    </div>
                    
                    <div className="bg-white border-[1px] border-emerald-100 p-1 rounded-3xl shadow-2xl relative">
                        <div className="border-4 border-double border-emerald-200 p-10 rounded-2xl bg-white relative overflow-hidden text-left font-serif">
                           <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] grayscale">
                              <img src={USA_EMBLEM_URL} alt="Emblem" className="w-[80%]" />
                           </div>

                           <div className="relative z-10">
                             <div className="text-center mb-10">
                               <img src={LOGO_URL} alt="Logo" className="h-16 mx-auto mb-4" />
                               <h3 className="text-emerald-900 text-2xl font-cinzel underline underline-offset-8 decoration-emerald-200 tracking-widest uppercase">Distribution License</h3>
                               <p className="text-[9px] text-emerald-600 font-sans font-bold tracking-[0.5em] mt-4">OFFICIAL CERTIFICATION</p>
                             </div>
                             
                             <div className="space-y-8 text-slate-700">
                               <div>
                                  <p className="text-[10px] uppercase font-sans font-bold text-slate-400 tracking-widest mb-1">Authenticated Holder</p>
                                  <h2 className="text-4xl font-black text-emerald-900 italic font-cinzel">{result.distributor?.name}</h2>
                               </div>
                               
                               <div className="grid grid-cols-2 gap-8 text-sm border-y border-emerald-50 py-8 font-sans">
                                 <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Partner ID</p>
                                    <p className="text-emerald-950 font-bold">{result.distributor?.number}</p>
                                 </div>
                                 <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">License Code</p>
                                    <p className="text-emerald-950 font-bold">{result.distributor?.license}</p>
                                 </div>
                                 <div className="col-span-2">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Authorized Distribution Zone</p>
                                    <p className="text-emerald-950 font-bold">{result.distributor?.location}</p>
                                 </div>
                               </div>
                             </div>

                             <div className="mt-12 flex justify-between items-end">
                               <div>
                                  <p className="text-[9px] text-slate-400 uppercase font-sans font-bold tracking-tighter">Issue Date</p>
                                  <p className="text-sm text-emerald-950 font-sans font-bold">{result.timestamp.toLocaleDateString()}</p>
                               </div>
                               <div className="text-right">
                                  <p className="text-[9px] text-slate-400 uppercase font-sans font-bold mb-2">Legal Authentication</p>
                                  <p className="font-signature text-3xl text-emerald-800 leading-none mb-1">Marie E. Richmond</p>
                                  <div className="h-[1px] w-40 bg-gradient-to-r from-transparent via-emerald-200 to-transparent ml-auto mb-2"></div>
                                  <p className="text-[8px] text-emerald-600 uppercase font-sans tracking-[0.3em] font-black">Chief Legal Officer</p>
                               </div>
                             </div>
                           </div>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-4 justify-center no-print">
                      <button onClick={() => window.print()} className="bg-white border border-slate-200 hover:bg-slate-50 px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm">Save License</button>
                      <a href={`https://wa.me/${result.distributor?.whatsappNumber}`} target="_blank" rel="noopener" className="bg-[#25D366] text-white px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg flex items-center gap-2">
                        WhatsApp Contact
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border-2 border-red-50 rounded-[2.5rem] p-16 text-center shadow-xl">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Access Denied</h2>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto">This ID could not be found in our Global Registry of Organic Trust partners.</p>
                  </div>
                )}
              </div>
            )}
          </main>

          <ActivityPopup />
          <footer className="max-w-3xl mx-auto px-6 mt-16 text-center">
            <p className="text-[10px] text-emerald-800/30 uppercase tracking-[0.4em] font-black">&copy; 2026 {BRAND_NAME} GLOBAL SYSTEMS. ALL RIGHTS RESERVED.</p>
          </footer>
        </div>
      )}

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @media print { .no-print, nav, footer, .fixed { display: none !important; } }
      `}</style>
    </>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
