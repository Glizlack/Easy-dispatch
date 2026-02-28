'use client';
import { useState } from 'react';

export default function DispatchPage() {
  const [miles, setMiles] = useState('650');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleDispatch = async () => {
    setLoading(true);
    const res = await fetch('/api/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ distance: miles }),
    });
    const result = await res.json();
    setData(result);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8 font-mono">
      <div className="max-w-xl mx-auto border-2 border-slate-800 bg-slate-900 p-8">
        <h1 className="text-amber-500 font-black text-3xl mb-8 tracking-tighter italic uppercase">Easy Dispatch v1</h1>
        
        <div className="space-y-6">
          <input 
            type="number" 
            value={miles} 
            onChange={(e) => setMiles(e.target.value)}
            className="w-full bg-black border border-slate-700 p-4 text-2xl outline-none focus:border-amber-500"
            placeholder="ENTER MILES"
          />

          <button 
            onClick={handleDispatch}
            disabled={loading}
            className="w-full bg-amber-500 text-black font-black p-4 text-lg hover:bg-amber-400 disabled:opacity-50"
          >
            {loading ? 'SYNCING AI...' : 'GENERATE DISPATCH'}
          </button>
        </div>

        {data && (
          <div className="mt-10 border-t border-slate-800 pt-6">
            <div className="flex justify-between mb-4">
              <span className="text-slate-500 text-xs uppercase">ETA</span>
              <span className="text-amber-500 font-bold">{data.eta}</span>
            </div>
            <div className="bg-black p-4 border-l-2 border-amber-500 text-sm whitespace-pre-wrap">
              {data.manifest}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
