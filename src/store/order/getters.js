import {percent, round} from "src/filters";

export function amountInfo(state) {
  let subTotal = 0;
  let tax = 0;
  let discount = { amount: 0, percent: 0 };

  state.items.forEach(i => {
    subTotal += i.totalPrice;
    tax += i.info.tax
  });

  if (state.discount) {
    if (state.discount.type === '%') {
      discount = {
        amount: (state.discount.value * subTotal) / 100,
        percent: state.discount.value
      }
    } else {
      discount = {
        amount: state.discount.value,
        percent: percent(state.discount.value, subTotal)
      }
    }
  }

  let grandTotal = subTotal - discount.amount;
  let payableAmount = round(grandTotal);
  let roundOff = payableAmount - grandTotal;

  return {
    subTotal,
    discount,
    tax: {
      amount: tax,
      type: 'Incl',
      percent: percent(tax, subTotal)
    },
    roundOff,
    grandTotal,
    payableAmount,
  }
}


export function paymentInfo(state, getters) {
  let paid = 0;
  paid += state.payments.cash.amount
  paid += state.payments.card.amount
  paid += state.payments.points.redeemed * state.payments.points.costPerPoint;

  return {
    paid,
    balance: getters.amountInfo.payableAmount - paid,
    status: (paid && paid === getters.amountInfo.payableAmount) ? 'paid' : 'pending'
  }
}

export function customerCurrentStatus(state, getters, rootState) {
  if (!state.customer) {
    return {
      totalPurchased: getters.amountInfo.payableAmount,
      totalDiscounted: getters.amountInfo.discount,
      rewardPoints: getters.amountInfo.payableAmount / rootState.app.settings.payment.pointPerAmount
    }
  }

  return {
    totalPurchased: state.customer.totalPurchased + getters.amountInfo.payableAmount,
    totalDiscounted: state.customer.totalDiscounted + getters.amountInfo.discount,
    rewardPoints: state.customer.rewardPoints + (getters.amountInfo.payableAmount / rootState.app.settings.payment.pointPerAmount)
  }
}
