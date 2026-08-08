import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, CheckCircle, AlertCircle, X, Store, Search } from 'lucide-react';

export const LocationModal = () => {
  const {
    selectedPincode,
    setSelectedPincode,
    checkServiceability,
    pincodes,
    isLocationModalOpen,
    setIsLocationModalOpen,
    setOrderMode
  } = useApp();

  const [inputPin, setInputPin] = useState(selectedPincode);
  const [searchedStatus, setSearchedStatus] = useState(null);

  if (!isLocationModalOpen) return null;

  const handleCheckPin = (pinToCheck) => {
    const pin = pinToCheck || inputPin;
    const info = checkServiceability(pin);
    if (info) {
      setSelectedPincode(pin);
      setSearchedStatus({ valid: true, info });
      setTimeout(() => {
        setIsLocationModalOpen(false);
      }, 1200);
    } else {
      setSearchedStatus({ valid: false, pin });
    }
  };

  const handleSwitchToTakeaway = () => {
    setOrderMode('takeaway');
    setIsLocationModalOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsLocationModalOpen(false)}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MapPin color="#1b4332" size={22} />
            <h3>Delivery Location Check</h3>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: '#4b5563', fontSize: '0.9rem', marginBottom: 16 }}>
            Enter your 6-digit PIN code to check if Desi Eats delivers directly to your doorstep.
          </p>

          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <input
              type="text"
              maxLength={6}
              value={inputPin}
              onChange={e => {
                setInputPin(e.target.value.replace(/\D/g, ''));
                setSearchedStatus(null);
              }}
              placeholder="e.g. 700135"
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid #d1d5db',
                fontSize: '1rem',
                fontWeight: '600',
                outline: 'none'
              }}
            />
            <button
              onClick={() => handleCheckPin()}
              style={{
                background: '#1b4332',
                color: 'white',
                border: 'none',
                padding: '0 20px',
                borderRadius: '10px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Check
            </button>
          </div>

          {/* Quick Select Buttons for Rajarhat */}
          <div style={{ marginBottom: 24 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
              Active Rajarhat Zones
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {pincodes.filter(p => p.active).map(p => (
                <button
                  key={p.pincode}
                  onClick={() => {
                    setInputPin(p.pincode);
                    handleCheckPin(p.pincode);
                  }}
                  style={{
                    background: inputPin === p.pincode ? '#1b4332' : '#f3f4f6',
                    color: inputPin === p.pincode ? 'white' : '#374151',
                    border: '1px solid #e5e7eb',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {p.pincode} ({p.area.split('/')[0].trim()})
                </button>
              ))}
            </div>
          </div>

          {/* Result Banner */}
          {searchedStatus && searchedStatus.valid && (
            <div style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              padding: 14,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              color: '#065f46'
            }}>
              <CheckCircle size={24} color="#10b981" />
              <div>
                <h4 style={{ fontWeight: '700', fontSize: '0.95rem' }}>We deliver to your location!</h4>
                <p style={{ fontSize: '0.85rem' }}>{searchedStatus.info.area} • Avg delivery: {searchedStatus.info.avgDeliveryTime}</p>
              </div>
            </div>
          )}

          {searchedStatus && !searchedStatus.valid && (
            <div style={{
              background: '#fff1f2',
              border: '1px solid #fecdd3',
              padding: 16,
              borderRadius: 12,
              color: '#9f1239'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <AlertCircle size={22} color="#e11d48" />
                <h4 style={{ fontWeight: '700', fontSize: '0.95rem' }}>PIN {searchedStatus.pin} is not serviceable for Delivery</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#be123c', marginBottom: 14 }}>
                We currently deliver in Rajarhat & nearby areas. You can still order your food for Takeaway!
              </p>
              <button
                onClick={handleSwitchToTakeaway}
                style={{
                  width: '100%',
                  background: '#e5a024',
                  color: 'white',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8
                }}
              >
                <Store size={18} />
                <span>Switch to Takeaway / Pickup</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
