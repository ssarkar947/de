import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, Clock, Plus, Minus, Sparkles, Check, ChevronRight } from 'lucide-react';

export const FoodCard = ({ item }) => {
  const { cart, addToCart, updateCartQuantity } = useApp();
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState(
    item.variations && item.variations.length > 0 ? item.variations[0] : null
  );
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [quantity, setQuantity] = useState(1);

  // Check if item is currently in cart
  const cartItemsForThisDish = cart.filter(ci => ci.item.id === item.id);
  const totalQuantityInCart = cartItemsForThisDish.reduce((sum, ci) => sum + ci.quantity, 0);

  const hasCustomizations = (item.variations && item.variations.length > 0) || (item.options && item.options.length > 0);

  const toggleOption = (opt) => {
    if (selectedOptions.some(o => o.name === opt.name)) {
      setSelectedOptions(prev => prev.filter(o => o.name !== opt.name));
    } else {
      setSelectedOptions(prev => [...prev, opt]);
    }
  };

  const handleAddClick = () => {
    if (hasCustomizations) {
      setIsCustomizing(true);
    } else {
      addToCart(item, null, [], 1);
    }
  };

  const handleIncrement = () => {
    if (hasCustomizations) {
      setIsCustomizing(true);
    } else if (cartItemsForThisDish.length > 0) {
      updateCartQuantity(cartItemsForThisDish[0].cartId, 1);
    } else {
      addToCart(item, null, [], 1);
    }
  };

  const handleDecrement = () => {
    if (cartItemsForThisDish.length > 0) {
      updateCartQuantity(cartItemsForThisDish[cartItemsForThisDish.length - 1].cartId, -1);
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
      <div className={`swiggy-dish-item ${!item.inStock ? 'out-of-stock' : ''}`}>
        {/* Left Column: Veg/NonVeg Icon, Badges, Name, Price, Rating & Description */}
        <div className="dish-info-col">
          {/* Veg/Non-Veg Indicator & Bestseller Tag */}
          <div className="dish-meta-row">
            <div className={`swiggy-veg-symbol ${item.isVeg ? 'veg' : 'nonveg'}`} title={item.isVeg ? 'Veg' : 'Non-Veg'}>
              <div className="veg-indicator-dot" />
            </div>

            {item.isSpecial && (
              <span className="swiggy-bestseller-badge">
                <Sparkles size={11} />
                <span>Bestseller</span>
              </span>
            )}
          </div>

          {/* Dish Name */}
          <h3 className="swiggy-dish-name">{item.name}</h3>

          {/* Price */}
          <div className="swiggy-dish-price">
            {item.variations && item.variations.length > 0 ? (
              <span>From ₹{item.variations[0].price}</span>
            ) : (
              <span>₹{item.price}</span>
            )}
          </div>

          {/* Rating & Prep Time */}
          <div className="swiggy-dish-rating-row">
            <div className="swiggy-rating-pill">
              <Star size={12} fill="#15803d" color="#15803d" />
              <span>{item.rating || '4.8'}</span>
              <span className="swiggy-rating-count">({item.reviews || 120})</span>
            </div>
            <span className="rating-dot-separator">•</span>
            <div className="swiggy-time-pill">
              <Clock size={12} />
              <span>{item.prepTime || '15 mins'}</span>
            </div>
          </div>

          {/* Rich Description (Detailed, Image-Free) */}
          <p className="swiggy-dish-desc">{item.description}</p>

          {/* Customisable indicator tag */}
          {hasCustomizations && (
            <div className="swiggy-custom-tag">
              <span>Customisable portion & add-ons</span>
            </div>
          )}
        </div>

        {/* Right Column: Action Buttons (ADD / Stepper) */}
        <div className="dish-action-col">
          {item.inStock ? (
            <div className="swiggy-btn-wrapper">
              {totalQuantityInCart > 0 && !hasCustomizations ? (
                /* Stepper Counter */
                <div className="swiggy-stepper-btn">
                  <button onClick={handleDecrement} className="stepper-sub-btn" aria-label="Decrease quantity">
                    <Minus size={14} />
                  </button>
                  <span className="stepper-count">{totalQuantityInCart}</span>
                  <button onClick={handleIncrement} className="stepper-add-btn" aria-label="Increase quantity">
                    <Plus size={14} />
                  </button>
                </div>
              ) : (
                /* Swiggy ADD Button */
                <button className="swiggy-add-btn" onClick={handleAddClick}>
                  <span>ADD</span>
                  <Plus size={14} className="add-plus-icon" />
                </button>
              )}

              {hasCustomizations && (
                <span className="swiggy-custom-label">Customisable</span>
              )}
            </div>
          ) : (
            <div className="swiggy-sold-out-badge">
              <span>Sold Out</span>
            </div>
          )}
        </div>
      </div>

      {/* Swiggy Customization Bottom Sheet / Modal */}
      {isCustomizing && (
        <div className="modal-overlay" onClick={() => setIsCustomizing(false)}>
          <div className="modal-card swiggy-customize-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div className={`swiggy-veg-symbol ${item.isVeg ? 'veg' : 'nonveg'}`} style={{ width: 14, height: 14 }}>
                    <div className="veg-indicator-dot" style={{ width: 6, height: 6 }} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1f2937' }}>{item.name}</h3>
                </div>
                <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Customize your portion size & add-ons</span>
              </div>
            </div>

            <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
              {/* Portion Variations (Half / Full) */}
              {item.variations && item.variations.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#164324' }}>
                      Choose Portion Size
                    </h4>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#d85d27', background: '#fff7ed', padding: '2px 8px', borderRadius: 6 }}>
                      REQUIRED
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {item.variations.map((varOpt, idx) => {
                      const isSelected = selectedVariation && selectedVariation.name === varOpt.name;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedVariation(varOpt)}
                          className={`swiggy-radio-row ${isSelected ? 'selected' : ''}`}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div className={`swiggy-radio-dot ${isSelected ? 'active' : ''}`}>
                              {isSelected && <div className="dot-inner" />}
                            </div>
                            <span style={{ fontWeight: 600, color: '#1f2937', fontSize: '0.92rem' }}>{varOpt.name}</span>
                          </div>
                          <span style={{ fontWeight: 800, color: '#164324' }}>₹{varOpt.price}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add-ons / Options */}
              {item.options && item.options.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#164324' }}>
                      Extra Add-ons & Sides
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>OPTIONAL</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {item.options.map((opt, idx) => {
                      const isSelected = selectedOptions.some(o => o.name === opt.name);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleOption(opt)}
                          className={`swiggy-checkbox-row ${isSelected ? 'selected' : ''}`}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div className={`swiggy-check-box ${isSelected ? 'active' : ''}`}>
                              {isSelected && <Check size={13} color="white" />}
                            </div>
                            <span style={{ fontWeight: 500, color: '#1f2937', fontSize: '0.9rem' }}>{opt.name}</span>
                          </div>
                          {opt.price > 0 && <span style={{ fontWeight: 700, color: '#d85d27' }}>+₹{opt.price}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Footer with Quantity & Add Button */}
              <div className="swiggy-customize-footer">
                <div className="swiggy-qty-controls">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="qty-btn"
                  >
                    -
                  </button>
                  <span className="qty-val">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => q + 1)}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmCustomize}
                  className="swiggy-confirm-add-btn"
                >
                  <span>Add Item to Plate • ₹{(basePrice + optionsTotal) * quantity}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

