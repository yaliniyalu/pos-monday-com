import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

import boards from './schema'

import { date } from 'quasar'
import {getNowDate, toMondayUTCDate} from "src/utils";
import {updateCustomer} from "src/modals/customer";
import {createPayments} from "src/modals/payment";
import {saveOrder, saveOrderItems} from "src/modals/order";
import {queryItems} from "src/modals/query";
import {parseMondayItem, parseMondayQueryValues} from "src/modals/utils";


const itemDefault = {
  id: null,
  name: null,
  code: null,
  price: 0,
  tax: 0,
  image: null,
  category: null,
  modifier: [],
  isAvailable: false,
  availability: null
}

const categoryDefault = {
  id: null,
  name: null,
  image: null
}

const modifierDefault = {
  id: null,
  name: null,
  multiple: false,
  empty: false,
  items: []
}

const modifierItemDefault = {
  id: null,
  name: null,
  price: 0,
  isDefault: false,
  isAvailable: false,
  availability: null,
  parent: null,
  parentName: null
}

export default {
  async getItems() {
    const res = await monday.api(`query {
      boards(ids: [${boards.item.id}, ${boards.category.id}, ${boards.modifier.id}]) {
        id
        name
        items {
          id
          name
          column_values {
            id
            value
            text
          }
        }
      }
    }
    `)

    const itemBoard = res['data']['boards'].find(v => v.id === boards.item.id)['items'];
    const categoryBoard = res['data']['boards'].find(v => v.id === boards.category.id)['items'];
    const attributeBoard = res['data']['boards'].find(v => v.id === boards.modifier.id)['items'];

    const category = categoryBoard.map(v => parseMondayItem(v, boards.category, categoryDefault))
    const modifiers = attributeBoard.map(v => parseMondayItem(v, boards.modifier, modifierDefault))

    for (let i = 0; i < modifiers.length; i ++) {
      if (!modifiers[i].items.length) {
        continue;
      }

      modifiers[i].items = (await queryItems(modifiers[i].items))
        .map(s => parseMondayItem(s, boards.modifier.sub, modifierItemDefault))
        .map(item => {
          item.parent = modifiers[i].id;
          item.parentName = modifiers[i].name;
          item.isAvailable = item.availability === 'available';
          return item;
        })
    }



    const items = itemBoard
      .map(ib => parseMondayItem(ib, boards.item, itemDefault))
      .map(item => {
        if (item.category) {
          item.category = category.find(c => +c.id === item.category[0])
        }

        if (item.modifier) {
          item.modifier = item.modifier.map(p => modifiers.find(a => +a.id === p)).filter(f => f !== undefined)
        } else {
          item.modifier = [];
        }

        item.isAvailable = item.availability === 'available';

        return item;
      })


    return {items, category, modifiers}
  },

  async getMe() {
    const res = await monday.api(`query {
      me {
        id
        name
      }
    }`);

    return res.data.me
  },

  async saveOrder(orderOrig, amount, pInfo, member, delivery, customerCurrentStatus) {
    const payments = orderOrig.payments;
    const pay = [];

    const now = getNowDate();

    const name = member ? member.name : orderOrig.billNo;
    const status = 'paid';
    if (payments.cash?.amount) {
      pay.push({
        name, status, date: now,
        type: 'cash',
        amount: payments.cash.amount
      })
    }

    if (payments.card?.amount) {
      pay.push({
        name, status, date: now,
        type: 'card',
        amount: payments.card.amount
      })
    }

    if (payments.points?.redeemed) {
      pay.push({
        name, status, date: now,
        type: 'rewardPoints',
        amount: payments.points.redeemed * payments.points.costPerPoint
      })
    }

    let paymentIds = [];
    if (pay.length) {
      paymentIds = await createPayments(pay)
      paymentIds = paymentIds.map(v => v.id)
    }

    const order = {
      payableAmount: amount.payableAmount,
      subTotal: amount.subTotal,
      tax: amount.tax.amount,
      discount: amount.discount.amount,
      roundOff: amount.roundOff,
      paidAmount: pInfo.paid,
      balanceAmount: pInfo.balance,
      paymentStatus: pInfo.status,
    };

    if (!orderOrig.date) {
      order.date = date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss')
    } else {
      order.date = orderOrig.date;
    }

    order.deliveryType = delivery.type;
    if (delivery.type === 'homeDelivery') {
      order.name = delivery.name;
      order.phone = delivery.phone;
      order.address = delivery.address;
    } else if (delivery.type === 'pickup') {
      order.pickupTime = toMondayUTCDate(delivery.date + ' ' + delivery.time)
    }

    if (member) {
      order.customer = [+member.id];
    }

    if (paymentIds.length) {
      order.payments = paymentIds;
    }

    order.billNo = orderOrig.billNo;

    let id = await saveOrder(order);
    id = id['id'];

    const items = orderOrig.items.map(v => {
      const modifiers = {};
      v.modifiers.forEach(m => {
        if (!modifiers[m.parentName]) {
          modifiers[m.parentName] = [];
        }

        modifiers[m.parentName].push(m.name)
      })

      return {
        name: v.info.name,
        item: [+v.info.id],
        qty: v.qty,
        total: v.totalPrice,
        remarks: v.remarks,
        status: 'pending',
        modifiers: JSON.stringify(modifiers)
      }
    })

    await saveOrderItems(id, items);

    if (member) {
      await updateCustomer(member, customerCurrentStatus)
    }

    return id;
  },
}
