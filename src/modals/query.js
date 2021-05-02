import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

export async function queryItems(ids) {
  const res = await monday.api(`query {
    items (ids: ${JSON.stringify(ids)}) {
      id
      name
      state
      column_values {
        id
        value
        text
      }
    }
  }`);

  return res.data.items;
}

export async function queryItemsByValue(boardId, column, value, columns = null) {
  const res = await monday.api(`query {
      items_by_column_values (board_id: ${boardId}, column_id: "${column}", column_value: "${value}") {
        id
        name
        column_values${columns ? `(ids: ${JSON.stringify(columns)})` : ''} {
          id
          value
          text
        }
      }
  }`);
  return res.data.items_by_column_values;
}

export async function queryBoardItems(boardId, columns, page, limit) {
  const res = await monday.api(`query {
    boards(ids: [${boardId}]) {
      items (limit: ${limit}, page: ${page}, newest_first: true) {
        id
        name
         state
         column_values(ids: ${JSON.stringify(columns)}) {
          id
          value
          text
        }
      }
    }
  }`)

  return res.data.boards[0].items.filter(v => v.state === 'active');
}

export async function createItem(board, name, values) {
  const res = await monday.api(`mutation {
      create_item (board_id: ${board}, item_name: "${name}", column_values: ${JSON.stringify(JSON.stringify(values))}) {
        id
        name
        column_values {
          id
          value
          text
        }
      }
    }`);

  return res.data.create_item;
}

export async function createItemMultiple(board, items) {
  const query = items.map(({name, values}, i) => {
    return `
      create_${i}: create_item (board_id: ${board}, item_name: "${name}", column_values: ${JSON.stringify(JSON.stringify(values))}) {
        id
      }
      `;
  })

  const res = await monday.api(`mutation {
    ${query.join("\n")}
  }`);

  return Object.values(res.data);
}

export async function createSubItemMultiple(parent, items) {
  const query = items.map(({name, values}, i) => {
    return `
      create_${i}: create_subitem (parent_item_id: ${parent}, item_name: "${name}", column_values: ${JSON.stringify(JSON.stringify(values))}) {
        id
      }
      `
  });

  const res = await monday.api(`mutation {
    ${query.join("\n")}
  }`);

  return Object.values(res.data);
}

export async function updateItem(board, item, column) {
  const res = await monday.api(`mutation {
      change_multiple_column_values (board_id: ${board}, item_id: ${item}, column_values: ${JSON.stringify(JSON.stringify(column))}) {
        id
        name
        column_values {
          id
          value
          text
        }
      }
    }`);

  return res.data.change_multiple_column_values;
}

export async function getSchema() {
  const res = await monday.api(`query {
    boards {
      id
      name
      columns {
        title
        id
        type
        settings_str
      }
    }
  }`)

  return res.data.boards;
}
