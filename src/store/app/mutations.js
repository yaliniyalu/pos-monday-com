export function someMutation (/* state */) {
}



export const hideLoader = (state) => state.ui.loading = false
export const showLoader = (state) => state.ui.loading = true

export const setSelectedCategory = (state, category) => state.menuList.selectedCategory = category;
export const setOpenedPage = (state, page) => state.ui.openedPage = page;
export const setLastError = (state, error) => state.ui.lastError = error;
export const setCustomerEditPage = (state, page) => state.customer.isEditPage = page;
export const setResetIndicator = (state, indicator) => state.resetIndicator = indicator;
export const setSettings = (state, settings) => state.settings = settings;
