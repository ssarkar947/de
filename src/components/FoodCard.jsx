import React from 'react';
import { useApp } from '../context/AppContext';
import { Star, Clock, Plus, Minus, Sparkles } from 'lucide-react';

export const FoodCard = ({ item }) => {
  const { cart, addToCart, updateCartQuantity } = useApp();

  // Check if item is currently in cart
  const cartItemsForThisDish = cart.filter(ci => ci.item.id === item.id);
  const totalQuantityInCart = cartItemsForThisDish.reduce((sum, ci) => sum + ci.quantity, 0);

  const handleAddClick = () => {
    addToCart(item, null, [], 1);
  };

  const handleIncrement = () => {
    if (cartItemsForThisDish.length > 0) {
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

  return (
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
          <span>₹{item.price}</span>
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
      </div>

      {/* Right Column: Action Buttons (ADD / Stepper) */}
      <div className="dish-action-col">
        {item.inStock ? (
          <div className="swiggy-btn-wrapper">
            {totalQuantityInCart > 0 ? (
              /* Stepper Counter - Direct +/- without any popups */
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
              /* Swiggy Direct 1-Click ADD Button */
              <button className="swiggy-add-btn" onClick={handleAddClick}>
                <span>ADD</span>
                <Plus size={14} className="add-plus-icon" />
              </button>
            )}
          </div>
        ) : (
          <div className="swiggy-sold-out-badge">
            <span>Sold Out</span>
          </div>
        )}
      </div>
    </div>
  );
};
