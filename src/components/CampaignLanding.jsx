import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Gift,
  CheckCircle2,
  Award,
  ArrowRight,
  ArrowLeft,
  User,
  ShoppingBag,
  Check,
  ChevronDown,
  ChevronUp,
  Share2,
  Sparkles,
  Utensils
} from 'lucide-react';

export const CampaignLanding = () => {
  const {
    setActiveTab,
    loyaltyStampsCount = 0,
    unlockedFreeDishes = 0,
    userProfile,
    loginCustomer,
    qualifyingOrders = [],
    addToCart,
    setIsCartOpen,
    applyFreeDishReward
  } = useApp();

  const [openFaq, setOpenFaq] = useState(null);

  // Profile activation form for guests
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleCreateProfileSubmit = (e) => {
    e.preventDefault();
    if (!profileName.trim() || !profilePhone.trim()) {
      setFormError('Please enter your full name and 10-digit mobile number.');
      return;
    }
    const clean = profilePhone.replace(/\D/g, '');
    if (clean.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }

    loginCustomer({
      name: profileName.trim(),
      phone: clean,
      address: profileAddress.trim(),
      pincode: '700135'
    });

    setFormError('');
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🍛 *Desi Eats 5-for-1 Rewards!*\n\nOrder 5 meals (₹200+ each) from Desi Eats and get *1 FREE signature dish or combo below ₹200* on your next order! Authentic Basanti Pulao, Kosha Chicken, Tandoori Naan & fresh delicacies.\n\nJoin Desi Club & track your stamps here:\nhttps://desieats.online/#campaign`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const eligibleDishes = [
    {
      name: 'Basanti Pulao + Kosha Chicken',
      originalPrice: 179,
      isVeg: false,
      desc: 'Fragrant sweet-scented golden Basanti Pulao paired with authentic slow-cooked spicy Kosha Chicken.'
    },
    {
      name: 'Basanti Pulao + Shahi Paneer',
      originalPrice: 179,
      isVeg: true,
      desc: 'Saffron-infused Basanti Pulao served with royal, creamy cashew Shahi Paneer gravy.'
    },
    {
      name: 'Naan Poori + Ghee Roast Chicken',
      originalPrice: 179,
      isVeg: false,
      desc: 'Crispy puffed naan pooris paired with fiery South-Indian style Desi Ghee Roast Chicken.'
    },
    {
      name: 'Naan + Postobata Chicken',
      originalPrice: 189,
      isVeg: false,
      desc: 'Soft tandoori naan served with traditional nutty poppy seed chicken curry.'
    },
    {
      name: 'Naan Poori + Posto Paneer',
      originalPrice: 189,
      isVeg: true,
      desc: 'Fresh cottage cheese in authentic stone-ground poppy seed paste with naan pooris.'
    },
    {
      name: 'Basanti Pulao + Chicken Bharta',
      originalPrice: 149,
      isVeg: false,
      desc: 'Kolkata dhaba style shredded chicken bharta served with aromatic Basanti Pulao.'
    }
  ];

  const faqs = [
    {
      q: 'How does the 5-for-1 Loyalty Pass work?',
      a: 'Create your profile with your phone number. Every order of ₹200 or more placed on Desi Eats automatically adds 1 stamp to your pass. Once you reach 5 stamps, you can claim any dish or combo under ₹200 for ₹0 on your next order.'
    },
    {
      q: 'Do I need a physical loyalty card?',
      a: 'No. Your digital pass is linked to your 10-digit mobile number and updates automatically in real-time as your orders are placed.'
    },
    {
      q: 'Which dishes can I choose as my free reward?',
      a: 'You can pick any combo, main dish, curry, or rice platter on our entire menu priced below ₹200 (including our top-selling Basanti Pulao combos, Kosha Chicken, and Shahi Paneer).'
    },
    {
      q: 'Can I earn multiple free dishes?',
      a: 'Yes. Every cycle of 5 qualifying orders earns you another free dish. The rewards never expire and keep accumulating.'
    }
  ];

  const neededStamps = 5 - loyaltyStampsCount;

  return (
    <div className="campaign-page-wrapper" style={{ background: 'var(--bg-ivory, #fef8eb)', minHeight: '100vh', paddingBottom: 60 }}>
      {/* Top Header Bar */}
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '12px 20px', position: 'sticky', top: 70, zIndex: 30 }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setActiveTab('customer')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#164324',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Menu</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            style={{
              background: '#fef3c7',
              border: '1px solid #fde047',
              color: '#92400e',
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer'
            }}
          >
            <User size={14} />
            <span>{userProfile ? `${userProfile.name.split(' ')[0]} (${loyaltyStampsCount}/5 Stamps)` : 'My Profile'}</span>
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px' }}>
        {/* 1. Main Brand Showcase Banner */}
        <div style={{
          background: 'white',
          borderRadius: 20,
          border: '1px solid #e5e7eb',
          padding: '32px 24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          marginBottom: 24
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{
              background: '#164324',
              color: '#e5a024',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: 6,
              letterSpacing: '0.5px'
            }}>
              DESI CLUB
            </span>
            <span style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 600 }}>
              Official Member Rewards Program
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.4rem)',
            fontWeight: 800,
            color: '#164324',
            fontFamily: 'var(--font-brand, Outfit)',
            margin: '0 0 10px',
            lineHeight: 1.2
          }}>
            Order 5 Times. Get 1 Dish Free.
          </h1>

          <p style={{
            fontSize: '0.95rem',
            color: '#4b5563',
            margin: '0 0 24px',
            maxWidth: 680,
            lineHeight: 1.5
          }}>
            Order your favorite meals from Desi Eats. Every qualifying order of <strong>₹200 or more</strong> adds 1 stamp to your profile. On your 5th stamp, your next dish (up to ₹200) is <strong>100% on us</strong>.
          </p>

          {/* Member Card or Activation Prompt */}
          {userProfile ? (
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 14,
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 14
            }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>
                  Active Member: <strong>{userProfile.name}</strong> ({userProfile.phone})
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#164324', marginTop: 2 }}>
                  {unlockedFreeDishes > 0
                    ? `🎉 You have ${unlockedFreeDishes} Free Dish ready to claim!`
                    : `${loyaltyStampsCount} of 5 stamps collected • ${neededStamps} more order(s) needed`}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                {unlockedFreeDishes > 0 ? (
                  <button
                    onClick={() => {
                      applyFreeDishReward();
                      setActiveTab('customer');
                    }}
                    style={{
                      background: '#164324',
                      color: 'white',
                      border: 'none',
                      padding: '10px 18px',
                      borderRadius: 8,
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      cursor: 'pointer'
                    }}
                  >
                    Claim Free Dish on Menu →
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('customer')}
                    style={{
                      background: '#164324',
                      color: 'white',
                      border: 'none',
                      padding: '10px 18px',
                      borderRadius: 8,
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      cursor: 'pointer'
                    }}
                  >
                    Browse Menu & Order →
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: 14,
              padding: '20px',
              marginTop: 10
            }}>
              <div style={{ marginBottom: 14 }}>
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#92400e' }}>
                  Step 1: Create your profile to start collecting stamps
                </h4>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#78350f' }}>
                  Enter your name and mobile number to activate your digital loyalty pass.
                </p>
              </div>

              {formError && (
                <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '8px 12px', borderRadius: 6, fontSize: '0.82rem', fontWeight: 700, marginBottom: 12 }}>
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateProfileSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={profileName}
                  onChange={e => setProfileName(e.target.value)}
                  style={{ flex: '1 1 200px', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  required
                />
                <input
                  type="tel"
                  placeholder="10-digit Phone Number *"
                  value={profilePhone}
                  onChange={e => setProfilePhone(e.target.value)}
                  style={{ flex: '1 1 200px', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 700 }}
                  required
                />
                <button
                  type="submit"
                  style={{
                    background: '#164324',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: 8,
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  Activate Pass →
                </button>
              </form>
            </div>
          )}
        </div>

        {/* 2. Digital Stamp Pass Card */}
        <div style={{
          background: 'white',
          borderRadius: 20,
          border: '1px solid #e5e7eb',
          padding: '28px 24px',
          marginBottom: 24,
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#164324', fontFamily: 'var(--font-brand, Outfit)' }}>
                Your 5-Stamp Reward Card
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#6b7280' }}>
                Every order amounting to ₹200 or more adds 1 verified stamp.
              </p>
            </div>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: '0.85rem',
              fontWeight: 800,
              color: '#164324'
            }}>
              {userProfile ? `Status: ${loyaltyStampsCount}/5 Stamps` : 'Profile Not Linked'}
            </div>
          </div>

          {/* Stamps 5-Slot Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, margin: '14px 0 20px' }}>
            {[1, 2, 3, 4, 5].map((slotNum) => {
              const isStamped = userProfile && slotNum <= loyaltyStampsCount;
              const isGift = slotNum === 5;

              return (
                <div
                  key={slotNum}
                  style={{
                    background: isStamped ? '#ecfdf5' : '#f8fafc',
                    border: isStamped ? '2px solid #10b981' : isGift ? '2px dashed #f59e0b' : '1px dashed #cbd5e1',
                    borderRadius: 12,
                    padding: '16px 8px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}
                >
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: isStamped ? '#10b981' : isGift ? '#fef3c7' : '#ffffff',
                    color: isStamped ? 'white' : isGift ? '#b45309' : '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.95rem'
                  }}>
                    {isStamped ? <Check size={18} strokeWidth={3} /> : isGift ? <Gift size={18} /> : slotNum}
                  </div>

                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: isStamped ? '#047857' : '#475569' }}>
                    {isGift ? 'FREE DISH' : `Order ${slotNum}`}
                  </span>

                  <span style={{ fontSize: '0.62rem', fontWeight: 800, color: isStamped ? '#059669' : '#94a3b8' }}>
                    {isStamped ? 'STAMPED' : 'PENDING'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div style={{ height: 8, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(loyaltyStampsCount / 5) * 100}%`, background: '#10b981', transition: 'width 0.3s ease' }} />
          </div>
        </div>

        {/* 3. Three Step Workflow */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
          marginBottom: 24
        }}>
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '20px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#d85d27', textTransform: 'uppercase', marginBottom: 4 }}>
              Step 1
            </div>
            <h4 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 800, color: '#164324' }}>
              Create Customer Profile
            </h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.4 }}>
              Register with your mobile phone number. All orders are automatically linked to your account.
            </p>
          </div>

          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '20px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#d85d27', textTransform: 'uppercase', marginBottom: 4 }}>
              Step 2
            </div>
            <h4 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 800, color: '#164324' }}>
              Order ₹200 or More
            </h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.4 }}>
              Order your favorite combos, curries, or biryanis. Each order of ₹200+ gives you 1 digital stamp.
            </p>
          </div>

          <div style={{ background: 'white', borderRadius: 16, border: '2px solid #e5a024', padding: '20px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', marginBottom: 4 }}>
              Step 3
            </div>
            <h4 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 800, color: '#164324' }}>
              1 Free Dish on 5th Order
            </h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.4 }}>
              Unlock 1 free dish below ₹200. Apply your reward in your plate drawer on your next order.
            </p>
          </div>
        </div>

        {/* 4. Eligible Signature Dishes */}
        <div style={{
          background: 'white',
          borderRadius: 20,
          border: '1px solid #e5e7eb',
          padding: '28px 24px',
          marginBottom: 24,
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
        }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#164324', fontFamily: 'var(--font-brand, Outfit)' }}>
              Dishes Eligible for Free Reward
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#6b7280' }}>
              Any item below ₹200 on our menu is eligible. Here are our top customer favorites:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            {eligibleDishes.map((dish, idx) => (
              <div
                key={idx}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div className={`swiggy-veg-symbol ${dish.isVeg ? 'veg' : 'nonveg'}`} style={{ width: 14, height: 14 }}>
                      <div className="veg-indicator-dot" style={{ width: 6, height: 6 }} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.82rem', color: '#94a3b8', textDecoration: 'line-through', marginRight: 6 }}>
                        ₹{dish.originalPrice}
                      </span>
                      <span style={{ fontSize: '0.78rem', background: '#ecfdf5', color: '#047857', border: '1px solid #10b981', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>
                        FREE (₹0)
                      </span>
                    </div>
                  </div>

                  <h4 style={{ margin: '0 0 6px', fontSize: '0.98rem', fontWeight: 800, color: '#164324' }}>
                    {dish.name}
                  </h4>
                  <p style={{ margin: '0 0 14px', fontSize: '0.82rem', color: '#64748b', lineHeight: 1.35 }}>
                    {dish.desc}
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('customer')}
                  style={{
                    width: '100%',
                    background: 'white',
                    border: '1px solid #cbd5e1',
                    color: '#164324',
                    padding: '8px',
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  Order on Desi Eats →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 5. FAQs */}
        <div style={{
          background: 'white',
          borderRadius: 20,
          border: '1px solid #e5e7eb',
          padding: '28px 24px',
          marginBottom: 24
        }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '1.2rem', fontWeight: 800, color: '#164324', fontFamily: 'var(--font-brand, Outfit)' }}>
            Frequently Asked Questions
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
                  <button
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: '100%',
                      background: 'white',
                      border: 'none',
                      padding: '14px 16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      color: '#1f2937',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 16px 14px', fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.5, borderTop: '1px solid #f1f5f9', paddingTop: 10 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* WhatsApp Share */}
          <div style={{
            marginTop: 20,
            padding: '14px 16px',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 12,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 10
          }}>
            <div>
              <strong style={{ fontSize: '0.9rem', color: '#166534', display: 'block' }}>
                Share Desi Club with friends & family
              </strong>
              <span style={{ fontSize: '0.78rem', color: '#15803d' }}>
                Invite loved ones to collect stamps and enjoy free authentic meals.
              </span>
            </div>

            <button
              onClick={handleShareWhatsApp}
              style={{
                background: '#25d366',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: 20,
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Share2 size={14} /> Share on WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
