<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card style="width: 700px; max-width: 80vw;" class="container">

      <q-toolbar>
        <q-avatar>
          <img :src="item.info.image" :alt="item.info.name">
        </q-avatar>

        <q-toolbar-title>
          {{ item.info.name }}
          <p class="item-price">{{ item.info.price | price | currency }}</p>
        </q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section style="max-height: 65vh" class="scroll">
        <div v-if="item.info.modifier.length" layout="rows center-center">
          <fieldset v-for="mod in item.info.modifier" :key="mod.id" style="min-width: calc(50% - 8px)">
            <legend>{{ mod.name }}</legend>
            <div layout="rows center-center" class="q-gutter-sm">
              <q-btn :outline="!isModifierSelected(mod, modItem)" no-caps color="secondary" unelevated v-for="modItem in mod.items" :key="modItem.id" @click="toggleModifier(mod, modItem)">{{ modItem.name }}</q-btn>
            </div>
          </fieldset>
        </div>

        <div class="row">
          <div class="col">
            <fieldset>
              <legend>Qty</legend>
                <q-input outlined placeholder="Qty" dense v-model="qty" class="qty-button" ref="qty" pos-keyboard='{ "type": "number" }' input-class="text-center">
                  <template v-slot:prepend>
                    <q-icon :name="icons.fasMinus" @click="qtyMinus" class="cursor-pointer"/>
                  </template>
                  <template v-slot:append>
                    <q-icon :name="icons.fasPlus" @click="qtyPlus" class="cursor-pointer"/>
                  </template>
                </q-input>
            </fieldset>
          </div>
          <div class="col">
            <fieldset>
              <legend>Remarks</legend>
              <q-input type="textarea" outlined autogrow placeholder="Remarks" dense v-model="remarks" pos-keyboard='{ "type": "qwerty" }'/>
            </fieldset>
          </div>
        </div>
      </q-card-section>


      <q-card-actions v-if="type === 'update'">
        <q-btn unelevated outline label="Delete" color="negative" @click="deleteItem" />
        <q-space />
        <q-btn unelevated outline label="Cancel" color="primary" v-close-popup />
        <q-btn unelevated label="Update" color="positive" @click="update" ref="addBtn" />
      </q-card-actions>

      <q-card-actions align="right" v-if="type === 'new'">
        <q-btn unelevated outline label="Cancel" color="primary" v-close-popup />
        <q-btn unelevated label="Add" color="positive" @click="add" ref="addBtn" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {currency, price} from "src/filters";

import { fasPlus, fasMinus } from '@quasar/extras/fontawesome-v5'

export default {
  name: "ItemDetailsPopup",

  filters: {
    price: price,
    currency: currency,
  },

  props: {
    item: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      default: 'new'
    }
  },

  data() {
    return {
      icons: {
        fasPlus, fasMinus
      },
      qty: 1,
      initQty: 1,
      remarks: '',
      selectedModifiers: {}
    }
  },

  computed: {
    diffQty() {
      return this.qty - this.initQty;
    }
  },

  methods: {
    show () {
      this.$refs.dialog.show();
    },

    hide () {
      this.$refs.dialog.hide()
    },

    onDialogHide () {
      this.$emit('hide')
    },

    qtyMinus() {
      if (this.qty === 1) return;
      this.qty --;
    },

    qtyPlus() {
      this.qty ++;
    },

    toggleModifier(parent, item) {
      if (!this.selectedModifiers[parent.id]) {
        this.$set(this.selectedModifiers, parent.id, [])
      }

      if (this.selectedModifiers[parent.id].find(i => i.id === item.id)) { //selected
        this.selectedModifiers[parent.id] = this.selectedModifiers[parent.id].filter(i => i.id !== item.id);

        if (!parent.empty && !this.selectedModifiers[parent.id].length) {
          let data = [];
          if (parent.multiple) {
            data = parent.items.filter(i => i.isDefault === true)
          } else {
            data = parent.items.find(i => i.isDefault === true);
            if (data) {
              data = [ data ]
            } else {
              data = [];
            }
          }
          this.selectedModifiers[parent.id] = data;
        }
      } else {
        if (parent.multiple) {
          this.selectedModifiers[parent.id].push(item);
        } else {
          this.selectedModifiers[parent.id] = [ item ]
        }
      }
    },

    isModifierSelected(parent, item) {
      return !!this.selectedModifiers[parent.id]?.find(i => i.id === item.id);
    },

    deleteItem() {
      this.$store.commit('order/deleteItemFromCart', this.item)

      this.$emit('ok', { action: 'delete', item: this.item })
      this.hide()
    },

    update() {
      const modifiers = Object.values(this.selectedModifiers).reduce((acc, v) => {acc.push(...v); return acc;}, [])
      this.$store.commit('order/pushToCart', { item: this.item, update: { qty: this.qty, remarks: this.remarks, modifiers }, replace: this.item.key })

      this.$emit('ok', { action: 'update', item: this.item })
      this.hide()
    },

    add() {
      const modifiers = Object.values(this.selectedModifiers).reduce((acc, v) => {acc.push(...v); return acc;}, [])
      this.$store.commit('order/pushToCart', { item: this.item, update: { qty: this.qty, remarks: this.remarks, modifiers } })

      this.$emit('ok', { action: 'add', item: this.item })
      this.hide()
    }
  },

  mounted() {
    this.item.modifiers.forEach(m => {
      if (!this.selectedModifiers[m.parent]) {
        this.$set(this.selectedModifiers, m.parent, [])
      }

      this.selectedModifiers[m.parent].push(m);
    });

    this.qty = this.item.qty;

    this.$nextTick(() => this.$refs.addBtn?.$el?.focus());
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 15px;
  background: #fff;

  .buttons-group {
    text-align: center;

    .title {
      font-weight: bold;
      font-size: 19px;
      font-family: "Concert One", sans-serif;
      text-transform: uppercase;
      margin: 0 0 2px;
    }
  }

  .button {
    display: inline-block;
    margin: 2px;

    .name, .price {
      margin: 0;
    }

    .name {
      font-weight: bold;
    }

    .price {
      font-size: 12px;
    }
  }

  .add-btn {
    margin: 15px 2px 0 2px;
  }

  .action-content {
    display: flex;

    & > div {
      width: 50%;
    }
  }

  .qty-button {
    width: 50%;
    margin: 0 auto;
  }
}

fieldset {
  border: 1px solid var(--q-color-info);
  border-radius: 5px;
}

legend {
  color: var(--q-color-info);
  font-weight: bold;
  font-size: 14px;
  //font-family: "Concert One", sans-serif;
  padding: 0 5px;
  text-transform: uppercase;
  margin: 0 0 2px;
}

.item-price {
  font-size: 12px;
  margin: 0;
}
</style>
