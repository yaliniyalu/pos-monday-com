
export const item = {
  id: null,
  columns: {
    code: { id: null },
    image: { id: null, type: 'file' },
    tax: { id: null, type: 'numeric' },
    price: { id: null, type: 'numeric' },
    category: { id: null, type: 'board-relation' },
    modifier: { id: null, type: 'board-relation' },
    availability: {
      id: null,
      type: 'status',
      columns: {
        available: { id: null },
        unavailable: { id: null }
      }
    }
  }
};

export const category = {
  id: null,
  columns: {
    image: { id: null, type: 'file'  }
  }
};

export const modifier = {
  id: null,
  columns: {
    empty: { id: null, type: 'check' },
    multiple: { id: null, type: 'check' },
    items: { id: 'subitems', type: 'subtasks' }
  },
  sub: {
    columns: {
      availability: {
        id: null,
        type: 'status',
        columns: {
          available: { id: null },
          unavailable: { id: null }
        }
      },
      price: { id: null, type: 'numeric' },
      isDefault: { id: null, type: 'check' }
    }
  }
}

export const customer = {
  id: null,
    columns: {
    email: { id: null, type: 'email' },
    phone: { id: null, type: 'phone' },
    address: { id: null },
    status: { id: null, type: 'status', columns: [] },
    memberType: { id: null, type: 'status', columns: [] },
    rewardPoints: { id: null, type: 'numeric' },
    totalPurchased: { id: null, type: 'numeric' },
    totalDiscounted: { id: null, type: 'numeric' }
  }
}

export const order = {
  id: null,
  columns: {
    date: { id: null, type: 'date' },
    status: {
      id: null,
      type: 'status',
      columns: {
        accepted: { id: null, color: { color: "#BDA8F9" } },
        delivery: { id: null, color: { color: "#FF5AC4" } },
        processing: { id: null, color: { color: "#FFCB00" } },
        canceled: { id: null, color: { color: "#BB3354" } },
        finished: { id: null, color: { color: "#037f4c" } },
        placed: { id: null, color: { color: "#c4c4c4" } },
      }
    },
    billNo: { id: null },
    payableAmount: { id: null, type: 'numeric' },
    subTotal: { id: null, type: 'numeric' },
    tax: { id: null, type: 'numeric' },
    discount: { id: null, type: 'numeric' },
    roundOff: { id: null, type: 'numeric' },
    paidAmount: { id: null, type: 'numeric' },
    balanceAmount: { id: null, type: 'numeric' },
    paymentStatus: {
      id: null,
      type: 'status',
      columns: {
        processing: { id: null, color: { color: "#fdab3d" } },
        paid: { id: null, color: { color: "#00c875" } },
        pending: { id: null, color: { color: "#e2445c"  } }
      }
    },
    deliveryType: {
      id: null,
      type: 'status',
      columns: {
        homeDelivery: { id: null, color: { color: "#D974B0" } },
        dineIn: { id: null, color: { color: "#66CCFF" } },
        pickup: { id: null, color: { color: "#5559df"  } }
      }
    },
    deliveryStatus: {
      id: null,
      type: 'status',
      columns: {
        processing: { id: null, color: { color: "#fdab3d" } },
        delivered: { id: null, color: { color: "#00c875" } },
        pending: { id: null, color: { color: "#e2445c"  } }
      }
    },
    name: { id: null },
    phone: { id: null, type: 'phone' },
    address: { id: null },
    pickupTime: { id: null, type: 'date' },
    customer: { id: null, type: 'board-relation' },
    payments: { id: null, type: 'board-relation' },
    items: { id: 'subitems', type: 'subtasks' }
  },
  sub: {
    id: null,
    columns: {
      item: { id: null, type: 'board-relation' },
      qty: { id: null, type: 'numeric' },
      total: { id: null, type: 'numeric' },
      remarks: { id: null },
      modifiers: { id: null },
      status: {
        id: null,
        type: 'status',
        columns: {
          processing: { id: null, color: { color: "#fdab3d" } },
          finished: { id: null, color: { color: "#00c875" } },
          stuck: { id: null, color: { color: "#e2445c" } },
          pending: { id: null, color: { color: "#c4c4c4"  } }
        }
      }
    }
  }
};

export const payment = {
  id: null,
  columns: {
    status: {
      id: null,
      type: 'status',
      columns: {
        pending: { id: null, color: { color: "#fdab3d" } },
        paid: { id: null, color: { color: "#00c875" } },
        canceled: { id: null, color: { color: "#e2445c"  } }
      }
    },
    type: {
      id: null,
      type: 'status',
      columns: {
        card: { id: null, color: { color: "#579bfc" } },
        cash: { id: null, color: { color: "#9CD326" } },
        rewardPoints: { id: null, color: { color: "#fdab3d"  } }
      }
    },
    amount: { id: null, type: 'numeric' },
    date: { id: null, type: 'date' }
  }
};



export default {
  item,
  category,
  modifier,
  customer,
  order,
  payment
}
