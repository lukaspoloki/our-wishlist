import { Store } from "vuex";
import { State } from "./store/store";
import { Auth0Context } from "./auth/auth0Context";
import { VueGtag } from "vue-gtag";
declare module "@vue/runtime-core" {
  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>;
    $auth: Auth0Context;
    $gtag: VueGtag;
  }
}
