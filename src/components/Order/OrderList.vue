<template>
  <perfect-scrollbar class="grid" @ps-y-reach-end="loadMore">
    <div class="row q-gutter-md q-pt-md">
      <div class="col-4">
        <q-form ref="frm_get_trans" @submit="loadOrder">
          <q-input autofocus outlined dense v-model="billNo" label="Bill No" :loading="loadingBill" bottom-slots :error="notFound" error-message="Order Not Found" v-select-on-focus>
            <template v-slot:append>
              <font-awesome-icon icon="arrow-alt-circle-right" class="set-icon cursor-pointer"
                                 v-if="!loadingBill" @click="$refs.frm_get_trans.submit()"/>
            </template>
          </q-input>
        </q-form>
      </div>
    </div>

    <div class="row" layout="rows top-left">
      <OrderItem v-for="(order) in filteredOrders" :key="order.id" @tap="openOrder" :item="order"/>

      <div class="info-div" v-if="!filteredOrders.length && !loading"><p class="info">No Items Found</p></div>
      <div class="info-div" v-if="loading || loadingMore"><p class="info">Loading...</p></div>
    </div>
  </perfect-scrollbar>
</template>

<script>
import {getOrder, getOrderByBillNo, listOrders, listOrdersByDate} from "src/modals/order";
import OrderItem from "components/Order/OrderItem";
import ui from "src/ui";

export default {
  name: "OrderList",
  components: {OrderItem},
  data() {
    return {
      loading: false,
      orders: [],

      notFound: false,

      billNo : null,

      loadingBill: false,
      loadingMore: false,
      finished: false,
      page: 1,
    }
  },
  computed: {
    filteredOrders() {
      return this.orders;
    }
  },
  methods: {
    async openOrder(order) {
      ui.showLoader("Loading order...")
      try {
        const o = await getOrder(order.id)
        await this.setOrder(o);
        ui.notifySuccess("Order loaded")
      } catch(_) {
        ui.notifyError("Unable to load your order")
      }
      ui.hideLoader();
    },

    async loadOrder() {
      try {
        this.loadingBill = true;
        const order = await getOrderByBillNo(this.billNo)
        if (!order) {
          this.notFound = true;
        }

        ui.showLoader("Loading order...")
        try {
          await this.setOrder(order);
          ui.notifySuccess("Order loaded")
        } catch {
          ui.notifyError("Unable to load your order")
        }
        ui.hideLoader();
      } catch {
        this.notFound = true;
      }
      this.loadingBill = false
    },

    async loadMore() {
      if (this.loadingMore || this.finished) return;

      this.loadingMore = true
      listOrders(++ this.page, 10)
        .then(orders => {
          this.orders.push(...orders);

          if (!orders.length)
            this.finished = true;
        }).finally(_ => { this.loadingMore = false })
    },

    async setOrder(order) {
      if (this.$store.state.order.items.length) {
        await this.$store.dispatch('order/holdOrder');
      }

      await this.$store.dispatch('order/loadOrder', order)
      await this.$store.dispatch('app/resetApp')
    }
  },
  mounted() {
    this.loading = true
    listOrders(1, 10)
      .then(orders => {
        this.orders = orders
      }).finally(_ => { this.loading = false })
  }
}
</script>

<style lang="scss" scoped>
.info-div {
  display: table;
  height: 100px;
  width: 100%;
  text-align: center;

  .info {
    text-align: center;
    color: var(--text-muted);

    display: table-cell;
    vertical-align: middle;
  }
}
</style>
