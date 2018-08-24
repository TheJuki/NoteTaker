import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import VueClipboard from 'vue-clipboard2'
import VueShortKey from 'vue-shortkey'
import { createI18n } from './i18n'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import './site.css'

Vue.use(VueClipboard)
Vue.use(VueShortKey)

Vue.config.productionTip = false

const i18n = createI18n()

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
