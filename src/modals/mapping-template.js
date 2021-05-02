

export default [
  {
    id: 'category',
    title: 'Category',
    icon: 'category',
    class: 'text-teal',
    mapped: null,
    tags: ['category', 'categories'],
    columns: [
      {
        id: 'image',
        title: 'Image',
        type: ['file'],
        mapped: null,
        tags: ['image', 'category image']
      }
    ]
  },
  {
    id: 'item',
    title: 'Items',
    icon: 'shopping_bag',
    class: 'text-purple',
    mapped: null,
    tags: ['item', 'items'],
    columns: [
      {
        id: 'code',
        title: 'Code',
        type: ['numeric', 'text'],
        tags: ['code', 'item code'],
        mapped: null,
      },
      {
        id: 'category',
        title: 'Category',
        type: ['board-relation'],
        mapped: null,
      },
      {
        id: 'price',
        title: 'Price',
        type: ['numeric'],
        mapped: null,
      },
      {
        id: 'modifier',
        title: 'Modifiers',
        type: ['board-relation'],
        tags: ['modifier', 'modifiers'],
        mapped: null,
      },
      {
        id: 'image',
        title: 'Image',
        type: ['file'],
        tags: ['image'],
        mapped: null,
      },
      {
        id: 'tax',
        title: 'Tax',
        type: ['numeric'],
        mapped: null,
      },
      {
        id: 'availability',
        title: 'Availability',
        type: ['status', 'color'],
        tags: ['availability'],
        mapped: null,
        options: [
          { id: 'available' },
          { id: 'unavailable', tags: ['unavailable', 'not available'] },
        ]
      }
    ]
  },
  {
    id: 'payment',
    title: 'Payments',
    icon: 'attach_money',
    class: 'text-green',
    mapped: null,
    tags: ['payment', 'payments'],
    columns: [
      {
        id: 'status',
        title: 'Status',
        type: ['status', 'color'],
        tags: ['status', 'payment status'],
        mapped: null,
        options: [
          { id: 'pending' },
          { id: 'paid' },
          { id: 'canceled' },
        ]
      },
      {
        id: 'type',
        title: 'Payment type',
        type: ['status', 'color'],
        tags: ['type'],
        mapped: null,
        options: [
          { id: 'card' },
          { id: 'cash' },
          { id: 'rewardPoints', tags: ['reward points'] },
        ]
      },
      {
        id: 'amount',
        title: 'Amount',
        type: ['numeric'],
        mapped: null,
      },
      {
        id: 'date',
        title: 'Date',
        type: ['date'],
        mapped: null,
      }
    ]
  },
  {
    id: 'customer',
    title: 'Customers',
    icon: 'people',
    class: 'text-brown',
    mapped: null,
    tags: ['customer', 'customers'],
    columns: [
      {
        id: 'email',
        title: 'Email',
        type: ['email'],
        mapped: null,
      },
      {
        id: 'phone',
        title: 'Phone',
        type: ['phone'],
        mapped: null,
      },
      {
        id: 'address',
        title: 'Address',
        type: ['text'],
        mapped: null
      },
      {
        id: 'status',
        title: 'Status',
        type: ['status', 'color'],
        mapped: null
      },
      {
        id: 'memberType',
        title: 'Member Type',
        type: ['status', 'color'],
        mapped: null
      },
      {
        id: 'rewardPoints',
        title: 'Reward Points',
        type: ['numeric'],
        mapped: null
      },
      {
        id: 'totalPurchased',
        title: 'Total Purchased Amount',
        type: ['numeric'],
        tags: ['total purchased'],
        mapped: null
      },
      {
        id: 'totalDiscounted',
        title: 'Total Discounted Amount',
        type: ['numeric'],
        tags: ['total discounted'],
        mapped: null
      }
    ]
  },
  {
    id: 'modifier',
    title: 'Modifiers',
    icon: 'note_add',
    class: 'text-pink',
    mapped: null,
    tags: ['modifier', 'modifiers'],
    columns: [
      {
        id: 'empty',
        title: 'Can Empty',
        type: ['boolean'],
        tags: ['empty'],
        mapped: null
      },
      {
        id: 'multiple',
        title: 'Can Multiple',
        type: ['boolean'],
        tags: ['multiple'],
        mapped: null
      },
    ],
    sub: {
      columns: [
        {
          id: 'availability',
          title: 'Availability Status',
          type: ['status', 'color'],
          tags: ['status'],
          mapped: null,
          options: [
            { id: 'available' },
            { id: 'unavailable', tags: ['unavailable', 'not available'] },
          ]
        },
        {
          id: 'price',
          title: 'Price',
          type: ['numeric'],
          tags: ['price'],
          mapped: null
        },
        {
          id: 'isDefault',
          title: 'Is Default?',
          type: ['boolean'],
          tags: ['is default', 'default'],
          mapped: null
        },
      ]
    }
  },
  /*  {
      id: 'settings',
      title: 'Settings',
      icon: 'settings',
      class: 'text-orange',
      mapped: null,
      tags: ['settings'],
      optional: true,
      columns: [
        {
          id: 'appSettings',
          title: 'App Settings',
          type: ['long-text'],
          mapped: null,
        },
        {
          id: 'mappedFields',
          title: 'Mapped Fields',
          type: ['long-text'],
          mapped: null,
        },
      ]
    },*/
  {
    id: 'order',
    title: 'Orders',
    icon: 'shopping_cart',
    class: 'text-cyan',
    mapped: null,
    tags: ['order', 'orders'],
    columns: [
      {
        id: 'date',
        title: 'Date',
        type: ['date'],
        mapped: null,
      },
      {
        id: 'status',
        title: 'Status',
        type: ['status', 'color'],
        mapped: null,
        options: [
          { id: 'accepted' },
          { id: 'delivery' },
          { id: 'processing' },
          { id: 'canceled' },
          { id: 'finished' },
          { id: 'placed' },
        ]
      },
      {
        id: 'billNo',
        title: 'Bill No',
        type: ['text'],
        tags: ['bill', 'bill no'],
        mapped: null,
      },
      {
        id: 'payableAmount',
        title: 'Payable Amount',
        type: ['numeric'],
        mapped: null,
      },
      {
        id: 'subTotal',
        title: 'Sub Total',
        type: ['numeric'],
        tags: ['sub total', 'subtotal'],
        mapped: null,
      },
      {
        id: 'tax',
        title: 'Tax',
        type: ['numeric'],
        mapped: null,
      },
      {
        id: 'discount',
        title: 'Discount',
        type: ['numeric'],
        mapped: null,
      },
      {
        id: 'roundOff',
        title: 'Round Off',
        type: ['numeric'],
        mapped: null,
      },
      {
        id: 'paidAmount',
        title: 'Paid Amount',
        type: ['numeric'],
        tags: ['paid', 'paid amount'],
        mapped: null,
      },
      {
        id: 'balanceAmount',
        title: 'Balance Amount',
        type: ['numeric'],
        tags: ['balance', 'balance amount'],
        mapped: null,
      },
      {
        id: 'paymentStatus',
        title: 'Payment Status',
        type: ['status', 'color'],
        mapped: null,
        options: [
          { id: 'processing' },
          { id: 'paid' },
          { id: 'pending' },
        ]
      },
      {
        id: 'deliveryType',
        title: 'Delivery Type',
        type: ['status', 'color'],
        mapped: null,
        options: [
          { id: 'homeDelivery', tags: ['home delivery'] },
          { id: 'dineIn', tags: ['dine in', 'dinein'] },
          { id: 'pickup', tags: ['pickup', 'pick up'] },
        ]
      },
      {
        id: 'deliveryStatus',
        title: 'Delivery Status',
        type: ['status', 'color'],
        mapped: null,
        options: [
          { id: 'processing' },
          { id: 'delivered' },
          { id: 'pending' },
        ]
      },
      {
        id: 'name',
        title: 'Name',
        type: ['text'],
        mapped: null,
      },
      {
        id: 'phone',
        title: 'Phone',
        type: ['phone'],
        mapped: null,
      },
      {
        id: 'address',
        title: 'Address',
        type: ['text'],
        mapped: null,
      },
      {
        id: 'pickupTime',
        title: 'Pickup Time',
        type: ['date'],
        mapped: null,
      },
      {
        id: 'customer',
        title: 'Customer',
        type: ['board-relation'],
        mapped: null,
      },
      {
        id: 'payments',
        title: 'Payments',
        type: ['board-relation'],
        mapped: null,
      },
    ],
    sub: {
      columns: [
        {
          id: 'item',
          title: 'Item',
          type: ['board-relation'],
          mapped: null,
        },
        {
          id: 'qty',
          title: 'Qty',
          type: ['numeric'],
          mapped: null,
        },
        {
          id: 'total',
          title: 'Total',
          type: ['numeric'],
          mapped: null,
        },
        {
          id: 'remarks',
          title: 'Remarks',
          type: ['text', 'long-text'],
          mapped: null,
        },
        {
          id: 'modifiers',
          title: 'Modifiers',
          type: ['text', 'long-text'],
          mapped: null,
        },
        {
          id: 'status',
          title: 'Status',
          type: ['status', 'color'],
          mapped: null,
          options: [
            { id: 'processing' },
            { id: 'finished' },
            { id: 'stuck' },
            { id: 'pending' },
          ]
        },
      ]
    }
  }
];

