import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import Vue2Editor from "vue2-editor";
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.css';
import SimpleVueValidation from 'simple-vue-validator';

Vue.use(SimpleVueValidation);
Vue.use(Vue2Editor);

Vue.config.productionTip = false;
Vue.prototype.$toast = iziToast;

new Vue({
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
