export default function () {
  return {
    id: null,
    items: [],
    customer: null,
    billNo: null,
    status: 'active',
    discount: null,
    payments: {
      cash: { amount: null },
      card: { amount: null },
      points: { redeemed: null, costPerPoint: null }
    },
    coupons: [],
    delivery: {
      type: 'dineIn'
    },
    saved: false
  }
}
