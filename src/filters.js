import { date } from 'quasar'

export function datetime(value) {
  return date.formatDate(value, 'D MMM YYYY h:mm A');
}

export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function price(value, round = 2) {
  if (value === null) return null;

  const num = Number(value);
  if (isNaN(num)) return null;

  return num.toFixed(round)
}

export function withSign(value, positive) {
  if (value > 0 && positive) {
    return '+ ' + value
  }

  if (value > 0) {
    return '- ' + value
  }

  return value;
}

export function currency(value) {
  return '$ ' + value;
}

export function null2zero(value) {
  return value ? value : 0;
}

export function percent(value, total) {
  if (!total) return 0;
  return (value * 100) / total;
}

export function mobile(mobile) {
  if (!mobile) return '';
  return '+' + mobile.replace(/[^0-9]+/g, "")
}

export function round(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

export function dateFormat(value, format) {
  return date.formatDate(value, format);
}

export function titleCase(text) {
  return  text.toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
}
