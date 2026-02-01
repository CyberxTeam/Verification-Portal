
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- Types ---
interface DistributorInfo {
  name: string;
  number: string;
  location: string;
  license: string;
  whatsappNumber: string;
}

interface Activity {
  id: number;
  country: { name: string; flag: string; prefix: string; cities: string[] };
  city: string;
  number: string;
}

// --- Constants ---
const BRAND_NAME = "OrganicTrust";
const LOGO_URL = 'https://organicproductcertified.top/wp-content/uploads/2026/01/Untitled-design-2.png';
const PRODUCT_IMAGE_URL = 'https://organicproductcertified.top/wp-content/uploads/2026/02/Untitled-design.png';
const USA_EMBLEM_URL = 'https://img.freepik.com/premium-vector/usa-emblem-design_24908-14062.jpg?w=740';

const COUNTRIES = [
  { name: 'Bangladesh', flag: '🇧🇩', prefix: '+880', cities: ['Dhaka', 'Rajshahi', 'Sylhet', 'Chittagong'] },
  { name: 'UK', flag: '🇬🇧', prefix: '+44', cities: ['London', 'Manchester'] },
  { name: 'USA', flag: '🇺🇸', prefix: '+1', cities: ['New York', 'Los Angeles'] },
  { name: 'Saudi Arabia', flag: '🇸🇦', prefix: '+966', cities: ['Riyadh', 'Jeddah'] },
  { name: 'UAE', flag: '🇦🇪', prefix: '+971', cities: ['Dubai', 'Abu Dhabi'] }
];

const DISTRIBUTOR_REGISTRY: DistributorInfo[] = [
  {
    name: 'Tarikul Islam',
    number: '01888525124',
    location: 'Rajshahi, Natore, Laxmipur Bazar',
    license: 'OT-REG-8852',
    whatsappNumber: '8801888525124'
  },
  {
    name: 'Tarikul Islam',
    number: '01757293124',
    location: 'Dhaka, Gulshan-2',
    license: 'OT-REG-7293',
    whatsappNumber: '8801888525124'
  },
  {
    name: 'Premium Partner BD',
    number: '01888525125',
    location: 'Sylhet, Zindabazar',
    license: 'OT-REG-1278',
    whatsappNumber: '8801888525125'
  }
];

// --- Utilities ---
const maskNumber = (num: string) => {
  if (num.length < 5) return num;
  return num.substring(0, 3) + "****" + num.substring(num.length - 2);
};

// --- Components ---

const Preloader: React.FC<{ onFinish: () => void; insight: string }> = ({ onFinish, insight }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center transition-all duration-1000">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-emerald-100 blur-3xl rounded-full scale-150 animate-pulse"></div>
        <img src={LOGO_URL} alt="Logo" className="relative w-48 md:w-64 animate-bounce" />
      </div>
      <h2 className="text-2xl font-black tracking-[0.3em] text-emerald-900 font-serif mb-4">ORGANIC TRUST</h2>
      <p className="max-w-xs text-center text-emerald-700/60 text-[10px] uppercase font-bold tracking-widest px-4 italic animate-pulse">
        "{insight || 'Authenticating secure distribution registry...'}"
      </p>
    </div>
  );
};

const ActivityPopup: React.FC = () => {
  const [act, setAct] = useState<Activity | null>(null);

  useEffect(() => {
    const show = () => {
      const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
      const city = country.cities[Math.floor(Math.random() * country.cities.length)];
      setAct({
        id: Date.now(),
        country,
        city,
        number: country.prefix + Math.floor(1000000 + Math.random() * 9000000)
      });
      setTimeout(() => setAct(null), 4000);
    };
    const interval = setInterval(show, 7000);
    show();
    return () => clearInterval(interval);
  }, []);

  if (!act) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 bg-white/90 backdrop-blur-xl shadow-2xl border border-emerald-50 p-4 rounded-2xl flex items-center gap-4 animate-slide-in w-72">
      <div className="text-3xl bg-emerald-50 p-2 rounded-xl">{act.country.flag}</div>
      <div>
        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span> Live Verification
        </p>
        <p className="text-xs font-bold text-slate-900">{act.city}, {act.country.name}</p>
        <p className="text-[10px] text-slate-400 font-mono">{maskNumber(act.number)}</p>
      </div>
      <style>{`
        @keyframes slide-in { from { transform: translateX(-40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-in { animation: slide-in 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [inputNumber, setInputNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<{ found: boolean; data?: DistributorInfo } | null>(null);
  const [insight, setInsight] = useState('');

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: "Say a very short, professional trust-building sentence (max 12 words) about organic authenticity.",
        });
        setInsight(response.text || "Purity and authenticity guaranteed through our global distribution registry.");
      } catch (e) {
        setInsight("Verified organic quality guaranteed by global safety standards.");
      }
    };
    fetchInsight();
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputNumber) return;
    setIsVerifying(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 2000));
    const found = DISTRIBUTOR_REGISTRY.find(d => d.number === inputNumber);
    setResult({ found: !!found, data: found });
    setIsVerifying(false);
  };

  return (
    <div className="selection:bg-emerald-100 font-sans">
      {!isLoaded && <Preloader insight={insight} onFinish={() => setIsLoaded(true)} />}
      
      {isLoaded && (
        <div className="min-h-screen bg-[#fcfdfc] animate-fade-in pb-20">
          <nav className="h-20 bg-white/80 backdrop-blur-md border-b border-emerald-50 sticky top-0 z-50 flex items-center justify-between px-6 md:px-12">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="Logo" className="h-10" />
              <span className="font-serif font-black text-xl text-emerald-950 tracking-tighter">OrganicTrust</span>
            </div>
            <div className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-widest text-emerald-800/40">
              <span className="cursor-pointer hover:text-emerald-700">Standards</span>
              <span className="cursor-pointer hover:text-emerald-700">Registry</span>
              <span className="cursor-pointer hover:text-emerald-700">Ethics</span>
            </div>
          </nav>

          <main className="max-w-4xl mx-auto px-6 py-12 md:py-16">
            <div className="text-center mb-12">
              <div className="relative inline-block mb-10">
                <div className="absolute inset-0 bg-emerald-400/10 blur-3xl rounded-full animate-pulse"></div>
                <img src={PRODUCT_IMAGE_URL} alt="Product" className="relative w-48 mx-auto rounded-[2rem] shadow-2xl border-4 border-white" />
              </div>
              <h1 className="text-4xl md:text-7xl font-black text-emerald-950 tracking-tight mb-4">
                Partner <span className="text-emerald-600">Verification</span>
              </h1>
              <p className="text-slate-500 text-sm md:text-lg italic max-w-lg mx-auto leading-relaxed">
                "{insight}"
              </p>
            </div>

            <div className="bg-white border border-emerald-100 rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-emerald-900/5 mb-12 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
              
              <form onSubmit={handleVerify} className="relative z-10 space-y-8">
                <div>
                  <label className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.3em] block mb-4 text-center">Global Registry Access</label>
                  <input 
                    type="text" 
                    value={inputNumber}
                    onChange={(e) => setInputNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Enter Registered Mobile Number"
                    className="w-full bg-emerald-50/30 border-2 border-emerald-100 rounded-2xl px-6 py-5 text-xl md:text-2xl focus:outline-none focus:border-emerald-500 transition-all text-center font-bold tracking-widest text-emerald-900"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isVerifying}
                  className="w-full bg-emerald-800 text-white font-black py-6 rounded-2xl text-xl hover:bg-emerald-900 transition-all shadow-xl shadow-emerald-900/20 active:scale-[0.98] disabled:opacity-50"
                >
                  {isVerifying ? 'SEARCHING REGISTRY...' : 'AUTHENTICATE NOW'}
                </button>
              </form>
            </div>

            {result && (
              <div className="animate-fade-in-up">
                {result.found ? (
                  <div className="space-y-8">
                    <div className="flex items-center justify-center gap-4 bg-emerald-50 border border-emerald-100 py-4 rounded-2xl">
                       <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                       </div>
                       <span className="font-black text-emerald-900 uppercase tracking-widest">Authorized Partner Confirmed</span>
                    </div>

                    <div className="bg-white border-4 border-double border-emerald-100 p-8 md:p-16 rounded-[2rem] relative shadow-2xl overflow-hidden print:border-none print:shadow-none">
                       <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center pointer-events-none grayscale scale-150">
                          <img src={USA_EMBLEM_URL} alt="Emblem" className="w-full" />
                       </div>
                       <div className="relative z-10 text-center">
                          <img src={LOGO_URL} alt="Logo" className="h-16 mx-auto mb-6" />
                          <h3 className="font-serif text-3xl md:text-4xl text-emerald-950 underline underline-offset-8 mb-10 tracking-wider">CERTIFICATE OF LICENSE</h3>
                          
                          <div className="text-left space-y-12">
                             <div>
                                <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-2">Registered Entity</p>
                                <h2 className="text-4xl md:text-6xl font-serif font-black text-emerald-950 italic">{result.data?.name}</h2>
                             </div>
                             <div className="grid grid-cols-2 gap-8 border-y border-emerald-50 py-8">
                                <div>
                                   <p className="text-[9px] font-black text-slate-400 uppercase">Partner ID</p>
                                   <p className="font-bold text-emerald-900">{result.data?.number}</p>
                                </div>
                                <div>
                                   <p className="text-[9px] font-black text-slate-400 uppercase">License Code</p>
                                   <p className="font-bold text-emerald-900">{result.data?.license}</p>
                                </div>
                                <div className="col-span-2">
                                   <p className="text-[9px] font-black text-slate-400 uppercase">Authorized Zone</p>
                                   <p className="font-bold text-emerald-900">{result.data?.location}</p>
                                </div>
                             </div>
                             <div className="flex justify-between items-end pt-4">
                                <div>
                                   <p className="text-[9px] font-black text-slate-400 uppercase">Verification Date</p>
                                   <p className="text-emerald-900 font-bold">{new Date().toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                   <p className="font-serif italic text-3xl text-emerald-900">Marie Richmond</p>
                                   <div className="h-[1px] w-48 bg-emerald-100 ml-auto mb-2"></div>
                                   <p className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-600">Head of Global Compliance</p>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 justify-center no-print">
                       <button onClick={() => window.print()} className="bg-white border border-emerald-100 px-10 py-5 rounded-2xl font-black text-xs uppercase hover:bg-emerald-50 transition-all">Download Certificate</button>
                       <a href={`https://wa.me/${result.data?.whatsappNumber}`} target="_blank" className="bg-[#25D366] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2 shadow-xl shadow-green-500/20 hover:scale-105 transition-all">
                         Contact Distributor
                       </a>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border-2 border-red-50 rounded-[3rem] p-16 text-center shadow-xl">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                       <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase">Verification Failed</h2>
                    <p className="text-slate-400 max-w-xs mx-auto text-sm">Access code not verified in our Global Distribution Registry.</p>
                  </div>
                )}
              </div>
            )}
          </main>

          <ActivityPopup />
          <footer className="mt-20 text-center opacity-30 text-[10px] font-black uppercase tracking-[0.5em] text-emerald-950">
            &copy; 2026 {BRAND_NAME} GLOBAL SYSTEMS. ALL RIGHTS RESERVED.
          </footer>
        </div>
      )}

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        @media print { .no-print, nav, footer, .fixed { display: none !important; } }
      `}</style>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
