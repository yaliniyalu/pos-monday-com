<template>
  <q-layout view="hHh lpR fFf" :class="{ content: true, 'no-list-editor': !showEditor }" id="pos-layout">
    <q-page-container class="container">
      <div class="row">
        <div class="col-6 left-col">
          <div class="row">
            <div class="col-12">
              <PurchaseList class="purchase-list" />
            </div>
          </div>
          <div class="row" v-if="showEditor">
            <div class="col-12">
              <ItemListEditor/>
            </div>
          </div>

          <div class="row">
            <div class="col-8">
              <PriceInfoBoard/>
            </div>
            <div class="col-4">
              <ControlButtons/>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="row">
            <div class="col-12">
              <ActionButtons/>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <ActionContent/>
            </div>
          </div>
          <div class="row">
            <div class="col-9">
              <NumberPad/>
            </div>
            <div class="col-3">
              <RightButtons/>
            </div>
          </div>
        </div>
      </div>
    </q-page-container>
    <q-footer bordered class="bg-white text-primary">
      <StatusBar/>
    </q-footer>
  </q-layout>
</template>

<script>
import StatusBar from "components/StatusBar";
import PriceInfoBoard from "components/PriceInfoBoard";
import ControlButtons from "components/ControlButtons";
import PurchaseList from "components/PurchaseList";
import NumberPad from "components/Keyboard/NumberPad";
import RightButtons from "components/RightButtons";
import ActionButtons from "components/ActionButtons";
import ActionContent from "components/ActionContent";
import ItemListEditor from "components/ItemListEditor";
import ui from "src/ui";

import mondaySdk from "monday-sdk-js";
import {loadMapping} from "src/modals/schema";
const monday = mondaySdk();

export default {
  name: "POS",
  components: {
    ItemListEditor,
    ActionContent,
    PurchaseList, ControlButtons, PriceInfoBoard, StatusBar, NumberPad, RightButtons, ActionButtons},

  computed: {
    showEditor() {
      return this.$store.state.app.settings.editor.enable;
    }
  },

  methods: {
    async init() {
      ui.showLoader('Loading...')
      const mapping = await loadMapping();

      if (!mapping) {
        this.$router.replace('/mapping')
        ui.hideLoader();
        return;
      }

      const p1 = this.$store.dispatch('order/newOrder')
      const p2 = this.$store.dispatch('data/loadItems');
      const p3 = this.$store.dispatch('data/loadMe');

      const p4 = monday.storage.instance.getItem('settings')
        .then(res => {
          const {value} = res.data;
          if (value && value !== "null") {
            this.$store.dispatch('app/setSettings', JSON.parse(value))
          }
        })

      Promise.all([p1, p2, p3, p4]).finally(_ => {
        ui.hideLoader();
      })
    },
  },

  mounted() {
    this.init();
  }
}
</script>

<style lang="scss" scoped>

.content {
  /*width: 100vw;*/
  height: 100vh;

  /*max-width: 100vw;*/
  max-height: 100vh;

  /*!*overflow: hidden;*!*/
  /*position: relative;*/

  .main-container {
    padding: 5px;
  }

  .purchase-list {
    margin-bottom: 5px;
    height: var(--purchase-list-height);
  }

  .list-editor {
    margin-bottom: 5px;
    height: var(--list-editor-height);
  }

  .price-info-board {
    /*margin-bottom: 5px;*/
    height: var(--price-info-board-height);
  }

  .left-col {
    padding-right: 5px;
  }

  .status-bar {
    /*position: absolute;*/
    /*width: 100%;*/
    /*bottom: 0;*/
    height: var(--status-bar-height);
  }

  .control-buttons {
    margin-left: 5px;
  }

  .item-details {
    margin-right: 4px;
  }
}

.fullscreen-spinner {
  text-align: center;

  .spinner-content {
    display: block;
  }
}

.container {
  padding: 5px;
  padding-bottom: 31px !important;
}
</style>
