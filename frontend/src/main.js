import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import router from './routes/index.js'
import { useAuth } from './auth/userAuth'

import '@mdi/font/css/materialdesignicons.css' // ✅ icon
import 'vuetify/styles' // ✅ Vuetify styles


useAuth().verify()
loadFonts()

const app = createApp(App)

app.use(router)
app.use(vuetify)
app.mount('#app')
