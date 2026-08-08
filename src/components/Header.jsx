import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, MapPin, ChefHat, Store, Smartphone } from 'lucide-react';

export const Header = () => {
  const {
    orderMode,
    setOrderMode,
    selectedPincode,
    setIsLocationModalOpen,
    cartItemCount,
    setIsCartOpen,
    activeTab,
    requestProtectedView
  } = useApp();

  return (
    <header className="main-header">
      <div className="header-inner">
        {/* Brand Logo (Left) */}
        <button className="brand-logo-btn" onClick={() => requestProtectedView('customer')}>
          <img src="/logo.png" alt="Desi Eats Logo" className="brand-logo-img" />
        </button>

        {/* Desktop Only: Order Mode Switcher */}
        <div className="mode-switcher desktop-only">
          <button
            className={`mode-btn ${orderMode === 'delivery' ? 'active delivery' : ''}`}
            onClick={() => setOrderMode('delivery')}
          >
            🛵 Delivery
          </button>
          <button
            className={`mode-btn ${orderMode === 'takeaway' ? 'active takeaway' : ''}`}
            onClick={() => setOrderMode('takeaway')}
          >
            🥡 Takeaway Spot
          </button>
        </div>

        {/* Desktop Only: Selected Location / PIN Badge */}
        <div className="desktop-only">
          {orderMode === 'delivery' ? (
            <button className="location-badge-btn" onClick={() => setIsLocationModalOpen(true)}>
              <MapPin size={16} color="#d85d27" />
              <span>PIN: {selectedPincode} (Rajarhat)</span>
            </button>
          ) : (
            <button className="location-badge-btn" style={{ background: '#fef3c7', borderColor: '#f59e0b', color: '#b45309' }}>
              <Store size={16} color="#b45309" />
              <span>Spot Takeaway</span>
            </button>
          )}
        </div>

        {/* Header Right Actions */}
        <div className="header-right">
          {/* Desktop Only: Protected Kitchen App Launcher */}
          <button
            className="view-toggle-btn desktop-only"
            style={{ background: activeTab === 'kitchen' ? '#1e293b' : 'rgba(230, 160, 36, 0.1)', color: activeTab === 'kitchen' ? '#fff' : '#164324', border: '1px solid #e5a024' }}
            onClick={() => requestProtectedView(activeTab === 'kitchen' ? 'customer' : 'kitchen')}
          >
            <Smartphone size={16} />
            <span>{activeTab === 'kitchen' ? 'Storefront' : '📱 Kitchen App'}</span>
          </button>

          {/* Desktop Only: Protected Kitchen Admin Portal Switcher */}
          <button
            className="view-toggle-btn desktop-only"
            onClick={() => requestProtectedView(activeTab === 'admin' ? 'customer' : 'admin')}
          >
            <ChefHat size={16} />
            <span>{activeTab === 'admin' ? 'Customer View' : 'Kitchen Admin'}</span>
          </button>

          {/* My Plate Cart Drawer Button (Visible on both Mobile & Desktop - Right side) */}
          <button className="cart-icon-btn" onClick={() => setIsCartOpen(true)}>
            <ShoppingBag size={20} />
            <span>My Plate</span>
            {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
};
