<template>
  <div @click="tap" v-touch-hold.mouse="longPress">
    <div :class="mainClass" :style="'--image:url(' + category.image + ')'" v-if="theme === 1">
      <div class="type" v-if="showTitle" >category</div>
      <div>
        <div class="name-overlay"></div>
        <div class="name">{{ category.name }}</div>
      </div>
    </div>
    <div :class="mainClass" :style="'--image:url(' + category.image + ')'" v-else-if="theme === 2">
      <div>
        <div class="name-overlay"></div>
        <div class="name">{{ category.name }}</div>
        <div class="type" v-if="showTitle" >category</div>
      </div>
    </div>
    <div :class="mainClass" v-else>
      <div class="type" v-if="showTitle" >category</div>
      <div class="name">{{ category.name }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MenuCategory',
  props: {
    category: {
      type: Object,
      required: true
    },

    showTitle: {
      type: Boolean,
      default: true
    },

    theme: {
      type: Number,
      default: 2
    },

    selected: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    mainClass () {
      return {
        'menu-item': true,
        'fill-height': this.theme === 2,
        'text-only': this.theme === 3,
        'selected': this.selected
      }
    }
  },

  methods: {
    tap () {
      this.$emit('tap', this.category)
    },

    longPress() {
      this.$emit('long-press', this.item)
    }
  }
}
</script>

<style scoped lang="scss">
.menu-item {
  width:  var(--menu-item-width);
  height: var(--menu-item-height);
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

  .type {
    position: absolute;
    top: 0;
    right: 0;
    background: var(--menu-item-price-background);
    font-size: 0.7em;
    padding: 0 4px 1px;
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
      background-image: var(--menu-category-name-background); //linear-gradient(to bottom right, #000, #000);
      opacity: 0.5;
    }
  }

  .name {
    position: absolute;
    bottom: 0;
    width: 100%;
    color: var(--menu-category-name-color);
    font-size: 0.75em;
    padding: 2px;

    /* Multiple line */
    line-height: 1.3em;
    height: 3em;  // line-height * no of lines
    overflow: hidden;
  }
}

.menu-item.fill-height {
  .name-overlay {
    height: 100%;
  }

  .name {
    height: var(--menu-item-height);
  }

  .type {
    position: absolute;
    bottom: 0;
    top: auto;
    width: 100%;
    text-align: center;
    border-radius: 0;
  }
}

.menu-item.text-only {
  border: 1px solid #00bfff;
  border-radius: 5px;


  height: calc(var(--menu-item-height) / 1.5);
  min-height: calc(var(--menu-item-height) / 1.5);

  .name {
    height: calc(var(--menu-item-height) / 1.5);
    color: #000;
  }

  .type {
    position: absolute;
    bottom: 0;
    top: auto;
    width: 100%;
    text-align: center;
    border-radius: 0;
  }

  &:hover, &:focus, &:active {
    border-color: #dc3545;

    .name {
      color: #dc3545;
    }

    .type {
      background: #dc3545;
    }
  }
}
</style>
