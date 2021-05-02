<template>
  <perfect-scrollbar>
    <q-card v-if="settings">
      <q-card-section>
        <p class="title">Settings</p>
      </q-card-section>

      <q-card-section>
        <div class="q-gutter-md">
          <q-btn
            color="light-blue-5"
            @click="fullscreen"
            :icon="$q.fullscreen.isActive ? 'fas fa-compress' : 'fas fa-expand'"
            :label="$q.fullscreen.isActive ? 'Exit Fullscreen' : 'Fullscreen'"
          />
          <q-btn color="green-5" label="Reload" @click="reload"/>
          <q-btn color="cyan-5" label="Field Mapping" @click="$router.push('/mapping')"/>
<!--          <q-btn color="red-14" label="Exit" @click="exit"/>-->
        </div>
      </q-card-section>

      <q-separator/>

      <q-card-section>
        <p class="reload-info text-red">Some settings may take effect after reload</p>
      </q-card-section>

      <q-card-section>
        <p class="sub-title">Menu</p>

        <p class="sub-title-2">Item Template</p>
        <div class="q-gutter-sm">
          <q-radio v-model="settings.menu.itemTheme" :val="1" label="Image & Text"/>
          <q-radio v-model="settings.menu.itemTheme" :val="2" label="Image"/>
          <q-radio v-model="settings.menu.itemTheme" :val="3" label="Text"/>
        </div>

        <p class="sub-title-2">Category Template</p>
        <div class="q-gutter-sm">
          <q-radio v-model="settings.menu.categoryTheme" :val="1" label="Image & Text"/>
          <q-radio v-model="settings.menu.categoryTheme" :val="2" label="Image"/>
          <q-radio v-model="settings.menu.categoryTheme" :val="3" label="Text"/>
        </div>

        <p class="sub-title-2">Others</p>
        <div class="q-gutter-sm">
          <q-toggle v-model="settings.menu.addWithDefaultModifiers" label="Bypass modifier popup (Added with default modifiers)"/>
          <q-toggle v-model="settings.menu.showPrice" label="Show Item Price"/>
        </div>
      </q-card-section>

      <q-separator/>

      <q-card-section>
        <p class="sub-title">Purchase List</p>

        <p class="sub-title-2">Display</p>
        <div class="q-gutter-sm">
          <q-checkbox v-model="settings.list.show.code" label="Code"/>
          <q-checkbox v-model="settings.list.show.name" label="Name"/>
          <q-checkbox v-model="settings.list.show.price" label="Price"/>
        </div>

        <p class="sub-title-2">Swipe Left</p>
        <div class="q-gutter-sm">
          <q-radio v-model="settings.list.action.swipeLeft" val="none" label="None"/>
          <q-radio v-model="settings.list.action.swipeLeft" val="delete" label="Delete"/>
          <q-radio v-model="settings.list.action.swipeLeft" val="details" label="Details"/>
        </div>

        <p class="sub-title-2">Swipe Right</p>
        <div class="q-gutter-sm">
          <q-radio v-model="settings.list.action.swipeRight" val="none" label="None"/>
          <q-radio v-model="settings.list.action.swipeRight" val="delete" label="Delete"/>
          <q-radio v-model="settings.list.action.swipeRight" val="details" label="Details"/>
        </div>

        <p class="sub-title-2">Tap</p>
        <div class="q-gutter-sm">
          <q-radio v-model="settings.list.action.tap" val="none" label="None"/>
          <q-radio v-model="settings.list.action.tap" val="details" label="Details"/>
        </div>

        <p class="sub-title-2">Long Press</p>
        <div class="q-gutter-sm">
          <q-radio v-model="settings.list.action.longTap" val="none" label="None"/>
          <q-radio v-model="settings.list.action.longTap" val="details" label="Details"/>
        </div>
      </q-card-section>

      <q-separator/>

      <q-card-section>
        <p class="sub-title">Printing</p>
        <div class="q-gutter-sm">
          <q-toggle v-model="settings.printing.autoPrintAfterFinish" label="Auto Print Receipt (On finish)"/>
          <q-toggle v-model="settings.printing.autoPrintAfterSave" label="Auto Print Receipt (On save)"/>
          <q-toggle v-model="settings.printing.autoPrintOnPopupOpen" label="Auto Print Receipt (On receipt open)"/>
        </div>
      </q-card-section>

      <q-separator/>

      <q-card-section>
        <p class="sub-title">Barcode</p>
        <div class="q-gutter-sm">
          <q-toggle v-model="settings.editor.enable" label="Enable Editor"/>
          <q-toggle v-model="settings.editor.stopAtQty" label="Enable Qty Change"/>
        </div>
      </q-card-section>

      <q-separator/>

      <q-card-section>
        <p class="sub-title">Others</p>
        <div class="q-gutter-sm">
          <q-toggle v-model="settings.misc.virtualKeyboard" label="Virtual Keyboard"/>
        </div>
      </q-card-section>

      <q-card-section>
        <p class="sub-title">Receipt</p>
        <div class="q-gutter-sm" layout="rows top-left">
          <q-input stack-label dense outlined class="w-45" v-model.lazy="settings.receipt.name" label="Name"/>
          <q-input stack-label dense outlined class="w-45" v-model.lazy="settings.receipt.address" type="textarea" label="Address" autogrow/>
          <q-input stack-label dense outlined class="w-45" v-model.lazy="settings.receipt.phone" label="Phone"/>
          <q-input stack-label dense outlined class="w-45" v-model.lazy="settings.receipt.cell" label="Cell"/>
        </div>
      </q-card-section>
    </q-card>
  </perfect-scrollbar>
</template>

<script>
import { extend } from 'quasar'

export default {
  name: "Settings",
  data() {
    return {
      settings: null
    }
  },

  watch: {
    settings: {
      handler: function (val) {
        this.$store.dispatch('app/setSettings', extend(true, {}, val))
      },
      deep: true
    },
  },

  computed: {

  },

  methods: {
    reload() {
      window.location.reload()
    },

    exit() {
      window.close();
    },

    fullscreen() {
      this.$q.fullscreen.toggle();
    },
  },

  mounted() {
    this.settings = extend(true, {}, this.$store.state.app.settings);
  },
}
</script>

<style lang="scss" scoped>
.reload-info {
  margin: 0;
}
</style>
