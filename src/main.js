import Vue from "vue";
import Vuetify from "vuetify";
import App from "./App.vue";
import "./registerServiceWorker";
import "./plugins/vuetify";

Vue.config.productionTip = false;

Vue.use(Vuetify);

new Vue({
	render: h => h(App)
}).$mount("#app");