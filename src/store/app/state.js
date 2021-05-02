export default function () {
  return {
    menuList: {
      selectedCategory: null
    },

    customer: {
      isEditPage: false
    },

    resetIndicator: true,

    settings: {
      misc: {
        virtualKeyboard: true
      },

      menu: {
        categoryTheme: 1,
        itemTheme: 1,
        showPrice: true,
        addWithDefaultModifiers: true
      },

      list: {
        show: {
          code: true, name: true, price: true
        },
        action: {
          swipeLeft: 'delete',
          swipeRight: 'none',
          longTap: 'none',
          tap: 'details'
        }
      },

      payment: {
        options: {
          cash: true,
          card: true,
          coupon: true,
          points: true,
          discount: true
        },
        costPerPoint: 0.01,
        pointPerAmount: 1,
      },

      editor: {
        enable: true,
        stopAtQty: true
      },

      printing: {
        autoPrintAfterFinish: false,
        autoPrintOnPopupOpen: false,
        autoPrintAfterSave: false
      },

      receipt: {
        name: 'Demo Name',
        address: 'Demo Address',
        phone: '0987654321',
        cell: ''
      }
    },

    ui: {
      loading: false,
      openedPage: 'menu',
      lastError: null
    }
  }
}
