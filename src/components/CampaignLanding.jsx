import React, { useState } from 'react';
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
  Heart,
  Store,
  User,
  PartyPopper
} from 'lucide-react';

export const CampaignLanding = () => {
  const {
    setActiveTab,
    loyaltyStampsCount,
    unlockedFreeDishes,
    userProfile,
    menuItems,
    addToCart,
    setIsCartOpen,
    applyFreeDishReward
  } = useApp();

  const [simulatedStamps, setSimulatedStamps] = useState(loyaltyStampsCount || 0);
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🍛 *Desi Eats Rajarhat Special Offer!*\n\nOrder 5 times (₹200+ each) and get *1 FREE Dish below ₹200* on your next order! Authentic Bengali Kosha Chicken, Basanti Pulao, Tandoori Naan & pure veg delicacies.\n\nCheck out the menu & claim your stamps here:\nhttps://desieats.online`
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
      q: 'What counts as a qualifying order for the campaign?',
      a: 'Any order placed on desieats.online (for Home Delivery or Spot Takeaway in Rajarhat) with a bill amount of ₹200 or more automatically earns you 1 Loyalty Stamp.'
    },
    {
      q: 'How do I collect and track my stamps?',
      a: 'You do not need complicated membership cards! Whenever you order, just provide your 10-digit phone number. Your digital stamp card automatically updates with each qualifying order.'
    },
    {
      q: 'Which free dishes can I choose when I complete 5 stamps?',
      a: 'You can choose ANY dish or combo on our entire menu priced below ₹200 (including our top-selling Basanti Pulao + Kosha Chicken ₹179, Shahi Paneer Combos ₹179, Ghee Roast Chicken, Naan Pooris, and more) 100% free!'
    },
    {
      q: 'Do my stamps expire?',
      a: 'No! Your stamps stay safely saved with your phone number on your profile for the entire duration of the campaign.'
    },
    {
      q: 'Can I earn multiple free dishes?',
      a: 'Yes! Every 5 qualifying orders earns you another free dish. (5 orders = 1 free dish, 10 orders = 2 free dishes, and so on).'
    }
  ];

  return (
    <div className="campaign-page-wrapper">
      {/* 1. CAMPAIGN HERO BANNER */}
      <section className="campaign-hero">
        <div className="campaign-hero-inner">
          <div className="campaign-badge-pill">
            <Sparkles size={14} color="#e5a024" />
            <span>EXCLUSIVE RAJARHAT LOYALTY CAMPAIGN</span>
          </div>

          <h1 className="campaign-title">
            Eat Desi. Get Rewarded.<br />
            <span className="highlight-text">Order 5 Times, Get 1 Dish FREE!</span>
          </h1>

          <p className="campaign-subtitle">
            Order your favourite authentic Bengali & North Indian meals. Every order of <strong>₹200 or more</strong> earns you a stamp. Complete <strong>5 stamps</strong>, and your next mouth-watering dish (below ₹200) is <strong>100% on the house!</strong>
          </p>

          <div className="campaign-cta-group">
            <button
              onClick={() => setActiveTab('customer')}
              className="campaign-primary-btn"
            >
              <span>Browse Menu & Start Earning</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className="campaign-secondary-btn"
            >
              <User size={18} />
              <span>Check My Stamps & Profile</span>
            </button>
          </div>

          {/* User Current Live Stamp Status Snippet */}
          <div className="live-user-status-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 800, color: '#e5a024', letterSpacing: 1 }}>
                  YOUR CURRENT STATUS ({userProfile ? userProfile.name : 'Guest'})
                </span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', marginTop: 2 }}>
                  {unlockedFreeDishes > 0
                    ? `🎉 You have ${unlockedFreeDishes} FREE Dish ready to claim!`
                    : `${loyaltyStampsCount}/5 Stamps collected • ${5 - loyaltyStampsCount} more order(s) for a Free Dish`}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('profile')}
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
                View Stamp Card →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (3 SIMPLE STEPS) */}
      <section className="campaign-section" style={{ background: '#ffffff' }}>
        <div className="campaign-container">
          <div className="section-heading-center">
            <span className="section-subtag">SIMPLE & REWARDING</span>
            <h2 className="section-main-title">How The 5-for-1 Pass Works</h2>
            <p className="section-main-desc">No complicated points or hidden rules. Just pure, honest food rewards.</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number-badge">1</div>
              <div className="step-icon-wrap" style={{ background: '#fef3c7', color: '#b45309' }}>
                <ShoppingBag size={28} />
              </div>
              <h3 className="step-title">Order ₹200 or More</h3>
              <p className="step-desc">
                Pick your favorite Basanti Pulao combos, Kosha Chicken, Tandoori naan, or healthy platters with a minimum bill of ₹200.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number-badge">2</div>
              <div className="step-icon-wrap" style={{ background: '#ecfdf5', color: '#047857' }}>
                <CheckCircle2 size={28} />
              </div>
              <h3 className="step-title">Collect 1 Stamp Each Time</h3>
              <p className="step-desc">
                Your phone number automatically records your stamp upon order delivery. No card to lose, no coupon codes to memorize.
              </p>
            </div>

            <div className="step-card highlight-step">
              <div className="step-number-badge" style={{ background: '#e5a024', color: '#164324' }}>3</div>
              <div className="step-icon-wrap" style={{ background: '#fef4e2', color: '#d85d27' }}>
                <Gift size={28} />
              </div>
              <h3 className="step-title">Enjoy 1 Free Dish Below ₹200!</h3>
              <p className="step-desc">
                After completing 5 qualifying orders, pick ANY dish or combo priced below ₹200 on our menu completely 100% FREE!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE 5-STAMP VISUALIZER */}
      <section className="campaign-section" style={{ background: 'var(--bg-ivory)' }}>
        <div className="campaign-container">
          <div className="stamp-visualizer-box">
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#d85d27', textTransform: 'uppercase', letterSpacing: 1 }}>
                DIGITAL LOYALTY PASS
              </span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#164324', marginTop: 4 }}>
                Your 5-Stamp Reward Card
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#6b7280' }}>
                Click any slot below to test how the pass unlocks your free dish!
              </p>
            </div>

            {/* Interactive Grid */}
            <div className="stamps-grid interactive">
              {[1, 2, 3, 4, 5].map((num) => {
                const active = num <= simulatedStamps;
                const isGift = num === 5;

                return (
                  <div
                    key={num}
                    onClick={() => setSimulatedStamps(num === simulatedStamps ? num - 1 : num)}
                    className={`stamp-slot ${active ? 'stamp-completed' : ''} ${isGift ? 'stamp-gift-slot' : ''}`}
                    style={{ cursor: 'pointer' }}
                    title="Click to simulate stamp progress"
                  >
                    <div className="stamp-icon-wrap">
                      {active ? (
                        <CheckCircle2 size={24} color="#15803d" />
                      ) : isGift ? (
                        <Gift size={24} color="#e5a024" />
                      ) : (
                        <span className="stamp-slot-number">{num}</span>
                      )}
                    </div>
                    <div className="stamp-label">
                      {isGift ? (
                        <strong style={{ color: active ? '#15803d' : '#d85d27' }}>🎁 FREE DISH</strong>
                      ) : (
                        <span>Order #{num}</span>
                      )}
                    </div>
                    <span className="stamp-earned-tag">
                      {active ? '✓ STAMPED' : 'TAP TO TEST'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Simulated Result Message */}
            <div style={{ textAlign: 'center', marginTop: 24, padding: '14px', background: 'white', borderRadius: 12, border: '1px solid #e5e7eb' }}>
              {simulatedStamps === 5 ? (
                <div style={{ color: '#047857' }}>
                  <strong style={{ fontSize: '1.1rem' }}>🎉 CELEBRATION! 5 STAMPS COMPLETED!</strong>
                  <p style={{ fontSize: '0.85rem', margin: '4px 0 0' }}>
                    You unlocked <strong>1 FREE dish below ₹200</strong>! Order your next meal and get ₹179–₹189 off instantly.
                  </p>
                </div>
              ) : (
                <div style={{ color: '#4b5563', fontSize: '0.9rem' }}>
                  <strong>{simulatedStamps} of 5 stamps collected.</strong> {5 - simulatedStamps} more order(s) of ₹200+ unlocks your free feast!
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. SHOWCASE OF FREE DISHES YOU CAN CLAIM */}
      <section className="campaign-section" style={{ background: '#ffffff' }}>
        <div className="campaign-container">
          <div className="section-heading-center">
            <span className="section-subtag">CLAIMABLE DELICACIES</span>
            <h2 className="section-main-title">Dishes You Can Get 100% FREE</h2>
            <p className="section-main-desc">All of these signature Bengali & North Indian favorites are eligible under your free dish reward!</p>
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
