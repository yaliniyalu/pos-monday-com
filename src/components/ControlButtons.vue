<template>
  <div class="control-buttons">
    <table class="grid">
      <tr>
        <td @click="clearItems" :disabled="!order.items.length">Clear</td>
        <td @click="cancelOrder">Cancel</td>
      </tr>
      <tr>
        <td @click="holdOrder">Hold</td>
        <td @click="openHoldList">Release</td>
      </tr>
    </table>
  </div>
</template>

<script>
import ui from './../ui';
import HoldList from "components/HoldList";

export default {
  name: 'ControlButtons',

  data () {
    return {
      cart_empty: true,
      trans_status: '',
      execFn: null,
    }
  },

  computed: {
    order() {
      return this.$store.state.order;
    }
  },

  methods: {
    clearItems () {
      ui.askYesNo('You are deleting all items. Are you sure?', 'CLEAR ITEMS!')
        .then(() => {
          this.$store.dispatch("order/clearCart")
            .then(() => {
              ui.notifySuccess('Items Cleared');
            })
            .catch(() => {
              ui.notifyError('Unable to clear items');
            })
          this.resetApp();
        })
    },

    cancelOrder () {
      ui.askYesNo('New order will be created. Are you sure?', 'CANCEL ORDER!')
        .then(() => {
          this.$store.dispatch("order/cancelOrder")
            .then(() => {
              ui.notifySuccess('Order Canceled');
            })
            .catch(() => {
              ui.notifyError('Unable to cancel order');
            })

          this.resetApp();
        })
    },

    holdOrder() {
      if (!this.order.items.length) {
        ui.notifyError('Can only hold order with items.');
        return;
      }

      this.$store.dispatch("order/holdOrder")
        .then(() => {
          ui.notifySuccess('Order Holden');
        })
        .catch(() => {
          ui.notifyError('Unable to hold order');
        })

      this.resetApp();
    },

    resetApp() {
      this.$store.dispatch('app/resetApp')
    },

    openHoldList () {
      this.$q.dialog({
        component: HoldList,
        root: this.$root
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.control-buttons {
  table {
    width: 100%;
    border-collapse: collapse;

    td {
      width: 50%;
      float: left;
      text-align: center;
      padding: 1.4em 5px;
      display: block;
      color: #ffffff;
      position: relative;
      text-transform: uppercase;
      font-weight: bold;
      border: 1px solid #fff;
      background: #00a253;
      cursor: pointer;
      user-select: none;

      &[disabled] {
        background: #ccc;
        pointer-events: none;
        touch-action: none;
      }

      &.btn-search {
        background: #9500a2;
        /*width: 20%;*/
      }

      &.btn-cash-drawer {
        background: #1565c0; // blue-9
        /*width: 10%;*/
      }

      &.btn-transaction {
        background: #00838f; //cyan-9
      }

      &.btn-return {
        background: #2e7d32; //green-9
      }

      &.btn-shift-close {
        background: #9e9d24; //lime-9
      }

      &.btn-settings {
        background: #ef6c00; //orange=9
      }
    }
  }
}
</style>
