/**
 * Order status normalization and date helpers
 */

export const isOrderCompleted = (order) => {
  if (!order) return false;
  const s = String(order.status || '').trim().toUpperCase();
  return s === 'COMPLETED' || s === 'DELIVERED' || s === 'DONE' || s === 'CANCELLED' || s === 'REJECTED';
};

export const normalizeOrderStatus = (status) => {
  if (!status) return 'RECEIVED';
  const s = String(status).trim().toUpperCase();
  if (s === 'COMPLETED' || s === 'DELIVERED' || s === 'DONE') return 'COMPLETED';
  if (s === 'PREPARING' || s === 'COOKING') return 'PREPARING';
  if (s === 'READY' || s === 'DISPATCHED' || s === 'OUT_FOR_DELIVERY') return 'READY';
  if (s === 'CANCELLED' || s === 'REJECTED') return 'CANCELLED';
  return 'RECEIVED';
};

export const formatOrderDateTime = (dateVal) => {
  if (!dateVal) return { date: 'Today', time: '' };
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return { date: String(dateVal), time: '' };
    return {
      date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    };
  } catch (e) {
    return { date: 'Today', time: '' };
  }
};
