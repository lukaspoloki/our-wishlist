<template>
  <div class="flex flex-col text-left border-gray mt-3 mx-4 h-full border-b">
    <div :class="`text-black font-bold text-2xl `">{{ amount }}</div>
    <div class="text-xs text-neutral700">{{ date }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ContributionTile",
  props: {
    date: { type: String, required: true },
    amount: { type: String, required: true },
  },
});
</script>

<style scoped lang="scss">
.budget {
  color: #bd8167;
}
</style>
