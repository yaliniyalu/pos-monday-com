<template>
  <div>
    <table>
      <tbody>
      <tr>
        <td class="w-20">
          <q-input ref="input_code" type="text" v-model="item.code" v-select-on-focus label="ITEM CODE" stack-label dense square outlined
                   @keypress.enter="itemCodeChange"

                   :loading="loading"
                   :disable="!active || inp_code_disabled"
                   :error="inp_code_error">
          </q-input>
        </td>
        <td class="w-40">
          <q-input type="text" :value="itemName" label="ITEM NAME" stack-label dense square outlined
                   :readonly="true" :error="false"/>
        </td>
        <td class="w-15">
          <q-input ref="input_price" type="text" :value="itemPrice" v-select-on-focus label="PRICE"
                   stack-label dense square outlined
                   :readonly="true"
                   :error="false"
          />
        </td>
        <td class="w-15">
          <q-input ref="input_qty" type="text" v-model="item.qty" v-select-on-focus label="QTY" stack-label
                   dense square outlined
                   @keypress.enter="qtyChange"

                   :readonly="!active || inp_qty_disabled || loading"
                   :error="inp_qty_error"
          />
        </td>
      </tr>
      </tbody>
    </table>
    <label style="display: none">
      <input type="text" @focus="">
    </label>
  </div>
</template>

<script>
import ui from "src/ui";
import {getDefaultModifiers, getNewCartItem} from "src/utils";
import ItemDetailsPopup from "components/ItemDetails/ItemDetailsPopup";

export default {
  name: 'ItemListEditor',
  data () {
    return {
      dblKey: false,
      dblKeyTimer: false,

      inp_code_disabled: false,
      inp_qty_disabled: true,

      inp_code_error: false,
      inp_qty_error: false,

      loading: false,

      item: {
        code: '',
        qty: '',
      },

      active: true,

      show_dialog: false,
    }
  },

  computed: {
    settings() {
      return this.$store.state.app.settings
    },

    items() {
      return this.$store.state.data.items;
    },

    selectedItem() {
      if (!this.item.code) {
        return null;
      }

      return this.items.find(v => (v.code + '').toLowerCase() === this.item.code.toLowerCase())
    },

    itemName() {
      return this.selectedItem?.name
    },

    itemPrice() {
      return this.selectedItem?.price;
    },

    resetIndicator() {
      return this.$store.state.app.resetIndicator;
    }
  },

  watch: {
    resetIndicator() {
      this.clear();
    }
  },

  methods: {
    resetItem () {
      this.item = {
        code: '',
        qty: '',
      }
    },

    itemCodeChange (e) {
      if (e.preventDefault) e.preventDefault();

      if (this.dblKey && !this.item.code) {
        clearTimeout(this.dblKeyTimer);
        this.$store.dispatch('app/openPage', 'pay')
        return;
      }

      this.dblKey = true;
      setTimeout(() => this.dblKey = false, 1000);

      if (!this.item.code || !this.selectedItem) {
        this.dblKeyTimer = setTimeout(() => { this.inputError('code') }, 300);
        return;
      }

      this.inp_qty_disabled = false;
      this.item.qty = 1;

      this.$nextTick(_ => this.addItem(this.selectedItem))
    },

    addItem (item) {
      if (item.modifier.length && !this.settings.menu.addWithDefaultModifiers) {
        let modifiers = getDefaultModifiers(item);
        this.$q.dialog({
          component: ItemDetailsPopup,
          root: this.$root,
          item: getNewCartItem({ item, modifiers }),
          type: 'new'
        }).onDismiss(() => {
          this.clear();
        })
        return;
      }

      this.proceedNextStep();
    },

    proceedNextStep() {
      if (this.settings.editor.stopAtQty) {
        this.setFocus('qty');
      } else {
        this.finishAddCart(this.selectedItem);
      }
    },

    finishAddCart(item) {
      const qty = parseInt(this.item.qty);
      this.$store.dispatch('data/addToRecentItems', item)

      if (item.modifier.length) {
        let modifiers = getDefaultModifiers(item);
        this.$store.dispatch('order/addToCart', { item, qty, modifiers })
      } else {
        this.$store.dispatch('order/addToCart', { item, qty  })
      }

      this.clear();
    },

    qtyChange () {
      if (isNaN(parseInt(this.item.qty))) {
        this.inputError('qty');
        return;
      }
      this.finishAddCart(this.selectedItem)
    },

    setFocus (name) {
      const input = this.$refs['input_' + name];
      input.focus();
      input.select();
    },

    inputError (input) {
      ui.audio.playError();
      this['inp_' + input + '_error'] = true;
      setTimeout(() => { this['inp_' + input + '_error'] = false }, 250);
    },

    clear () {
      this.resetItem();
      this.inp_qty_disabled = true;
      this.setFocus('code');
    },
  },

  mounted () {
    this.setFocus('code');
  }
}
</script>

<style lang="scss" scoped>
.q-field--with-bottom {
  padding-bottom: 0 !important;
}
</style>
