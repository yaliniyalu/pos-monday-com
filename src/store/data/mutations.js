
export const setItems = (state, items) => state.items = items
export const setCategory = (state, category) => state.category = category
export const setModifiers = (state, modifiers) => state.modifiers = modifiers

export const setRecentItems = (state, items) => state.recentItems = items
export const setMe = (state, me) => state.me = me

export const addToHoldList = (state, order) => state.holdList.unshift(order)
export const removeFromHoldList = (state, id) => state.holdList = state.holdList.filter(v => v.id !== id)

export const setLastOrder = (state, order) => state.lastOrder = order;
