import schema from 'src/modals/schema';
import {convertToMondayQueryValues, parseMondayItem, parseMondayQueryValues} from "src/modals/utils";
import {getCustomer} from "src/modals/customer";
import {getPayments} from "src/modals/payment";
import {createItem, createSubItemMultiple, queryBoardItems, queryItems, queryItemsByValue} from "src/modals/query";

export async function listOrders(page, limit = 50) {
  const c = schema.order.columns;
  const fetchColumns = [c.date.id, c.status.id, c.deliveryType.id, c.deliveryStatus.id, c.paymentStatus.id, c.payableAmount.id]

  const items = await queryBoardItems(schema.order.id, fetchColumns, page, limit);
  return items.map(item => {
    let order = parseMondayQueryValues(item.column_values, schema.order);

    order.name = order.billNo = item.name;
    order.id = +item.id;

    return order;
  });
}

export async function getOrder(id) {
  const items = await queryItems([id]);
  if (!items.length) {
    return null;
  }

  const item = items[0];
  return await parseOrder(item)
}

export async function getOrderByBillNo(billNo) {
  const items = await queryItemsByValue(schema.order.id, schema.order.columns.billNo.id, billNo);
  if (!items.length) {
    return null;
  }

  const item = items[0];
  return await parseOrder(item)
}

export async function listOrdersByDate(date, page, limit = 10) {
  const c = schema.order.columns
  const items = await queryItemsByValue(schema.order.id, schema.order.columns.date.id, date, [c.date.id, c.billNo.id, c.status.id, c.paymentStatus.id, c.deliveryType.id, c.deliveryStatus.id, c.payableAmount.id]);
  if (!items.length) {
    return null;
  }

  const itemP = items.map(v => parseOrder(v));
  return await Promise.all(itemP);
}

async function getOrderItems(ids) {
  const items = await queryItems(ids);
  if (!items.length) {
    return [];
  }

  return items.map(i => parseMondayItem(i, schema.order.sub, itemsDefaults))
}

export async function saveOrder(order) {
  const name = order.billNo;
  const values = convertToMondayQueryValues(order, schema.order);

  const data = await createItem(schema.order.id, name, values)
  return parseMondayItem(data, schema.order, {});
}

export async function saveOrderItems(order, items) {
  items = items.map(i => {
    const values = convertToMondayQueryValues(i, schema.order.sub);
    const { name } = values;

    delete values.id;
    delete values.name;

    return { name, values }
  })

  const data = await createSubItemMultiple(order, items)
  return parseMondayItem(data, schema.order.sub, itemsDefaults);
}

async function parseOrder(item) {
  let order = parseMondayQueryValues(item.column_values, schema.order);

  order.name = item.name;
  order.id = +item.id;

  if (order.customer?.length) {
    order.customer = await getCustomer(order.customer[0])
  }

  if (order.payments?.length) {
    order.payments = await getPayments(order.payments);
  }

  if (order.items?.length) {
    order.items = await getOrderItems(order.items);
  }

  return order;
}

const itemsDefaults = {
  item: null,
  qty: 0,
  total: 0,
  remarks: null,
  modifiers: [],
  status: null
}
