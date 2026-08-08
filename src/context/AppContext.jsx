import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_PINCODES } from '../data/initialPincodes';
import { INITIAL_MENU } from '../data/initialMenu';
import { INITIAL_COUPONS } from '../data/initialCoupons';
import {
  subscribeToCollection,
  saveFirestoreDoc,
  deleteFirestoreDoc,
  isFirebaseConnected
} from '../firebase';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Mode: 'delivery' or 'takeaway'
  const [orderMode, setOrderMode] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'takeaway') return 'takeaway';
    return localStorage.getItem('de_order_mode') || 'delivery';
  });

  // Pincode Management
  const [pincodes, setPincodes] = useState(() => {
    const saved = localStorage.getItem('de_pincodes');
    return saved ? JSON.parse(saved) : DEFAULT_PINCODES;
  });

  const [selectedPincode, setSelectedPincode] = useState(() => {
    return localStorage.getItem('de_selected_pincode') || '700135';
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Menu Management
  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem('de_menu');
    return saved ? JSON.parse(saved) : INITIAL_MENU;
  });

  // Coupons Management
  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem('de_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Cart / "My Plate" Management
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('de_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // View switch: 'customer' or 'admin'
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'admin' || window.location.hash === '#admin') return 'admin';
    return 'customer';
  });

  // Orders Management
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('de_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeOrderId, setActiveOrderId] = useState(() => {
    return localStorage.getItem('de_active_order_id') || null;
  });

  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Notification Toast message
  const [toastMessage, setToastMessage] = useState(null);

  // Firebase Real-time Firestore Subscribers
  useEffect(() => {
    // 1. Subscribe to Firebase Orders
    const unsubOrders = subscribeToCollection('orders', (fsOrders) => {
      if (fsOrders && fsOrders.length > 0) {
        setOrders(fsOrders);
      }
    });

    // 2. Subscribe to Firebase Menu
    const unsubMenu = subscribeToCollection('menu', (fsMenu) => {
      if (fsMenu && fsMenu.length > 0) {
        setMenuItems(fsMenu);
      }
    });

    // 3. Subscribe to Firebase Coupons
    const unsubCoupons = subscribeToCollection('coupons', (fsCoupons) => {
      if (fsCoupons && fsCoupons.length > 0) {
        setCoupons(fsCoupons);
      }
    });

    // 4. Subscribe to Firebase Pincodes
    const unsubPincodes = subscribeToCollection('pincodes', (fsPincodes) => {
      if (fsPincodes && fsPincodes.length > 0) {
        setPincodes(fsPincodes);
      }
    });

    return () => {
      unsubOrders();
      unsubMenu();
      unsubCoupons();
      unsubPincodes();
    };
  }, []);

  // BroadcastChannel for multi-tab real-time sync
  useEffect(() => {
    let channel;
    try {
      channel = new BroadcastChannel('desieats_sync_channel');
      channel.onmessage = (event) => {
        const { type, data } = event.data;
        if (type === 'NEW_ORDER') {
          setOrders(prev => [data, ...prev]);
          if (activeTab === 'admin') {
            showToast(`🔔 New Order #${data.id.slice(-4)} Received (${data.orderMode.toUpperCase()})!`);
            playAudioAlert();
          }
        } else if (type === 'UPDATE_ORDER_STATUS') {
          setOrders(prev => prev.map(o => o.id === data.id ? { ...o, ...data } : o));
          if (activeOrderId === data.id) {
            playAudioAlert();
            showToast(`⭐ Order #${data.id.slice(-4)} status updated: ${data.status.replace(/_/g, ' ').toUpperCase()}`);
          }
        } else if (type === 'UPDATE_PINCODES') {
          setPincodes(data);
        } else if (type === 'UPDATE_MENU') {
          setMenuItems(data);
        } else if (type === 'UPDATE_COUPONS') {
          setCoupons(data);
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported', e);
    }

    return () => {
      if (channel) channel.close();
    };
  }, [activeTab, activeOrderId]);

  // Persist State locally
  useEffect(() => {
    localStorage.setItem('de_order_mode', orderMode);
  }, [orderMode]);

  useEffect(() => {
    localStorage.setItem('de_pincodes', JSON.stringify(pincodes));
    broadcastSync('UPDATE_PINCODES', pincodes);
  }, [pincodes]);

  useEffect(() => {
    localStorage.setItem('de_selected_pincode', selectedPincode);
  }, [selectedPincode]);

  useEffect(() => {
    localStorage.setItem('de_menu', JSON.stringify(menuItems));
    broadcastSync('UPDATE_MENU', menuItems);
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('de_coupons', JSON.stringify(coupons));
    broadcastSync('UPDATE_COUPONS', coupons);
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('de_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('de_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (activeOrderId) {
      localStorage.setItem('de_active_order_id', activeOrderId);
    } else {
      localStorage.removeItem('de_active_order_id');
    }
  }, [activeOrderId]);

  const broadcastSync = (type, data) => {
    try {
      const channel = new BroadcastChannel('desieats_sync_channel');
      channel.postMessage({ type, data });
      channel.close();
    } catch (e) {}
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const playAudioAlert = () => {
    if (isAudioMuted) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.warn("Audio playback issue", e);
    }
  };

  // Serviceability Checker
  const checkServiceability = (pin) => {
    const found = pincodes.find(p => p.pincode === pin && p.active);
    return found || null;
  };

  // Cart / Plate Operations
  const addToCart = (item, selectedVariation = null, options = [], quantity = 1, note = '') => {
    setCart(prev => {
      const unitPrice = (selectedVariation ? selectedVariation.price : item.price) + options.reduce((s, o) => s + o.price, 0);
      const cartKey = `${item.id}-${selectedVariation ? selectedVariation.name : 'default'}-${JSON.stringify(options)}`;
      
      const existingIndex = prev.findIndex(ci => ci.cartKey === cartKey);

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, {
          cartId: `${item.id}-${Date.now()}`,
          cartKey,
          item,
          selectedVariation,
          quantity,
          options,
          unitPrice,
          note
        }];
      }
    });
    showToast(`Added ${item.name} to My Plate!`);
  };

  const updateCartQuantity = (cartId, delta) => {
    setCart(prev => prev.map(ci => {
      if (ci.cartId === cartId) {
        const newQty = ci.quantity + delta;
        return newQty > 0 ? { ...ci, quantity: newQty } : null;
      }
      return ci;
    }).filter(Boolean));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Coupon application logic
  const applyCouponCode = (codeStr) => {
    const code = codeStr.trim().toUpperCase();
    const found = coupons.find(c => c.code === code && c.active);
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    if (cartSubtotal < found.minOrder) {
      return { success: false, message: `Minimum order value for ${code} is ₹${found.minOrder}.` };
    }

    let discount = 0;
    if (found.type === 'percentage') {
      discount = Math.round((cartSubtotal * found.value) / 100);
      if (found.maxDiscount && discount > found.maxDiscount) {
        discount = found.maxDiscount;
      }
    } else {
      discount = found.value;
    }

    setAppliedCoupon({ ...found, discountAmount: discount });
    return { success: true, message: `🎉 Coupon ${code} applied! Saved ₹${discount}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const couponDiscount = appliedCoupon ? appliedCoupon.discountAmount : 0;

  // Place Order (Writes to Firestore Database + Local State)
  const placeOrder = (customerDetails) => {
    const deliveryFee = orderMode === 'delivery' ? 30 : 0;
    const grandTotal = Math.max(0, cartSubtotal + deliveryFee - couponDiscount);

    const newOrder = {
      id: `DE-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      orderMode,
      pincode: orderMode === 'delivery' ? selectedPincode : 'TAKEAWAY',
      customerName: customerDetails.name,
      customerPhone: customerDetails.phone,
      address: orderMode === 'delivery' ? customerDetails.address : `Counter / Spot #${customerDetails.tableNo || 'Takeaway'}`,
      paymentMethod: customerDetails.paymentMethod || 'cash',
      items: [...cart],
      subtotal: cartSubtotal,
      discount: couponDiscount,
      appliedCouponCode: appliedCoupon ? appliedCoupon.code : null,
      deliveryFee,
      totalAmount: grandTotal,
      status: 'RECEIVED',
      prepTimeMinutes: null,
      readyAtTime: null,
      instructions: customerDetails.instructions || '',
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrderId(newOrder.id);
    clearCart();
    setIsCartOpen(false);
    setIsOrderTrackerOpen(true);

    // Save to Firebase Firestore Database
    saveFirestoreDoc('orders', newOrder.id, newOrder);

    broadcastSync('NEW_ORDER', newOrder);
    playAudioAlert();
    showToast(`🎉 Order #${newOrder.id} placed successfully!`);
    return newOrder;
  };

  // Admin Order Actions (Syncs to Firestore Database)
  const updateOrderStatus = (orderId, newStatus, prepMinutes = null) => {
    let updatedObj = null;

    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updated = { ...order, status: newStatus };
        if (prepMinutes !== null) {
          updated.prepTimeMinutes = prepMinutes;
          const target = new Date();
          target.setMinutes(target.getMinutes() + parseInt(prepMinutes, 10));
          updated.readyAtTime = target.toISOString();
        }
        updatedObj = updated;
        broadcastSync('UPDATE_ORDER_STATUS', updated);
        return updated;
      }
      return order;
    }));

    if (updatedObj) {
      saveFirestoreDoc('orders', orderId, updatedObj);
    }

    showToast(`Order #${orderId.slice(-4)} status updated to ${newStatus}`);
  };

  // Menu Items Management (Syncs to Firestore Database)
  const saveMenuItem = (itemData) => {
    let targetItem = itemData;
    setMenuItems(prev => {
      const existingIdx = prev.findIndex(i => i.id === itemData.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = { ...itemData };
        return updated;
      } else {
        const newItem = {
          ...itemData,
          id: `de-${Date.now()}`,
          rating: 4.8,
          reviews: 1,
          inStock: true
        };
        targetItem = newItem;
        return [newItem, ...prev];
      }
    });

    saveFirestoreDoc('menu', targetItem.id, targetItem);
    showToast(`Saved Menu Item: ${targetItem.name}`);
  };

  const deleteMenuItem = (itemId) => {
    setMenuItems(prev => prev.filter(i => i.id !== itemId));
    deleteFirestoreDoc('menu', itemId);
    showToast('Menu item deleted');
  };

  const toggleItemStock = (itemId) => {
    let updatedItem = null;
    setMenuItems(prev => prev.map(item => {
      if (item.id === itemId) {
        updatedItem = { ...item, inStock: !item.inStock };
        return updatedItem;
      }
      return item;
    }));

    if (updatedItem) {
      saveFirestoreDoc('menu', itemId, updatedItem);
    }
  };

  // Coupon CRUD (Syncs to Firestore Database)
  const saveCoupon = (couponData) => {
    const formatted = { ...couponData, code: couponData.code.toUpperCase() };
    setCoupons(prev => {
      const existingIdx = prev.findIndex(c => c.code.toUpperCase() === formatted.code);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = formatted;
        return updated;
      } else {
        return [formatted, ...prev];
      }
    });

    saveFirestoreDoc('coupons', formatted.code, formatted);
    showToast(`Saved Coupon Code: ${formatted.code}`);
  };

  const toggleCouponStatus = (code) => {
    let updatedCoupon = null;
    setCoupons(prev => prev.map(c => {
      if (c.code === code) {
        updatedCoupon = { ...c, active: !c.active };
        return updatedCoupon;
      }
      return c;
    }));

    if (updatedCoupon) {
      saveFirestoreDoc('coupons', code, updatedCoupon);
    }
  };

  const deleteCoupon = (code) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
    deleteFirestoreDoc('coupons', code);
    showToast(`Deleted Coupon ${code}`);
  };

  // Pincode CRUD for Admin (Syncs to Firestore Database)
  const addPincode = (pincodeObj) => {
    const newPin = { ...pincodeObj, active: true };
    setPincodes(prev => [...prev, newPin]);
    saveFirestoreDoc('pincodes', newPin.pincode, newPin);
    showToast(`Added PIN Code ${pincodeObj.pincode}`);
  };

  const togglePincodeActive = (pincodeStr) => {
    let updatedPin = null;
    setPincodes(prev => prev.map(p => {
      if (p.pincode === pincodeStr) {
        updatedPin = { ...p, active: !p.active };
        return updatedPin;
      }
      return p;
    }));

    if (updatedPin) {
      saveFirestoreDoc('pincodes', pincodeStr, updatedPin);
    }
  };

  const removePincode = (pincodeStr) => {
    setPincodes(prev => prev.filter(p => p.pincode !== pincodeStr));
    deleteFirestoreDoc('pincodes', pincodeStr);
  };

  return (
    <AppContext.Provider value={{
      orderMode,
      setOrderMode,
      pincodes,
      selectedPincode,
      setSelectedPincode,
      checkServiceability,
      isLocationModalOpen,
      setIsLocationModalOpen,
      menuItems,
      saveMenuItem,
      deleteMenuItem,
      toggleItemStock,
      coupons,
      saveCoupon,
      toggleCouponStatus,
      deleteCoupon,
      appliedCoupon,
      applyCouponCode,
      removeCoupon,
      couponDiscount,
      cart,
      addToCart,
      updateCartQuantity,
      clearCart,
      cartSubtotal,
      cartItemCount,
      isCartOpen,
      setIsCartOpen,
      activeTab,
      setActiveTab,
      orders,
      activeOrderId,
      setActiveOrderId,
      isOrderTrackerOpen,
      setIsOrderTrackerOpen,
      isAudioMuted,
      setIsAudioMuted,
      placeOrder,
      updateOrderStatus,
      addPincode,
      togglePincodeActive,
      removePincode,
      toastMessage,
      showToast,
      isFirebaseConnected
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
