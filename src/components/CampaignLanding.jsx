import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Gift,
  Sparkles,
  CheckCircle2,
  Award,
  ArrowRight,
  Flame,
  Star,
  Clock,
  Bike,
  ShieldCheck,
  Share2,
  ChevronDown,
  ChevronUp,
  User,
  ShoppingBag,
  ArrowLeft,
  Check,
  Lock,
  UserPlus,
  Phone
} from 'lucide-react';

export const CampaignLanding = () => {
  const {
    setActiveTab,
    loyaltyStampsCount = 0,
    unlockedFreeDishes = 0,
    userProfile,
    loginCustomer,
    qualifyingOrders = [],
    customerOrders = [],
    selectedPincode = '700135',
    addToCart,
    setIsCartOpen,
    applyFreeDishReward
  } = useApp();

  const [openFaq, setOpenFaq] = useState(null);

  // Inline Profile Creation Form for Guests
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [formError, setFormError] = useState('');
  const [isSuccessCreated, setIsSuccessCreated] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleCreateProfileSubmit = (e) => {
    e.preventDefault();
    if (!profileName.trim() || !profilePhone.trim()) {
      setFormError('Please enter your full name and 10-digit phone number.');
      return;
    }
    if (profilePhone.replace(/\D/g, '').length < 10) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }

    loginCustomer({
      name: profileName.trim(),
      phone: profilePhone.replace(/\D/g, ''),
      address: profileAddress.trim(),
      pincode: selectedPincode || '700135'
    });

    setIsSuccessCreated(true);
    setFormError('');
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🍛 *Desi Eats Rajarhat Loyalty Offer!*\n\nOrder 5 times (₹200+ each) and get *1 FREE Dish below ₹200* on your next order! Authentic Bengali Kosha Chicken, Basanti Pulao, Tandoori Naan & pure veg delicacies.\n\nCreate your profile & claim your stamps here:\nhttps://desieats.online/#campaign`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const eligibleDishes = [
    {
      name: 'Basanti Pulao + Kosha Chicken',
      originalPrice: 179,
      isVeg: false,
      rating: 4.9,
      desc: 'Sweet golden saffron pulao with authentic slow-cooked spicy Kosha Chicken.'
    },
    {
      name: 'Basanti Pulao + Shahi Paneer',
      originalPrice: 179,
      isVeg: true,
      rating: 4.9,
      desc: 'Fragrant Basanti Pulao served with royal, creamy cashew Shahi Paneer.'
    },
    {
      name: 'Naan Poori + Ghee Roast Chicken',
      originalPrice: 179,
      isVeg: false,
      rating: 4.9,
      desc: 'Crispy puffed naan pooris paired with fiery Desi Ghee Roast Chicken.'
    },
    {
      name: 'Naan + Postobata Chicken',
      originalPrice: 189,
      isVeg: false,
      rating: 4.8,
      desc: 'Soft naan served with traditional nutty Bengali poppy seed chicken.'
    },
    {
      name: 'Naan Poori + Posto Paneer',
      originalPrice: 189,
      isVeg: true,
      rating: 4.9,
      desc: 'Golden naan pooris served with authentic aromatic Posto Paneer.'
    },
    {
      name: 'Basanti Pulao + Chicken Bharta',
      originalPrice: 149,
      isVeg: false,
      rating: 4.9,
      desc: 'Kolkata dhaba style shredded chicken bharta with saffron Basanti Pulao.'
    }
  ];

  const faqs = [
    {
      q: 'Do I need to create a profile before starting?',
      a: 'Yes! Creating your Desi Eats profile (with your 10-digit mobile number) links your orders and stamps securely so they are never lost.'
    },
    {
      q: 'What counts as a qualifying order?',
      a: 'Any order placed on desieats.online (for Home Delivery or Spot Takeaway in Rajarhat) with a bill amount of ₹200 or more automatically earns you 1 Loyalty Stamp on your profile.'
    },
    {
      q: 'Which free dishes can I choose when I complete 5 stamps?',
      a: 'You can choose ANY dish or combo on our entire menu priced below ₹200 (including our top-selling Basanti Pulao + Kosha Chicken ₹179, Shahi Paneer Combos ₹179, Ghee Roast Chicken, Naan Pooris, and more) 100% free!'
    },
    {
      q: 'Do my stamps expire?',
      a: 'No! Your stamps stay safely saved with your profile phone number for the entire duration of the campaign.'
    },
    {
      q: 'Can I earn multiple free dishes?',
      a: 'Yes! Every 5 qualifying orders earns you another free dish. (5 orders = 1 free dish, 10 orders = 2 free dishes, and so on).'
    }
  ];

  const neededForNextReward = 5 - loyaltyStampsCount;

  return (
    <div className="campaign-page-wrapper">
      {/* 0. Top Back Bar */}
      <div className="campaign-top-bar">
        <div className="campaign-top-bar-inner">
          <button onClick={() => setActiveTab('customer')} className="campaign-back-btn">
            <ArrowLeft size={16} />
            <span>Back to Food Menu</span>
          </button>

          <button onClick={() => setActiveTab('profile')} className="campaign-profile-link-btn">
            <User size={15} />
            <span>{userProfile ? `${userProfile.name.split(' ')[0]} (${loyaltyStampsCount}/5 Stamps)` : 'Create Profile'}</span>
          </button>
        </div>
      </div>

      {/* 1. CAMPAIGN HERO BANNER */}
      <section className="campaign-hero">
        <div className="campaign-hero-inner">
          <div className="campaign-badge-pill">
            <Sparkles size={14} color="#e5a024" />
            <span>LIVE RAJARHAT LOYALTY CAMPAIGN</span>
          </div>

          <h1 className="campaign-title">
            Eat Desi. Get Rewarded.<br />
            <span className="highlight-text">Order 5 Times, Get 1 Dish FREE!</span>
          </h1>

          <p className="campaign-subtitle">
            Order your favourite authentic Bengali & North Indian meals. Create your profile, place orders of <strong>₹200 or more</strong>, and every <strong>5 orders unlocks 1 FREE dish below ₹200</strong> on the house!
          </p>

          {/* Live Status Header Card */}
          {userProfile ? (
            <div className="live-user-status-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 800, color: '#e5a024', letterSpacing: 1 }}>
                    ACTIVE MEMBER: {userProfile.name.toUpperCase()} ({userProfile.phone})
                  </span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'white', marginTop: 2 }}>
                    {unlockedFreeDishes > 0
                      ? `🎉 You have ${unlockedFreeDishes} FREE Dish ready to claim!`
                      : `${loyaltyStampsCount}/5 Stamps collected • ${neededForNextReward} more order(s) for a Free Dish`}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => setActiveTab('customer')}
                    style={{
                      background: '#e5a024',
                      color: '#164324',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: 8,
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    Order Now & Earn Stamp →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="live-user-status-card" style={{ background: 'rgba(230, 160, 36, 0.15)', borderColor: '#e5a024' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#e5a024', color: '#164324', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <UserPlus size={18} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 800, color: '#fde68a', letterSpacing: 1 }}>
                      STEP 1: CREATE YOUR PROFILE TO PARTICIPATE
                    </span>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>
                      Create your free profile below to start collecting stamps on every ₹200+ order!
                    </div>
                  </div>
                </div>

                <a
                  href="#profile-form-section"
                  style={{
                    background: '#e5a024',
                    color: '#164324',
                    textDecoration: 'none',
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    display: 'inline-block'
                  }}
                >
                  Create Profile Now ↓
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. HOW IT WORKS (3 SIMPLE STEPS) */}
      <section className="campaign-section" style={{ background: '#ffffff' }}>
        <div className="campaign-container">
          <div className="section-heading-center">
            <span className="section-subtag">CAMPAIGN RULES</span>
            <h2 className="section-main-title">How To Get Your Free Dish</h2>
            <p className="section-main-desc">A transparent, rewarding program designed for our loyal foodies in Rajarhat.</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number-badge">1</div>
              <div className="step-icon-wrap" style={{ background: '#fef3c7', color: '#b45309' }}>
                <User size={28} />
              </div>
              <h3 className="step-title">Create Profile</h3>
              <p className="step-desc">
                Register with your mobile number. Your orders & stamps will automatically be tracked on your profile.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number-badge">2</div>
              <div className="step-icon-wrap" style={{ background: '#ecfdf5', color: '#047857' }}>
                <ShoppingBag size={28} />
              </div>
              <h3 className="step-title">Order ₹200 or More</h3>
              <p className="step-desc">
                Order your favorite Basanti Pulao combos, Kosha Chicken, or curries (min ₹200 bill). Each order gives you 1 stamp!
              </p>
            </div>

            <div className="step-card highlight-step">
              <div className="step-number-badge" style={{ background: '#e5a024', color: '#164324' }}>3</div>
              <div className="step-icon-wrap" style={{ background: '#fef4e2', color: '#d85d27' }}>
                <Gift size={28} />
              </div>
              <h3 className="step-title">1 Free Dish on 5th Order!</h3>
              <p className="step-desc">
                After 5 qualifying orders, pick ANY dish or combo priced below ₹200 on our menu completely 100% FREE!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. REAL LIVE DIGITAL STAMP CARD */}
      <section className="campaign-section" style={{ background: 'var(--bg-ivory)' }}>
        <div className="campaign-container" style={{ maxWidth: 860 }}>
          <div className="stamp-visualizer-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#d85d27', textTransform: 'uppercase', letterSpacing: 1 }}>
                  OFFICIAL DIGITAL LOYALTY CARD
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#164324', margin: '4px 0 0' }}>
                  {userProfile ? `${userProfile.name}'s Stamp Pass` : 'Guest Loyalty Pass'}
                </h3>
              </div>

              <div style={{ background: '#fef3c7', padding: '6px 14px', borderRadius: 8, border: '1px solid #fde047', fontSize: '0.85rem', fontWeight: 800, color: '#92400e' }}>
                {userProfile ? `Status: ${loyaltyStampsCount}/5 Stamps` : 'Status: Profile Required'}
              </div>
            </div>

            {/* Real Stamps Grid */}
            <div className="stamps-grid">
              {[1, 2, 3, 4, 5].map((slotNum) => {
                const isStamped = userProfile && slotNum <= loyaltyStampsCount;
                const isFinalGift = slotNum === 5;

                return (
                  <div
                    key={slotNum}
                    className={`stamp-slot ${isStamped ? 'stamp-completed' : ''} ${isFinalGift ? 'stamp-gift-slot' : ''}`}
                  >
                    <div className="stamp-icon-wrap">
                      {isStamped ? (
                        <CheckCircle2 size={24} color="#15803d" />
                      ) : isFinalGift ? (
                        <Gift size={24} color={unlockedFreeDishes > 0 ? '#15803d' : '#e5a024'} />
                      ) : (
                        <span className="stamp-slot-number">{slotNum}</span>
                      )}
                    </div>
                    <div className="stamp-label">
                      {isFinalGift ? (
                        <strong style={{ color: isStamped ? '#15803d' : '#d85d27' }}>🎁 FREE DISH</strong>
                      ) : (
                        <span>Order {slotNum} (₹200+)</span>
                      )}
                    </div>
                    <span className="stamp-earned-tag">
                      {isStamped ? '✓ STAMPED' : 'PENDING'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Live Progress or Registration Call */}
            {userProfile ? (
              <div style={{ marginTop: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, color: '#4b5563', marginBottom: 6 }}>
                  <span>Progress to next Free Dish:</span>
                  <span style={{ color: '#164324' }}>
                    {loyaltyStampsCount === 0
                      ? 'Place your next ₹200+ order to earn Stamp #1'
                      : `${loyaltyStampsCount} of 5 orders completed (${loyaltyStampsCount * 20}%)`}
                  </span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${(loyaltyStampsCount / 5) * 100}%` }} />
                </div>

                {unlockedFreeDishes > 0 ? (
                  <div className="unlocked-reward-banner" style={{ marginTop: 16 }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#065f46' }}>
                      🎉 You have {unlockedFreeDishes} Free Dish Reward ready!
                    </h4>
                    <p style={{ margin: '4px 0 10px', fontSize: '0.82rem', color: '#047857' }}>
                      Pick any combo or dish below ₹200 and apply your reward in the plate drawer for ₹0!
                    </p>
                    <button
                      onClick={() => {
                        applyFreeDishReward();
                        setActiveTab('customer');
                      }}
                      className="claim-reward-btn"
                    >
                      Pick Free Dish on Food Menu →
                    </button>
                  </div>
                ) : (
                  <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                    <span style={{ fontSize: '0.85rem', color: '#475569' }}>
                      💡 Need <strong>{neededForNextReward} more order(s)</strong> of ₹200+ for your free feast.
                    </span>
                    <button
                      onClick={() => setActiveTab('customer')}
                      style={{
                        background: '#164324',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      Browse Menu & Order →
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Inline Profile Activation Section */
              <div id="profile-form-section" style={{ marginTop: 24, padding: '20px', background: '#fffbeb', borderRadius: 12, border: '2px dashed #e5a024' }}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#164324', margin: 0 }}>
                    Create Your Profile in 10 Seconds
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#78350f', margin: '4px 0 0' }}>
                    Enter your name and mobile number to activate your loyalty pass & start earning stamps!
                  </p>
                </div>

                {formError && (
                  <div style={{ background: '#fee2e2', color: '#dc2626', padding: '8px 12px', borderRadius: 6, fontSize: '0.82rem', fontWeight: 700, marginBottom: 12, textAlign: 'center' }}>
                    {formError}
                  </div>
                )}

                <form onSubmit={handleCreateProfileSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                    style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="10-digit Phone Number *"
                    value={profilePhone}
                    onChange={e => setProfilePhone(e.target.value)}
                    style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 700 }}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Rajarhat Delivery Address (Optional)"
                    value={profileAddress}
                    onChange={e => setProfileAddress(e.target.value)}
                    style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.9rem', gridColumn: '1 / -1' }}
                  />
                  <button
                    type="submit"
                    style={{
                      gridColumn: '1 / -1',
                      background: '#164324',
                      color: 'white',
                      border: 'none',
                      padding: '12px',
                      borderRadius: 8,
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8
                    }}
                  >
                    <Check size={18} color="#e5a024" />
                    <span>Activate My Loyalty Stamp Pass →</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. SHOWCASE OF FREE DISHES YOU CAN CLAIM */}
      <section className="campaign-section" style={{ background: '#ffffff' }}>
        <div className="campaign-container">
          <div className="section-heading-center">
            <span className="section-subtag">ELIGIBLE DELICACIES</span>
            <h2 className="section-main-title">Dishes You Can Get 100% FREE</h2>
            <p className="section-main-desc">All of these signature Bengali & North Indian favorites below ₹200 are eligible under your free reward!</p>
          </div>

          <div className="eligible-dishes-grid">
            {eligibleDishes.map((dish, i) => (
              <div key={i} className="eligible-dish-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div className={`swiggy-veg-symbol ${dish.isVeg ? 'veg' : 'nonveg'}`} style={{ width: 14, height: 14 }}>
                      <div className="veg-indicator-dot" style={{ width: 6, height: 6 }} />
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6b7280' }}>
                      ★ {dish.rating}
                    </span>
                  </div>

                  <div className="price-tag-wrap">
                    <span className="old-price">₹{dish.originalPrice}</span>
                    <span className="free-price">FREE (₹0)</span>
                  </div>
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#164324', margin: '0 0 6px' }}>
                  {dish.name}
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 14px', lineHeight: 1.35 }}>
                  {dish.desc}
                </p>

                <button
                  onClick={() => {
                    setActiveTab('customer');
                  }}
                  className="dish-order-cta"
                >
                  Order on Desi Eats →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY PEOPLE LOVE DESI EATS */}
      <section className="campaign-section" style={{ background: '#164324', color: 'white' }}>
        <div className="campaign-container">
          <div className="section-heading-center">
            <span className="section-subtag" style={{ color: '#fde68a' }}>DESI EATS PROMISE</span>
            <h2 className="section-main-title" style={{ color: 'white' }}>Why Rajarhat Orders from Desi Eats</h2>
            <p className="section-main-desc" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Quality, authentic recipes, and real ghee cooking you can trust every single day.
            </p>
          </div>

          <div className="perks-grid">
            <div className="perk-card">
              <Flame size={32} color="#e5a024" />
              <h4>100% Pure Desi Ghee</h4>
              <p>Crafted using fragrant whole spices, saffron, and pure aromatic desi ghee.</p>
            </div>

            <div className="perk-card">
              <Clock size={32} color="#e5a024" />
              <h4>25-30 Min Quick Delivery</h4>
              <p>Hot, fresh doorstep delivery across all major Rajarhat pincodes.</p>
            </div>

            <div className="perk-card">
              <Award size={32} color="#e5a024" />
              <h4>No Hidden Markups</h4>
              <p>Honest pricing direct from our kitchen to your dining table.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="campaign-section" style={{ background: '#ffffff' }}>
        <div className="campaign-container" style={{ maxWidth: 760 }}>
          <div className="section-heading-center">
            <span className="section-subtag">QUESTIONS & DETAILS</span>
            <h2 className="section-main-title">Campaign FAQs & Rules</h2>
          </div>

          <div className="faq-list">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="faq-item">
                  <button className="faq-question-btn" onClick={() => toggleFaq(idx)}>
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {isOpen && (
                    <div className="faq-answer-body">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* WhatsApp Share Button */}
          <div className="whatsapp-share-strip">
            <div>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#164324' }}>
                Spread the word in Rajarhat!
              </h4>
              <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#4b5563' }}>
                Share this 5-for-1 Free Dish campaign with family, roommates, & neighbors on WhatsApp.
              </p>
            </div>

            <button onClick={handleShareWhatsApp} className="whatsapp-btn">
              <Share2 size={16} />
              <span>Share on WhatsApp</span>
            </button>
          </div>
        </div>
      </section>

      {/* 7. BOTTOM STICKY PROMO STRIP */}
      <div className="campaign-sticky-footer">
        <div className="campaign-footer-inner">
          <div className="footer-left">
            <span className="footer-offer-badge">🎁 5 ORDERS = 1 FREE DISH</span>
            <span className="footer-offer-text">Every ₹200+ order earns 1 stamp!</span>
          </div>

          <button
            onClick={() => setActiveTab('customer')}
            className="footer-order-btn"
          >
            <span>Order Now & Start Collecting</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
