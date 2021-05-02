<template>
  <div id="status-bar">
    <table style="width: 100%;">
      <tr>
        <td>cashier : {{ me.name }}</td>
        <td>customer : {{ order.customer ? order.customer.name : '' }}</td>
        <td>bill no : {{ order.billNo }}</td>
        <td>order no : {{ order.saved ? order.id : 'none' }}</td>
        <td>status : {{ order.status }}</td>
        <td class="btn" @click="" v-if="lastOrder && lastOrder.no">Last Bill : # {{ lastOrder.no }} / {{ lastOrder.amount | price | currency }}</td>
        <td class="text-right">{{ date | datetime }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { datetime, price, currency } from "src/filters";

export default {
  name: "StatusBar",

  filters: {
    datetime: datetime,
    price: price,
    currency: currency
  },

  data() {
    return {
      date: new Date()
    }
  },

  computed: {
    order() {
      return this.$store.state.order;
    },
    me() {
      return this.$store.state.data.me;
    },
    lastOrder() {
      return this.$store.state.data.lastOrder;
    }
  },

  methods: {
    setTime() {
      this.date = new Date();
    }
  },

  mounted() {
    const ONE_MIN =  1000 * 60;
    setTimeout(() => this.setTime() & setInterval(() => this.setTime(), ONE_MIN), (Math.ceil(Date.now() / ONE_MIN) * ONE_MIN) - Date.now());
  }
}
</script>

<style lang="scss">
#status-bar {
  position: relative;
  padding: 0 5px;

  ul {
    li {
      display: inline-block;
      width:16.666%;
      float: left;
      padding: 5px 0;


      &:first-child {
        text-align: left;
      }

      &:last-child {
        text-align: right;
      }
    }
  }

  tr {
    text-transform: uppercase;
    text-align: center;

    td {
      &:first-child {
        text-align: left;
      }

      &:last-child {
        text-align: right;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.btn {
  cursor: pointer;
}
</style>
