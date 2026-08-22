import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Gift,
  CheckCircle2,
  Clock,
  ShoppingBag,
  Sparkles,
  Award,
  ChevronRight,
  ArrowRight,
  LogOut,
  Edit3,
  Save,
  RotateCcw,
  Check,
  Flame,
  Star,
  ExternalLink,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';

export const UserProfile = () => {
  const {
    userProfile,
    loginCustomer,
    updateCustomerProfile,
    logoutCustomer,
    customerOrders = [],
    qualifyingOrders = [],
    loyaltyStampsCount = 0,
    totalEarnedFreeDishes = 0,
    claimedFreeDishes = 0,
    unlockedFreeDishes = 0,
    setActiveTab,
    selectedPincode,
    setSelectedPincode,
    setIsOrderTrackerOpen,
    setActiveOrderId,
    addToCart,
    setIsCartOpen,
    applyFreeDishReward
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    phone: userProfile?.phone || '',
    email: userProfile?.email || '',
    address: userProfile?.address || '',
    pincode: userProfile?.pincode || selectedPincode || '700135'
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        phone: userProfile.phone || '',
        email: userProfile.email || '',
        address: userProfile.address || '',
        pincode: userProfile.pincode || selectedPincode || '700135'
      });
    }
  }, [userProfile, selectedPincode]);

  const [loginPhoneInput, setLoginPhoneInput] = useState('');
  const [loginNameInput, setLoginNameInput] = useState('');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;
    updateCustomerProfile(formData);
    if (formData.pincode) setSelectedPincode(formData.pincode);
    setIsEditing(false);
  };

  const handleQuickLogin = (e) => {
    e.preventDefault();
    if (!loginPhoneInput.trim()) return;
    loginCustomer({
      name: loginNameInput.trim() || 'Desi Foodie',
      phone: loginPhoneInput.trim(),
      address: '',
      pincode: selectedPincode || '700135'
    });
  };

  const handleReorder = (order) => {
    order.items.forEach(cartItem => {
      addToCart(cartItem.item, cartItem.selectedVariation || null, cartItem.options || [], cartItem.quantity);
    });
    setIsCartOpen(true);
  };

  const handleTrackOrder = (orderId) => {
    setActiveOrderId(orderId);
    setIsOrderTrackerOpen(true);
  };

  const neededForNextReward = 5 - loyaltyStampsCount;

  return (
    <div className="profile-page-container">
      <div className="profile-page-inner">
        {/* Page Top Breadcrumb / Back Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <button
            onClick={() => setActiveTab('customer')}
            style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              padding: '8px 16px',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: '0.85rem',
              color: '#164324',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            ← Back to Food Menu
          </button>

          <button
            onClick={() => setActiveTab('campaign')}
            style={{
              background: '#fef3c7',
              border: '1px solid #fde047',
              padding: '8px 16px',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: '0.85rem',
              color: '#b45309',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Gift size={16} color="#d97706" />
            <span>5-for-1 Campaign Details →</span>
          </button>
        </div>

        {/* 1. HERO USER CARD */}
        {userProfile ? (
          <div className="profile-hero-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div className="profile-avatar-circle">
                  {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'D'}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#164324', margin: 0 }}>
                      {userProfile.name}
                    </h2>
                    <span className="desi-club-badge">
                      <Award size={13} />
                      <span>Desi Club Foodie</span>
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 14, color: '#4b5563', fontSize: '0.85rem', marginTop: 4, flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Phone size={14} color="#d85d27" /> {userProfile.phone}
                    </span>
                    {userProfile.email && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Mail size={14} color="#d85d27" /> {userProfile.email}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  style={{
                    background: 'white',
                    border: '1px solid #d1d5db',
                    padding: '8px 14px',
                    borderRadius: 8,
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Edit3 size={14} />
                  <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                </button>
                <button
                  onClick={logoutCustomer}
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fee2e2',
                    color: '#dc2626',
                    padding: '8px 14px',
                    borderRadius: 8,
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Profile Edit Form */}
            {isEditing && (
              <form onSubmit={handleSaveProfile} style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #e5e7eb' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#164324', marginBottom: 12 }}>
                  Update Customer Details
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4 }}>Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4 }}>Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4 }}>Email (Optional)</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4 }}>Rajarhat PIN Code</label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4 }}>Default Delivery Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g. Flat 3B, Rajarhat Main Road, Near Chinar Park"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  style={{
                    marginTop: 14,
                    background: '#164324',
                    color: 'white',
                    border: 'none',
                    padding: '8px 20px',
                    borderRadius: 8,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Save size={15} /> Save Details
                </button>
              </form>
            )}
          </div>
        ) : (
          /* Login Card for Guests */
          <div className="profile-hero-card" style={{ background: '#fdfbf7', border: '2px dashed #e5a024' }}>
            <div style={{ textAlign: 'center', maxWidth: 480, margin: '0 auto', padding: '10px 0' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <User size={24} color="#b45309" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#164324' }}>
                Welcome to Desi Eats Profile & Rewards
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '6px 0 16px' }}>
                Enter your phone number to view your order history, track past orders, and view your <strong>5-for-1 Free Dish loyalty stamps</strong>!
              </p>

              <form onSubmit={handleQuickLogin} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input
                  type="text"
                  placeholder="Your Full Name (e.g. Sourav Sarkar)"
                  value={loginNameInput}
                  onChange={e => setLoginNameInput(e.target.value)}
                  style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 600 }}
                  required
                />
                <input
                  type="tel"
                  placeholder="10-digit Phone Number (e.g. 6291288522)"
                  value={loginPhoneInput}
                  onChange={e => setLoginPhoneInput(e.target.value)}
                  style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 700 }}
                  required
                />
                <button
                  type="submit"
                  style={{
                    background: '#164324',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: 8,
                    fontWeight: 800,
                    cursor: 'pointer',
                    fontSize: '0.95rem'
                  }}
                >
                  Access My Profile & Stamp Card →
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 2. THE 5-FOR-1 LOYALTY CAMPAIGN CARD */}
        <div className="loyalty-campaign-card">
          <div className="loyalty-card-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="loyalty-tag-pill">🔥 EXCLUSIVE LOYALTY REWARD</span>
                {unlockedFreeDishes > 0 && (
                  <span className="reward-ready-pill animate-bounce">
                    🎉 1 Free Dish Ready!
                  </span>
                )}
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#164324', marginTop: 6 }}>
                Desi 5-for-1 Loyalty Pass
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#4b5563', margin: '4px 0 0' }}>
                Place <strong>5 orders of ₹200+ each</strong> ➔ Unlock <strong>1 FREE dish below ₹200</strong> on your next order!
              </p>
            </div>

            <div className="loyalty-stat-badge">
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#164324', lineHeight: 1 }}>
                {loyaltyStampsCount}/5
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>
                Stamps Collected
              </div>
            </div>
          </div>

          {/* 5-Stamp Visual Progress Bar */}
          <div className="stamps-grid">
            {[1, 2, 3, 4, 5].map((slotNum) => {
              const isCompleted = slotNum <= loyaltyStampsCount;
              const isFinalGift = slotNum === 5;

              return (
                <div
                  key={slotNum}
                  className={`stamp-slot ${isCompleted ? 'stamp-completed' : ''} ${isFinalGift ? 'stamp-gift-slot' : ''}`}
                >
                  <div className="stamp-icon-wrap">
                    {isCompleted ? (
                      <CheckCircle2 size={24} color="#15803d" />
                    ) : isFinalGift ? (
                      <Gift size={24} color={unlockedFreeDishes > 0 ? '#15803d' : '#e5a024'} />
                    ) : (
                      <span className="stamp-slot-number">{slotNum}</span>
                    )}
                  </div>
                  <div className="stamp-label">
                    {isFinalGift ? (
                      <span style={{ fontWeight: 800, color: isCompleted ? '#15803d' : '#d85d27' }}>
                        🎁 FREE DISH
                      </span>
                    ) : (
                      <span>Order {slotNum} (₹200+)</span>
                    )}
                  </div>
                  {isCompleted && (
                    <span className="stamp-earned-tag">✓ STAMPED</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress Bar & Status */}
          <div style={{ marginTop: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, color: '#4b5563', marginBottom: 6 }}>
              <span>Progress towards Free Dish:</span>
              <span style={{ color: '#164324' }}>
                {loyaltyStampsCount === 0
                  ? 'Start with your first order of ₹200+'
                  : `${loyaltyStampsCount} of 5 orders completed (${loyaltyStampsCount * 20}%)`}
              </span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${(loyaltyStampsCount / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Unlocked Reward Action Banner */}
          {unlockedFreeDishes > 0 ? (
            <div className="unlocked-reward-banner">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Gift size={22} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#065f46' }}>
                    🎉 You have {unlockedFreeDishes} Free Dish {unlockedFreeDishes > 1 ? 'Rewards' : 'Reward'} Ready!
                  </h4>
                  <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#047857' }}>
                    Pick any mouth-watering combo or dish below ₹200 (like Basanti Pulao + Kosha Chicken ₹179) and enjoy it for ₹0!
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button
                  onClick={() => {
                    applyFreeDishReward();
                    setActiveTab('customer');
                  }}
                  className="claim-reward-btn"
                >
                  Claim & Pick Free Dish on Menu →
                </button>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, background: '#f8fafc', padding: '12px 16px', borderRadius: 10 }}>
              <span style={{ fontSize: '0.85rem', color: '#475569' }}>
                💡 Place <strong>{neededForNextReward} more {neededForNextReward === 1 ? 'order' : 'orders'}</strong> of ₹200+ to claim your next 100% free dish!
              </span>
              <button
                onClick={() => setActiveTab('customer')}
                style={{
                  background: '#164324',
                  color: 'white',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: 6,
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Order Now & Earn Stamp →
              </button>
            </div>
          )}

          {/* Campaign Summary & Lifetime Stats */}
          <div className="loyalty-stats-footer">
            <div className="stat-col">
              <span className="stat-num">{qualifyingOrders.length}</span>
              <span className="stat-txt">Total ₹200+ Orders Placed</span>
            </div>
            <div className="stat-col">
              <span className="stat-num">{totalEarnedFreeDishes}</span>
              <span className="stat-txt">Free Dishes Earned</span>
            </div>
            <div className="stat-col">
              <span className="stat-num">{claimedFreeDishes}</span>
              <span className="stat-txt">Free Dishes Redeemed</span>
            </div>
          </div>
        </div>

        {/* 3. PAST ORDERS HISTORY */}
        <div style={{ marginTop: 30 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#164324', margin: 0 }}>
                My Past Orders ({customerOrders.length})
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '2px 0 0' }}>
                View previous meals, track live statuses, or reorder in 1-click
              </p>
            </div>
          </div>

          {customerOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', background: 'white', borderRadius: 16, border: '1px solid #e5e7eb' }}>
              <ShoppingBag size={42} color="#cbd5e1" style={{ margin: '0 auto 10px' }} />
              <h4 style={{ fontSize: '1.05rem', color: '#374151' }}>No Past Orders Yet</h4>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', maxWidth: 360, margin: '4px auto 16px' }}>
                When you place food orders on Desi Eats, they will appear here with stamp tracking and live receipts.
              </p>
              <button
                onClick={() => setActiveTab('customer')}
                style={{
                  background: '#164324',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                Browse Menu & Order
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {customerOrders.map(order => {
                const isQualifying = Number(order.totalAmount || order.subtotal) >= 200;

                return (
                  <div key={order.id} className="user-order-history-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#164324' }}>
                            Order #{order.id}
                          </span>
                          <span className={`order-status-pill status-${order.status ? order.status.toLowerCase() : 'received'}`}>
                            {order.status || 'RECEIVED'}
                          </span>
                          {isQualifying && (
                            <span className="qualifying-stamp-pill" title="Order above ₹200: Earned 1 Loyalty Stamp">
                              ★ +1 Stamp
                            </span>
                          )}
                          {order.freeDishRewardUsed && (
                            <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: 6 }}>
                              🎁 Free Dish Claimed
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: 2, display: 'block' }}>
                          Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {order.orderMode.toUpperCase()}
                        </span>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#164324' }}>
                          ₹{order.totalAmount}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {order.paymentMethod ? order.paymentMethod.toUpperCase() : 'CASH'}
                        </span>
                      </div>
                    </div>

                    {/* Order Items List */}
                    <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: 8, marginBottom: 12 }}>
                      {order.items.map((it, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 3 }}>
                          <span>
                            <strong>{it.quantity}x</strong> {it.item.name}
                            {it.selectedVariation && <span style={{ color: '#d85d27', fontSize: '0.78rem' }}> ({it.selectedVariation.name})</span>}
                          </span>
                          <span style={{ fontWeight: 600 }}>₹{it.unitPrice * it.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Order Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                      <button
                        onClick={() => handleTrackOrder(order.id)}
                        style={{
                          background: '#f1f5f9',
                          color: '#334155',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: 6,
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5
                        }}
                      >
                        <Clock size={14} /> Track Status
                      </button>
                      <button
                        onClick={() => handleReorder(order)}
                        style={{
                          background: '#164324',
                          color: 'white',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: 6,
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5
                        }}
                      >
                        <RotateCcw size={14} /> Reorder Plate
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
