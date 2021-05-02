<template>
  <div class="right-buttons border-none">
    <table class="grid container-table">
      <tr>
        <td class="btn-search" @click="openPage('menu_search')">Items</td>
        <td class="btn-save" rowspan="2" @click="openPage('save_order')">Save</td>
      </tr>
      <tr>
        <td class="btn-orders" @click="openPage('orders')">Orders</td>
      </tr>
      <tr>
        <td class="btn-last-bill" @click="openLastBill" :disabled="!lastOrder">Last Bill</td>
        <td class="btn-l-print" @click="openPage('l_print')" :disabled="!lastOrder">L.Print</td>
      </tr>
      <tr>
        <td class="btn-settings" @click="openPage('settings')">Settings</td>
        <td class="btn-c-print" @click="openPage('c_print')">C.Print</td>
      </tr>
    </table>
  </div>
</template>

<script>
import MenuPopup from "components/Menu/MenuPopup";
import Receipt from "components/Receipt";
import ui from "src/ui";
import monday from "src/modals/monday";

export default {
  name: "RightButtons",

  computed: {
    lastOrder() {
      return this.$store.state.data.lastOrder
    }
  },

  methods: {
    openPage (page) {
      if (page === 'menu_search') {
        this.$q.dialog({
          component: MenuPopup,
          root: this.$root
        });
        return;
      }

      if (page === 'l_print') {
        this.$q.dialog({
          component: Receipt,
          data: this.$store.state.data.lastOrder,
          root: this.$root
        });
        return;
      }

      if (page === 'c_print') {
        this.$q.dialog({
          component: Receipt,
          root: this.$root
        });
        return;
      }

      if (page === 'orders') {
        this.$store.dispatch('app/openPage', { page: 'orders' })
        return;
      }

      if (page === 'save_order') {
        this.saveOrder();
        return;
      }

      if (page === 'settings') {
        return this.$store.dispatch('app/openPage', { page: 'settings' });
      }
    },

    openLastBill() {
      this.$store.dispatch('order/loadLastOrder')
    },

    async saveOrder() {
      if (!this.$store.state.order.items.length) {
        await this.$store.dispatch('app/openPage', { page: 'menu' });
        ui.notifyError("Please add some items")
        return;
      }

      ui.showLoader("Order is being saved. Please wait...")
      try {
        const id = await monday.saveOrder(
          this.$store.state.order,
          this.$store.getters['order/amountInfo'],
          this.$store.getters['order/paymentInfo'],
          this.$store.state.order.customer,
          this.$store.state.order.delivery,
          this.$store.getters["order/customerCurrentStatus"]
        );
        ui.notifySuccess("Order Saved")

        await this.$store.dispatch('order/setOrderId', id)
        await this.$store.dispatch('order/extractLastOrder')

        if (this.$store.state.app.settings.printing.autoPrintAfterSave) {
          this.$q.dialog({
            component: Receipt,
            data: this.$store.state.data.lastOrder,
            root: this.$root,
            autoPrint: true
          });
        }

        await this.$store.dispatch('order/newOrder')
        await this.$store.dispatch('app/resetApp')
      } catch(e) {
        ui.notifyError("Unable to place your order. Something went wrong.")
      }
      ui.hideLoader();
    }
  },
}
</script>

<style lang="scss" scoped>

.right-buttons {
  padding-left: 5px;

  table.container-table {
    width: 100%;
    border-collapse: collapse;

    & > tr > td:not(.powered) {
      //width: 100%;
      //float: left;
      text-align: center;
      //padding: 0.97em 5px;
      /*padding: 1.09em 5px;*/
      //padding: 1.01em 5px;
      //display: block;
      color: #ffffff;
      //position: relative;
      text-transform: uppercase;
      font-weight: bold;
      //border: 1px solid #ffffff;
      cursor: pointer;
      user-select: none;
      white-space: nowrap;

      width: 50%;
      padding: 1.05em 5px;
      /*padding: 1.09em 5px;*/
      //border: 2px solid #ffffff;
      outline: 1px solid #fff;

      &[disabled] {
        background: #ccc;
        pointer-events: none;
        touch-action: none;
      }

      &.btn-search {
        background: #9500a2;
        /*width: 20%;*/
      }

      &.btn-save {
        background: #1565c0; // blue-9
        /*width: 10%;*/
      }

      &.btn-l-print {
        background: #0097a7; // cyan-8
      }

      &.btn-c-print {
        background: #00796b; // teal-8
      }

      &.btn-orders {
        background: #303f9f; //indigo-8
      }

      &.btn-return {
        background: #2e7d32; //green-9
      }

      &.btn-last-bill {
        background: #9e9d24; //lime-9
      }

      &.btn-settings {
        background: #5d4037; //brown-8
      }
    }
  }

  .powered {
    text-transform: none;
    font-size: 10px;
    font-weight: initial;
    padding: 5px;
    user-select: none;

    table {
      width: 100%;
    }

    .name {
      text-align: center;

      .product {
        text-transform: uppercase;
        font-weight: bold;
        font-size: 12px;
      }
    }

    .pro-logo img {
      width: 33px;
    }

    .com-logo img {
      width: 28px;
    }
  }
}
</style>
