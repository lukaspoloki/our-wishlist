<template>
<div class="overflow-scroll h-full" v-show="loading">
    <div className="flex w-full flex-1 flex-col items-center px-2">
        <div className="w-full flex-row items-center justify-center space-x-1 rounded-lg border border-gray p-6">
            <div className="flex flex-col space-y-2 animate-pulse">
                <div className="h-10 w-full rounded-md bg-darkgreen200 opacity-30 mb-4"></div>
                <div className="h-40 w-full rounded-md bg-darkgreen200 opacity-30"></div>
                <div class="flex flex-row justify-items-start items-center pt-8 pb-4">
                    <div className="h-8 w-1/2 rounded-md bg-darkgreen200 opacity-30"></div>
                    <div className="h-8 w-1/2 ml-2 rounded-md bg-darkgreen200 opacity-30"></div>
                </div>
                <div className="h-4 w-full rounded-md bg-darkgreen200 opacity-30"></div>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ChartSkeleton",
  data() {
    return { 
        loading: true
    }
  },
  methods: {
    setLoadingState(value: boolean) {
        this.loading = value
    }
  }
});
</script>

<style scoped lang="scss"></style>
