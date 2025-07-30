// Updated EcoButton component with improved styling.  This version
// preserves the existing functionality—rewarding the user with 10
// points on their first scan—while adding layout and typography
// adjustments to match the Figma design.  The button expands to the
// full width of its container, uses a larger font size and padding,
// and features a slightly rounded rectangle shape.

'use client';
import { useState } from 'react';
import Toast from '@/components/Toast';

export function EcoButton({ sku }: { sku: string }) {
  // When the button has been clicked previously, localStorage stores
  // '1' under the key 'eco_${sku}'.  This prevents the button from
  // appearing again on subsequent page loads.
  const [done, setDone] = useState<boolean>(() =>
    typeof window !== 'undefined' && localStorage.getItem('eco_' + sku) === '1'
  );
  const [toast, setToast] = useState('');
  if (done) return null;

  async function claim() {
    const user = crypto.randomUUID();
    await fetch('/api/points/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user, sku, action: 'first_scan', pts: 10 }),
    });
    localStorage.setItem('eco_' + sku, '1');
    setToast('+ 10 Eco-Punkte');
    setDone(true);
  }

  return (
    <>
      {toast && <Toast msg={toast} />}

      <button
        className="w-full text-center bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-semibold text-lg"
        onClick={claim}
      >
        + 10 Eco‑Punkte
      </button>
    </>
  );
}
