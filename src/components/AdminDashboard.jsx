import React, { useState, useMemo } from 'react';
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
  ListFilter,
  Users,
  History,
  Search,
  Download,
  IndianRupee,
  Phone,
  MessageSquare,
  Gift,
  Award
} from 'lucide-react';

export const AdminDashboard = () => {
  const {
    orders = [],
    updateOrderStatus,
    deleteOrder,
    clearAllOrders,
    menuItems = [],
    deleteMenuItem,
    toggleItemStock,
    resetMenuToDefault,
    isAudioMuted,
    setIsAudioMuted,
    isRinging,
    stopRingerLoop,
    setActiveTab,
    showToast
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState('orders'); // orders, completed, customers, categories, menu, coupons, pincodes
  const [editingItem, setEditingItem] = useState(null);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [selectedPrepTimes, setSelectedPrepTimes] = useState({});

  // Completed Orders & Customer Search Filters
  const [completedSearch, setCompletedSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');

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
          <p><b>Pay:</b> ${order.paymentMethod ? order.paymentMethod.toUpperCase() : 'CASH'} | Total: ₹${order.totalAmount}</p>
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
  const liveOrders = orders.filter(o => o.status !== 'COMPLETED');
  const completedOrders = orders.filter(o => o.status === 'COMPLETED');

  // Filtered Completed Orders
  const filteredCompletedOrders = completedOrders.filter(o => {
    if (!completedSearch.trim()) return true;
    const q = completedSearch.toLowerCase();
    return (
      (o.id && o.id.toLowerCase().includes(q)) ||
      (o.customerName && o.customerName.toLowerCase().includes(q)) ||
      (o.customerPhone && o.customerPhone.includes(q)) ||
      (o.address && o.address.toLowerCase().includes(q))
    );
  });

  // Unique Customers Aggregation (CRM)
  const customersList = useMemo(() => {
    const customerMap = new Map();

    orders.forEach(o => {
      const phone = o.customerPhone || 'unknown';
      if (!customerMap.has(phone)) {
        customerMap.set(phone, {
          phone,
          name: o.customerName || 'Desi Foodie',
          address: o.address || '',
          pincode: o.pincode || '700135',
          ordersCount: 0,
          completedCount: 0,
          totalSpent: 0,
          lastOrderDate: o.createdAt,
          qualifyingOrdersCount: 0
        });
      }

      const c = customerMap.get(phone);
      c.ordersCount += 1;
      if (o.status === 'COMPLETED') c.completedCount += 1;
      c.totalSpent += Number(o.totalAmount || o.subtotal || 0);
      if (Number(o.totalAmount || o.subtotal || 0) >= 200) {
        c.qualifyingOrdersCount += 1;
      }
      if (new Date(o.createdAt) > new Date(c.lastOrderDate)) {
        c.lastOrderDate = o.createdAt;
        if (o.address) c.address = o.address;
        if (o.customerName) c.name = o.customerName;
      }
    });

    return Array.from(customerMap.values());
  }, [orders]);

  const filteredCustomers = customersList.filter(c => {
    if (!customerSearch.trim()) return true;
    const q = customerSearch.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.address.toLowerCase().includes(q)
    );
  });

  // Export Completed Orders to CSV
  const exportCompletedOrdersCSV = () => {
    if (completedOrders.length === 0) {
      showToast('No completed orders to export.');
      return;
    }
    const headers = ['Order ID', 'Date & Time', 'Customer Name', 'Phone', 'Mode', 'Address', 'Pincode', 'Payment', 'Amount (INR)', 'Coupon Used', 'Items'];
    const rows = completedOrders.map(o => [
      `"${o.id}"`,
      `"${new Date(o.createdAt).toLocaleString()}"`,
      `"${o.customerName || ''}"`,
      `"${o.customerPhone || ''}"`,
      `"${o.orderMode}"`,
      `"${(o.address || '').replace(/"/g, '""')}"`,
      `"${o.pincode || ''}"`,
      `"${o.paymentMethod || 'CASH'}"`,
      o.totalAmount,
      `"${o.appliedCouponCode || 'NONE'}"`,
      `"${o.items.map(i => `${i.quantity}x ${i.item.name}`).join('; ')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `desieats_completed_orders_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📥 Completed Orders CSV Downloaded!');
  };

  // Export Customers Directory to CSV
  const exportCustomersCSV = () => {
    if (customersList.length === 0) {
      showToast('No customer records to export.');
      return;
    }
    const headers = ['Customer Name', 'Phone Number', 'Delivery Address', 'Pincode', 'Total Orders', 'Total Spent (INR)', 'Stamps Progress (0-5)', 'Last Order Date'];
    const rows = customersList.map(c => [
      `"${c.name}"`,
      `"${c.phone}"`,
      `"${(c.address || '').replace(/"/g, '""')}"`,
      `"${c.pincode || ''}"`,
      c.ordersCount,
      c.totalSpent,
      `${c.qualifyingOrdersCount % 5}/5`,
      `"${new Date(c.lastOrderDate).toLocaleDateString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `desieats_customers_directory_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📥 Customers Directory CSV Downloaded!');
  };

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
            Live order fulfillment, completed orders archive, customer CRM & menu management
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
          Live Orders ({liveOrders.length})
          {pendingCount > 0 && (
            <span style={{ background: '#ef4444', color: 'white', borderRadius: '50%', padding: '2px 7px', fontSize: '0.75rem', marginLeft: 6 }}>
              {pendingCount}
            </span>
          )}
        </button>

        <button
          className={`admin-nav-tab ${activeAdminTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('completed')}
        >
          <History size={15} style={{ display: 'inline', marginRight: 4 }} />
          Completed Archive ({completedOrders.length})
        </button>

        <button
          className={`admin-nav-tab ${activeAdminTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('customers')}
        >
          <Users size={15} style={{ display: 'inline', marginRight: 4 }} />
          Customers CRM ({customersList.length})
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
          {orders.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, background: '#ffffff', padding: '12px 18px', borderRadius: 12, border: '1px solid #e5e7eb' }}>
              <span style={{ fontSize: '0.88rem', color: '#475569', fontWeight: 600 }}>
                Total Orders in System: <strong>{orders.length}</strong> (Active: <strong>{liveOrders.length}</strong> • Completed: <strong>{completedOrders.length}</strong>)
              </span>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete and clear ALL test orders from the database to go live?')) {
                    clearAllOrders();
                  }
                }}
                style={{
                  background: '#fef2f2',
                  color: '#b91c1c',
                  border: '1px solid #fecaca',
                  padding: '6px 14px',
                  borderRadius: 8,
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Trash2 size={14} /> Clear All Test / Demo Orders
              </button>
            </div>
          )}

          {liveOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 16, border: '1px solid #e5e7eb' }}>
              <ChefHat size={48} color="#9ca3af" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#374151' }}>No Active Live Orders Right Now</h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>New orders will appear here in real time with loud audio chime alerts. You can view all completed past orders in the <strong>Completed Archive</strong> tab.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
              {liveOrders.map(order => {
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

                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => handlePrintKOT(order)}
                          style={{ background: '#f1f5f9', border: 'none', padding: '6px 10px', borderRadius: 8, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}
                          title="Print Kitchen Ticket"
                        >
                          <Printer size={14} /> Print
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete order #${order.id}?`)) {
                              deleteOrder(order.id);
                            }
                          }}
                          style={{ background: '#fee2e2', border: 'none', padding: '6px 8px', borderRadius: 8, fontSize: '0.8rem', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center' }}
                          title="Delete Order"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
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
                        Payment: <strong>{order.paymentMethod ? order.paymentMethod.toUpperCase() : 'CASH'}</strong>
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
                                type="button"
                                onClick={() => handleSetPrepTime(order.id, mins)}
                                style={{
                                  flex: 1,
                                  padding: '6px 0',
                                  borderRadius: 6,
                                  border: currentPrepTime === mins ? '2px solid #164324' : '1px solid #d1d5db',
                                  background: currentPrepTime === mins ? '#e5a024' : 'white',
                                  color: currentPrepTime === mins ? '#164324' : '#374151',
                                  fontWeight: 800,
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
                          <CheckCircle size={18} /> Complete Order & Save to Archive
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

      {/* TAB: COMPLETED ORDERS ARCHIVE */}
      {activeAdminTab === 'completed' && (
        <div style={{ background: 'white', padding: 24, borderRadius: 16, border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#164324', margin: 0, fontFamily: 'var(--font-brand)' }}>
                Completed Orders Archive ({completedOrders.length})
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '4px 0 0' }}>
                Permanent historical record of all fulfilled orders, customer bills & revenue
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={exportCompletedOrdersCSV}
                style={{
                  background: '#164324',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Download size={15} /> Export Orders CSV
              </button>
            </div>
          </div>

          {/* Metric Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: 14, borderRadius: 10 }}>
              <span style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>Total Completed</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#15803d', marginTop: 2 }}>{completedOrders.length}</div>
            </div>
            <div style={{ background: '#fefce8', border: '1px solid #fef08a', padding: 14, borderRadius: 10 }}>
              <span style={{ fontSize: '0.78rem', color: '#854d0e', fontWeight: 700, textTransform: 'uppercase' }}>Total Revenue</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#a16207', marginTop: 2 }}>
                ₹{completedOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0)}
              </div>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: 14, borderRadius: 10 }}>
              <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase' }}>Avg Order Value</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e293b', marginTop: 2 }}>
                ₹{completedOrders.length > 0 ? Math.round(completedOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0) / completedOrders.length) : 0}
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: 14, top: 12 }} />
            <input
              type="text"
              placeholder="Search by Order ID, Customer Name, Phone, or Address..."
              value={completedSearch}
              onChange={e => setCompletedSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 14px 10px 42px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            />
          </div>

          {filteredCompletedOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              <History size={40} color="#cbd5e1" style={{ margin: '0 auto 10px' }} />
              <h4>No Completed Orders Found</h4>
              <p style={{ fontSize: '0.85rem' }}>Completed orders are permanently preserved and will appear here.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569', fontWeight: 800 }}>
                    <th style={{ padding: 12 }}>Order ID & Date</th>
                    <th style={{ padding: 12 }}>Customer Details</th>
                    <th style={{ padding: 12 }}>Items Ordered</th>
                    <th style={{ padding: 12 }}>Mode & Address</th>
                    <th style={{ padding: 12, textAlign: 'right' }}>Total</th>
                    <th style={{ padding: 12, textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompletedOrders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: 12 }}>
                        <div style={{ fontWeight: 800, color: '#164324' }}>#{order.id}</div>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      <td style={{ padding: 12 }}>
                        <div style={{ fontWeight: 700 }}>{order.customerName}</div>
                        <a href={`tel:${order.customerPhone}`} style={{ fontSize: '0.78rem', color: '#d85d27', textDecoration: 'none' }}>
                          📞 {order.customerPhone}
                        </a>
                      </td>

                      <td style={{ padding: 12, maxWidth: 260 }}>
                        {order.items.map((it, idx) => (
                          <div key={idx} style={{ fontSize: '0.8rem', color: '#334155' }}>
                            {it.quantity}x {it.item.name} {it.selectedVariation ? `(${it.selectedVariation.name})` : ''}
                          </div>
                        ))}
                      </td>

                      <td style={{ padding: 12, maxWidth: 220 }}>
                        <span style={{ fontSize: '0.75rem', background: order.orderMode === 'delivery' ? '#ecfdf5' : '#fef3c7', color: order.orderMode === 'delivery' ? '#047857' : '#b45309', padding: '2px 6px', borderRadius: 4, fontWeight: 800, textTransform: 'uppercase' }}>
                          {order.orderMode}
                        </span>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 3 }}>
                          {order.address} {order.pincode && `(${order.pincode})`}
                        </div>
                      </td>

                      <td style={{ padding: 12, textAlign: 'right' }}>
                        <div style={{ fontWeight: 900, color: '#164324', fontSize: '1rem' }}>₹{order.totalAmount}</div>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{order.paymentMethod ? order.paymentMethod.toUpperCase() : 'CASH'}</span>
                      </td>

                      <td style={{ padding: 12, textAlign: 'center' }}>
                        <button
                          onClick={() => handlePrintKOT(order)}
                          style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '4px 8px', borderRadius: 6, fontSize: '0.78rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                          title="Print Receipt"
                        >
                          <Printer size={13} /> Print
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB: CUSTOMERS DIRECTORY CRM */}
      {activeAdminTab === 'customers' && (
        <div style={{ background: 'white', padding: 24, borderRadius: 16, border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#164324', margin: 0, fontFamily: 'var(--font-brand)' }}>
                Registered Customers Directory CRM ({customersList.length})
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '4px 0 0' }}>
                Complete directory of all saved customer profiles, lifetime spending & loyalty stamp progress
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={exportCustomersCSV}
                style={{
                  background: '#164324',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Download size={15} /> Export Customers CSV
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: 14, top: 12 }} />
            <input
              type="text"
              placeholder="Search customer by Name, Phone, or Delivery Address..."
              value={customerSearch}
              onChange={e => setCustomerSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 14px 10px 42px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            />
          </div>

          {filteredCustomers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              <Users size={40} color="#cbd5e1" style={{ margin: '0 auto 10px' }} />
              <h4>No Customer Records Found</h4>
              <p style={{ fontSize: '0.85rem' }}>Customer data is automatically captured on profile creation and order placement.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569', fontWeight: 800 }}>
                    <th style={{ padding: 12 }}>Customer Name</th>
                    <th style={{ padding: 12 }}>Mobile Number</th>
                    <th style={{ padding: 12 }}>Delivery Address</th>
                    <th style={{ padding: 12, textAlign: 'center' }}>Total Orders</th>
                    <th style={{ padding: 12, textAlign: 'right' }}>Lifetime Spend</th>
                    <th style={{ padding: 12, textAlign: 'center' }}>Stamps Progress</th>
                    <th style={{ padding: 12, textAlign: 'center' }}>Quick WhatsApp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((cust, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: 12 }}>
                        <div style={{ fontWeight: 800, color: '#164324' }}>{cust.name}</div>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Last active: {new Date(cust.lastOrderDate).toLocaleDateString()}</span>
                      </td>

                      <td style={{ padding: 12 }}>
                        <div style={{ fontWeight: 700 }}>📞 {cust.phone}</div>
                      </td>

                      <td style={{ padding: 12, maxWidth: 220 }}>
                        <div style={{ fontSize: '0.82rem', color: '#334155' }}>
                          {cust.address || 'Takeaway Spot / Address Not Set'}
                        </div>
                        {cust.pincode && <span style={{ fontSize: '0.72rem', color: '#64748b' }}>PIN: {cust.pincode}</span>}
                      </td>

                      <td style={{ padding: 12, textAlign: 'center' }}>
                        <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: 6, fontWeight: 800 }}>
                          {cust.ordersCount} orders
                        </span>
                      </td>

                      <td style={{ padding: 12, textAlign: 'right' }}>
                        <strong style={{ color: '#164324', fontSize: '0.95rem' }}>₹{cust.totalSpent}</strong>
                      </td>

                      <td style={{ padding: 12, textAlign: 'center' }}>
                        <span style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde047', padding: '2px 8px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 800 }}>
                          ★ {cust.qualifyingOrdersCount % 5}/5 Stamps
                        </span>
                      </td>

                      <td style={{ padding: 12, textAlign: 'center' }}>
                        <a
                          href={`https://wa.me/91${cust.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${cust.name}, greetings from Desi Eats Rajarhat! 🍛`)}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            background: '#25d366',
                            color: 'white',
                            textDecoration: 'none',
                            padding: '4px 10px',
                            borderRadius: 6,
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                        >
                          <MessageSquare size={13} /> Chat
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  if (window.confirm('Reset all menu items to the default menu?')) {
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
                🔄 Reset to Default Menu
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
                    <td style={{ padding: 12, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 4,
                          border: item.isVeg ? '2px solid #15803d' : '2px solid #b91c1c',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: 3,
                          flexShrink: 0
                        }}
                      >
                        <div
                          style={{
                            width: item.isVeg ? 8 : 0,
                            height: item.isVeg ? 8 : 0,
                            borderRadius: item.isVeg ? '50%' : 0,
                            backgroundColor: item.isVeg ? '#15803d' : 'transparent',
                            borderLeft: !item.isVeg ? '4px solid transparent' : 'none',
                            borderRight: !item.isVeg ? '4px solid transparent' : 'none',
                            borderBottom: !item.isVeg ? '7px solid #b91c1c' : 'none'
                          }}
                        />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <strong style={{ color: '#1f2937', fontSize: '0.95rem' }}>{item.name}</strong>
                          {item.isSpecial && (
                            <span style={{ background: '#fef3c7', color: '#b45309', fontSize: '0.7rem', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>
                              ★ Special
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '3px 0 0', maxWidth: 380, lineHeight: 1.35 }}>
                          {item.description}
                        </p>
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
          key={editingItem ? editingItem.id : 'new-dish-modal'}
          item={editingItem}
          itemToEdit={editingItem}
          onClose={() => {
            setIsMenuModalOpen(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
};
