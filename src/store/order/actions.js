import {generateBillNo} from "src/utils";



export function addToCart(context, { item, qty, remarks, modifiers }) {
  let newItem = {
    info: item,
    qty: qty ? qty : 1,
    remarks: remarks ? remarks : null,
    modifiers: modifiers ? modifiers : [],
    key: item.id + '_' + modifiers?.map(m => m.id).sort().join(',') + '_' + (remarks ? remarks : '')
  }

  context.commit('addToCart', newItem)
}

export function setCustomer(context, customer) {
  context.commit('setCustomer', customer)
}

export function clearCart(context) {
  context.commit('setItems', [])
}

export function setPayment(context, { type, payment }) {
  context.commit('setPayments', { type, payment })
}

export function setDiscount(context, discount) {
  context.commit('setDiscount', discount)
}


export function holdOrder(context) {
  let order = JSON.stringify(context.state);
  context.commit("data/addToHoldList", {
    id: context.state.id,
    billNo: context.state.billNo,
    customer: context.state.customer?.name,
    order: order
  }, { root: true });

  return context.dispatch('newOrder')
}

export async function unHoldOrder(context, id) {
  if (context.state.items.length) {
    let order = JSON.stringify(context.state);
    context.commit("data/addToHoldList", {
      id: context.state.id,
      billNo: context.state.billNo,
      customer: context.state.customer?.name,
      order: order
    }, { root: true });
  }

  const order = await context.dispatch('data/unHoldOrder', id, { root: true })
  await context.dispatch("setState", JSON.parse(order.order))
}

export function cancelOrder(context) {
  return context.dispatch('newOrder');
}

export async function loadOrder(context, order) {
  let delivery;
  if (order.deliveryType === 'dineIn') {
    delivery = { type: 'dineIn' }
  } else if (order.deliveryType === 'homeDelivery') {
    delivery = { type: 'homeDelivery', name: order.name, address: order.address, phone: order.phone }
  } else if (order.deliveryType === 'pickup') {
    delivery = { type: 'homeDelivery', date: order.date.split(' ')[0], time: order.date.split(' ')[1] }
  }

  let payments = { cash: { amount: null }, card: { amount: null }, points: { redeemed: null, costPerPoint: null }}
  order.payments?.forEach(v => {
    if (v.type === 'cash' || v.type === 'card') {
      payments[v.type] = { amount: v.amount }
    } else if (v.type === 'rewardPoints') {
      const costPerPoint = context.rootState.app.settings.payment.costPerPoint;
      payments['points'] = { redeemed: v.amount/costPerPoint, costPerPoint: costPerPoint }
    }
  })

  context.commit("setState", {
    id: order.id,
    items: [],
    customer: order.customer,
    billNo: order.billNo,
    status: order.status || 'pending',
    discount: order.discount,
    payments: payments,
    coupons: [],
    delivery: delivery,
    saved: !!order.id
  })

  for (let i = 0; i < order.items?.length; i++) {
    const item = order.items[i];
    const info = context.rootState.data.items.find(v => v.id === item.item[0]);
    let modifiers = JSON.parse(item.modifiers);
    modifiers = Object.keys(modifiers).map(m => {
      const find = info.modifier.find(f => m.toLowerCase() === f.name.toLowerCase());
      return modifiers[m].map(mi => find.items.find(f => mi.toLowerCase() === f.name.toLowerCase()))
    });
    modifiers = JSON.parse(JSON.stringify(modifiers.reduce((acc, v) => { acc.push(...v); return acc; }, [])))
    await context.dispatch('addToCart', { item: info, qty: item.qty, remarks: item.remarks, modifiers })
  }
}

export function setState(context, order) {
  context.commit("setState", order)
}

export function newOrder(context) {
  const bill = generateBillNo();
  context.commit("setState", {
    id: bill,
    items: [],
    customer: null,
    billNo: bill,
    status: 'active',
    discount: null,
    payments: { cash: { amount: null }, card: { amount: null }, points: { redeemed: null, costPerPoint: null }},
    coupons: [],
    delivery: { type: 'dineIn'},
    saved: false
  })
}

export function setDeliveryDetails(context, { type, data }) {
  const delivery = Object.assign({}, data);
  delivery.type = type;

  context.commit('setDeliveryDetails', delivery)
}

export function extractLastOrder(context) {
  const lastBill = {
    order: JSON.parse(JSON.stringify(context.state)),
    id: context.state.id,
    amountInfo: context.getters.amountInfo,
    paymentInfo: context.getters.paymentInfo,
    customerCurrentStatus: context.getters.customerCurrentStatus,
  }

  return context.dispatch("data/setLastOrder", lastBill, {root: true})
}

export function setOrderId(context, id) {
  context.commit('setOrderId', id)
}

export async function loadLastOrder(context) {
  if (!context.rootState.data.lastOrder) {
    return;
  }

  await context.dispatch('setState', context.rootState.data.lastOrder.order)
  await context.dispatch('data/setLastOrder', null, { root: true })
}
