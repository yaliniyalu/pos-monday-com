import {date} from "quasar";
import boards from "src/modals/board-mapping";

export function parseMondayQueryStatusValues(index, column) {
  return Object.keys(column).find(c => +column[c].id === +index);
}

export function parseMondayQueryValues(values, board) {
  const data = {};
  const col = Object.keys(board.columns);
  (values??[]).forEach(v => {
    const f = col.find(c => board.columns[c].id === v.id);
    if (!f) return;

    let value = JSON.parse(v.value);

    if (!value) {
      data[f] = value;
      return;
    }

    const column = board.columns[f];

    if (column.type === 'status') {
      value = parseMondayQueryStatusValues(value.index, column.columns)
    } else if (column.type === 'date') {
      value = date.formatDate(value.date + ' ' + value.time, 'YYYY-MM-DD HH:mm:ss');
    } else if (column.type === 'board-relation' || column.type === 'subtasks') {
      value = value.linkedPulseIds.map(l => l.linkedPulseId);
    } else if (column.type === 'check') {
      value = value.checked === true || value.checked === 'true';
    }  else if (column.type === 'file') {
      value = v.text;
    } else if (column.type === 'numeric') {
      value = +value;
    } else if (column.type === 'phone') {
      value = value.phone;
    } else if (column.type === 'email') {
      value = value.email;
    }

    data[f] = value;
  })

  return data;
}

export function convertToMondayQueryValues(values, board) {
  const data = {};
  Object.keys(values ?? []).forEach(v => {
    if (v === 'name' || v === 'id') {
      data[v] = values[v];
      return;
    }

    const column = board.columns[v];
    if (!column) {
      return;
    }

    let value = values[v];
    if (!value) {
      data[column.id] = value;
      return;
    }

    if (column.type === 'board-relation') {
      value = { item_ids: value }
    } else if (column.type === 'status') {
      value = { index: column.columns[value].id }
    } else if (column.type === 'date') {
      if (value.split(' ').length === 1) {
        value = date.extractDate(value, 'YYYY-MM-DD').toISOString().replace('T', ' ').split('.')[0].split(' ')[0];
      } else {
        value = date.extractDate(value, 'YYYY-MM-DD HH:mm:ss').toISOString().replace('T', ' ').split('.')[0];
      }
    }  else if (column.type === 'numeric') {
      value = +value;
    } else if (column.type === 'email') {
      value = { email: value[0], text: value[1] };
    }

    data[column.id] = value;
  })

  return data;
}

export function parseMondayItem(data, board, defaults = {}) {
  const item = parseMondayQueryValues(data.column_values, board);
  item.name = data.name;
  item.id = +data.id;

  return Object.assign({}, defaults, item)
}

export function getColorForStatus(id, status) {
  return status.columns[id] ? status.columns[id].color.color : 'grey'
}
