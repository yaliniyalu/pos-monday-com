import Vue from 'vue'

import PerfectScrollbar from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'

Vue.use(PerfectScrollbar);

import 'flex-layout-attribute'

import '../directives/select-on-focus';


import FontAwesomeIcon from './../font-awesome'
Vue.component('font-awesome-icon', FontAwesomeIcon);
