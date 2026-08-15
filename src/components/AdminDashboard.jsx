import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MenuEditorModal } from './MenuEditorModal';
import { CouponManager } from './CouponManager';
import { PinCodeManager } from './PinCodeManager';
import { CategoryManager } from './CategoryManager';
import {
  Bell,
  BellOff,
  ChefHat,
  Clock,
  CheckCircle,
  Plus,
  Edit2,
  Trash2,
  Tag,
  MapPin,
  Printer,
  Sparkles,
  Smartphone,
  CheckCircle2,
  ListFilter
} from 'lucide-react';

export const AdminDashboard = () => {
  const {
    orders,
    updateOrderStatus,
    menuItems,
    deleteMenuItem,
    toggleItemStock,
    resetMenuToDefault,
    isAudioMuted,
    setIsAudioMuted,
    isRinging,
    stopRingerLoop,
    setActiveTab
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState('orders'); // orders, categories, menu, coupons, pincodes
  const [editingItem, setEditingItem] = useState(null);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [selectedPrepTimes, setSelectedPrepTimes] = useState({});

  const handleSetPrepTime = (orderId, mins) => {
    setSelectedPrepTimes(prev => ({ ...prev, [orderId]: mins }));
  };

  const handleAcceptOrder = (orderId) => {
    const mins = selectedPrepTimes[orderId] || 20;
    updateOrderStatus(orderId, 'PREPARING', mins);
  };

  const handlePrintKOT = (order) => {
    const printWin = window.open('', '_blank', 'width=400,height=600');
    if (!printWin) return;

    printWin.document.write(`
      <html>
        <head>
          <title>KOT #${order.id}</title>
          <style>
            body { font-family: monospace; padding: 20px; font-size: 14px; }
            h2 { margin: 0; font-size: 18px; text-align: center; }
            p { margin: 4px 0; }
            .line { border-bottom: 1px dashed #000; margin: 10px 0; }
            .item { display: flex; justify-content: space-between; font-weight: bold; }
          </style>
        </head>
        <body>
          <h2>DESI EATS - KITCHEN TICKET</h2>
          <p style="text-align:center;">Order #${order.id} (${order.orderMode.toUpperCase()})</p>
          <p>Time: ${new Date(order.createdAt).toLocaleTimeString()}</p>
          <p>Customer: ${order.customerName} (${order.customerPhone})</p>
          <div class="line"></div>
          ${order.items.map(i => `
            <div class="item">
              <span>${i.quantity}x ${i.item.name} ${i.selectedVariation ? `(${i.selectedVariation.name})` : ''}</span>
              <span>₹${i.unitPrice * i.quantity}</span>
            </div>
          `).join('')}
          <div class="line"></div>
          <p><b>Pay:</b> ${order.paymentMethod.toUpperCase()} | Total: ₹${order.totalAmount}</p>
          ${order.instructions ? `<p><b>Note:</b> ${order.instructions}</p>` : ''}
        </body>
      </html>
    `);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => {
      printWin.print();
      printWin.close();
    }, 250);
  };

  const pendingCount = orders.filter(o => o.status === 'RECEIVED').length;

  return (
    <div className="admin-container">
      {/* Top Banner */}
      <div className="admin-header-banner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <ChefHat size={28} color="#e5a024" />
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-brand)', margin: 0 }}>
              Kitchen Partner & Restaurant Dashboard
            </h1>
          </div>
          <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Live order fulfillment, menu editor, promo offers & Rajarhat delivery management
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('kitchen')}
            style={{
              background: '#e5a024',
              color: '#164324',
              border: 'none',
              padding: '10px 18px',
              borderRadius: 30,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 12px rgba(229, 160, 36, 0.4)',
              fontFamily: 'var(--font-brand)'
            }}
          >
            <Smartphone size={18} /> Launch Kitchen Partner App
          </button>

          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            style={{
              background: isAudioMuted ? 'rgba(255,255,255,0.2)' : '#ffffff',
              color: isAudioMuted ? '#ffffff' : '#164324',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '99px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.875rem'
            }}
          >
            {isAudioMuted ? <BellOff size={16} /> : <Bell size={16} />}
            {isAudioMuted ? 'Audio Muted' : 'Sound Alerts ON'}
          </button>
        </div>
      </div>

      {/* Ringer Alarm Banner */}
      {isRinging && (
        <div style={{
          background: '#ef4444',
          color: 'white',
          padding: '14px 20px',
          borderRadius: 14,
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: 700
        }}>
          <span>🔔 LOUD ALARM: {pendingCount} NEW UNACCEPTED ORDER(S)!</span>
          <button
            onClick={stopRingerLoop}
            style={{ background: 'white', color: '#ef4444', border: 'none', padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontWeight: 800 }}
          >
            Mute Ringer
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="admin-nav-tabs">
        <button
          className={`admin-nav-tab ${activeAdminTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('orders')}
        >
          Live Orders ({orders.filter(o => o.status !== 'COMPLETED').length})
          {pendingCount > 0 && (
            <span style={{ background: '#ef4444', color: 'white', borderRadius: '50%', padding: '2px 7px', fontSize: '0.75rem', marginLeft: 6 }}>
              {pendingCount}
            </span>
          )}
        </button>

        <button
          className={`admin-nav-tab ${activeAdminTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('categories')}
        >
          Categories Manager
        </button>

        <button
          className={`admin-nav-tab ${activeAdminTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('menu')}
        >
          Menu & Portion Variations ({menuItems.length})
        </button>

        <button
          className={`admin-nav-tab ${activeAdminTab === 'coupons' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('coupons')}
        >
          Coupons & Offers
        </button>

        <button
          className={`admin-nav-tab ${activeAdminTab === 'pincodes' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('pincodes')}
        >
          Delivery PIN Zones
        </button>
      </div>

      {/* TAB 1: LIVE ORDERS */}
      {activeAdminTab === 'orders' && (
        <div>
          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 16, border: '1px solid #e5e7eb' }}>
              <ChefHat size={48} color="#9ca3af" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#374151' }}>No Incoming Orders Yet</h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>When a customer places an order, it will appear here in real time with audio chime alerts.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
              {orders.map(order => {
                const currentPrepTime = selectedPrepTimes[order.id] || 20;

                return (
                  <div key={order.id} className="order-admin-card" style={{ borderLeft: `5px solid ${order.status === 'RECEIVED' ? '#ef4444' : order.status === 'PREPARING' ? '#3b82f6' : '#10b981'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#164324', fontFamily: 'var(--font-brand)' }}>
                            #{order.id}
                          </span>
                          <span className={`order-badge-pill ${order.orderMode === 'delivery' ? 'badge-delivery' : 'badge-takeaway'}`}>
                            {order.orderMode}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </span>
                      </div>

                      <button
                        onClick={() => handlePrintKOT(order)}
                        style={{ background: '#f1f5f9', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}
                      >
                        <Printer size={14} /> Print KOT
                      </button>
                    </div>

                    <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, marginBottom: 12, fontSize: '0.875rem' }}>
                      <div><strong>Customer:</strong> {order.customerName} ({order.customerPhone})</div>
                      {order.orderMode === 'delivery' ? (
                        <div style={{ color: '#4b5563', marginTop: 2 }}><strong>Address:</strong> {order.address} (PIN: {order.pincode})</div>
                      ) : (
                        <div style={{ color: '#4b5563', marginTop: 2 }}><strong>Spot:</strong> Takeaway / Table Counter</div>
                      )}
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 6 }}>
                        Items
                      </div>
                      {order.items.map((cartItem, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 4 }}>
                          <span>
                            <strong>{cartItem.quantity}x</strong> {cartItem.item.name}
                            {cartItem.selectedVariation && <span style={{ color: '#d85d27', fontSize: '0.8rem' }}> ({cartItem.selectedVariation.name})</span>}
                          </span>
                          <span>₹{cartItem.unitPrice * cartItem.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e5e7eb', paddingTop: 10, marginTop: 10 }}>
                      <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                        Payment: <strong>{order.paymentMethod.toUpperCase()}</strong>
                      </span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#164324', fontFamily: 'var(--font-brand)' }}>
                        Total: ₹{order.totalAmount}
                      </span>
                    </div>

                    {/* Order Action Controls */}
                    <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px dashed #e5e7eb' }}>
                      {order.status === 'RECEIVED' && (
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                            Set Prep Time & Accept Order:
                          </div>
                          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                            {[15, 20, 30, 45].map(mins => (
                              <button
                                key={mins}
                                onClick={() => handleSetPrepTime(order.id, mins)}
                                style={{
                                  flex: 1,
                                  padding: '6px 0',
                                  borderRadius: 6,
                                  border: currentPrepTime === mins ? '2px solid #164324' : '1px solid #d1d5db',
                                  background: currentPrepTime === mins ? '#164324' : '#fff',
                                  color: currentPrepTime === mins ? '#fff' : '#374151',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  fontSize: '0.8rem'
                                }}
                              >
                                {mins}m
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => handleAcceptOrder(order.id)}
                            style={{
                              width: '100%',
                              background: '#164324',
                              color: 'white',
                              border: 'none',
                              padding: '10px',
                              borderRadius: 8,
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 6,
                              fontFamily: 'var(--font-brand)'
                            }}
                          >
                            <ChefHat size={18} /> Accept Order ({currentPrepTime} mins)
                          </button>
                        </div>
                      )}

                      {order.status === 'PREPARING' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'READY')}
                          style={{
                            width: '100%',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '10px',
                            borderRadius: 8,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            fontFamily: 'var(--font-brand)'
                          }}
                        >
                          <CheckCircle2 size={18} /> Mark Ready for Pickup / Dispatch
                        </button>
                      )}

                      {order.status === 'READY' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                          style={{
                            width: '100%',
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            padding: '10px',
                            borderRadius: 8,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            fontFamily: 'var(--font-brand)'
                          }}
                        >
                          <CheckCircle size={18} /> Complete Order
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CATEGORIES MANAGER */}
      {activeAdminTab === 'categories' && <CategoryManager />}

      {/* TAB 3: MENU & PORTION VARIATIONS MANAGER */}
      {activeAdminTab === 'menu' && (
        <div style={{ background: 'white', padding: 24, borderRadius: 16, border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#164324', fontFamily: 'var(--font-brand)' }}>
                Food Menu & Portion Variations
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                Add dishes, configure portion sizes (Half/Full), upload images or pick food presets.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => {
                  if (window.confirm('Reset all menu items to the standard 36 combos @ ₹199 flat price?')) {
                    resetMenuToDefault();
                  }
                }}
                style={{
                  background: '#fef3c7',
                  color: '#b45309',
                  border: '1px solid #fde68a',
                  padding: '10px 16px',
                  borderRadius: 8,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                🔄 Reset to 36 Combos (₹199 Flat)
              </button>

              <button
                onClick={() => { setEditingItem(null); setIsMenuModalOpen(true); }}
                style={{
                  background: '#164324',
                  color: 'white',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: 8,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontFamily: 'var(--font-brand)'
                }}
              >
                <Plus size={18} /> Add New Dish
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb', color: '#6b7280' }}>
                  <th style={{ padding: 12 }}>Dish</th>
                  <th style={{ padding: 12 }}>Category</th>
                  <th style={{ padding: 12 }}>Price / Variations</th>
                  <th style={{ padding: 12 }}>Stock Status</th>
                  <th style={{ padding: 12, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={item.image} alt={item.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} />
                      <div>
                        <strong style={{ color: '#1f2937' }}>{item.name}</strong>
                        <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}</div>
                      </div>
                    </td>

                    <td style={{ padding: 12, textTransform: 'capitalize', color: '#4b5563' }}>{item.category}</td>

                    <td style={{ padding: 12 }}>
                      {item.variations && item.variations.length > 0 ? (
                        <div style={{ fontSize: '0.85rem' }}>
                          {item.variations.map((v, i) => (
                            <span key={i} style={{ display: 'inline-block', background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: 4, margin: 2, fontWeight: 600 }}>
                              {v.name}: ₹{v.price}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <strong style={{ color: '#164324' }}>₹{item.price}</strong>
                      )}
                    </td>

                    <td style={{ padding: 12 }}>
                      <button
                        onClick={() => toggleItemStock(item.id)}
                        style={{
                          background: item.inStock ? '#dcfce7' : '#fee2e2',
                          color: item.inStock ? '#15803d' : '#ef4444',
                          border: 'none',
                          padding: '4px 12px',
                          borderRadius: 20,
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        {item.inStock ? 'In Stock' : 'Sold Out'}
                      </button>
                    </td>

                    <td style={{ padding: 12, textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <button
                          onClick={() => { setEditingItem(item); setIsMenuModalOpen(true); }}
                          style={{ background: '#f1f5f9', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer', color: '#374151' }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteMenuItem(item.id)}
                          style={{ background: '#fee2e2', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer', color: '#ef4444' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: COUPONS */}
      {activeAdminTab === 'coupons' && <CouponManager />}

      {/* TAB 5: PIN CODES */}
      {activeAdminTab === 'pincodes' && <PinCodeManager />}

      {/* Modal for Menu Item Add/Edit */}
      {isMenuModalOpen && (
        <MenuEditorModal
          item={editingItem}
          onClose={() => setIsMenuModalOpen(false)}
        />
      )}
    </div>
  );
};
