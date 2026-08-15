import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FoodCard } from './FoodCard';
import { HeroOrderSelector } from './HeroOrderSelector';
import { Search, Sparkles, Utensils, Flame, Sandwich, Soup, Wheat, Coffee, Heart, Leaf, Lock, ChefHat, Smartphone } from 'lucide-react';

const categoryIconMap = {
  Utensils, Sparkles, Flame, Sandwich, Soup, Wheat, Coffee, Heart, Leaf
};

export const MenuSection = () => {
  const { menuItems, categories, activeOrderId, setIsOrderTrackerOpen, orders, requestProtectedView } = useApp();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  const activeOrder = orders.find(o => o.id === activeOrderId && o.status !== 'COMPLETED' && o.status !== 'CANCELLED');

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVeg = !vegOnly || item.isVeg;
    return matchesCategory && matchesSearch && matchesVeg;
  });

  return (
    <main>
      {/* Hero Section matching User's Attached Screenshot Design */}
      <HeroOrderSelector />

      {/* Active Order Quick Tracker Bar (If Customer Has Active Order) */}
      {activeOrder && (
        <div style={{ background: '#fdfbf7', padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontWeight: 800, color: '#164324', fontSize: '0.9rem' }}>
                Active Order #{activeOrder.id} Status: <strong style={{ color: '#d85d27' }}>{activeOrder.status}</strong>
              </span>
            </div>

            <button
              onClick={() => setIsOrderTrackerOpen(true)}
              style={{
                background: '#164324',
                color: 'white',
                border: 'none',
                padding: '6px 16px',
                borderRadius: 20,
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Track Order Live
            </button>
          </div>
        </div>
      )}

      {/* Category Pills Bar */}
      <div className="category-nav">
        <div className="category-nav-inner">
          <div className="category-pills">
            {categories.map(cat => {
              const IconComp = categoryIconMap[cat.icon] || Utensils;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  className={`category-pill ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <IconComp size={16} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          <div className="filters-bar">
            {/* Search Input */}
            <div className="search-input-wrap">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search combos, pulao, naan, paneer..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Veg Filter */}
            <button
              className={`filter-btn ${vegOnly ? 'active veg' : ''}`}
              onClick={() => setVegOnly(!vegOnly)}
            >
              <div className="veg-nonveg-badge" style={{ position: 'static', width: 16, height: 16 }}>
                <div className="veg-dot" style={{ width: 6, height: 6 }} />
              </div>
              <span>Veg Only</span>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Grid Container */}
      <div className="menu-container">
        <h2 className="section-title">
          {activeCategory === 'all' && '🔥 All Combos & Platters (₹199 Flat)'}
          {activeCategory === 'non-veg-combos' && '🍗 Non-Veg Combos (₹199 Flat)'}
          {activeCategory === 'veg-combos' && '🧀 Veg Combos (₹199 Flat)'}
          {activeCategory === 'healthy-combos' && '🥗 Healthy Combos (₹199 Flat)'}
          {!['all', 'non-veg-combos', 'veg-combos', 'healthy-combos'].includes(activeCategory) && `${categories.find(c => c.id === activeCategory)?.name || 'Menu Items'} (₹199 Flat)`}
          <span style={{ fontSize: '1rem', color: '#9ca3af', fontWeight: '400', marginLeft: 8 }}>({filteredItems.length} items)</span>
        </h2>

        {filteredItems.length > 0 ? (
          <div className="menu-grid">
            {filteredItems.map(item => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
            <Utensils size={48} color="#cbd5e1" style={{ marginBottom: 12 }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>No items match your filter</h3>
            <p style={{ fontSize: '0.9rem' }}>Try clearing your search query or changing category.</p>
          </div>
        )}
      </div>

      {/* Staff & Admin Backend Access Section at Footer of Menu */}
      <div style={{ maxWidth: 1280, margin: '20px auto 40px', padding: '0 20px' }}>
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          border: '1px solid #e5e7eb',
          padding: '20px 24px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(22, 67, 36, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={22} color="#164324" />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#164324', fontFamily: 'var(--font-brand)' }}>
                Restaurant Staff & Admin Access
              </h4>
              <p style={{ margin: '3px 0 0 0', fontSize: '0.82rem', color: '#6b7280' }}>
                Backend controls for live orders, KOT printing, kitchen screen & menu editing
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => requestProtectedView('admin')}
              style={{
                background: '#164324',
                color: 'white',
                border: 'none',
                padding: '10px 18px',
                borderRadius: 10,
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <ChefHat size={16} color="#e5a024" />
              <span>Admin Login</span>
            </button>

            <button
              onClick={() => requestProtectedView('kitchen')}
              style={{
                background: '#fef3c7',
                color: '#b45309',
                border: '1px solid #fde68a',
                padding: '10px 16px',
                borderRadius: 10,
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Smartphone size={16} />
              <span>Kitchen Screen</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
