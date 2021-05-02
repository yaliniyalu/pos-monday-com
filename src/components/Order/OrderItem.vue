<template>
  <div @click="tap" v-touch-hold.mouse="longPress">
    <div :class="mainClass">
      <div class="no text-primary">#{{ item.billNo }}</div>
      <div class="date">{{ item.date | datetime }}</div>
      <div>{{ item.payableAmount | null2zero | price | currency }}</div>
      <q-chip :style="{ background: getStatusColor() }" text-color="white" icon="shopping_cart" size="xs">{{ item.status || 'Pending' | capitalize }}</q-chip>
      <q-chip :style="{ background: getPaymentColor() }" text-color="white" icon="paid" size="xs">{{ item.paymentStatus || 'Pending' | capitalize}}</q-chip>
      <q-chip :style="{ background: getDeliveryColor() }" text-color="white" icon="local_shipping" size="xs">{{ item.deliveryStatus || 'Pending' | capitalize}}</q-chip>
    </div>
  </div>
</template>

<script>
import {datetime, currency, price, capitalize, null2zero} from "src/filters";
import {getColorForStatus} from "src/modals/utils";
import boards from "src/modals/board-mapping";

export default {
  name: "OrderItem",
  props: {
    item: Object,
    required: true
  },
  filters: {
    datetime, price, currency, capitalize, null2zero
  },
  computed: {
    mainClass () {
      return {
        'menu-item': true,
        'fill-height': true,
        'text-only': true,
        'selected': true
      }
    }
  },
  methods: {
    tap () {
      this.$emit('tap', this.item)
    },

    longPress() {
      this.$emit('long-press', this.item)
    },

    getPaymentColor() {
      return getColorForStatus(this.item.paymentStatus || 'pending', boards.order.columns.paymentStatus)
    },

    getStatusColor() {
      return getColorForStatus(this.item.status || 'pending', boards.order.columns.status)
    },

    getDeliveryColor() {
      return getColorForStatus(this.item.deliveryStatus || 'pending', boards.order.columns.deliveryStatus)
    },
  }
}
</script>

<style lang="scss" scoped>
.menu-item {
  width:  140px;
  height: 140px;
  min-width:  var(--menu-item-width);
  min-height: var(--menu-item-height);

  position: relative;
  margin-right: 5px;
  margin-bottom: 5px;
  cursor: pointer;
  user-select: none;
  /*--image: url('https://onlinejpgtools.com/images/examples-onlinejpgtools/coffee-resized.jpg');*/

  background-image: var(--image);
  background-size: cover;

  border: var(--menu-item-border);

  padding: 5px;

  .date {
    font-size: 10px;
  }

  .price {
    position: absolute;
    top: 0;
    right: 0;
    background: var(--menu-item-price-background);
    font-size: 0.8em;
    padding: 0 5px;
    border-radius: 6px 0 0 6px;
    color: var(--menu-item-price-color);
    line-height: 18px;
    z-index: 1;
  }

  .name-overlay {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 36px;
    color: #fff;

    &:before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-image: var(--menu-item-name-background); //linear-gradient(to bottom right, #000, #000);
      opacity: 0.6;
    }
  }

  .name {
    position: absolute;
    bottom: 0;
    width: 100%;
    color: var(--menu-item-name-color);
    font-size: 0.75em;
    padding: 2px;

    /* Multiple line */
    line-height: 1.3em;
    height: 3em;  // line-height * no of lines
    overflow: hidden;

    /*text-shadow: 1px 1px #000;*/
  }
}
</style>
