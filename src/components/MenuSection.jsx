import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { FoodCard } from './FoodCard';
import {
  Search,
  Sparkles,
  Star,
  Clock,
  MapPin,
  Bike,
  Store,
  Tag,
  Percent,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  ArrowRight,
  Utensils,
  Flame,
  Soup,
  Leaf,
  Layers,
  X,
  Lock,
  ChefHat,
  Smartphone,
  ShieldCheck,
  Filter,
  Gift
} from 'lucide-react';

import { INITIAL_CATEGORIES } from '../data/initialMenu';

const categoryIconMap = {
  Utensils, Sparkles, Flame, Soup, Leaf
};

export const MenuSection = () => {
  const {
    menuItems,
    categories,
    orderMode,
    setOrderMode,
    selectedPincode,
    setIsLocationModalOpen,
    cart,
    cartItemCount,
    cartSubtotal,
    setIsCartOpen,
    activeOrderId,
    setIsOrderTrackerOpen,
    orders,
    requestProtectedView,
    coupons,
    setActiveTab,
    loyaltyStampsCount,
    unlockedFreeDishes
  } = useApp();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietFilter, setDietFilter] = useState('all'); // 'all', 'veg', 'nonveg', 'special'
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [isBrowseMenuOpen, setIsBrowseMenuOpen] = useState(false);

  const activeOrder = orders.find(o => o.id === activeOrderId && o.status !== 'COMPLETED' && o.status !== 'CANCELLED');

  // Compute full unique categories list combining INITIAL_CATEGORIES, categories context, and any categories in menuItems
  const allCategories = useMemo(() => {
    const map = new Map();
    INITIAL_CATEGORIES.forEach(c => map.set(c.id, c));
    (categories || []).forEach(c => {
      if (c && c.id) map.set(c.id, c);
    });
    (menuItems || []).forEach(item => {
      if (item.category && item.category !== 'all' && !map.has(item.category)) {
        const catName = item.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        map.set(item.category, { id: item.category, name: catName, icon: 'Utensils' });
      }
    });
    return Array.from(map.values());
  }, [categories, menuItems]);

  const toggleCategoryCollapse = (catId) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // Filter items
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      // Category match
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      // Search match
      const matchesSearch = !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      // Diet filter match
      const matchesDiet =
        dietFilter === 'all' ? true :
        dietFilter === 'veg' ? item.isVeg :
        dietFilter === 'nonveg' ? !item.isVeg :
        dietFilter === 'special' ? item.isSpecial : true;

      return matchesCategory && matchesSearch && matchesDiet;
    });
  }, [menuItems, activeCategory, searchQuery, dietFilter]);

  // Group items by category for structured listing
  const groupedSections = useMemo(() => {
    const validCategories = allCategories.filter(c => c.id !== 'all');
    return validCategories.map(cat => {
      const itemsInCat = filteredItems.filter(item => item.category === cat.id);
      return {
        ...cat,
        items: itemsInCat
      };
    }).filter(group => activeCategory === 'all' ? group.items.length > 0 : group.id === activeCategory);
  }, [allCategories, filteredItems, activeCategory]);

  const scrollToCategory = (catId) => {
    setActiveCategory(catId);
    setIsBrowseMenuOpen(false);
    const element = document.getElementById(`cat-section-${catId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="swiggy-page-layout">
      {/* Active Order Live Notification */}
      {activeOrder && (
        <div className="swiggy-active-order-bar">
          <div className="swiggy-active-order-inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="live-pulse-dot" />
              <span className="active-order-text">
                Active Order #{activeOrder.id} • Status: <strong>{activeOrder.status}</strong>
              </span>
            </div>
            <button onClick={() => setIsOrderTrackerOpen(true)} className="swiggy-track-live-btn">
              Track Order Live
            </button>
          </div>
        </div>
      )}

      {/* 1. SWIGGY RESTAURANT SHOWCASE HEADER BANNER */}
      <section className="swiggy-restaurant-header">
        <div className="swiggy-outlet-card">
          <div className="swiggy-outlet-top">
            <div className="outlet-name-wrap">
              <span className="outlet-brand-badge">DESI EATS OUTLET</span>
              <h1 className="swiggy-outlet-name">Desi Eats • Rajarhat</h1>
              <p className="swiggy-outlet-cuisines">
                North Indian • Bengali Specials • Basanti Pulao Combos • Tandoori Platters
              </p>
            </div>

            {/* Outlet Rating Card */}
            <div className="swiggy-outlet-rating-box">
              <div className="outlet-rating-score">
                <Star size={16} fill="white" color="white" />
                <span>4.8</span>
              </div>
              <span className="outlet-rating-total">500+ ratings</span>
            </div>
          </div>

          <div className="swiggy-outlet-divider" />

          {/* Delivery Info & Mode Bar */}
          <div className="swiggy-outlet-meta-row">
            <div className="meta-left">
              <div className="outlet-meta-item">
                <Clock size={16} color="#164324" />
                <span><strong>25-30 mins</strong> delivery time</span>
              </div>
              <span className="meta-sep">•</span>
              <div className="outlet-meta-item">
                <MapPin size={16} color="#d85d27" />
                <span>Rajarhat Chowmatha / Chinar Park (Kolkata)</span>
              </div>
              <span className="meta-sep">•</span>
              <div className="outlet-meta-item">
                <span><strong>₹200</strong> for two</span>
              </div>
            </div>

            {/* Quick Order Mode Toggle on Header */}
            <div className="swiggy-mode-switch-inline">
              <button
                className={`mode-tab ${orderMode === 'delivery' ? 'active-mode' : ''}`}
                onClick={() => setOrderMode('delivery')}
              >
                <Bike size={14} />
                <span>Delivery</span>
              </button>
              <button
                className={`mode-tab ${orderMode === 'takeaway' ? 'active-mode' : ''}`}
                onClick={() => setOrderMode('takeaway')}
              >
                <Store size={14} />
                <span>Takeaway</span>
              </button>
            </div>
          </div>

          {/* Location PIN Prompt if Delivery */}
          {orderMode === 'delivery' && (
            <div className="swiggy-pincode-strip">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={14} color="#164324" />
                <span>Delivering to Rajarhat PIN: <strong>{selectedPincode}</strong></span>
              </div>
              <button onClick={() => setIsLocationModalOpen(true)} className="swiggy-change-pin-btn">
                Change Area PIN
              </button>
            </div>
          )}
        </div>

        {/* 2. SWIGGY DEALS & OFFERS CAROUSEL STRIP */}
        <div className="swiggy-offers-strip">
          {/* Main 5-for-1 Loyalty Campaign Promo Card */}
          <div
            className="swiggy-offer-card campaign-promo-card"
            onClick={() => setActiveTab('campaign')}
            style={{ cursor: 'pointer', background: 'linear-gradient(135deg, #164324 0%, #1f5731 100%)', color: 'white', border: '2px solid #e5a024' }}
          >
            <div className="offer-icon-box" style={{ background: '#e5a024', color: '#164324' }}>
              <Gift size={20} color="#164324" />
            </div>
            <div>
              <div className="offer-code-tag" style={{ color: '#fde68a', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>🎁 5-FOR-1 LOYALTY PASS</span>
                <span style={{ fontSize: '0.68rem', background: '#e5a024', color: '#164324', padding: '1px 6px', borderRadius: 4, fontWeight: 800 }}>
                  {loyaltyStampsCount}/5 STAMPS
                </span>
              </div>
              <div className="offer-desc" style={{ color: '#e2e8f0' }}>
                Order 5 times (₹200+) & get 1 FREE dish below ₹200! <strong>Learn More →</strong>
              </div>
            </div>
          </div>

          <div className="swiggy-offer-card">
            <div className="offer-icon-box">
              <Percent size={18} color="#e5a024" />
            </div>
            <div>
              <div className="offer-code-tag">WELCOME50</div>
              <div className="offer-desc">50% OFF up to ₹100 on your order</div>
            </div>
          </div>

          <div className="swiggy-offer-card">
            <div className="offer-icon-box" style={{ background: '#ecfdf5', color: '#047857' }}>
              <Bike size={18} color="#047857" />
            </div>
            <div>
              <div className="offer-code-tag" style={{ color: '#047857' }}>FREE DELIVERY</div>
              <div className="offer-desc">Free doorstep delivery on orders over ₹199</div>
            </div>
          </div>

          <div className="swiggy-offer-card">
            <div className="offer-icon-box" style={{ background: '#fff7ed', color: '#c2410c' }}>
              <Tag size={18} color="#c2410c" />
            </div>
            <div>
              <div className="offer-code-tag" style={{ color: '#c2410c' }}>DESI50</div>
              <div className="offer-desc">Flat ₹50 OFF on orders above ₹349</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SWIGGY STICKY NAVIGATION & FILTER BAR */}
      <div className="swiggy-filter-sticky-bar">
        <div className="swiggy-filter-inner">
          {/* Search Input Box */}
          <div className="swiggy-search-box">
            <Search size={16} className="swiggy-search-icon" />
            <input
              type="text"
              placeholder="Search for combos, pulao, naan, paneer, kosha..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="swiggy-search-input"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="swiggy-search-clear" aria-label="Clear search">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Quick Dietary Filters (Veg, NonVeg, Bestseller) */}
          <div className="swiggy-diet-filters">
            <button
              className={`swiggy-diet-btn ${dietFilter === 'veg' ? 'active-veg' : ''}`}
              onClick={() => setDietFilter(prev => prev === 'veg' ? 'all' : 'veg')}
            >
              <div className="swiggy-veg-symbol veg mini">
                <div className="veg-indicator-dot" />
              </div>
              <span>Veg Only</span>
            </button>

            <button
              className={`swiggy-diet-btn ${dietFilter === 'nonveg' ? 'active-nonveg' : ''}`}
              onClick={() => setDietFilter(prev => prev === 'nonveg' ? 'all' : 'nonveg')}
            >
              <div className="swiggy-veg-symbol nonveg mini">
                <div className="veg-indicator-dot" />
              </div>
              <span>Non-Veg</span>
            </button>

            <button
              className={`swiggy-diet-btn ${dietFilter === 'special' ? 'active-special' : ''}`}
              onClick={() => setDietFilter(prev => prev === 'special' ? 'all' : 'special')}
            >
              <Sparkles size={14} color="#e5a024" />
              <span>Bestsellers</span>
            </button>
          </div>
        </div>

        {/* Category Horizontal Scrolling Tabs */}
        <div className="swiggy-category-tabs-scroll">
          <div className="swiggy-category-tabs-inner">
            <button
              className={`swiggy-category-tab ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              <span>All Dishes ({menuItems.length})</span>
            </button>

            {allCategories.filter(c => c.id !== 'all').map(cat => {
              const catCount = menuItems.filter(m => m.category === cat.id).length;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  className={`swiggy-category-tab ${isActive ? 'active' : ''}`}
                  onClick={() => scrollToCategory(cat.id)}
                >
                  <span>{cat.name} ({catCount})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. SWIGGY PRODUCT LISTING (ACCORDION & GROUPED SECTIONS - 100% IMAGE FREE) */}
      <main className="swiggy-menu-container">
        {groupedSections.length > 0 ? (
          groupedSections.map((section) => {
            const isCollapsed = collapsedCategories[section.id];
            return (
              <section
                key={section.id}
                id={`cat-section-${section.id}`}
                className="swiggy-category-section"
              >
                {/* Section Accordion Header */}
                <div
                  className="swiggy-section-header"
                  onClick={() => toggleCategoryCollapse(section.id)}
                >
                  <div className="section-title-wrap">
                    <h2 className="swiggy-section-title">
                      {section.name}
                    </h2>
                    <span className="swiggy-section-count">({section.items.length})</span>
                  </div>

                  <button className="swiggy-collapse-arrow" aria-label="Toggle section">
                    {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                  </button>
                </div>

                {/* Dish Items List in this Category */}
                {!isCollapsed && (
                  <div className="swiggy-dishes-list">
                    {section.items.map(item => (
                      <FoodCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </section>
            );
          })
        ) : (
          <div className="swiggy-no-results">
            <Utensils size={48} color="#cbd5e1" style={{ marginBottom: 12 }} />
            <h3>No dishes match your search or filter</h3>
            <p>Try searching for a different dish name or reset your filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setDietFilter('all');
                setActiveCategory('all');
              }}
              className="swiggy-reset-filter-btn"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      {/* 5. FLOATING "BROWSE MENU" QUICK JUMP BUTTON (Swiggy Style) */}
      <div className="swiggy-floating-menu-btn-wrap">
        <button
          onClick={() => setIsBrowseMenuOpen(true)}
          className="swiggy-browse-menu-fab"
        >
          <Utensils size={16} />
          <span>BROWSE MENU</span>
        </button>
      </div>

      {/* 6. BROWSE MENU CATEGORY JUMP MODAL / BOTTOM SHEET */}
      {isBrowseMenuOpen && (
        <div className="modal-overlay" onClick={() => setIsBrowseMenuOpen(false)}>
          <div className="modal-card swiggy-menu-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Layers size={20} color="#164324" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Explore Desi Eats Menu</h3>
              </div>
              <button onClick={() => setIsBrowseMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ padding: '12px 16px' }}>
              <div className="browse-menu-list">
                <button
                  onClick={() => scrollToCategory('all')}
                  className={`browse-menu-item ${activeCategory === 'all' ? 'active' : ''}`}
                >
                  <span style={{ fontWeight: 700 }}>🔥 All Dishes & Combos</span>
                  <span className="browse-count">{menuItems.length}</span>
                </button>

                {allCategories.filter(c => c.id !== 'all').map(cat => {
                  const count = menuItems.filter(m => m.category === cat.id).length;
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => scrollToCategory(cat.id)}
                      className={`browse-menu-item ${isActive ? 'active' : ''}`}
                    >
                      <span style={{ fontWeight: 600 }}>{cat.name}</span>
                      <span className="browse-count">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. FLOATING STICKY CART BAR (Swiggy Cart Strip) */}
      {cartItemCount > 0 && (
        <div className="swiggy-bottom-cart-bar">
          <div className="swiggy-cart-bar-inner" onClick={() => setIsCartOpen(true)}>
            <div className="cart-bar-left">
              <div className="cart-bar-count">
                <ShoppingBag size={18} />
                <span>{cartItemCount} {cartItemCount === 1 ? 'ITEM' : 'ITEMS'}</span>
              </div>
              <span className="cart-bar-divider">|</span>
              <div className="cart-bar-total">
                <span>₹{cartSubtotal}</span>
              </div>
            </div>

            <div className="cart-bar-right">
              <span>VIEW PLATE</span>
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      )}

      {/* 8. RESTAURANT STAFF & ADMIN ACCESS SECTION */}
      <div className="swiggy-staff-access-footer">
        <div className="staff-access-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="staff-icon-wrap">
              <Lock size={20} color="#164324" />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#164324' }}>
                Restaurant Staff & Kitchen Portal
              </h4>
              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#6b7280' }}>
                Live order ticketing, Kitchen screen, and Menu stock manager
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => requestProtectedView('admin')}
              className="staff-btn admin-btn"
            >
              <ChefHat size={15} color="#e5a024" />
              <span>Admin Portal</span>
            </button>

            <button
              onClick={() => requestProtectedView('kitchen')}
              className="staff-btn kitchen-btn"
            >
              <Smartphone size={15} />
              <span>Kitchen Screen</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

