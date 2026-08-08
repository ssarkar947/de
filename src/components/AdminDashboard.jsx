import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PinCodeManager } from './PinCodeManager';
import { CouponManager } from './CouponManager';
import { MenuEditorModal } from './MenuEditorModal';
import {
  Bell,
  Clock,
  CheckCircle,
  Flame,
  Bike,
  Store,
  MapPin,
  Utensils,
  Check,
  Tag,
  Volume2,
  VolumeX,
  Plus,
  Edit,
  Printer,
  Trash2,
  Banknote
} from 'lucide-react';

export const AdminDashboard = () => {
  const {
    orders,
    updateOrderStatus,
    menuItems,
    deleteMenuItem,
    toggleItemStock,
    isAudioMuted,
    setIsAudioMuted
  } = useApp();

  const [adminTab, setAdminTab] = useState('orders'); // 'orders', 'menu', 'coupons', 'pincodes'
  const [orderTypeFilter, setOrderTypeFilter] = useState('all'); // 'all', 'delivery', 'takeaway'
  const [orderStatusFilter, setOrderStatusFilter] = useState('all'); // 'all', 'RECEIVED', 'PREPARING', 'READY', 'COMPLETED'
  const [selectedPrepTimes, setSelectedPrepTimes] = useState({});

  // Menu editor modal state
  const [isMenuEditorOpen, setIsMenuEditorOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  // Filter orders
  const filteredOrders = orders.filter(o => {
    const matchesType = orderTypeFilter === 'all' || o.orderMode === orderTypeFilter;
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesType && matchesStatus;
  });

  const pendingReceivedCount = orders.filter(o => o.status === 'RECEIVED').length;

  const handleSetPrepTimeAndAccept = (orderId) => {
    const mins = selectedPrepTimes[orderId] || 20;
    updateOrderStatus(orderId, 'PREPARING', mins);
  };

  const handleOpenAddNewItem = () => {
    setItemToEdit(null);
    setIsMenuEditorOpen(true);
  };

  const handleOpenEditItem = (item) => {
    setItemToEdit(item);
    setIsMenuEditorOpen(true);
  };

  const handlePrintKot = (order) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>KOT Ticket #${order.id}</title>
          <style>
            body { font-family: monospace; padding: 20px; width: 300px; }
            h2 { text-align: center; margin-bottom: 4px; }
            .badge { background: #000; color: #fff; padding: 2px 6px; font-weight: bold; }
            hr { border-top: 1px dashed #000; }
            .item { display: flex; justify-content: space-between; margin: 6px 0; }
          </style>
        </head>
        <body>
          <h2>DESI EATS KOT</h2>
          <div style="text-align:center;">Order #${order.id}</div>
          <div style="text-align:center; margin-bottom: 10px;">
            <span class="badge">${order.orderMode.toUpperCase()}</span>
          </div>
          <div>Customer: ${order.customerName} (${order.customerPhone})</div>
          <div>Mode: ${order.orderMode === 'takeaway' ? 'Takeaway Pickup' : 'Delivery (' + order.pincode + ')'}</div>
          <div>Payment: ${order.paymentMethod === 'cash' ? 'CASH AT COUNTER/DELIVERY' : 'UPI / QR CODE AT SHOP'}</div>
          <hr />
          ${order.items.map(it => `
            <div class="item">
              <div><strong>${it.quantity}x</strong> ${it.item.name} ${it.selectedVariation ? '(' + it.selectedVariation.name + ')' : ''}</div>
              <div>₹${it.unitPrice * it.quantity}</div>
            </div>
          `).join('')}
          <hr />
          ${order.instructions ? `<div>Note: ${order.instructions}</div><hr />` : ''}
          <div style="text-align:right; font-weight:bold; font-size:1.1rem;">Total: ₹${order.totalAmount}</div>
          <script>window.print(); setTimeout(() => window.close(), 500);</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="admin-container">
      {/* Top Banner */}
      <div className="admin-header-banner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
            <span className="order-badge-pill" style={{ background: '#e5a024', color: 'white' }}>
              Restaurant Partner Portal
            </span>
            {pendingReceivedCount > 0 && (
              <span className="order-badge-pill animate-pulse" style={{ background: '#ef4444', color: 'white' }}>
                🔔 {pendingReceivedCount} NEW ORDERS NEED TIME ASSIGNMENT!
              </span>
            )}
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Desi Eats Kitchen Backend</h2>
          <p style={{ fontSize: '0.9rem', opacity: 0.85, marginTop: 4 }}>
            Live orders queue, portion size variations editor, backend coupon creator, & Rajarhat PIN zones.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Mute / Unmute Audio Toggle */}
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: 30,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
            title={isAudioMuted ? 'Unmute Audio Chime' : 'Mute Audio Chime'}
          >
            {isAudioMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{isAudioMuted ? 'Muted' : 'Sound On'}</span>
          </button>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="admin-nav-tabs">
        <button
          className={`admin-nav-tab ${adminTab === 'orders' ? 'active' : ''}`}
          onClick={() => setAdminTab('orders')}
        >
          Live Orders Queue ({orders.length})
          {pendingReceivedCount > 0 && (
            <span style={{ marginLeft: 6, background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: 99, fontSize: '0.75rem' }}>
              {pendingReceivedCount}
            </span>
          )}
        </button>

        <button
          className={`admin-nav-tab ${adminTab === 'menu' ? 'active' : ''}`}
          onClick={() => setAdminTab('menu')}
        >
          Menu & Portion Variations Editor ({menuItems.length} items)
        </button>

        <button
          className={`admin-nav-tab ${adminTab === 'coupons' ? 'active' : ''}`}
          onClick={() => setAdminTab('coupons')}
        >
          Coupons & Promo Offers
        </button>

        <button
          className={`admin-nav-tab ${adminTab === 'pincodes' ? 'active' : ''}`}
          onClick={() => setAdminTab('pincodes')}
        >
          Delivery PIN Zones (Rajarhat)
        </button>
      </div>

      {/* Tab 1: Live Orders Queue */}
      {adminTab === 'orders' && (
        <div>
          {/* Controls Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', gap: 8, background: '#e2e8f0', padding: 4, borderRadius: 30 }}>
              <button
                onClick={() => setOrderTypeFilter('all')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 30,
                  border: 'none',
                  background: orderTypeFilter === 'all' ? 'white' : 'transparent',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                All Types ({orders.length})
              </button>
              <button
                onClick={() => setOrderTypeFilter('takeaway')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 30,
                  border: 'none',
                  background: orderTypeFilter === 'takeaway' ? '#e5a024' : 'transparent',
                  color: orderTypeFilter === 'takeaway' ? 'white' : '#334155',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Store size={14} />
                <span>Takeaway ({orders.filter(o => o.orderMode === 'takeaway').length})</span>
              </button>
              <button
                onClick={() => setOrderTypeFilter('delivery')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 30,
                  border: 'none',
                  background: orderTypeFilter === 'delivery' ? '#164324' : 'transparent',
                  color: orderTypeFilter === 'delivery' ? 'white' : '#334155',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Bike size={14} />
                <span>Delivery ({orders.filter(o => o.orderMode === 'delivery').length})</span>
              </button>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['all', 'RECEIVED', 'PREPARING', 'READY', 'COMPLETED'].map(st => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  style={{
                    background: orderStatusFilter === st ? '#1f2937' : '#f1f5f9',
                    color: orderStatusFilter === st ? 'white' : '#475569',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: 20,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {st === 'all' ? 'All Status' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Cards List */}
          {filteredOrders.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {filteredOrders.map(order => {
                const isTakeaway = order.orderMode === 'takeaway';
                const isUpiQr = order.paymentMethod === 'upi_qr';

                return (
                  <div key={order.id} className="order-admin-card" style={{
                    borderLeft: `6px solid ${order.status === 'RECEIVED' ? '#ef4444' : order.status === 'PREPARING' ? '#f59e0b' : order.status === 'READY' ? '#10b981' : '#cbd5e1'}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#164324' }}>
                            Order #{order.id}
                          </span>

                          <span className={`order-badge-pill ${isTakeaway ? 'badge-takeaway' : 'badge-delivery'}`}>
                            {isTakeaway ? '🏪 TAKEAWAY' : '🛵 DELIVERY'}
                          </span>

                          <span style={{
                            padding: '3px 10px',
                            borderRadius: 12,
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            background: isUpiQr ? '#fefce8' : '#f0fdf4',
                            color: isUpiQr ? '#b45309' : '#166534',
                            border: isUpiQr ? '1px solid #fde047' : '1px solid #bbf7d0',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4
                          }}>
                            {isUpiQr ? '📱 UPI / QR SCAN AT SHOP' : '💵 CASH AT COUNTER/DELIVERY'}
                          </span>

                          <span style={{
                            padding: '3px 10px',
                            borderRadius: 12,
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            background: order.status === 'RECEIVED' ? '#fee2e2' : order.status === 'PREPARING' ? '#fef3c7' : '#dcfce7',
                            color: order.status === 'RECEIVED' ? '#991b1b' : order.status === 'PREPARING' ? '#92400e' : '#166534'
                          }}>
                            {order.status}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.85rem', color: '#4b5563' }}>
                          Customer: <strong>{order.customerName}</strong> ({order.customerPhone}) • {order.address}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button
                          onClick={() => handlePrintKot(order)}
                          style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', padding: '6px 12px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                          title="Print Kitchen Ticket"
                        >
                          <Printer size={14} />
                          <span>KOT Ticket</span>
                        </button>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#164324' }}>₹{order.totalAmount}</span>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af' }}>
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items Breakdown */}
                    <div style={{ background: '#f8fafc', padding: 12, borderRadius: 10, marginBottom: 14, border: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        {order.items.map((it, idx) => (
                          <div key={idx} style={{ background: 'white', padding: '6px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                            <strong style={{ color: '#164324' }}>{it.quantity}x</strong> {it.item.name}
                            {it.selectedVariation && (
                              <span style={{ color: '#d85d27', fontWeight: 700, marginLeft: 4 }}>
                                ({it.selectedVariation.name})
                              </span>
                            )}
                            {it.options.length > 0 && (
                              <span style={{ color: '#64748b', fontSize: '0.75rem', marginLeft: 4 }}>
                                [{it.options.map(o => o.name).join(', ')}]
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {order.appliedCouponCode && (
                        <div style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 700, marginTop: 6 }}>
                          🎟️ Promo Code Used: {order.appliedCouponCode} (-₹{order.discount})
                        </div>
                      )}

                      {order.instructions && (
                        <div style={{ fontSize: '0.8rem', color: '#d85d27', fontWeight: 700, marginTop: 6 }}>
                           Instruction: {order.instructions}
                        </div>
                      )}
                    </div>

                    {/* Action Controls for Admin */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
                      {order.status === 'RECEIVED' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', width: '100%' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#b45309' }}>
                            ⏰ Set Required Cooking & Prep Time:
                          </span>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {[15, 20, 30, 45].map(mins => (
                              <button
                                key={mins}
                                onClick={() => setSelectedPrepTimes(prev => ({ ...prev, [order.id]: mins }))}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: 8,
                                  border: (selectedPrepTimes[order.id] || 20) === mins ? '2px solid #164324' : '1px solid #d1d5db',
                                  background: (selectedPrepTimes[order.id] || 20) === mins ? '#f0fdf4' : 'white',
                                  fontWeight: 800,
                                  fontSize: '0.85rem',
                                  cursor: 'pointer',
                                  color: (selectedPrepTimes[order.id] || 20) === mins ? '#164324' : '#374151'
                                }}
                              >
                                {mins} mins
                              </button>
                            ))}
                          </div>

                          <button
                            onClick={() => handleSetPrepTimeAndAccept(order.id)}
                            style={{
                              marginLeft: 'auto',
                              background: '#164324',
                              color: 'white',
                              border: 'none',
                              padding: '10px 20px',
                              borderRadius: 30,
                              fontWeight: 800,
                              fontSize: '0.85rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6
                            }}
                          >
                            <Check size={16} />
                            <span>Confirm & Start Cooking ({selectedPrepTimes[order.id] || 20}m)</span>
                          </button>
                        </div>
                      )}

                      {order.status === 'PREPARING' && (
                        <>
                          <div style={{ fontSize: '0.85rem', color: '#854d0e', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Clock size={16} />
                            <span>In Preparation (Assigned {order.prepTimeMinutes || 20} mins)</span>
                          </div>

                          <button
                            onClick={() => updateOrderStatus(order.id, 'READY')}
                            style={{
                              background: '#10b981',
                              color: 'white',
                              border: 'none',
                              padding: '10px 20px',
                              borderRadius: 30,
                              fontWeight: 800,
                              fontSize: '0.85rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                            }}
                          >
                            <Bell size={16} />
                            <span>Notify Customer: {isTakeaway ? 'READY FOR TAKEAWAY PICKUP' : 'OUT FOR DELIVERY'}</span>
                          </button>
                        </>
                      )}

                      {order.status === 'READY' && (
                        <>
                          <div style={{ fontSize: '0.85rem', color: '#047857', fontWeight: 700 }}>
                            ✅ Customer Notified! Ready for pickup/delivery.
                          </div>

                          <button
                            onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                            style={{
                              background: '#1f2937',
                              color: 'white',
                              border: 'none',
                              padding: '8px 18px',
                              borderRadius: 30,
                              fontWeight: 800,
                              fontSize: '0.85rem',
                              cursor: 'pointer'
                            }}
                          >
                            Mark Order Completed & Fulfilled
                          </button>
                        </>
                      )}

                      {order.status === 'COMPLETED' && (
                        <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                          Order Completed & Fulfilled.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 16 }}>
              <Utensils size={40} color="#cbd5e1" style={{ marginBottom: 8 }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#374151' }}>No orders in this queue</h3>
              <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>New orders will pop up here with live sound chime alert!</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Menu & Variations Manager */}
      {adminTab === 'menu' && (
        <div style={{ background: 'white', padding: 24, borderRadius: 16, border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#164324' }}>
                Restaurant Menu & Portion Variations Manager
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                Add new dishes, edit prices & photo presets, define portion size variations (Half/Full), & toggle item stock.
              </p>
            </div>

            <button
              onClick={handleOpenAddNewItem}
              style={{
                background: '#164324',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: 30,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Plus size={18} />
              <span>Add New Dish</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {menuItems.map(item => (
              <div key={item.id} style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14, background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                  <img src={item.image} alt="" style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1f2937' }}>{item.name}</h4>
                      <span className={`veg-nonveg-badge ${!item.isVeg ? 'nonveg' : ''}`} style={{ position: 'static', width: 14, height: 14 }}>
                        <div className="veg-dot" style={{ width: 5, height: 5 }} />
                      </span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700 }}>
                      Category: {item.category}
                    </span>
                    <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#164324', marginTop: 2 }}>
                      ₹{item.price}
                    </div>
                  </div>
                </div>

                {item.variations && item.variations.length > 0 && (
                  <div style={{ fontSize: '0.78rem', background: '#ffffff', padding: '6px 10px', borderRadius: 6, border: '1px solid #e2e8f0', marginBottom: 10 }}>
                    <strong style={{ color: '#d85d27' }}>Portion Variants: </strong>
                    {item.variations.map(v => `${v.name} (₹${v.price})`).join(' • ')}
                  </div>
                )}

                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid #e2e8f0' }}>
                  <button
                    onClick={() => toggleItemStock(item.id)}
                    style={{
                      background: item.inStock ? '#dcfce7' : '#fee2e2',
                      color: item.inStock ? '#15803d' : '#991b1b',
                      border: 'none',
                      padding: '4px 12px',
                      borderRadius: 20,
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      cursor: 'pointer'
                    }}
                  >
                    {item.inStock ? 'IN STOCK' : 'SOLD OUT'}
                  </button>

                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => handleOpenEditItem(item)}
                      style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', padding: '4px 10px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      <Edit size={14} />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => deleteMenuItem(item.id)}
                      style={{ background: '#fef2f2', border: '1px solid #fecdd3', color: '#ef4444', padding: '4px 8px', borderRadius: 6, cursor: 'pointer' }}
                      title="Delete Dish"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Coupons */}
      {adminTab === 'coupons' && <CouponManager />}

      {/* Tab 4: Pincodes */}
      {adminTab === 'pincodes' && <PinCodeManager />}

      {/* Menu Editor Modal */}
      {isMenuEditorOpen && (
        <MenuEditorModal
          itemToEdit={itemToEdit}
          onClose={() => setIsMenuEditorOpen(false)}
        />
      )}
    </div>
  );
};
