import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Store, Bike, ShieldCheck, UtensilsCrossed } from 'lucide-react';

export const Header = () => {
  const {
    orderMode,
    setOrderMode,
    selectedPincode,
    checkServiceability,
    setIsLocationModalOpen,
    cartItemCount,
    setIsCartOpen,
    activeTab,
    setActiveTab,
    orders
  } = useApp();

  const currentArea = checkServiceability(selectedPincode);
  const pendingOrdersCount = orders.filter(o => o.status === 'RECEIVED' || o.status === 'PREPARING').length;

  return (
    <header className="main-header">
      <div className="header-inner">
        {/* Brand Logo */}
        <button className="brand-logo-btn" onClick={() => setActiveTab('customer')}>
          <img src="/logo.png" alt="Desi Eats Logo" className="brand-logo-img" />
        </button>

        {/* Center Mode Switcher (Delivery vs Takeaway) */}
        {activeTab === 'customer' && (
          <div className="mode-switcher">
            <button
              className={`mode-btn ${orderMode === 'delivery' ? 'active delivery' : ''}`}
              onClick={() => setOrderMode('delivery')}
            >
              <Bike size={15} />
              <span>Delivery</span>
            </button>

            <button
              className={`mode-btn ${orderMode === 'takeaway' ? 'active takeaway' : ''}`}
              onClick={() => setOrderMode('takeaway')}
            >
              <Store size={15} />
              <span>Takeaway</span>
            </button>
          </div>
        )}

        {/* Right Section */}
        <div className="header-right">
          {/* Location Badge (If Delivery Mode) */}
          {activeTab === 'customer' && orderMode === 'delivery' && (
            <button className="location-badge-btn" onClick={() => setIsLocationModalOpen(true)}>
              <MapPin size={15} color="#d85d27" />
              <span>{currentArea ? currentArea.area.split('/')[0] : 'Location'} ({selectedPincode})</span>
            </button>
          )}

          {/* Admin Switcher */}
          <button
            className="view-toggle-btn"
            onClick={() => setActiveTab(activeTab === 'customer' ? 'admin' : 'customer')}
          >
            <ShieldCheck size={16} />
            <span className="desktop-only">{activeTab === 'customer' ? 'Kitchen Admin' : 'Customer View'}</span>
            <span className="mobile-only">{activeTab === 'customer' ? 'Admin' : 'Menu'}</span>
            {activeTab === 'customer' && pendingOrdersCount > 0 && (
              <span className="cart-badge" style={{ background: '#d85d27', color: 'white' }}>
                {pendingOrdersCount}
              </span>
            )}
          </button>

          {/* "My Plate" Button */}
          {activeTab === 'customer' && (
            <button className="cart-icon-btn" onClick={() => setIsCartOpen(true)}>
              <UtensilsCrossed size={16} />
              <span>My Plate</span>
              {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
