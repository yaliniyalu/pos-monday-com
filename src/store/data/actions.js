import monday from "src/modals/monday";

export function cancelOrder() {

}

export function addHoldList(context, order) {
  context.commit('addToHoldList', order)
}

export function unHoldOrder(context, id) {
  const order = context.state.holdList.find(v => v.id === id);
  if (order) {
    context.commit('removeFromHoldList', id)
  }
  return order;
}

export async function loadItems(context) {
  context.commit('app/showLoader', {}, {root: true})
  const {items, category, modifiers} = await monday.getItems();
  context.commit('setItems', items)
  context.commit('setModifiers', modifiers)
  context.commit('setCategory', category)
  context.commit('app/hideLoader', {}, {root: true})
}

export async function loadMe(context) {
  context.commit('app/showLoader', {}, {root: true})
  const me = await monday.getMe();
  context.commit('setMe', me)
  context.commit('app/hideLoader', {}, {root: true})
}

export function addToRecentItems(context, item) {
  let recentItems = context.state.recentItems
  recentItems = recentItems.filter(v => v.id !== item.id);
  recentItems.unshift(item);

  if (recentItems.length > 50) {
    recentItems.pop();
  }

  context.commit('setRecentItems', recentItems)
}

export function setLastOrder(context, order) {
  context.commit('setLastOrder', order)
}
