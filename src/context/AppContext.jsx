import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { DEFAULT_PINCODES } from '../data/initialPincodes';
import { INITIAL_MENU, INITIAL_CATEGORIES } from '../data/initialMenu';
import { INITIAL_COUPONS } from '../data/initialCoupons';
import {
  subscribeToCollection,
  saveFirestoreDoc,
  getFirestoreDoc,
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
  const [adminPasscode, setAdminPasscode] = useState('desieats2026');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingTargetView, setPendingTargetView] = useState(null);

  const MENU_SCHEMA_VERSION = 'v8_full_57_dishes_clean';

  // Categories Management
  const [categories, setCategories] = useState(() => {
    const savedVersion = localStorage.getItem('de_menu_version');
    if (savedVersion !== MENU_SCHEMA_VERSION) {
      localStorage.setItem('de_menu_version', MENU_SCHEMA_VERSION);
      localStorage.setItem('de_categories', JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
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
    const savedVersion = localStorage.getItem('de_menu_version');
    if (savedVersion !== MENU_SCHEMA_VERSION) {
      localStorage.setItem('de_menu_version', MENU_SCHEMA_VERSION);
      localStorage.setItem('de_menu', JSON.stringify(INITIAL_MENU));
      return INITIAL_MENU;
    }
    const saved = localStorage.getItem('de_menu');
    return saved ? JSON.parse(saved) : INITIAL_MENU;
  });

  // Coupons Management
  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem('de_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // User Profile & Customer State
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('de_user_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthProfileModalOpen, setIsAuthProfileModalOpen] = useState(false);

  // Free Dish Loyalty Reward Applied in Cart
  const [isFreeDishRewardApplied, setIsFreeDishRewardApplied] = useState(false);

  // Cart / "My Plate" Management
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('de_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // View switch: 'customer', 'admin', 'kitchen', 'profile', or 'campaign'
  const [activeTab, setActiveTabState] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash.toLowerCase();
    if (params.get('view') === 'kitchen' || hash === '#kitchen') return 'kitchen';
    if (params.get('view') === 'admin' || hash === '#admin') return 'admin';
    if (params.get('view') === 'profile' || hash === '#profile') return 'profile';
    if (params.get('view') === 'campaign' || hash === '#campaign' || hash === '#rewards' || hash === '#offer') return 'campaign';
    return 'customer';
  });

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      if (tab === 'customer') {
        if (window.location.hash) {
          window.history.pushState(null, '', window.location.pathname + window.location.search);
        }
      } else {
        window.history.pushState(null, '', '#' + tab);
      }
    } catch (e) {
      console.warn('History update error:', e);
    }
  };

  // Sync with browser back / forward buttons (hashchange event)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#kitchen') setActiveTabState('kitchen');
      else if (hash === '#admin') setActiveTabState('admin');
      else if (hash === '#profile') setActiveTabState('profile');
      else if (hash === '#campaign' || hash === '#rewards' || hash === '#offer') setActiveTabState('campaign');
      else setActiveTabState('customer');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Active Order Tracker State
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('de_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeOrderId, setActiveOrderId] = useState(() => {
    return localStorage.getItem('de_active_order_id') || null;
  });
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);

  // Notification Sound & Audio Chime
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const audioContextRef = useRef(null);
  const ringerIntervalRef = useRef(null);

  // Notification Toast message
  const [toastMessage, setToastMessage] = useState(null);

  // Customer Profile Management Methods
  const loginCustomer = async (profileData) => {
    const cleanPhone = (profileData.phone || '').replace(/\D/g, '');
    let existingData = null;

    if (cleanPhone) {
      existingData = await getFirestoreDoc('users', cleanPhone);
    }

    const profile = {
      name: profileData.name || existingData?.name || 'Desi Foodie',
      phone: cleanPhone,
      email: profileData.email || existingData?.email || '',
      address: profileData.address || existingData?.address || '',
      pincode: profileData.pincode || existingData?.pincode || selectedPincode || '700135',
      claimedRewardsCount: existingData?.claimedRewardsCount ?? profileData.claimedRewardsCount ?? Number(localStorage.getItem('de_claimed_rewards') || 0),
      joinedAt: existingData?.joinedAt || profileData.joinedAt || new Date().toISOString()
    };

    setUserProfile(profile);
    localStorage.setItem('de_user_profile', JSON.stringify(profile));
    if (profile.phone) {
      localStorage.setItem('de_saved_phone', profile.phone);
      saveFirestoreDoc('users', profile.phone, profile);
    }
    showToast(`Welcome, ${profile.name}! 🍛 Profile activated.`);
  };

  const updateCustomerProfile = (updatedData) => {
    setUserProfile(prev => {
      const merged = { ...prev, ...updatedData };
      localStorage.setItem('de_user_profile', JSON.stringify(merged));
      if (merged.phone) {
        localStorage.setItem('de_saved_phone', merged.phone);
        saveFirestoreDoc('users', merged.phone, merged);
      }
      return merged;
    });
    showToast('Profile updated successfully!');
  };

  const logoutCustomer = () => {
    setUserProfile(null);
    localStorage.removeItem('de_user_profile');
    localStorage.removeItem('de_saved_phone');
    setIsFreeDishRewardApplied(false);
    showToast('Logged out of customer profile');
  };

  // Loyalty Campaign Calculations: Profile is REQUIRED first, then each order >= ₹200 gives +1 stamp
  const activeCustomerPhone = userProfile?.phone || '';
  const customerOrders = activeCustomerPhone ? orders.filter(o => o.customerPhone === activeCustomerPhone) : [];
  const qualifyingOrders = customerOrders.filter(o => Number(o.totalAmount || o.subtotal || 0) >= 200);
  const loyaltyStampsCount = userProfile ? (qualifyingOrders.length % 5) : 0;
  const totalEarnedFreeDishes = userProfile ? Math.floor(qualifyingOrders.length / 5) : 0;
  const claimedFreeDishes = userProfile?.claimedRewardsCount ?? Number(localStorage.getItem('de_claimed_rewards') || 0);
  const unlockedFreeDishes = userProfile ? Math.max(0, totalEarnedFreeDishes - claimedFreeDishes) : 0;

  // Free Dish Reward Discount Calculation in Cart
  // Applies 100% free price on the highest priced eligible item in cart with price < 200 (up to ₹199)
  const eligibleFreeDishItem = isFreeDishRewardApplied && unlockedFreeDishes > 0
    ? cart.find(ci => ci.unitPrice < 200) || null
    : null;
  const freeDishRewardDiscount = eligibleFreeDishItem ? eligibleFreeDishItem.unitPrice : 0;

  const applyFreeDishReward = () => {
    if (unlockedFreeDishes <= 0) {
      showToast('No free dish rewards available yet! Complete 5 orders of ₹200+');
      return false;
    }
    const hasEligibleItem = cart.some(ci => ci.unitPrice < 200);
    if (!hasEligibleItem) {
      showToast('Add any dish or combo under ₹200 to your plate to apply your free reward!');
      return false;
    }
    setIsFreeDishRewardApplied(true);
    showToast('🎉 Free Dish Reward applied to your plate!');
    return true;
  };

  const removeFreeDishReward = () => {
    setIsFreeDishRewardApplied(false);
  };

  // Firebase Real-time Subscribers
  useEffect(() => {
    const unsubOrders = subscribeToCollection('orders', (fsOrders) => {
      if (fsOrders && fsOrders.length > 0) {
        setOrders(fsOrders);
      }
    });

    const unsubCategories = subscribeToCollection('categories', (fsCategories) => {
      if (fsCategories && fsCategories.length >= INITIAL_CATEGORIES.length) {
        setCategories(fsCategories);
      } else {
        setCategories(INITIAL_CATEGORIES);
        INITIAL_CATEGORIES.forEach(c => saveFirestoreDoc('categories', c.id, c));
      }
    });

    const unsubMenu = subscribeToCollection('menu', (fsMenu) => {
      if (fsMenu && fsMenu.length > 0) {
        // Clean out any stale old menu items with old ID format from Firestore
        fsMenu.forEach(item => {
          if (item.id && (item.id.startsWith('de-nv-') || item.id.startsWith('de-v-') || item.id.startsWith('de-h-'))) {
            deleteFirestoreDoc('menu', item.id);
          }
        });
        const validFsMenu = fsMenu.filter(item => item.id && !item.id.startsWith('de-nv-') && !item.id.startsWith('de-v-') && !item.id.startsWith('de-h-'));

        const menuMap = new Map();
        INITIAL_MENU.forEach(item => menuMap.set(item.id, item));
        validFsMenu.forEach(item => menuMap.set(item.id, item));
        const mergedMenu = Array.from(menuMap.values());
        setMenuItems(mergedMenu);
        localStorage.setItem('de_menu', JSON.stringify(mergedMenu));
      } else {
        setMenuItems(INITIAL_MENU);
        INITIAL_MENU.forEach(item => saveFirestoreDoc('menu', item.id, item));
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
    if (inputCode && inputCode.trim() === adminPasscode) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('de_admin_auth', 'true');
      setIsAuthModalOpen(false);
      if (pendingTargetView) {
        setActiveTab(pendingTargetView);
        setPendingTargetView(null);
      }
      showToast('🔓 Admin Verified! Welcome to Backend Dashboard.');
      return true;
    } else {
      showToast('❌ Invalid Password. Access Denied!');
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
    setIsFreeDishRewardApplied(false);
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

  // Place Order (Writes to Firestore Database + Local State + Loyalty Campaign Auto-Save)
  const placeOrder = (customerDetails) => {
    const deliveryFee = orderMode === 'delivery' ? 30 : 0;
    const totalDiscount = couponDiscount + freeDishRewardDiscount;
    const grandTotal = Math.max(0, cartSubtotal + deliveryFee - totalDiscount);

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
      discount: totalDiscount,
      appliedCouponCode: appliedCoupon ? appliedCoupon.code : null,
      freeDishRewardUsed: isFreeDishRewardApplied,
      deliveryFee,
      totalAmount: grandTotal,
      status: 'RECEIVED',
      prepTimeMinutes: null,
      readyAtTime: null,
      instructions: customerDetails.instructions || '',
    };

    // Auto-update customer profile / saved details for next time & stamp tracking
    if (customerDetails.phone) {
      localStorage.setItem('de_saved_phone', customerDetails.phone);
      const newClaimedCount = (userProfile?.claimedRewardsCount || Number(localStorage.getItem('de_claimed_rewards') || 0)) + (isFreeDishRewardApplied ? 1 : 0);
      if (isFreeDishRewardApplied) {
        localStorage.setItem('de_claimed_rewards', newClaimedCount.toString());
      }
      const updatedProf = {
        name: customerDetails.name || userProfile?.name || 'Desi Foodie',
        phone: customerDetails.phone,
        email: customerDetails.email || userProfile?.email || '',
        address: customerDetails.address || userProfile?.address || '',
        pincode: selectedPincode || '700135',
        claimedRewardsCount: newClaimedCount,
        joinedAt: userProfile?.joinedAt || new Date().toISOString()
      };
      setUserProfile(updatedProf);
      localStorage.setItem('de_user_profile', JSON.stringify(updatedProf));
      saveFirestoreDoc('users', customerDetails.phone, updatedProf);
    }

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrderId(newOrder.id);
    clearCart();
    setIsCartOpen(false);
    setIsOrderTrackerOpen(true);
    setIsFreeDishRewardApplied(false);

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

  // Delete / Clear Orders (Clean up demo or completed orders)
  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    if (activeOrderId === orderId) {
      setActiveOrderId(null);
    }
    deleteFirestoreDoc('orders', orderId);
    broadcastSync('DELETE_ORDER', orderId);
    showToast(`Deleted order #${orderId.slice(-4)}`);
  };

  const clearAllOrders = () => {
    orders.forEach(o => {
      deleteFirestoreDoc('orders', o.id);
    });
    setOrders([]);
    setActiveOrderId(null);
    localStorage.removeItem('de_orders');
    localStorage.removeItem('de_active_order_id');
    stopRingerLoop();
    broadcastSync('CLEAR_ALL_ORDERS', null);
    showToast('🧹 All orders cleared from database!');
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

  const resetMenuToDefault = () => {
    setMenuItems(INITIAL_MENU);
    setCategories(INITIAL_CATEGORIES);
    localStorage.setItem('de_menu', JSON.stringify(INITIAL_MENU));
    localStorage.setItem('de_categories', JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem('de_menu_version', MENU_SCHEMA_VERSION);
    broadcastSync('UPDATE_MENU', INITIAL_MENU);
    broadcastSync('UPDATE_CATEGORIES', INITIAL_CATEGORIES);
    showToast('Menu reset to default items!');
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
      resetMenuToDefault,
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
      userProfile,
      loginCustomer,
      updateCustomerProfile,
      logoutCustomer,
      isAuthProfileModalOpen,
      setIsAuthProfileModalOpen,
      customerOrders,
      qualifyingOrders,
      loyaltyStampsCount,
      totalEarnedFreeDishes,
      claimedFreeDishes,
      unlockedFreeDishes,
      isFreeDishRewardApplied,
      freeDishRewardDiscount,
      eligibleFreeDishItem,
      applyFreeDishReward,
      removeFreeDishReward,
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
      deleteOrder,
      clearAllOrders,
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
