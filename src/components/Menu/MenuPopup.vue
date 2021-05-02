<template>
  <q-dialog position="top" ref="dialog" full-width>
    <q-card>
      <q-card-section>
        <div class="row q-gutter-md">
          <div class="col">
            <q-form>
              <div class="row q-gutter-md">
                <div class="col">
                  <q-input v-model="code" outlined dense stack-label label="Code" pos-keyboard='{ "type": "number" }'/>
                </div>
                <div class="col">
                  <q-input v-model="name" outlined dense stack-label label="Name" pos-keyboard='{ "type": "text" }'/>
                </div>
                <div class="col">
                  <q-select v-model="category" :options="categoryOptions" outlined dense stack-label label="Category" @filter="filterFn" use-input map-options option-value="id" option-label="name" />
                </div>
<!--                <div class="col">
                  <q-btn type="submit" color="primary" unelevated label="Search" :loading="loading"/>
                </div>-->
              </div>
            </q-form>
            <div class="row">
              <div class="container-menu">
                <div class="grid" layout="rows top-left">

                  <MenuItem v-for="(item) in filteredItems" :key="item.id" :item="item" @tap="addItem(item)" @long-press="openItem"
                            :theme="menuSettings.itemTheme" :show-price="menuSettings.showPrice"/>

                  <div class="info-div" v-if="!(filteredItems.length || loading)"><p class="info">No Items Found</p></div>
                  <div class="info-div" v-if="loading"><p class="info">Loading...</p></div>
                </div>

              </div>
            </div>
          </div>
          <div class="col">
            <p class="sub-title">Recent Items</p>
            <span class="btn-close text-negative">
                            <q-icon name="fas fa-times" class="cursor-pointer" @click="hide"/>
                         </span>

            <div class="grid" layout="rows top-left">
              <MenuItem v-for="item in recentItems" :key="item.code" @tap="addItem(item)"
                        :item="item"
                        :theme="menuSettings.itemTheme"
                        :show-price="menuSettings.showPrice"
              />
              <div class="info-div" v-if="!Object.keys(recentItems).length"><p class="info">No Recent Items Found</p></div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import MenuItem from './MenuItem'
import MenuCategory from './MenuCategory'
import ItemDetailsChooser from "../ItemDetails/ItemDetailsPopup";
import {getDefaultModifiers, getNewCartItem} from "src/utils";
import ItemDetailsPopup from "components/ItemDetails/ItemDetailsPopup";

export default {
  name: 'MenuPopup',
  components: { MenuCategory, MenuItem },

  data () {
    return {
      code: '',
      name: '',
      category: '',

      categoryOptions: [],

      loading: false
    }
  },

  computed: {
    menuSettings() {
      return this.$store.state.app.settings.menu;
    },

    recentItems() {
      return this.$store.state.data.recentItems;
    },

    items() {
      return this.$store.state.data.items;
    },

    categories() {
      return this.$store.state.data.category;
    },

    filteredItems() {
      if (!(this.code || this.name || this.category)) {
        return  this.items.slice(0, 50)
      }

      return this.items.filter(v => {
        let c1, c2, c3;

        c1 = this.code ? (v.code + '').toLowerCase().startsWith(this.code.toLowerCase()) : true;
        c2 = this.name ? (v.name + '').toLowerCase().startsWith(this.name.toLowerCase()) : true;
        c3 = this.category ? v.category?.id === this.category?.id : true;

        return c1 && c2 && c3;
      })
    }
  },

  methods: {
    show () {
      this.$refs.dialog.show();
    },

    hide () {
      this.$refs.dialog.hide()
    },

    addItem (item) {
      this.$store.dispatch('data/addToRecentItems', item)

      if (item.modifier.length) {
        let modifiers = getDefaultModifiers(item);

        if (this.menuSettings.addWithDefaultModifiers) {
          this.$store.dispatch('order/addToCart', { item, modifiers })
        } else {
          this.$q.dialog({
            component: ItemDetailsPopup,
            root: this.$root,
            item: getNewCartItem({ item, modifiers }),
            type: 'new'
          })
        }
      } else {
        this.$store.dispatch('order/addToCart', { item })
      }
    },

    openItem(item) {
      let modifiers = getDefaultModifiers(item);
      this.$q.dialog({
        component: ItemDetailsPopup,
        root: this.$root,
        item: getNewCartItem({ item, modifiers }),
        type: 'new'
      })
    },

    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.categoryOptions = this.categories;
        });
        return
      }

      update(() => {
        const needle = val.toLowerCase();
        this.categoryOptions = this.categories.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
      })
    }
  },
}
</script>

<style scoped lang="scss">
.container-menu {
  margin-top: 10px;
}

.info-div {
  color: #ccc;
}
</style>
