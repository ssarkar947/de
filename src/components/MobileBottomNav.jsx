import React from 'react';
import { useApp } from '../context/AppContext';
import { UtensilsCrossed, Gift, User, ShoppingBag } from 'lucide-react';

export const MobileBottomNav = () => {
  const {
    activeTab,
    setActiveTab,
    cartItemCount,
    setIsCartOpen,
    loyaltyStampsCount = 0,
    unlockedFreeDishes = 0
  } = useApp();

  return (
    <nav className="mobile-bottom-nav">
      <button
        onClick={() => setActiveTab('customer')}
        className={`mobile-nav-item ${activeTab === 'customer' ? 'active' : ''}`}
      >
        <UtensilsCrossed size={20} />
        <span>Menu</span>
      </button>

      <button
        onClick={() => setActiveTab('campaign')}
        className={`mobile-nav-item ${activeTab === 'campaign' ? 'active' : ''}`}
      >
        <div style={{ position: 'relative' }}>
          <Gift size={20} />
          {unlockedFreeDishes > 0 && <span className="mobile-nav-dot animate-bounce" />}
        </div>
        <span>5-for-1 Pass</span>
      </button>

      <button
        onClick={() => setActiveTab('profile')}
        className={`mobile-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
      >
        <div style={{ position: 'relative' }}>
          <User size={20} />
          {loyaltyStampsCount > 0 && (
            <span className="mobile-nav-badge">{loyaltyStampsCount}/5</span>
          )}
        </div>
        <span>Profile</span>
      </button>

      <button
        onClick={() => setIsCartOpen(true)}
        className="mobile-nav-item cart-item"
      >
        <div style={{ position: 'relative' }}>
          <ShoppingBag size={20} />
          {cartItemCount > 0 && (
            <span className="mobile-nav-cart-badge">{cartItemCount}</span>
          )}
        </div>
        <span>My Plate</span>
      </button>
    </nav>
  );
};
