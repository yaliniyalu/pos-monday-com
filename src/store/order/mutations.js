import {getItemKey, setCalculatedValues} from "src/utils";
import {matCarRepair} from "@quasar/extras/material-icons";



export const addToCart = (state, item) =>  {
  setCalculatedValues(item)
  let findItem = state.items.find(v => v.key === item.key);
  if (findItem) {
    findItem.qty += item.qty;
    setCalculatedValues(findItem)
  } else {
    state.items.push(item)
  }
}
export const updateItemInCart = (state, item) => {
  setCalculatedValues(item);
  state.items = [...state.items.map(i => i.key !== item.key ? i : {...i, ...item})]
}

export const pushToCart = (state, { item, update, replace }) => {
  const updateKeys = Object.keys(update);
  updateKeys.forEach(v => item[v] = update[v]);

  const key = getItemKey(item);

  let findItem = state.items.find(v => v.key === key);
  if (findItem) {
    setCalculatedValues(findItem)

    if (replace && replace !== key) { // delete
      findItem.qty += item.qty;
      state.items = state.items.filter(i => i.key !== item.key)
    } else if (!replace) {
      findItem.qty += item.qty;
    }
  } else {
    setCalculatedValues(item)

    if (replace) { // replace
      state.items = [...state.items.map(i => i.key !== replace ? i : {...i, ...item})]
    } else { // add
      state.items.push(item)
    }
  }
}

export const deleteItemFromCart = (state, item) => state.items = state.items.filter(i => i.key !== item.key)

export const setCustomer = (state, customer) => state.customer = customer;
export const setItems = (state, items) => state.items = items;
export const setPayments = (state, { type, payment }) => state.payments[type] = payment;
export const setDiscount = (state, discount) => state.discount = discount;
export const setDeliveryDetails = (state, details) => state.delivery = details;

export const setState = (state, order) => Object.keys(order).forEach(v => state[v] = order[v])
export const setOrderId = (state, id) => state.id = id;
