import {date} from "quasar";

export function getDefaultModifiers(item) {
  let modifiers = [];

  item.modifier.forEach(v => {
    if (!v.multiple) {
      const def = v.items.find(i => i.isDefault === true);
      if (def)
        modifiers.push(def);
    } else {
      modifiers.push(...v.items.filter(i => i.isDefault === true))
    }
  })

  return modifiers;
}


export function getNewCartItem({ item, qty, remarks, modifiers }) {
  return {
    info: item,
    qty: qty ? qty : 1,
    remarks: remarks ? remarks : null,
    modifiers: modifiers ? modifiers : [],
    totalPrice: 0,
    totalModifierPrice: 0,
    price: 0,
    key: item.id + '_' + modifiers?.map(m => m.id).sort().join(',') + '_' + (remarks ? remarks : '')
  }
}

export function setCalculatedValues(item) {
  const modPrice = item.modifiers.reduce((acc, v) => acc + v.price, 0)
  const price = modPrice + item.info.price;

  item.totalPrice = price * item.qty;
  item.totalModifierPrice = modPrice;
  item.price = price;

  item.key = getItemKey(item)
}

export function getItemKey(item) {
  return item.info.id + '_' + item.modifiers?.map(m => m.id).sort().join(',') + '_' + (item.remarks ? item.remarks : '');
}

export function generateBillNo() {
  let d = new Date();
  const prefix = date.formatDate(Date.now(), 'YYMMDD')
  return prefix + '-' + (d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds());
}

export function toMondayUTCDate(d) {
  return date.extractDate(d, 'YYYY-MM-DD HH:mm:ss').toISOString().replace('T', ' ').split('.')[0]
}

export function getNowDate() {
  return date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss')
}

export function provideDownload(obj, name) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
  const a = document.createElement('a');
  a.setAttribute("href",     dataStr);
  a.setAttribute("download", name + ".json");
  //document.body.appendChild(a); // required for firefox
  a.click();
  a.remove();
}

export async function readUploadedFile(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = event => resolve(JSON.parse(event.target.result))
    fileReader.onerror = error => reject(error)
    fileReader.readAsText(file)
  })
}
