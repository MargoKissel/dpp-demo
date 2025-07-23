'use client';
import { useEffect, useState } from 'react';

export default function Toast({ msg }: { msg: string }) {
  const [show, setShow] = useState(true);
  useEffect(() => { const t = setTimeout(()=>setShow(false), 3000); return () => clearTimeout(t); },[]);
  if (!show) return null;
  return (
    <div className="fixed bottom-6 inset-x-0 flex justify-center pointer-events-none">
      <div className="bg-green-600 text-white px-4 py-2 rounded-xl shadow-lg">
        {msg}
      </div>
    </div>
  );
}
