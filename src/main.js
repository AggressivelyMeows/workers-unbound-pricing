import Vue from 'vue'
import App from './App.vue'
import router from './router'
import "@/assets/styles/main.scss";

import Oruga from '@oruga-ui/oruga'

Vue.use(Oruga,{
    iconPack: 'fas',
    button: {
        override: true,
        rootClass: 'button rounded-md',
        roundedClass: 'btn-rounded',
    },
    modal: {
        contentClass: 'card ~neutral !low p-4',
    },
    input: {
        inputClass: 'my-2 field'
    }
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
