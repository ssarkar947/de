import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, MapPin, ChefHat, Store, Smartphone, Gift, User, Sparkles } from 'lucide-react';

export const Header = () => {
  const {
    orderMode,
    setOrderMode,
    selectedPincode,
    setIsLocationModalOpen,
    cartItemCount,
    setIsCartOpen,
    activeTab,
    setActiveTab,
    requestProtectedView,
    userProfile,
    loyaltyStampsCount,
    unlockedFreeDishes
  } = useApp();

  return (
    <header className="main-header">
      <div className="header-inner">
        {/* Brand Logo (Left) */}
        <button className="brand-logo-btn" onClick={() => setActiveTab('customer')}>
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
          {/* Mobile Only: Quick Location Pill */}
          <div className="mobile-only">
            {orderMode === 'delivery' ? (
              <button className="location-badge-btn-mini" onClick={() => setIsLocationModalOpen(true)}>
                <MapPin size={13} color="#d85d27" />
                <span>{selectedPincode}</span>
              </button>
            ) : (
              <button className="location-badge-btn-mini" onClick={() => setOrderMode('delivery')}>
                <Store size={13} color="#b45309" />
                <span>Takeaway</span>
              </button>
            )}
          </div>

          {/* Desktop Only: 5-for-1 Loyalty Campaign Promotional Button */}
          <button
            className={`header-campaign-btn desktop-only ${activeTab === 'campaign' ? 'active' : ''}`}
            onClick={() => setActiveTab('campaign')}
            title="5 Orders = 1 Free Dish below ₹200 Campaign"
          >
            <Gift size={16} color="#d97706" />
            <span>5-for-1 Free Dish</span>
            {unlockedFreeDishes > 0 && (
              <span className="header-pulse-tag">1 FREE</span>
            )}
          </button>

          {/* Desktop Only: Customer User Profile Button */}
          <button
            className={`header-profile-btn desktop-only ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
            title="My Profile & Loyalty Stamps"
          >
            <User size={16} />
            <span>
              {userProfile ? userProfile.name.split(' ')[0] : 'Profile'}
            </span>
            <span className="profile-stamp-mini-badge" title={`${loyaltyStampsCount}/5 stamps collected`}>
              {unlockedFreeDishes > 0 ? '🎁' : `${loyaltyStampsCount}/5`}
            </span>
          </button>

          {/* Desktop Only: Protected Kitchen App Launcher */}
          <button
            className="view-toggle-btn desktop-only"
            style={{ background: activeTab === 'kitchen' ? '#1e293b' : 'rgba(230, 160, 36, 0.1)', color: activeTab === 'kitchen' ? '#fff' : '#164324', border: '1px solid #e5a024' }}
            onClick={() => requestProtectedView(activeTab === 'kitchen' ? 'customer' : 'kitchen')}
          >
            <Smartphone size={16} />
            <span>{activeTab === 'kitchen' ? 'Storefront' : '📱 Kitchen'}</span>
          </button>

          {/* Desktop Only: Protected Kitchen Admin Portal Switcher */}
          <button
            className="view-toggle-btn desktop-only"
            onClick={() => requestProtectedView(activeTab === 'admin' ? 'customer' : 'admin')}
          >
            <ChefHat size={16} />
            <span>{activeTab === 'admin' ? 'Customer' : 'Admin'}</span>
          </button>

          {/* My Plate Cart Drawer Button (Visible on both Mobile & Desktop - Right side) */}
          <button className="cart-icon-btn" onClick={() => setIsCartOpen(true)}>
            <ShoppingBag size={18} />
            <span className="desktop-only">My Plate</span>
            {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
};
