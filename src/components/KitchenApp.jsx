import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  BellOff,
  CheckCircle2,
  Clock,
  Printer,
  ChefHat,
  Volume2,
  Phone,
  MapPin,
  Flame,
  ArrowLeft,
  Download,
  Smartphone,
  Sparkles
} from 'lucide-react';

export const KitchenApp = () => {
  const {
    orders,
    updateOrderStatus,
    isRinging,
    stopRingerLoop,
    playRingerBeep,
    isAudioMuted,
    setIsAudioMuted,
    setActiveTab,
    showToast
  } = useApp();

  const [selectedFilter, setSelectedFilter] = useState('ALL'); // ALL, RECEIVED, PREPARING, READY
  const [selectedPrepTimes, setSelectedPrepTimes] = useState({});

  const filteredOrders = orders.filter(order => {
    if (selectedFilter === 'RECEIVED') return order.status === 'RECEIVED';
    if (selectedFilter === 'PREPARING') return order.status === 'PREPARING';
    if (selectedFilter === 'READY') return order.status === 'READY';
    return order.status !== 'COMPLETED';
  });

  const receivedCount = orders.filter(o => o.status === 'RECEIVED').length;
  const preparingCount = orders.filter(o => o.status === 'PREPARING').length;
  const readyCount = orders.filter(o => o.status === 'READY').length;

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
            ${i.options && i.options.length > 0 ? `<div style="font-size:12px; padding-left:12px;">+ ${i.options.map(o=>o.name).join(', ')}</div>` : ''}
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

  return (
    <div style={{ background: '#0f172a', color: '#f8fafc', minHeight: '100vh', padding: 16 }}>
      {/* Flashing Loud Ringer Alarm Banner */}
      {isRinging && (
        <div style={{
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          padding: '16px 20px',
          borderRadius: 16,
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          animation: 'pulse 1s infinite alternate',
          boxShadow: '0 8px 24px rgba(239, 68, 68, 0.4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Volume2 size={26} className="animate-bounce" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>🔔 LOUD ALARM: NEW ORDER RECEIVED!</h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>Select prep time and click Accept to start cooking and silence ringer.</p>
            </div>
          </div>
          <button
            onClick={stopRingerLoop}
            style={{
              background: 'white',
              color: '#dc2626',
              border: 'none',
              padding: '10px 18px',
              borderRadius: 30,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <BellOff size={18} /> Silence Alarm
          </button>
        </div>
      )}

      {/* App Top Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => setActiveTab('customer')}
            style={{ background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}
          >
            <ArrowLeft size={16} /> Exit App
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ChefHat size={28} color="#e5a024" />
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-brand)', color: '#f8fafc', margin: 0 }}>
                DESI EATS - Kitchen Partner App
              </h2>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Live Order Queue & Alarm Ringer</span>
            </div>
          </div>
        </div>

        {/* Alarm Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={playRingerBeep}
            style={{ background: '#334155', border: 'none', color: 'white', padding: '8px 14px', borderRadius: 8, fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
          >
            🔊 Test Alarm
          </button>
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            style={{
              background: isAudioMuted ? '#94a3b8' : '#164324',
              color: 'white',
              border: 'none',
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            {isAudioMuted ? <BellOff size={16} /> : <Bell size={16} />}
            {isAudioMuted ? 'Muted' : 'Sound ON'}
          </button>
        </div>
      </div>

      {/* Filter Navigation Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
        <button
          onClick={() => setSelectedFilter('ALL')}
          style={{
            background: selectedFilter === 'ALL' ? '#e5a024' : '#1e293b',
            color: selectedFilter === 'ALL' ? '#0f172a' : '#94a3b8',
            border: 'none',
            padding: '10px 18px',
            borderRadius: 30,
            fontWeight: 800,
            cursor: 'pointer',
            fontFamily: 'var(--font-brand)'
          }}
        >
          All Active ({filteredOrders.length})
        </button>
        <button
          onClick={() => setSelectedFilter('RECEIVED')}
          style={{
            background: selectedFilter === 'RECEIVED' ? '#ef4444' : '#1e293b',
            color: 'white',
            border: 'none',
            padding: '10px 18px',
            borderRadius: 30,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'var(--font-brand)'
          }}
        >
          🔔 New ({receivedCount})
        </button>
        <button
          onClick={() => setSelectedFilter('PREPARING')}
          style={{
            background: selectedFilter === 'PREPARING' ? '#3b82f6' : '#1e293b',
            color: 'white',
            border: 'none',
            padding: '10px 18px',
            borderRadius: 30,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'var(--font-brand)'
          }}
        >
          👨‍🍳 In Kitchen ({preparingCount})
        </button>
        <button
          onClick={() => setSelectedFilter('READY')}
          style={{
            background: selectedFilter === 'READY' ? '#10b981' : '#1e293b',
            color: 'white',
            border: 'none',
            padding: '10px 18px',
            borderRadius: 30,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'var(--font-brand)'
          }}
        >
          ✅ Ready ({readyCount})
        </button>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#1e293b', borderRadius: 16, border: '1px dashed #334155' }}>
          <ChefHat size={48} color="#64748b" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.2rem', color: '#94a3b8' }}>No Active Orders in this View</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>When new orders arrive, they will pop up here with live alarm ringers.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {filteredOrders.map(order => {
            const currentPrepTime = selectedPrepTimes[order.id] || 20;

            return (
              <div
                key={order.id}
                style={{
                  background: '#1e293b',
                  borderRadius: 16,
                  border: order.status === 'RECEIVED' ? '2px solid #ef4444' : '1px solid #334155',
                  padding: 20,
                  boxShadow: order.status === 'RECEIVED' ? '0 0 20px rgba(239, 68, 68, 0.25)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  {/* Order Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#e5a024', fontFamily: 'var(--font-brand)' }}>
                          #{order.id}
                        </span>
                        <span style={{
                          padding: '3px 10px',
                          borderRadius: 20,
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          background: order.orderMode === 'delivery' ? '#166534' : '#854d0e',
                          color: 'white'
                        }}>
                          {order.orderMode.toUpperCase()}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 2 }}>
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>

                    <button
                      onClick={() => handlePrintKOT(order)}
                      style={{ background: '#334155', border: 'none', color: '#f8fafc', padding: '6px 12px', borderRadius: 8, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      <Printer size={14} /> KOT
                    </button>
                  </div>

                  {/* Customer Info */}
                  <div style={{ background: '#0f172a', padding: 12, borderRadius: 10, marginBottom: 14, fontSize: '0.85rem' }}>
                    <div style={{ fontWeight: 700, color: '#f8fafc' }}>{order.customerName}</div>
                    <div style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      <Phone size={14} color="#e5a024" /> {order.customerPhone}
                    </div>
                    {order.orderMode === 'delivery' && (
                      <div style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <MapPin size={14} color="#ef4444" /> {order.address} (PIN: {order.pincode})
                      </div>
                    )}
                  </div>

                  {/* Items List */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 8 }}>
                      Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
                    </div>
                    {order.items.map((cartItem, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.9rem' }}>
                        <div>
                          <strong style={{ color: '#f8fafc' }}>{cartItem.quantity}x {cartItem.item.name}</strong>
                          {cartItem.selectedVariation && (
                            <span style={{ fontSize: '0.75rem', color: '#e5a024', marginLeft: 6 }}>
                              ({cartItem.selectedVariation.name})
                            </span>
                          )}
                          {cartItem.options && cartItem.options.length > 0 && (
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                              + {cartItem.options.map(o => o.name).join(', ')}
                            </div>
                          )}
                        </div>
                        <span style={{ fontWeight: 700, color: '#cbd5e1' }}>₹{cartItem.unitPrice * cartItem.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Instructions */}
                  {order.instructions && (
                    <div style={{ background: '#78350f33', border: '1px solid #78350f', padding: 8, borderRadius: 8, fontSize: '0.8rem', color: '#fde68a', marginBottom: 14 }}>
                      <strong>Note:</strong> {order.instructions}
                    </div>
                  )}
                </div>

                {/* Bottom Action Section */}
                <div style={{ borderTop: '1px solid #334155', paddingTop: 14, marginTop: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      Payment: <strong style={{ color: '#f8fafc' }}>{order.paymentMethod.toUpperCase()}</strong>
                    </span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-brand)' }}>
                      ₹{order.totalAmount}
                    </span>
                  </div>

                  {/* STATUS 1: RECEIVED -> Select Prep Time & Accept */}
                  {order.status === 'RECEIVED' && (
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: 6, fontWeight: 700 }}>
                        ⏱️ Select Preparation Time:
                      </div>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                        {[15, 20, 30, 45].map(mins => (
                          <button
                            key={mins}
                            onClick={() => handleSetPrepTime(order.id, mins)}
                            style={{
                              flex: 1,
                              padding: '6px 0',
                              borderRadius: 6,
                              border: currentPrepTime === mins ? '2px solid #e5a024' : '1px solid #334155',
                              background: currentPrepTime === mins ? '#e5a024' : '#0f172a',
                              color: currentPrepTime === mins ? '#0f172a' : 'white',
                              fontSize: '0.8rem',
                              fontWeight: 800,
                              cursor: 'pointer'
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
                          background: '#16a34a',
                          color: 'white',
                          border: 'none',
                          padding: '12px',
                          borderRadius: 10,
                          fontWeight: 800,
                          fontSize: '0.95rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)',
                          fontFamily: 'var(--font-brand)'
                        }}
                      >
                        <ChefHat size={20} /> ACCEPT & START ({currentPrepTime} mins)
                      </button>
                    </div>
                  )}

                  {/* STATUS 2: PREPARING -> Mark Ready */}
                  {order.status === 'PREPARING' && (
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#60a5fa', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                        <Clock size={16} /> Cooking (Target: {order.prepTimeMinutes || 20}m)
                      </div>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'READY')}
                        style={{
                          width: '100%',
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          padding: '12px',
                          borderRadius: 10,
                          fontWeight: 800,
                          fontSize: '0.95rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          fontFamily: 'var(--font-brand)'
                        }}
                      >
                        <CheckCircle2 size={20} /> MARK READY FOR PICKUP / DISPATCH
                      </button>
                    </div>
                  )}

                  {/* STATUS 3: READY -> Complete */}
                  {order.status === 'READY' && (
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#34d399', marginBottom: 10, fontWeight: 700 }}>
                        ✅ Food is Ready for Customer Pickup / Dispatch!
                      </div>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                        style={{
                          width: '100%',
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          padding: '12px',
                          borderRadius: 10,
                          fontWeight: 800,
                          fontSize: '0.95rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          fontFamily: 'var(--font-brand)'
                        }}
                      >
                        🎉 COMPLETE ORDER
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
