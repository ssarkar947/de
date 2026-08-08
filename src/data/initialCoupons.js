export const INITIAL_COUPONS = [
  {
    code: 'DESI20',
    description: 'Get 20% OFF on orders above ₹300',
    type: 'percentage', // 'percentage' or 'flat'
    value: 20,
    maxDiscount: 100,
    minOrder: 300,
    active: true
  },
  {
    code: 'WELCOME50',
    description: 'Flat ₹50 OFF on your first order',
    type: 'flat',
    value: 50,
    maxDiscount: 50,
    minOrder: 250,
    active: true
  },
  {
    code: 'RAJARHAT10',
    description: '10% OFF Special Rajarhat Local Discount',
    type: 'percentage',
    value: 10,
    maxDiscount: 60,
    minOrder: 200,
    active: true
  }
];
