<template>
  <q-dialog v-model="keyboardShown" seamless no-focus no-refocus :position="keyboardPosition" full-width>
    <NumberPad :class="number_pad_class" v-if="isNumeric" :float-type="floatType" :accept-btn="actionBtn"/>
    <QwertyPad v-else @close="close" :accept-btn="actionBtn"/>
  </q-dialog>
</template>

<script>
import NumberPad from "./NumberPad";
import QwertyPad from "./QwertyPad";

export default {
  name: "Keyboard",
  components: {QwertyPad, NumberPad},
  data () {
    return {
      keyboardShown: false,
      isNumeric: false,

      hideRegister: false,

      keyboardPosition: 'bottom',
      keyboardAlignment: 'center',

      floatType: '',
      actionBtn: undefined,
      isInitialized: false
    };
  },

  computed: {
    number_pad_class() {
      return {
        'numeric-pad': true,
        'left': this.keyboardAlignment === 'left',
        'right': this.keyboardAlignment === 'right'
      }
    },

    settings() {
      return this.$store.state.app.settings;
    }
  },

  watch: {
    settings() {
      this.initKeyboard();
    }
  },

  methods: {
    close() {
      this.keyboardShown = false;
    },

    onFocus() {
      let el = document.activeElement;

      if (!((el instanceof HTMLInputElement && (/text|password|search|tel|url|number/).test(el.type)) || el.tagName === 'TEXTAREA') || el.readOnly || el.disabled) {
        this.closeKeyboard();
        return;
      }

      // if (el.readOnly || el.disabled) {
      //     this.closeKeyboard();
      //     return;
      // }

      let attr = el.getAttribute('pos-keyboard');
      if (attr === 'false' || !el.hasAttribute('pos-keyboard')) {
        this.closeKeyboard();
        return;
      }

      this.hideRegister = false;

      let kb_config = {
        accept_btn: undefined
      };

      let is_numeric = false;
      let kb_position = '';

      try {
        kb_config = JSON.parse(attr);
      } catch (e) {

      }

      if (!kb_config) kb_config = {};

      if (!kb_config.type) {
        is_numeric = el.type === 'number';
      }
      else {
        is_numeric = kb_config.type !== 'text';
      }

      if (is_numeric) {
        if (!kb_config.position) {
          kb_config.position = 'bottom_right';
        }

        let pos = kb_config.position.split('_');
        kb_position = pos[0];
        this.keyboardAlignment = pos[1] ? pos[1] : '';
        this.floatType = kb_config.type === 'float';
      }
      else {
        kb_position = kb_config.position ? kb_config.position : 'bottom'
      }

      this.keyboardPosition = kb_position;
      this.actionBtn = kb_config.accept_btn;
      this.isNumeric = is_numeric;
      this.keyboardShown = true;
    },

    onBlur() {
      if (this.keyboardShown) {
        this.hideRegister = true;

        setTimeout(() => {
          if (this.hideRegister) {
            this.closeKeyboard()
          }
        }, 150)
      }
    },

    closeKeyboard() {
      this.keyboardShown = false;
    },

    initKeyboard() {
      if (this.settings.misc.virtualKeyboard && !this.isInitialized) {
        window.addEventListener('focus', this.onFocus, true);
        window.addEventListener('blur', this.onBlur, true);
        this.isInitialized = true;
      }
      else if (this.isInitialized) {
        this.removeListeners();
      }
    },

    removeListeners() {
      window.removeEventListener('focus', this.onFocus);
      window.removeEventListener('blur', this.onBlur)
    }
  },

  mounted() {
    this.initKeyboard();
  },

  beforeDestroy() {
    this.removeListeners();
  }
}
</script>

<style lang="scss" scoped>
.numeric-pad {
  width: 430px !important;
  height: 208px;
  padding: 3px;
  background: #fff;
  margin-bottom: 35px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

  &.left {
    margin-right: auto;
  }

  &.right {
    margin-left: auto;
  }
}
</style>
