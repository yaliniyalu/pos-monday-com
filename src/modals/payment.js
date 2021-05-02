import {convertToMondayQueryValues, parseMondayItem} from "src/modals/utils";
import {createItemMultiple, queryItems} from "src/modals/query";
import schema from "src/modals/schema";

const defaults = {
  status: null,
  type: null,
  amount: 0
}

export async function getPayments(ids) {
  const items = await queryItems(ids);
  if (!items.length) {
    return [];
  }

  return items.map(i => parseMondayItem(i, schema.payment, defaults))
}

export async function createPayments(payments) {
  payments = payments.map(p => {
    const pay = convertToMondayQueryValues(p, schema.payment);

    const { name } = pay;
    delete pay.name;

    return { name, values: pay }
  })

  const data = await createItemMultiple(schema.payment.id, payments)
  return data.map(p => parseMondayItem(p, schema.payment, defaults));
}
