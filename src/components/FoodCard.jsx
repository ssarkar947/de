import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, Clock, Plus, Sparkles, Check, ChevronDown } from 'lucide-react';

export const FoodCard = ({ item }) => {
  const { addToCart } = useApp();
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState(
    item.variations && item.variations.length > 0 ? item.variations[0] : null
  );
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const toggleOption = (opt) => {
    if (selectedOptions.some(o => o.name === opt.name)) {
      setSelectedOptions(prev => prev.filter(o => o.name !== opt.name));
    } else {
      setSelectedOptions(prev => [...prev, opt]);
    }
  };

  const handleAdd = () => {
    if ((item.variations && item.variations.length > 0) || (item.options && item.options.length > 0)) {
      setIsCustomizing(true);
    } else {
      addToCart(item, null, [], 1);
    }
  };

  const handleConfirmCustomize = () => {
    addToCart(item, selectedVariation, selectedOptions, quantity);
    setIsCustomizing(false);
    setSelectedOptions([]);
    setQuantity(1);
  };

  const basePrice = selectedVariation ? selectedVariation.price : item.price;
  const optionsTotal = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);

  return (
    <>
      <div className={`food-card ${!item.inStock ? 'out-of-stock' : ''}`}>
        <div className="card-img-wrap">
          <img src={item.image} alt={item.name} className="food-img" loading="lazy" />
          
          {item.isSpecial && (
            <div className="food-badge-tag badge-special">
              <Sparkles size={12} />
              <span>Desi Special</span>
            </div>
          )}

          <div className={`veg-nonveg-badge ${!item.isVeg ? 'nonveg' : ''}`} title={item.isVeg ? 'Pure Veg' : 'Non-Veg'}>
            <div className="veg-dot" />
          </div>
        </div>

        <div className="card-content">
          <div className="card-header">
            <h3 className="food-title">{item.name}</h3>
            <span className="food-price">
              {item.variations && item.variations.length > 0 ? `From ₹${item.variations[0].price}` : `₹${item.price}`}
            </span>
          </div>

          <p className="food-desc">{item.description}</p>

          <div className="card-footer">
            <div className="prep-info">
              <Star size={14} color="#f59e0b" fill="#f59e0b" />
              <span style={{ fontWeight: 700, color: '#374151' }}>{item.rating}</span>
              <span style={{ color: '#9ca3af', margin: '0 4px' }}>•</span>
              <Clock size={14} color="#6b7280" />
              <span>{item.prepTime}</span>
            </div>

            {item.inStock ? (
              <button className="add-btn" onClick={handleAdd}>
                <Plus size={16} />
                <span>{item.variations && item.variations.length > 0 ? 'CUSTOMIZE' : 'ADD'}</span>
              </button>
            ) : (
              <span className="add-btn out-of-stock-btn">Sold Out</span>
            )}
          </div>
        </div>
      </div>

      {/* Customization Modal */}
      {isCustomizing && (
        <div className="modal-overlay" onClick={() => setIsCustomizing(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>{item.name}</h3>
                <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Select portion size & extra add-ons</span>
              </div>
            </div>

            <div className="modal-body">
              {/* Portion Variations (Half / Full) */}
              {item.variations && item.variations.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1b4332', marginBottom: 10 }}>
                    1. Select Portion Size / Variant:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {item.variations.map((varOpt, idx) => {
                      const isSelected = selectedVariation && selectedVariation.name === varOpt.name;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedVariation(varOpt)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            borderRadius: '10px',
                            border: isSelected ? '2px solid #1b4332' : '1px solid #e5e7eb',
                            background: isSelected ? '#f0fdf4' : 'white',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                              width: 18,
                              height: 18,
                              borderRadius: '50%',
                              border: isSelected ? 'none' : '2px solid #9ca3af',
                              background: isSelected ? '#1b4332' : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              {isSelected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
                            </div>
                            <span style={{ fontWeight: 700, color: '#1f2937', fontSize: '0.9rem' }}>{varOpt.name}</span>
                          </div>
                          <span style={{ fontWeight: 800, color: '#1b4332' }}>₹{varOpt.price}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add-ons / Options */}
              {item.options && item.options.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1b4332', marginBottom: 10 }}>
                    2. Optional Add-ons & Extra Prep:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {item.options.map((opt, idx) => {
                      const isSelected = selectedOptions.some(o => o.name === opt.name);
                      return (
                        <button
                          key={idx}
                          onClick={() => toggleOption(opt)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            border: isSelected ? '2px solid #e5a024' : '1px solid #e5e7eb',
                            background: isSelected ? '#fefce8' : 'white',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                              width: 18,
                              height: 18,
                              borderRadius: 4,
                              border: isSelected ? 'none' : '2px solid #9ca3af',
                              background: isSelected ? '#e5a024' : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              {isSelected && <Check size={14} color="white" />}
                            </div>
                            <span style={{ fontWeight: 600, color: '#1f2937', fontSize: '0.88rem' }}>{opt.name}</span>
                          </div>
                          {opt.price > 0 && <span style={{ fontWeight: 700, color: '#d85d27' }}>+₹{opt.price}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 800, cursor: 'pointer' }}
                  >
                    -
                  </button>
                  <span style={{ fontWeight: 800, fontSize: '1rem' }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 800, cursor: 'pointer' }}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleConfirmCustomize}
                  style={{
                    background: '#1b4332',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '30px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <span>Add to Plate • ₹{(basePrice + optionsTotal) * quantity}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
