import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

import {getSchema} from "src/modals/query";

import board from './board-mapping';

export async function getSchemaFromMonday() {
  const s = await getSchema();
  s.forEach(b => {
    b.columns.forEach(c => {
      c.settings = JSON.parse(c.settings_str)
    })
  })
  return s
}

export async function saveMapping(mapping) {
  await monday.storage.instance.setItem('mapping', JSON.stringify(mapping))
}

export async function loadMapping() {
  const res = await monday.storage.instance.getItem('mapping');
  const value = res.data.value;
  if (value && value !== "null") {
    mapSchema(JSON.parse(value));
    return true;
  }
  return false;
}

function mapSchema(map) {
  Object.keys(board).forEach(b => {
    if (!map[b]) {
      return;
    }

    const m = map[b];
    const bd = board[b];

    bd['id'] = m['mapped'];

    Object.keys(bd['columns']).forEach(c => {
      if (!m['columns'][c]) {
        return;
      }

      bd['columns'][c]['id'] = m['columns'][c];

      if (bd['columns'][c]['type'] === 'status' && bd['columns'][c]['columns']) {
        Object.keys(bd['columns'][c]['columns']).forEach(s => {
          if (m['status'][c] && m['status'][c][s]) {
            bd['columns'][c]['columns'][s] = {
              id: m['status'][c][s]['id'],
              color: { color: m['status'][c][s]['color'] }
            }
          }
        })
      }
    })

    if (bd['sub']) {
      Object.keys(bd['sub']['columns']).forEach(c => {
        if (!m['sub']['columns'][c]) {
          return;
        }

        bd['sub']['columns'][c]['id'] = m['sub']['columns'][c];

        if (bd['sub']['columns'][c]['type'] === 'status' && bd['sub']['columns'][c]['columns']) {
          Object.keys(bd['sub']['columns'][c]['columns']).forEach(s => {
            if (m['sub']['status'][c] && m['sub']['status'][c][s]) {
              bd['sub']['columns'][c]['columns'][s] = {
                id: m['sub']['status'][c][s]['id'],
                color: { color: m['sub']['status'][c][s]['color'] }
              }
            }
          })
        }
      })
    }
  })
}

export default board
