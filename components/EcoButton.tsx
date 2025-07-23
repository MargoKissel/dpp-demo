'use client';
import { useState } from 'react';
import Toast from '@/components/Toast';

export function EcoButton({ sku }: { sku: string }) {
  const [done, setDone] = useState<boolean>(() => typeof window !== 'undefined' && localStorage.getItem('eco_'+sku)==='1');
  const [toast, setToast] = useState('');
  if (done) return null;

  async function claim() {
    const user = crypto.randomUUID();
    await fetch('/api/points/claim', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ user_id:user, sku, action:'first_scan', pts:10 })
    });
    localStorage.setItem('eco_'+sku,'1');
    setToast('+10 Eco-Punkte 🎉');
    setDone(true);
  }

  return (
    <>
      {toast && <Toast msg={toast}/>}

      <button
        className="mt-6 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
        onClick={claim}>
        +10 Eco-Punkte
      </button>
    </>
  );
}
