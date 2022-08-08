import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { store, key } from './store'
import { createI18n } from 'vue-i18n'
import messages from './i18n/en/en-US.json'

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: messages
  }
})

createApp(App)
  .use(store, key)
  .use(vuetify)
  .use(i18n)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
