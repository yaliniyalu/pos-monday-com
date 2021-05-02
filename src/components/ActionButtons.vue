<template>
  <table class="grid">
    <tbody>
    <tr>
      <td class="btn-menu" v-ripple @click="openPage('menu')">MENU</td>
      <td class="btn-member" v-ripple @click="openPage('member')">CUSTOMER</td>
<!--      <td class="btn-receipt" v-ripple @click="openPage('receipt')">RECEIPT</td>-->
      <td class="btn-delivery" v-ripple @click="openPage('delivery')">DELIVERY</td>
      <td class="btn-pay" v-ripple @click="openPage('pay')">Pay</td>
    </tr>
    </tbody>
  </table>
</template>

<script>
import Receipt from "components/Receipt";

export default {
  name: 'ActionButtons',

  computed: {
    openedPage() {
      return this.$store.state.app.ui.openedPage
    }
  },

  methods: {
    openPage (page) {
      if (page === 'menu') {
        if (this.openedPage !== 'menu') {
          this.$store.dispatch('app/openPage', { page: 'menu' });
        } else {
          this.$store.dispatch('app/selectCategory', { category: null });
        }
        return;
      }

      if (page === 'member') {
        if (this.openedPage !== 'member') {
          this.$store.dispatch('app/openPage', { page: 'member' });
        } else {
          this.$store.dispatch('app/setCustomerEditPage', false);
        }
        return;
      }

      if (page === 'receipt') {
        this.$q.dialog({
          component: Receipt,
          order: this.$store.state.order,
          root: this.$root
        });
        return;
      }

      if (page === 'delivery') {

      }

      this.$store.dispatch('app/openPage', { page: page });
    },
  }
}
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  cursor: pointer;
  user-select: none;
  border-collapse: collapse;

  td {
    /*width: 100%;*/
    height: 50px;
    line-height: 50px;
    text-transform: uppercase;
    /*display: block;*/
    text-align: center;
    font-weight: 700;
    color: #ffffff;
    border: 2px solid #ffffff;

    border-top: 0;

    /*margin-right: 2px;*/

    background: #ccc;
    width: 10%;
    display: inline-block;
    position: relative;

    &.btn-menu {
      background: #9500a2;
      width: 25%;
    }

    &.btn-member {
      background: #ff5722;
      width: 25%;
    }

    &.btn-pay {
      background: #c73c29;
      width: 30%
    }

    &.btn-receipt {
      background: #ff9f00;
      width: 20%;
    }

    &.btn-delivery {
      background: #ff9f00;
      width: 20%;
    }
  }

  tr {
    .btn-pay {
      /*border-bottom: none;*/
    }
  }
}
</style>
