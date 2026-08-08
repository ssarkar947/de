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
    setActiveTab
  } = useApp();

  return (
    <header className="main-header">
      <div className="header-inner">
        {/* Brand Logo */}
        <button className="brand-logo-btn" onClick={() => setActiveTab('customer')}>
          <img src="/logo.png" alt="Desi Eats Logo" className="brand-logo-img" />
        </button>

        {/* Order Mode Switcher: Delivery vs Takeaway */}
        <div className="mode-switcher">
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

        {/* Selected Location / PIN Badge */}
        {orderMode === 'delivery' ? (
          <button className="location-badge-btn" onClick={() => setIsLocationModalOpen(true)}>
            <MapPin size={16} color="#d85d27" />
            <span>PIN: {selectedPincode} (Rajarhat)</span>
          </button>
        ) : (
          <button className="location-badge-btn" style={{ background: '#fef3c7', borderColor: '#f59e0b', color: '#b45309' }}>
            <Store size={16} color="#b45309" />
            <span>Spot Takeaway (No Delivery Fee)</span>
          </button>
        )}

        {/* Header Right Actions */}
        <div className="header-right">
          {/* Dedicated Kitchen App Launcher */}
          <button
            className="view-toggle-btn"
            style={{ background: activeTab === 'kitchen' ? '#1e293b' : 'rgba(230, 160, 36, 0.1)', color: activeTab === 'kitchen' ? '#fff' : '#164324', border: '1px solid #e5a024' }}
            onClick={() => setActiveTab(activeTab === 'kitchen' ? 'customer' : 'kitchen')}
          >
            <Smartphone size={16} />
            <span>{activeTab === 'kitchen' ? 'Storefront' : '📱 Kitchen App'}</span>
          </button>

          {/* Kitchen Admin Portal Switcher */}
          <button
            className="view-toggle-btn"
            onClick={() => setActiveTab(activeTab === 'admin' ? 'customer' : 'admin')}
          >
            <ChefHat size={16} />
            <span>{activeTab === 'admin' ? 'Customer View' : 'Kitchen Admin'}</span>
          </button>

          {/* My Plate Cart Drawer Badge Button */}
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
