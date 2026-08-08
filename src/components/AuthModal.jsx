import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, KeyRound, X, ShieldCheck } from 'lucide-react';

export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, verifyPasscode } = useApp();
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = verifyPasscode(passcode);
    if (!success) {
      setErrorMsg('Incorrect passcode. Please try again!');
    } else {
      setPasscode('');
      setErrorMsg('');
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal-card" style={{ maxWidth: 400, padding: 0 }}>
        <div style={{ background: '#164324', color: 'white', padding: '24px 20px', textAlign: 'center', position: 'relative' }}>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
          <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <Lock size={26} color="#e5a024" />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-brand)' }}>
            Staff Passcode Required
          </h3>
          <p style={{ fontSize: '0.85rem', opacity: 0.85, marginTop: 4 }}>
            Enter your restaurant staff PIN to access Kitchen Admin & Partner App.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          {errorMsg && (
            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, marginBottom: 16 }}>
              {errorMsg}
            </div>
          )}

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>
              Enter Passcode (Default: 1234)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="••••"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                autoFocus
                maxLength={8}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: 10,
                  border: '1px solid #d1d5db',
                  fontSize: '1.1rem',
                  letterSpacing: 4,
                  fontWeight: 700,
                  outline: 'none'
                }}
              />
              <KeyRound size={20} color="#9ca3af" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              background: '#164324',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: 10,
              fontWeight: 800,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontFamily: 'var(--font-brand)',
              boxShadow: '0 4px 12px rgba(22, 67, 36, 0.25)'
            }}
          >
            <ShieldCheck size={20} /> Unlock Access
          </button>
        </form>
      </div>
    </div>
  );
};
