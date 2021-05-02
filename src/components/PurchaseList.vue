<template>
  <perfect-scrollbar :style="{height: height}">
    <table class="list with-sno">
      <thead>
      <tr>
        <th>#</th>
        <th class="w-15" v-if="settings.show.code">Code</th>
        <th class="w-45" v-if="settings.show.name">Name</th>
        <th v-if="settings.show.price">Price</th>
        <th>Qty</th>
        <th>Total</th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="(item, key, index) in items" :key="item.key"

          @click="rowTap(item)"
          v-touch-hold.mouse="rowLongTap(item)"
          v-touch-swipe.mouse="handleSwipe(item)"

          :data-index="item.key"

          :class="{ selected: selection === item.key }"
      >
        <td data-field="sno">{{ key + 1 }}</td>
        <td data-field="code" v-if="settings.show.code">{{ item.info.code }}</td>
        <td data-field="name" v-if="settings.show.name">{{ item.info.name }}</td>
        <td class="text-right" data-field="price" v-if="settings.show.price">{{ item.price | price }}</td>
        <td class="text-right" data-field="qty">{{ item.qty }}</td>
        <td class="text-right font-number" data-field="total">{{ item.totalPrice | price }}</td>
      </tr>
      </tbody>

      <tfoot class="list-empty" v-if="items.length === 0">
      <tr>
        <td colspan="10" class="text-center">List Empty</td>
      </tr>
      </tfoot>
    </table>
  </perfect-scrollbar>
</template>

<script>
import ItemDetailsPopup from "./ItemDetails/ItemDetailsPopup";
import {currency, price} from "src/filters";

export default {
  name: 'PurchaseList',
  filters: {
    price: price,
    currency: currency,
  },
  props: {
    height: {
      type: [String],
      default: undefined
    }
  },

  data () {
    return {
      selection: null,
      readonly: false,
    }
  },

  computed: {
    items() {
      return this.$store.state.order.items;
    },

    settings() {
      return this.$store.state.app.settings.list
    }
  },

  watch: {
    selection (id) {
      if (id) { this.scrollTo(id) }
    }
  },

  methods: {
    rowTap (item) {
      this.performAction(this.settings.action.tap, item);
    },

    handleSwipe(item) {
      return (e) => {
        if (e.direction === 'left') {
          this.performAction(this.settings.action.swipeLeft, item);
        } else if (e.direction === 'right') {
          this.performAction(this.settings.action.swipeRight, item);
        }
      }
    },

    rowSwipeLeft (item) {
      return () => {
        this.performAction(this.settings.action.swipeLeft, item);
      }
    },

    rowSwipeRight (item) {
      return () => {
        this.performAction(this.settings.action.swipeRight, item);
      }
    },

    rowLongTap (item) {
      return () => {
        this.performAction(this.settings.action.longTap, item);
      }
    },

    scrollTo (key) {
      this.$nextTick(() => {
        let elm = document.querySelector('[data-index="' + key + '"]');
        if (elm) { elm.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'auto' }) }
      })
    },

    performAction(action, item) {
      switch (action) {
        case 'popup':
        case 'details':
          this.$q.dialog({
            component: ItemDetailsPopup,
            root: this.$root,
            item: item,
            type: 'update'
          });
          break;
        case 'delete':
          this.deleteItem(item);
          break;
        case 'none':
        default:
      }
    },

    deleteItem(item) {
      if (this.readonly) return;
      this.$store.commit('order/deleteItemFromCart', item)
    }
  }
}
</script>

<style lang="scss" scoped>
table {
  user-select: none;
}
</style>
