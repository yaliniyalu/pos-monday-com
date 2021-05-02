<template>
  <q-dialog position="top" ref="dialog" @hide="onDialogHide">
    <q-card>
      <q-card-section>
        <p class="title">Hold List</p>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col">
            <q-input outlined dense placeholder="Bill No" debounce="500" v-model="billNo" pos-keyboard='{ "type": "number" }'>
              <template v-slot:append="">
                <q-icon name="fas fa-search"/>
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div v-if="filteredList.length" class="grid" layout="rows top-left">
          <div v-for="item in filteredList" :key="item.id" class="list-item">

            <q-btn unelevated no-caps outline color="blue" class="button" @click="openOrder(item.id)">
              <div class="content">
                <p># {{ item.billNo }}</p>
                <p class="text-secondary">{{ item.customer || '-' }}</p>
              </div>
            </q-btn>

          </div>
        </div>
        <div v-else>
          <p class="text-center">No Orders Found</p>
        </div>
        <q-inner-loading :showing="loading">
          <q-spinner-tail size="50px" color="primary"/>
        </q-inner-loading>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>

import ui from "src/ui";

export default {
  name: 'HoldList',

  data() {
    return {
      loading: false,
      billNo: '',
    }
  },

  computed: {
    list() {
      return this.$store.state.data.holdList
    },

    filteredList() {
      if (!this.billNo) {
        return this.$store.state.data.holdList;
      }

      return this.$store.state.data.holdList.filter(v => (v.billNo + '').startsWith(this.billNo))
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

    openOrder(id) {
      this.$store.dispatch('app/resetApp')

      try {
        this.$store.dispatch('order/unHoldOrder', id);
        ui.notifySuccess('Order released')
        this.hide();
      } catch {
        ui.notifyError('Unable to release the order')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$width : 100px;

.list-item {
  margin: 2px;

  p {
    margin: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: calc(#{$width} - 8px);
  }

  .content {
    padding: 2px;
  }

  .button {
    width: $width;
    /*height: 100px;*/
  }

  .button[active] {
    p {
      color: #fff !important;
    }
  }
}

.title {
  font-weight: bold;
  font-size: 19px;
  font-family: "Concert One", sans-serif;
  text-transform: uppercase;
  margin: 0 0 2px;
}
</style>
