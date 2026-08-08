import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, CheckCircle, Flame, Bike, Store, Bell, X, Sparkles, Banknote, QrCode } from 'lucide-react';

export const OrderTracker = () => {
  const { orders, activeOrderId, isOrderTrackerOpen, setIsOrderTrackerOpen } = useApp();
  const [timeLeftStr, setTimeLeftStr] = useState('');

  const order = orders.find(o => o.id === activeOrderId);

  useEffect(() => {
    if (!order || !order.readyAtTime) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(order.readyAtTime).getTime();
      const diffMs = target - now;

      if (diffMs <= 0) {
        setTimeLeftStr('00:00');
        clearInterval(interval);
      } else {
        const mins = Math.floor(diffMs / 60000);
        const secs = Math.floor((diffMs % 60000) / 1000);
        setTimeLeftStr(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [order]);

  if (!isOrderTrackerOpen || !order) return null;

  const isTakeaway = order.orderMode === 'takeaway';
  const isUpiQr = order.paymentMethod === 'upi_qr';

  return (
    <div className="modal-overlay" onClick={() => setIsOrderTrackerOpen(false)}>
      <div className="modal-card" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header" style={{ background: '#1b4332', color: 'white' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={18} color="#e5a024" />
              <h3 style={{ color: 'white', margin: 0 }}>Order Tracking #{order.id}</h3>
            </div>
            <span style={{ fontSize: '0.8rem', opacity: 0.85 }}>
              Placed at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <button
            onClick={() => setIsOrderTrackerOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Main Status Hero */}
          <div style={{
            background: order.status === 'READY' ? '#ecfdf5' : '#fdfbf7',
            border: order.status === 'READY' ? '2px solid #10b981' : '1px solid #e5e7eb',
            borderRadius: 16,
            padding: 20,
            textAlign: 'center',
            marginBottom: 24
          }}>
            {order.status === 'RECEIVED' && (
              <div>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <Bell size={24} className="animate-bounce" />
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1f2937' }}>Order Sent to Kitchen</h4>
                <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: 4 }}>
                  The chef is assigning preparation time. You will get a notification shortly!
                </p>
              </div>
            )}

            {order.status === 'PREPARING' && (
              <div>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <Flame size={24} />
                </div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1b4332' }}>Preparing Your Meal Fresh!</h4>
                <p style={{ fontSize: '0.85rem', color: '#4b5563', marginTop: 4 }}>
                  Kitchen assigned waiting time: <strong>{order.prepTimeMinutes || '20'} mins</strong>
                </p>

                {timeLeftStr && (
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 900,
                    color: '#d85d27',
                    marginTop: 12,
                    fontFamily: 'monospace',
                    letterSpacing: 2
                  }}>
                    {timeLeftStr}
                    <span style={{ fontSize: '0.8rem', display: 'block', fontWeight: 600, color: '#6b7280' }}>
                      Estimated Countdown
                    </span>
                  </div>
                )}
              </div>
            )}

            {order.status === 'READY' && (
              <div>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <CheckCircle size={32} />
                </div>
                <h4 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#065f46' }}>
                  {isTakeaway ? '🎉 ORDER READY FOR TAKEAWAY PICKUP!' : '🚀 OUT FOR DELIVERY!'}
                </h4>
                <p style={{ fontSize: '0.9rem', color: '#047857', marginTop: 6, fontWeight: 600 }}>
                  {isTakeaway
                    ? 'Your delicious food is packed and hot at the shop counter! Show Order #' + order.id + ' to collect.'
                    : 'Our delivery partner is on the way to your address!'}
                </p>
              </div>
            )}

            {order.status === 'COMPLETED' && (
              <div>
                <CheckCircle size={32} color="#10b981" style={{ margin: '0 auto 8px' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1f2937' }}>Order Completed</h4>
                <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Thank you for ordering with Desi Eats!</p>
              </div>
            )}
          </div>

          {/* Timeline Steps */}
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: 24, padding: '0 10px' }}>
            {['RECEIVED', 'PREPARING', 'READY', 'COMPLETED'].map((st, idx) => {
              const stepMap = { RECEIVED: 1, PREPARING: 2, READY: 3, COMPLETED: 4 };
              const currentStep = stepMap[order.status] || 1;
              const thisStep = stepMap[st];
              const isPassed = currentStep >= thisStep;

              return (
                <div key={st} style={{ flex: 1, textAlign: 'center', position: 'relative', zIndex: 2 }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: isPassed ? '#1b4332' : '#e5e7eb',
                    color: isPassed ? 'white' : '#9ca3af',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 6px',
                    fontWeight: 800,
                    fontSize: '0.8rem'
                  }}>
                    {isPassed ? '✓' : idx + 1}
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: isPassed ? '#1b4332' : '#9ca3af', textTransform: 'uppercase' }}>
                    {st === 'READY' ? (isTakeaway ? 'Ready Pickup' : 'Dispatched') : st}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Payment Method & Delivery Info */}
          <div style={{ background: isUpiQr ? '#fefce8' : '#f0fdf4', padding: 12, borderRadius: 10, border: '1px solid #cbd5e1', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: isUpiQr ? '#854d0e' : '#166534' }}>
              {isUpiQr ? <QrCode size={18} /> : <Banknote size={18} />}
              <span>Payment: {isUpiQr ? 'UPI / QR Scan at Shop' : 'Cash at Counter/Delivery'}</span>
            </div>
            <span style={{ fontWeight: 800, color: '#1b4332' }}>{isTakeaway ? 'TAKEAWAY' : 'DELIVERY'}</span>
          </div>

          {/* Items Summary */}
          <div style={{ background: '#f8fafc', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: 8, textTransform: 'uppercase' }}>
              Desi Plate Breakdown ({order.items.length} items)
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
              {order.items.map((it, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>
                    {it.quantity}x {it.item.name}
                    {it.selectedVariation && <span style={{ color: '#d85d27', fontWeight: 600 }}> ({it.selectedVariation.name})</span>}
                  </span>
                  <span style={{ fontWeight: 700 }}>₹{it.unitPrice * it.quantity}</span>
                </div>
              ))}
            </div>

            {order.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#15803d', fontWeight: 700, marginBottom: 6 }}>
                <span>Coupon Discount ({order.appliedCouponCode})</span>
                <span>-₹{order.discount}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 800, color: '#1b4332', paddingTop: 8, borderTop: '1px dashed #cbd5e1' }}>
              <span>Total Payable</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
