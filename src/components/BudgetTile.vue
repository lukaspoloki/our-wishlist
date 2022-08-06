<template>
  <div class="flex flex-col text-left p-4 m-2 mt-4 w-40">
    <div class="smaller font-bold">{{ title }}</div>
    <div :class="`letter-spacing text-darkgreen100 font-bold text-xl ` + type">{{ value }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "BudgetTile",
  props: {
    title: { type: String, required: true },
    value: { type: String, required: true },
    type: { type: String, required: true },
  },
});
</script>

<style scoped lang="scss">
.budget {
  color: #bd8167;
}

.smaller {
  font-size: 10px;
}

.letter-spacing {
  letter-spacing:0.0015em
}
</style>
