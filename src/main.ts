import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router";
import { store, key } from "./store/store";
import "./index.css";
import { auth0AppState, setupAuth } from "./auth/auth";
import authConfig from "./auth/authConfig.json";
import config from "./config.json";
import { VueSignalR } from "@quangdao/vue-signalr";
import VueGtag from "vue-gtag";

export const app = createApp(App)
  .use(router)
  .use(VueSignalR, {
    url: `${config.apiBasePath}/hub`,
    automaticReconnect: true,
  });

if (config.gtag !== "") {
  app.use(
    VueGtag,
    {
      config: { id: config.gtag, appName: "Bugdet App Client" },
    },
    router
  );
}

setupAuth(authConfig, callbackRedirect).then(auth => {
  app.use(auth);
  app.use(store, key).mount("#app");
});

export function callbackRedirect(appState: auth0AppState): void {
  router.push(appState && appState.targetUrl ? appState.targetUrl : "/");
}
