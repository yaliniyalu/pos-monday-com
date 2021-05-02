import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

export function openPage(context, {page}) {
  context.commit("setOpenedPage", page)
}

export function selectCategory(context, {category}) {
  context.commit("setSelectedCategory", category)
}

export function setLastError(context, error) {
  context.commit('setLastError', error)
}

export function setCustomerEditPage(context, page) {
  context.commit('setCustomerEditPage', page)
}

export function resetApp(context) {
  context.commit('setOpenedPage', 'menu')
  context.commit('setResetIndicator', !context.state.resetIndicator)
}

export function setSettings(context, settings) {
  monday.storage.instance.setItem('settings', JSON.stringify(settings))
  context.commit('setSettings', settings)
}
