import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Phone, MapPin, Sparkles, X, Check, ArrowRight, ShieldCheck, Gift } from 'lucide-react';

export const CustomerAuthModal = () => {
  const {
    isAuthProfileModalOpen,
    setIsAuthProfileModalOpen,
    loginCustomer,
    userProfile,
    selectedPincode
  } = useApp();

  const [mode, setMode] = useState('register'); // 'register' or 'login'
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState(selectedPincode || '700135');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthProfileModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');

    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    loginCustomer({
      name: name.trim() || 'Desi Foodie',
      phone: cleanPhone,
      email: email.trim(),
      address: address.trim(),
      pincode: pincode || selectedPincode || '700135'
    });

    setIsAuthProfileModalOpen(false);
    setErrorMsg('');
  };

  return (
    <div className="cart-drawer-overlay" onClick={() => setIsAuthProfileModalOpen(false)}>
      <div
        className="modal-container"
        style={{ maxWidth: 460, margin: 'auto', padding: 0, overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ background: 'linear-gradient(135deg, #164324 0%, #0d2816 100%)', color: 'white', padding: '24px 20px 20px', position: 'relative' }}>
          <button
            onClick={() => setIsAuthProfileModalOpen(false)}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(229, 160, 36, 0.2)', border: '1px solid #e5a024', color: '#fde68a', padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 800, marginBottom: 10 }}>
            <Gift size={13} color="#e5a024" />
            <span>DESI 5-FOR-1 REWARDS CLUB</span>
          </div>

          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'white', margin: 0, fontFamily: 'var(--font-brand)' }}>
            {mode === 'register' ? 'Create Customer Profile' : 'Login to Your Profile'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: '6px 0 0', lineHeight: 1.4 }}>
            {mode === 'register'
              ? 'Create your profile to start collecting stamps on every ₹200+ order!'
              : 'Enter your phone number to access your stamp pass & order history.'}
          </p>
        </div>

        {/* Tab switcher: Register vs Login */}
        <div style={{ display: 'flex', background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: mode === 'register' ? 'white' : 'transparent',
              fontWeight: 800,
              fontSize: '0.88rem',
              color: mode === 'register' ? '#164324' : '#64748b',
              cursor: 'pointer',
              borderBottom: mode === 'register' ? '3px solid #164324' : 'none'
            }}
          >
            Create New Profile
          </button>
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: mode === 'login' ? 'white' : 'transparent',
              fontWeight: 800,
              fontSize: '0.88rem',
              color: mode === 'login' ? '#164324' : '#64748b',
              cursor: 'pointer',
              borderBottom: mode === 'login' ? '3px solid #164324' : 'none'
            }}
          >
            Existing Customer Login
          </button>
        </div>

        {/* Modal Form */}
        <div style={{ padding: '24px 20px', background: 'white' }}>
          {errorMsg && (
            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 700, marginBottom: 14 }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {mode === 'register' && (
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4 }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sourav Sarkar"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  required
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4 }}>
                10-Digit Mobile Phone Number *
              </label>
              <input
                type="tel"
                placeholder="e.g. 6291288522"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 700 }}
                required
              />
            </div>

            {mode === 'register' && (
              <>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4 }}>
                    Delivery Address in Rajarhat (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Flat 3B, Rajarhat Main Road"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4 }}>
                    PIN Code
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              style={{
                background: '#164324',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: 8,
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginTop: 6,
                boxShadow: '0 4px 12px rgba(22, 67, 36, 0.25)'
              }}
            >
              <span>{mode === 'register' ? 'Create Profile & Join Campaign' : 'Login & View My Stamps'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ marginTop: 16, textAlign: 'center', fontSize: '0.78rem', color: '#64748b' }}>
            🔒 Safe & Secure • Your stamps and orders are saved directly to your phone number.
          </div>
        </div>
      </div>
    </div>
  );
};
