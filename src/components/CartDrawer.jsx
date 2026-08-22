import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, UtensilsCrossed, ArrowRight, Bike, Store, Tag, Check, CreditCard, Banknote, QrCode, Gift, Sparkles, Award } from 'lucide-react';

export const CartDrawer = () => {
  const {
    cart,
    updateCartQuantity,
    cartSubtotal,
    isCartOpen,
    setIsCartOpen,
    orderMode,
    selectedPincode,
    checkServiceability,
    coupons,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    couponDiscount,
    placeOrder,
    userProfile,
    loyaltyStampsCount,
    unlockedFreeDishes,
    isFreeDishRewardApplied,
    freeDishRewardDiscount,
    eligibleFreeDishItem,
    applyFreeDishReward,
    removeFreeDishReward
  } = useApp();

  const [customerName, setCustomerName] = useState(userProfile?.name || '');
  const [customerPhone, setCustomerPhone] = useState(userProfile?.phone || '');
  const [address, setAddress] = useState(userProfile?.address || '');
  const [tableNo, setTableNo] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' or 'upi_qr'
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState(null);
  const [instructions, setInstructions] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Synchronize prefill if userProfile changes
  useEffect(() => {
    if (userProfile) {
      if (!customerName && userProfile.name) setCustomerName(userProfile.name);
      if (!customerPhone && userProfile.phone) setCustomerPhone(userProfile.phone);
      if (!address && userProfile.address) setAddress(userProfile.address);
    }
  }, [userProfile]);

  if (!isCartOpen) return null;

  const deliveryFee = orderMode === 'delivery' ? 30 : 0;
  const grandTotal = Math.max(0, cartSubtotal + deliveryFee - couponDiscount - freeDishRewardDiscount);

  const isQualifyingOrder = cartSubtotal >= 200;
  const amountNeededForStamp = Math.max(0, 200 - cartSubtotal);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCouponCode(couponInput);
    setCouponFeedback(res);
    if (res.success) {
      setCouponInput('');
    }
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg('Please enter your name and phone number.');
      return;
    }
    if (orderMode === 'delivery' && !address.trim()) {
      setErrorMsg('Please enter your delivery street address.');
      return;
    }

    placeOrder({
      name: customerName,
      phone: customerPhone,
      address,
      tableNo,
      paymentMethod,
      instructions
    });
  };

  return (
    <div className="cart-drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <UtensilsCrossed color="#1b4332" size={22} />
            <h3>My Desi Plate ({cart.length} items)</h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
          >
            <X size={20} />
          </button>
        </div>

        {cart.length > 0 ? (
          <>
            {/* Mode Banner */}
            <div style={{
              background: orderMode === 'delivery' ? '#f0fdf4' : '#fefce8',
              padding: '10px 20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.85rem',
              fontWeight: 600
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: orderMode === 'delivery' ? '#166534' : '#854d0e' }}>
                {orderMode === 'delivery' ? <Bike size={16} /> : <Store size={16} />}
                <span>Ordering for {orderMode === 'delivery' ? `Home Delivery (${selectedPincode})` : 'Spot Pickup / Takeaway'}</span>
              </div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800 }}>
                {orderMode.toUpperCase()}
              </span>
            </div>

            {/* Cart Items List */}
            <div className="cart-items-list">
              {cart.map(ci => (
                <div key={ci.cartId} className="cart-item-row">
                  <div style={{ flex: 1, paddingRight: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div className={`veg-nonveg-badge ${!ci.item.isVeg ? 'nonveg' : ''}`} style={{ position: 'static', width: 14, height: 14 }}>
                        <div className="veg-dot" style={{ width: 5, height: 5 }} />
                      </div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1f2937' }}>
                        {ci.item.name}
                        {ci.selectedVariation && (
                          <span style={{ color: '#d85d27', fontSize: '0.8rem', marginLeft: 6 }}>
                            ({ci.selectedVariation.name})
                          </span>
                        )}
                      </h4>
                    </div>

                    {ci.options.length > 0 && (
                      <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: 2 }}>
                        Add-ons: {ci.options.map(o => o.name).join(', ')}
                      </div>
                    )}
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1b4332', marginTop: 4 }}>
                      ₹{ci.unitPrice * ci.quantity}
                    </div>
                  </div>

                  <div className="qty-counter">
                    <button className="qty-btn" onClick={() => updateCartQuantity(ci.cartId, -1)}>-</button>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{ci.quantity}</span>
                    <button className="qty-btn" onClick={() => updateCartQuantity(ci.cartId, 1)}>+</button>
                  </div>
                </div>
              ))}

              {/* Loyalty Campaign Stamp Tracker in Cart */}
              <div style={{
                marginTop: 14,
                padding: '12px 14px',
                borderRadius: 12,
                background: isQualifyingOrder ? '#ecfdf5' : '#fefce8',
                border: isQualifyingOrder ? '1px solid #10b981' : '1px solid #fef08a',
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: isQualifyingOrder ? '#10b981' : '#fef3c7',
                  color: isQualifyingOrder ? '#fff' : '#b45309',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Award size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  {isQualifyingOrder ? (
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#065f46' }}>
                        ⭐ +1 Loyalty Stamp Earned!
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#047857' }}>
                        Order is ₹200+. You will have <strong>{loyaltyStampsCount + 1}/5 stamps</strong> towards a FREE dish!
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#92400e' }}>
                        5-for-1 Free Dish Campaign
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#b45309' }}>
                        Add <strong>₹{amountNeededForStamp}</strong> more to qualify for a Loyalty Stamp towards a FREE dish!
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Unlocked Free Dish Reward Redeem Card */}
              {unlockedFreeDishes > 0 && (
                <div style={{
                  marginTop: 14,
                  padding: '14px',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #fef4e2 0%, #fff7ed 100%)',
                  border: '2px solid #e5a024'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Gift size={18} color="#d85d27" />
                      <strong style={{ fontSize: '0.88rem', color: '#9a3412' }}>
                        🎁 Free Dish Reward Available!
                      </strong>
                    </div>
                    <span style={{ fontSize: '0.72rem', background: '#d85d27', color: 'white', padding: '1px 6px', borderRadius: 4, fontWeight: 800 }}>
                      {unlockedFreeDishes} READY
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#7c2d12', margin: '0 0 10px' }}>
                    You completed 5 qualifying orders! Claim any dish below ₹200 (like Basanti Pulao + Kosha Chicken) for ₹0.
                  </p>

                  {isFreeDishRewardApplied ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', padding: '8px 12px', borderRadius: 8, border: '1px solid #10b981' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#15803d' }}>
                        ✓ Free Dish Applied (-₹{freeDishRewardDiscount})
                      </span>
                      <button
                        onClick={removeFreeDishReward}
                        style={{ background: 'none', border: 'none', color: '#dc2626', fontWeight: 700, cursor: 'pointer', fontSize: '0.78rem' }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={applyFreeDishReward}
                      style={{
                        width: '100%',
                        background: '#164324',
                        color: 'white',
                        border: 'none',
                        padding: '8px 14px',
                        borderRadius: 8,
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6
                      }}
                    >
                      <Gift size={16} color="#e5a024" />
                      <span>Apply Free Dish to this Order</span>
                    </button>
                  )}
                </div>
              )}

              {/* Promo Coupon Section */}
              <div style={{ marginTop: 14, padding: 14, background: '#fefce8', borderRadius: 12, border: '1px solid #fef08a' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <Tag size={16} color="#d97706" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#92400e' }}>
                    Apply Coupon Code / Offer
                  </span>
                </div>

                {appliedCoupon ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', padding: '8px 12px', borderRadius: 8, border: '1px solid #fde047' }}>
                    <div>
                      <strong style={{ color: '#15803d', fontSize: '0.9rem' }}>{appliedCoupon.code} APPLIED!</strong>
                      <span style={{ fontSize: '0.75rem', color: '#65a30d', display: 'block' }}>Saving ₹{couponDiscount} on this order</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      style={{ background: 'none', border: 'none', color: '#dc2626', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: 6 }}>
                    <input
                      type="text"
                      placeholder="e.g. DESI20 or WELCOME50"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value.toUpperCase())}
                      style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', textTransform: 'uppercase', fontWeight: 700, fontSize: '0.85rem' }}
                    />
                    <button
                      type="submit"
                      style={{ background: '#1b4332', color: 'white', border: 'none', padding: '0 16px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponFeedback && (
                  <div style={{ fontSize: '0.78rem', color: couponFeedback.success ? '#15803d' : '#b91c1c', marginTop: 6, fontWeight: 600 }}>
                    {couponFeedback.message}
                  </div>
                )}
              </div>

              {/* Payment Method Selector (For Takeaway & Delivery) */}
              <div style={{ marginTop: 20 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1f2937', display: 'block', marginBottom: 8 }}>
                  Payment Method for {orderMode === 'takeaway' ? 'Takeaway Pickup' : 'Delivery'}:
                </label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: paymentMethod === 'cash' ? '2px solid #1b4332' : '1px solid #d1d5db',
                      background: paymentMethod === 'cash' ? '#f0fdf4' : 'white',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6
                    }}
                  >
                    <Banknote size={16} color="#166534" />
                    <span>{orderMode === 'takeaway' ? 'Cash at Counter' : 'Cash on Delivery'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi_qr')}
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: paymentMethod === 'upi_qr' ? '2px solid #e5a024' : '1px solid #d1d5db',
                      background: paymentMethod === 'upi_qr' ? '#fefce8' : 'white',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6
                    }}
                  >
                    <QrCode size={16} color="#b45309" />
                    <span>UPI / QR Scan at Shop</span>
                  </button>
                </div>
              </div>

              {/* Special Instructions */}
              <div style={{ marginTop: 16 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4 }}>
                  Cooking / Delivery Instructions:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Extra spicy, keep cutlery..."
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: '0.85rem' }}
                />
              </div>

              {/* Customer Contact Details */}
              <div style={{ marginTop: 20, padding: 16, background: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1f2937', marginBottom: 10 }}>
                  Contact Information
                </h4>

                {errorMsg && (
                  <div style={{ color: '#dc2626', fontSize: '0.8rem', fontWeight: 600, marginBottom: 10 }}>
                    {errorMsg}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    style={{ padding: '10px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: '0.85rem' }}
                  />

                  <input
                    type="tel"
                    placeholder="Mobile Phone Number *"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    style={{ padding: '10px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: '0.85rem' }}
                  />

                  {orderMode === 'delivery' ? (
                    <textarea
                      placeholder="Delivery Street Address (Flat / House No) *"
                      rows={2}
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      style={{ padding: '10px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: '0.85rem', resize: 'none' }}
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder="Table / Spot Label (Optional)"
                      value={tableNo}
                      onChange={e => setTableNo(e.target.value)}
                      style={{ padding: '10px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: '0.85rem' }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Footer Summary & Place Order */}
            <div style={{ padding: 20, borderTop: '1px solid #e5e7eb', background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#6b7280', marginBottom: 4 }}>
                <span>Subtotal</span>
                <span>₹{cartSubtotal}</span>
              </div>

              {couponDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#15803d', fontWeight: 700, marginBottom: 4 }}>
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}

              {freeDishRewardDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#047857', fontWeight: 800, marginBottom: 4 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Gift size={13} color="#047857" />
                    <span>Free Dish Reward ({eligibleFreeDishItem?.item.name})</span>
                  </span>
                  <span>-₹{freeDishRewardDiscount} (FREE)</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#6b7280', marginBottom: 12 }}>
                <span>{orderMode === 'delivery' ? 'Delivery Fee' : 'Packaging'}</span>
                <span>{orderMode === 'delivery' ? `₹${deliveryFee}` : 'FREE'}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: '#1b4332', marginBottom: 16 }}>
                <span>Grand Total</span>
                <span>₹{grandTotal}</span>
              </div>

              <button
                onClick={handleCheckoutSubmit}
                style={{
                  width: '100%',
                  background: '#d85d27',
                  color: 'white',
                  border: 'none',
                  padding: '14px 20px',
                  borderRadius: '30px',
                  fontWeight: 800,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  boxShadow: '0 4px 14px rgba(216, 93, 39, 0.35)'
                }}
              >
                <span>Place {orderMode === 'delivery' ? 'Delivery' : 'Takeaway'} Order • ₹{grandTotal}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center' }}>
            <UtensilsCrossed size={54} color="#cbd5e1" style={{ marginBottom: 16 }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#374151' }}>Your Desi Plate is Empty</h3>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: 6, marginBottom: 20 }}>
              Add biryanis, rolls, and sizzling curries to fill your plate!
            </p>
            <button
              onClick={() => setIsCartOpen(false)}
              style={{
                background: '#1b4332',
                color: 'white',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '30px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Explore Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
