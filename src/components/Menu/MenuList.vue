<template>
  <perfect-scrollbar class="grid" layout="rows top-left" v-touch-swipe.mouse.right="swipeRight">

    <div v-if="selectedCategory" :class="back_button_class" @click="onBack" style="--image: ''">
      <p class="info action-text">Back</p>
    </div>

    <MenuCategory v-for="c in displayCategory" :key="c.id" @tap="openCategory" :category="c" :theme="menuSettings.categoryTheme"/>

    <MenuItem v-for="(item) in displayItems" :key="item.id" @tap="addItem" @long-press="openItem" :item="item"
                :theme="menuSettings.itemTheme" :show-price="menuSettings.showPrice"/>

    <div class="info-div" v-if="isItemEmpty"><p class="info">No Items Found</p></div>
    <div class="info-div" v-if="loading"><p class="info">Loading...</p></div>
  </perfect-scrollbar>
</template>

<script>
import MenuItem from './MenuItem'
import MenuCategory from './MenuCategory'

import {getDefaultModifiers, getNewCartItem} from "src/utils";
import ItemDetailsPopup from "components/ItemDetails/ItemDetailsPopup";

export default {
  name: 'MenuList',
  components: {ItemDetailsPopup, MenuCategory, MenuItem },
  data () {
    return {
      loading: 0,
    }
  },

  computed: {
    items() {
      return this.$store.state.data.items
    },

    category() {
      return this.$store.state.data.category
    },

    selectedCategory() {
      return this.$store.state.app.menuList.selectedCategory
    },

    displayItems() {
      return this.$store.state.data.items.filter(v => v.category?.id === this.$store.state.app.menuList.selectedCategory?.id)
    },

    displayCategory() {
      if (this.$store.state.app.menuList.selectedCategory) {
        return [];
      }

      return this.category;
    },

    isItemEmpty () {
      return this.selectedCategory && !this.displayItems.length && !this.loading;
    },

    menuSettings() {
      return this.$store.state.app.settings.menu;
    },

    back_button_class() {
      return {
        'grid-item': true,
        'info-div': true,
        'small': this.menuSettings.categoryTheme === 3 || this.menuSettings.categoryTheme === 3
      }
    },

    resetIndicator() {
      return this.$store.state.app.resetIndicator;
    }
  },

  watch: {
    resetIndicator() {
      this.reset();
    }
  },

  methods: {
    swipeRight () {
      this.onBack();
    },

    onBack () {
      this.$store.commit('app/setSelectedCategory', null)
    },

    openCategory (category) {
      this.$store.commit('app/setSelectedCategory', category)
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

    reset() {
      this.openCategory(null)
    }
  },
}
</script>

<style lang="scss" scoped>
.grid {
  overflow: auto;
  height: var(--action-screen-height);
  /*border: 2px dashed #f69c55;*/

  .grid-item {
    width: 100px;
    height: var(--menu-item-height);
    position: relative;
    margin-right: 5px;
    margin-bottom: 5px;
    cursor: pointer;
    /*--image: url('https://onlinejpgtools.com/images/examples-onlinejpgtools/coffee-resized.jpg');*/

    background-image: var(--image);
    background-size: cover;

    &:before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      /*background-image: linear-gradient(to bottom right, #002f4b, #dc4225);*/
      /*background-image: linear-gradient(to bottom right, #000, #000);*/
      opacity: .5;
    }

    &.small {
      height: calc(var(--menu-item-height) / 1.5);
    }

    .price {
      position: absolute;
      top: 0;
      right: 0;
      background: #0e979b;
      font-size: 0.8em;
      padding: 1px;
      color: #fff;
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
        background-image: linear-gradient(to bottom right, #000, #000);
        opacity: 0.5;
      }
    }

    .name {
      position: absolute;
      bottom: 0;
      width: 100%;
      color: #fff;
      font-size: 0.75em;
      padding: 2px;

      /* Multiple line */
      line-height: 1.3em;
      height: 3em;  // line-height * no of lines
      overflow: hidden;
    }
  }
}

p.i, p.i:hover {
  border-radius: 3px;
  color: #ffffff;
  font-size: 18px;
  padding: 10px;
  text-decoration: none;
  text-align: center;
  width: 100%;
  height: 62px;
  line-height: 35px;
  display: block;
  overflow: hidden;
  margin: 0;

  p {
    margin: 0;
    overflow: hidden;
  }
}

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

.action-text {
  color: #000 !important;
  font-weight: bold;
}
</style>
