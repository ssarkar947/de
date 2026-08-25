// Helper utility for generating formatted WhatsApp order confirmation & status updates

export const RESTAURANT_PHONE = '6291288522';

/**
 * Format a complete order confirmation receipt for WhatsApp
 */
export const generateOrderConfirmationMessage = (order) => {
  const itemsText = (order.items || [])
    .map(i => `• ${i.quantity}x ${i.item?.name || 'Dish'} ${i.selectedVariation ? `(${i.selectedVariation.name})` : ''} - ₹${(i.unitPrice || 0) * (i.quantity || 1)}`)
    .join('\n');

  return (
`🍛 *DESI EATS - ORDER CONFIRMATION* 🍛
━━━━━━━━━━━━━━━━━━
*Order ID:* #${order.id}
*Date & Time:* ${order.orderDate || new Date(order.createdAt).toLocaleDateString('en-IN')}, ${order.orderTime || new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
*Customer:* ${order.customerName}
*Phone:* ${order.customerPhone}
*Order Mode:* ${order.orderMode?.toUpperCase() || 'DELIVERY'}
${order.orderMode === 'delivery' ? `*Delivery Address:* ${order.address} (PIN: ${order.pincode})` : '*Pickup:* Desi Eats Takeaway Counter'}
━━━━━━━━━━━━━━━━━━
*ITEMS ORDERED:*
${itemsText}
━━━━━━━━━━━━━━━━━━
${order.discount > 0 ? `*Discount Saved:* ₹${order.discount}\n` : ''}*Total Amount:* ₹${order.totalAmount} (${(order.paymentMethod || 'CASH').toUpperCase()})
*Order Status:* ${order.status || 'RECEIVED'} 👨‍🍳

Track your order live anytime:
👉 https://desieats.online

Thank you for choosing Desi Eats! ❤️`
  );
};

/**
 * Generate kitchen alert message for restaurant owner/chef
 */
export const generateKitchenAlertMessage = (order) => {
  const itemsText = (order.items || [])
    .map(i => `• ${i.quantity}x ${i.item?.name || 'Dish'} ${i.selectedVariation ? `(${i.selectedVariation.name})` : ''}`)
    .join('\n');

  return (
`🔔 *NEW ORDER RECEIVED #${order.id}* 🔔
━━━━━━━━━━━━━━━━━━
*Customer:* ${order.customerName} (📞 ${order.customerPhone})
*Mode:* ${order.orderMode?.toUpperCase()}
*Time:* ${order.orderTime || new Date(order.createdAt).toLocaleTimeString()}
${order.orderMode === 'delivery' ? `*Address:* ${order.address} (PIN: ${order.pincode})` : '*Spot:* Counter Takeaway'}
━━━━━━━━━━━━━━━━━━
*ITEMS TO COOK:*
${itemsText}
━━━━━━━━━━━━━━━━━━
*Total:* ₹${order.totalAmount} (${(order.paymentMethod || 'CASH').toUpperCase()})
${order.instructions ? `*Special Note:* ${order.instructions}\n` : ''}
Manage Order: https://desieats.online/#kitchen`
  );
};

/**
 * Generate status update message to customer
 */
export const generateCustomerStatusMessage = (order, status) => {
  let statusHeadline = 'Order Update';
  let details = '';

  if (status === 'PREPARING') {
    statusHeadline = '🍳 Your Meal is Being Cooked!';
    details = `Our chefs have started preparing your meal with fresh ingredients. Estimated prep time: *${order.prepTimeMinutes || 20} mins*.`;
  } else if (status === 'READY') {
    statusHeadline = order.orderMode === 'delivery' ? '🚀 Out For Delivery!' : '🎉 Ready for Counter Pickup!';
    details = order.orderMode === 'delivery'
      ? `Your hot food has been packed and is on its way to *${order.address}*.`
      : `Your order is packed and waiting hot at our takeaway counter. Show Order *#${order.id}* to collect.`;
  } else if (status === 'COMPLETED') {
    statusHeadline = '✅ Order Delivered / Completed!';
    details = 'We hope you loved your meal! Don\'t forget to collect your loyalty stamp towards a FREE dish on your 5th order.';
  } else {
    statusHeadline = '🍛 Order Received!';
    details = 'We have received your order and sent it to the kitchen.';
  }

  return (
`🍛 *DESI EATS - ${statusHeadline}* 🍛
━━━━━━━━━━━━━━━━━━
*Order ID:* #${order.id}
*Customer:* ${order.customerName}

${details}

*Items:* ${(order.items || []).map(i => `${i.quantity}x ${i.item?.name}`).join(', ')}
*Total:* ₹${order.totalAmount} (${(order.paymentMethod || 'CASH').toUpperCase()})

Track live status:
👉 https://desieats.online

Thank you! ❤️`
  );
};

/**
 * Open WhatsApp with pre-filled text
 */
export const openWhatsApp = (phone, message) => {
  const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
  const encodedText = encodeURIComponent(message);
  const target = cleanPhone ? `https://wa.me/91${cleanPhone}?text=${encodedText}` : `https://wa.me/?text=${encodedText}`;
  window.open(target, '_blank');
};
