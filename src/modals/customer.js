import schema from 'src/modals/schema';
import {convertToMondayQueryValues, parseMondayItem} from "src/modals/utils";
import {createItem, queryItems, queryItemsByValue, updateItem} from "src/modals/query";

const defaults = {
  id: null,
  name: null,
  email: null,
  phone: null,
  address: null,
  status: null,
  memberType: null,
  rewardPoints: 0,
  totalPurchased: 0,
  totalDiscounted: 0,
};

export async function getCustomer(id) {
  const items = await queryItems([id]);
  if (!items.length) {
    return null;
  }

  return parseMondayItem(items[0], schema.customer, defaults);
}

export async function getCustomerByMobile(mobile) {
  const items = await queryItemsByValue(schema.customer.id, schema.customer.columns.phone.id, mobile);
  if (!items.length) {
    return null;
  }

  return parseMondayItem(items[0], schema.customer, defaults);
}

export async function createCustomer(customer) {
  const member = convertToMondayQueryValues(customer, schema.customer);
  const { name } = customer;

  delete member.id;
  delete member.name;

  const data = await createItem(schema.customer.id, name, member)
  return parseMondayItem(data, schema.customer, defaults);
}

export async function updateCustomer(customer, update) {
  update['email'] = [update['email'], update['name']];
  update = convertToMondayQueryValues(update, schema.customer);
  const data = await updateItem(schema.customer.id, customer.id, update)
  return parseMondayItem(data, schema.customer, defaults);
}
