import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Home, Store, MapPin, CheckCircle, AlertCircle, ArrowRight, Bike } from 'lucide-react';

export const HeroOrderSelector = () => {
  const {
    orderMode,
    setOrderMode,
    selectedPincode,
    setSelectedPincode,
    checkServiceability,
    pincodes,
    setIsLocationModalOpen
  } = useApp();

  const [inputPin, setInputPin] = useState(selectedPincode);
  const [pinResult, setPinResult] = useState(null);

  const handleCheckPin = (e) => {
    if (e) e.preventDefault();
    const info = checkServiceability(inputPin);
    if (info) {
      setSelectedPincode(inputPin);
      setPinResult({ valid: true, info });
    } else {
      setPinResult({ valid: false, pin: inputPin });
    }
  };

  const handleSelectDelivery = () => {
    setOrderMode('delivery');
    handleCheckPin();
  };

  const handleSelectTakeaway = () => {
    setOrderMode('takeaway');
    setPinResult(null);
  };

  return (
    <section className="hero-order-section">
      <div className="hero-order-inner">
        {/* Left Column: Typography */}
        <div className="hero-order-left">
          <span className="hero-subhead">START YOUR ORDER</span>
          <h1 className="hero-title">
            How would you like<br />
            to enjoy Desi<br />
            Eats?
          </h1>
        </div>

        {/* Right Column: Cards & Location Note */}
        <div className="hero-order-right">
          {/* Side by Side Selection Cards */}
          <div className="hero-cards-grid">
            {/* Delivery Card */}
            <div
              className={`hero-select-card ${orderMode === 'delivery' ? 'active-delivery' : ''}`}
              onClick={handleSelectDelivery}
            >
              <div className="hero-card-icon">
                <Home size={26} color={orderMode === 'delivery' ? '#164324' : '#6b7280'} />
              </div>
              <h3 className="hero-card-title">Delivery</h3>
              <p className="hero-card-sub">To your doorstep</p>
            </div>

            {/* Takeaway Card */}
            <div
              className={`hero-select-card ${orderMode === 'takeaway' ? 'active-takeaway' : ''}`}
              onClick={handleSelectTakeaway}
            >
              <div className="hero-card-icon">
                <Store size={26} color={orderMode === 'takeaway' ? '#e5a024' : '#6b7280'} />
              </div>
              <h3 className="hero-card-title">Takeaway</h3>
              <p className="hero-card-sub">Pick up from our kitchen</p>
            </div>
          </div>

          {/* Inline PIN Code Checker Box (If Delivery Mode) */}
          {orderMode === 'delivery' && (
            <div className="hero-pin-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <MapPin size={16} color="#d85d27" />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#164324' }}>
                  Check Delivery PIN Code in Rajarhat:
                </span>
              </div>

              <form onSubmit={handleCheckPin} style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  maxLength={6}
                  value={inputPin}
                  onChange={e => {
                    setInputPin(e.target.value.replace(/\D/g, ''));
                    setPinResult(null);
                  }}
                  placeholder="e.g. 700135"
                  style={{
                    flex: 1,
                    padding: '9px 14px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: '#164324',
                    color: 'white',
                    border: 'none',
                    padding: '0 18px',
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Check PIN
                </button>
              </form>

              {/* Pin Feedback Banner */}
              {pinResult && pinResult.valid && (
                <div style={{ marginTop: 8, fontSize: '0.82rem', color: '#15803d', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle size={14} color="#16a34a" />
                  <span>Delivery available in {pinResult.info.area.split('/')[0]}! (Avg {pinResult.info.avgDeliveryTime})</span>
                </div>
              )}

              {pinResult && !pinResult.valid && (
                <div style={{ marginTop: 8, fontSize: '0.82rem', color: '#b91c1c', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AlertCircle size={14} color="#dc2626" />
                  <span>PIN {pinResult.pin} not serviceable yet. Switch to Takeaway or pick a Rajarhat PIN.</span>
                </div>
              )}
            </div>
          )}

          {/* Bottom Location & Payment Note (Matching Screenshot) */}
          <div className="hero-location-note">
            <h4>Collect from Desi Eats, Rajarhat</h4>
            <p>Order ahead and pay by cash or QR/UPI when you collect.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
