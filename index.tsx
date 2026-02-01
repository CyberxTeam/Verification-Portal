
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
  { name: 'Bangladesh', flag: '🇧🇩', prefix: '+880', cities: ['Dhaka', 'Rajshahi', 'Sylhet'] },
  { name: 'UK', flag: '🇬🇧', prefix: '+44', cities: ['London', 'Manchester'] },
  { name: 'USA', flag: '🇺🇸', prefix: '+1', cities: ['New York', 'LA'] },
  { name: 'Saudi Arabia', flag: '🇸🇦', prefix: '+966', cities: ['Riyadh', 'Jeddah'] }
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
const maskNumber = (num: string) => num.substring(0, 3) + "****" + num.substring(num.length - 2);

// --- Components ---

const Preloader: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center animate-pulse">
      <img src={LOGO_URL} alt="Logo" className="w-48 md:w-64 mb-6" />
      <h2 className="text-2xl font-black tracking-widest text-emerald-900 font-serif">ORGANIC TRUST</h2>
      <div className="mt-4 flex gap-2">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
      </div>
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
      setTimeout(() => setAct(null), 3000);
    };
    const interval = setInterval(show, 6000);
    show();
    return () => clearInterval(interval);
  }, []);

  if (!act) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 bg-white shadow-2xl border border-emerald-50 p-4 rounded-2xl flex items-center gap-4 animate-slide-in w-72">
      <div className="text-3xl">{act.country.flag}</div>
      <div>
        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Live Verification</p>
        <p className="text-xs font-bold text-slate-900">{act.city}, {act.country.name}</p>
        <p className="text-[10px] text-slate-400 font-mono">{maskNumber(act.number)}</p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [inputNumber, setInputNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<{ found: boolean; data?: DistributorInfo } | null>(null);
  const [insight, setInsight] = useState('Ensuring organic purity through global blockchain verification.');

  useEffect(() => {
    const fetchInsight = async () => {
      const apiKey = process.env.API_KEY;
      if (!apiKey) return;
      const ai = new GoogleGenAI({ apiKey });
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: "Say a short, inspiring trust-building sentence about organic product verification.",
        });
        if (response.text) setInsight(response.text);
      } catch (e) { console.error(e); }
    };
    fetchInsight();
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputNumber) return;
    setIsVerifying(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 1500));
    const found = DISTRIBUTOR_REGISTRY.find(d => d.number === inputNumber);
    setResult({ found: !!found, data: found });
    setIsVerifying(false);
  };

  return (
    <div className="selection:bg-emerald-100">
      {!isLoaded && <Preloader onFinish={() => setIsLoaded(true)} />}
      
      {isLoaded && (
        <div className="min-h-screen bg-[#fcfdfc] animate-fade-in pb-20">
          <nav className="h-20 bg-white/80 backdrop-blur-md border-b border-emerald-50 sticky top-0 z-50 flex items-center justify-between px-6 md:px-12">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="Logo" className="h-10" />
              <span className="font-serif font-black text-xl text-emerald-950">OrganicTrust</span>
            </div>
          </nav>

          <main className="max-w-4xl mx-auto px-6 py-12">
            <div className="text-center mb-16">
              <div className="relative inline-block mb-10">
                <div className="absolute inset-0 bg-emerald-400/10 blur-3xl rounded-full"></div>
                <img src={PRODUCT_IMAGE_URL} alt="Product" className="relative w-48 mx-auto rounded-3xl shadow-2xl border-4 border-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-emerald-950 mb-4">Verification <span className="text-emerald-600">Portal</span></h1>
              <p className="text-slate-500 italic max-w-lg mx-auto leading-relaxed">"{insight}"</p>
            </div>

            <div className="bg-white border border-emerald-50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl mb-12 relative overflow-hidden">
              <form onSubmit={handleVerify} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-emerald-700 uppercase tracking-widest block mb-4 text-center">Global Registry Access</label>
                  <input 
                    type="text" 
                    value={inputNumber}
                    onChange={(e) => setInputNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Enter Registered Mobile Number"
                    className="w-full bg-emerald-50/30 border-2 border-emerald-100 rounded-2xl px-6 py-5 text-xl focus:outline-none focus:border-emerald-500 transition-all text-center font-bold text-emerald-900"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isVerifying}
                  className="w-full bg-emerald-800 text-white font-black py-5 rounded-2xl text-lg hover:bg-emerald-900 transition-all shadow-xl disabled:opacity-50"
                >
                  {isVerifying ? 'SEARCHING...' : 'VERIFY AUTHENTICITY'}
                </button>
              </form>
            </div>

            {result && (
              <div className="animate-fade-in-up">
                {result.found ? (
                  <div className="space-y-8">
                    <div className="bg-white border-4 border-double border-emerald-100 p-8 md:p-16 rounded-[2rem] relative shadow-2xl overflow-hidden">
                       <div className="absolute inset-0 opacity-[0.03] grayscale pointer-events-none">
                          <img src={USA_EMBLEM_URL} alt="Emblem" className="w-full h-full object-contain" />
                       </div>
                       <div className="relative z-10 text-center">
                          <img src={LOGO_URL} alt="Logo" className="h-20 mx-auto mb-6" />
                          <h3 className="font-serif text-3xl text-emerald-950 underline underline-offset-8 mb-10">AUTHORIZED LICENSE</h3>
                          
                          <div className="text-left space-y-8">
                             <div>
                                <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Registered Partner</p>
                                <h2 className="text-4xl md:text-5xl font-serif italic text-emerald-950 font-black">{result.data?.name}</h2>
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
                                   <p className="text-[9px] font-black text-slate-400 uppercase">Distribution Zone</p>
                                   <p className="font-bold text-emerald-900">{result.data?.location}</p>
                                </div>
                             </div>
                             <div className="flex justify-between items-end pt-4">
                                <p className="text-xs font-bold text-slate-400 italic">Issued: {new Date().toLocaleDateString()}</p>
                                <div className="text-right">
                                   <p className="font-serif italic text-2xl text-emerald-900">Marie Richmond</p>
                                   <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Global Compliance Officer</p>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                    <div className="flex justify-center gap-4 no-print">
                       <button onClick={() => window.print()} className="bg-white border border-emerald-100 px-8 py-4 rounded-xl font-bold text-xs uppercase hover:bg-emerald-50">Save License</button>
                       <a href={`https://wa.me/${result.data?.whatsappNumber}`} className="bg-[#25D366] text-white px-8 py-4 rounded-xl font-bold text-xs uppercase shadow-lg">WhatsApp Contact</a>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border-2 border-red-50 rounded-[2rem] p-12 text-center shadow-xl">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                       <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </div>
                    <h2 className="text-xl font-black text-slate-900 mb-2 uppercase">Verification Failed</h2>
                    <p className="text-slate-400 text-sm">Access code not found in global registry.</p>
                  </div>
                )}
              </div>
            )}
          </main>

          <ActivityPopup />
          <footer className="mt-12 text-center opacity-20 text-[10px] font-black uppercase tracking-[0.5em]">&copy; 2026 {BRAND_NAME} GLOBAL SYSTEMS</footer>
        </div>
      )}

      <style>{`
        @keyframes slide-in { from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-in { animation: slide-in 0.5s ease-out; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        @media print { .no-print, nav, footer { display: none !important; } }
      `}</style>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
