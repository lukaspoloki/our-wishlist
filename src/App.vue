<template>
  <div class="h-max lg:h-screen flex justify-center">
    <div class="max-w-full w-full h-full lg:h-screen flex flex-col bg-white md:max-w-md md:shadow-2xl md:rounded-2xl">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { useSignalR, HubEventToken } from "@quangdao/vue-signalr";
import { store } from "./store/store";
import { INIT_DATA_ACTION, UPDATE_BUDGET_CONTRIBUTION_AMOUNT_ACTION } from "./store/actions";
import TopBar from "./components/TopBar.vue";
import { NewContribution } from "./models/NewContribution";
const UpdateEvent: HubEventToken<NewContribution> = "update";

export default defineComponent({
  name: "App",
  components: {
    TopBar,
  },

  mounted() {
    store.dispatch(INIT_DATA_ACTION, {});
    const signalr = useSignalR();
    signalr.on(UpdateEvent, (data: NewContribution) => {
      store.dispatch(UPDATE_BUDGET_CONTRIBUTION_AMOUNT_ACTION, data);
    });
  },
});
</script>

<style lang="scss">
#app {
  font-family: Archivo, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #272727;
}

//Hides default arrows in number input
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
