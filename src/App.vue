<template>
  <div id="q-app">
    <router-view />
    <Keyboard/>
  </div>
</template>
<script>
import Keyboard from "./components/Keyboard/Keyboard";

export default {
  name: 'App',
  components: {Keyboard}
}
</script>
