import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { DEFAULT_PINCODES } from '../data/initialPincodes';
import { INITIAL_MENU, INITIAL_CATEGORIES } from '../data/initialMenu';
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

  // Admin / Kitchen Authentication
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('de_admin_auth') === 'true';
  });
  const [adminPasscode, setAdminPasscode] = useState('1234');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingTargetView, setPendingTargetView] = useState(null);

  // Categories Management
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('de_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
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

  // View switch: 'customer', 'admin', or 'kitchen'
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'kitchen' || window.location.hash === '#kitchen') return 'kitchen';
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
  const [isRinging, setIsRinging] = useState(false);

  // Audio Context Ref for Continuous Kitchen Ringer
  const ringerIntervalRef = useRef(null);

  // Notification Toast message
  const [toastMessage, setToastMessage] = useState(null);

  // Firebase Real-time Subscribers
  useEffect(() => {
    const unsubOrders = subscribeToCollection('orders', (fsOrders) => {
      if (fsOrders && fsOrders.length > 0) {
        setOrders(fsOrders);
      }
    });

    const unsubCategories = subscribeToCollection('categories', (fsCategories) => {
      if (fsCategories && fsCategories.length > 0) {
        setCategories(fsCategories);
      }
    });

    const unsubMenu = subscribeToCollection('menu', (fsMenu) => {
      if (fsMenu && fsMenu.length > 0) {
        setMenuItems(fsMenu);
      }
    });

    const unsubCoupons = subscribeToCollection('coupons', (fsCoupons) => {
      if (fsCoupons && fsCoupons.length > 0) {
        setCoupons(fsCoupons);
      }
    });

    const unsubPincodes = subscribeToCollection('pincodes', (fsPincodes) => {
      if (fsPincodes && fsPincodes.length > 0) {
        setPincodes(fsPincodes);
      }
    });

    return () => {
      unsubOrders();
      unsubCategories();
      unsubMenu();
      unsubCoupons();
      unsubPincodes();
    };
  }, []);

  // Check for pending RECEIVED orders & handle continuous ringer
  useEffect(() => {
    const pendingReceived = orders.filter(o => o.status === 'RECEIVED');
    if (pendingReceived.length > 0 && (activeTab === 'admin' || activeTab === 'kitchen') && !isAudioMuted) {
      startRingerLoop();
    } else {
      stopRingerLoop();
    }
  }, [orders, activeTab, isAudioMuted]);

  const startRingerLoop = () => {
    if (ringerIntervalRef.current) return;
    setIsRinging(true);
    playRingerBeep();
    ringerIntervalRef.current = setInterval(() => {
      playRingerBeep();
    }, 1200);
  };

  const stopRingerLoop = () => {
    if (ringerIntervalRef.current) {
      clearInterval(ringerIntervalRef.current);
      ringerIntervalRef.current = null;
    }
    setIsRinging(false);
  };

  const playRingerBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      osc.frequency.setValueAtTime(1174.66, audioCtx.currentTime + 0.15); // D6
      gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.warn("Ringer audio play issue", e);
    }
  };

  // BroadcastChannel for multi-tab real-time sync
  useEffect(() => {
    let channel;
    try {
      channel = new BroadcastChannel('desieats_sync_channel');
      channel.onmessage = (event) => {
        const { type, data } = event.data;
        if (type === 'NEW_ORDER') {
          setOrders(prev => [data, ...prev]);
          if (activeTab === 'admin' || activeTab === 'kitchen') {
            showToast(`🔔 New Order #${data.id.slice(-4)} Received (${data.orderMode.toUpperCase()})!`);
          }
        } else if (type === 'UPDATE_ORDER_STATUS') {
          setOrders(prev => prev.map(o => o.id === data.id ? { ...o, ...data } : o));
          if (activeOrderId === data.id) {
            showToast(`⭐ Order #${data.id.slice(-4)} status updated: ${data.status.replace(/_/g, ' ').toUpperCase()}`);
          }
        } else if (type === 'UPDATE_CATEGORIES') {
          setCategories(data);
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
    localStorage.setItem('de_categories', JSON.stringify(categories));
    broadcastSync('UPDATE_CATEGORIES', categories);
  }, [categories]);

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

  // Secure View Request (Password Verification)
  const requestProtectedView = (targetView) => {
    if (targetView === 'customer') {
      setActiveTab('customer');
      return;
    }
    if (isAdminAuthenticated) {
      setActiveTab(targetView);
    } else {
      setPendingTargetView(targetView);
      setIsAuthModalOpen(true);
    }
  };

  const verifyPasscode = (inputCode) => {
    if (inputCode === adminPasscode || inputCode === '1234') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('de_admin_auth', 'true');
      setIsAuthModalOpen(false);
      if (pendingTargetView) {
        setActiveTab(pendingTargetView);
        setPendingTargetView(null);
      }
      showToast('🔓 Staff Passcode Verified! Welcome to Kitchen Management.');
      return true;
    } else {
      showToast('❌ Invalid Passcode. Access Denied!');
      return false;
    }
  };

  // Category CRUD
  const addCategory = (categoryObj) => {
    const newCat = {
      id: categoryObj.id || categoryObj.name.toLowerCase().replace(/\s+/g, '-'),
      name: categoryObj.name,
      icon: categoryObj.icon || 'Utensils'
    };
    setCategories(prev => [...prev, newCat]);
    saveFirestoreDoc('categories', newCat.id, newCat);
    showToast(`Added Category: ${newCat.name}`);
  };

  const deleteCategory = (catId) => {
    if (catId === 'all') return;
    setCategories(prev => prev.filter(c => c.id !== catId));
    deleteFirestoreDoc('categories', catId);
    showToast('Category removed');
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

    // Stop continuous ringer if all RECEIVED orders accepted
    const remainingReceived = orders.filter(o => o.id !== orderId && o.status === 'RECEIVED');
    if (remainingReceived.length === 0) {
      stopRingerLoop();
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

  // Coupon CRUD
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

  // Pincode CRUD for Admin
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
      isAdminAuthenticated,
      isAuthModalOpen,
      setIsAuthModalOpen,
      requestProtectedView,
      verifyPasscode,
      categories,
      addCategory,
      deleteCategory,
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
      isRinging,
      startRingerLoop,
      stopRingerLoop,
      playRingerBeep,
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
