<template>
<div v-if="isOpen">

    <div v-show="infoType === 'info'">
        <div class="flex flex-row justify-between px-3 py-2 rounded-md bg-info50">
            <div class="flex flex-row">
                <div class=" mr-2">
                    <AlertCircle class="h-5 w-5" color="#30718D"/>
                </div>
                <p class="font-normal text-neutral900 text-sm text-left pr-5 tracking-wide">
                    {{ infoText }}
                </p>
            </div>
            <div class="cursor-pointer" v-if="closable" @click="closePopup">
                <X class="h-5 w-5"/>
            </div>
        </div>
    </div>
    <div v-show="infoType === 'success'">
        <div class="flex flex-row justify-between px-3 py-2 rounded-md bg-success50">
            <div class="flex flex-row">
                <div class=" mr-2">
                    <AlertCircle class="h-5 w-5" color="#487A48"/>
                </div>
                <p class="font-normal text-neutral900 text-sm text-left pr-5 tracking-wide">
                    {{ infoText }}
                </p>
            </div>
            <div class="cursor-pointer" v-if="closable" @click="closePopup">
                <X class="h-5 w-5 justify-end"/>
            </div>
        </div>
    </div>
    <div v-show="infoType === 'alert'">
        <div class="flex flex-row justify-between px-3 py-2 rounded-md bg-alert50">
            <div class="flex flex-row">
                <div class=" mr-2">
                    <AlertCircle class="h-5 w-5" color="#80663C"/>
                </div>
                <p class="font-normal text-neutral900 text-sm text-left pr-5 tracking-wide">
                    {{ infoText }}
                </p>
            </div>
            <div class="cursor-pointer" v-if="closable" @click="closePopup">
                <X class="h-5 w-5 ml-auto justify-end"/>
            </div>
        </div>
    </div>

</div>

</template>

<script lang="ts">
import { X, AlertCircle } from 'lucide-vue-next'
import { defineComponent } from 'vue'

export default defineComponent({
    name: "InfoBox",
    components: {X, AlertCircle},
    props: {
        infoText: { type: String, required: true },
        infoType: { type: String, required: true },
        closable: { type: Boolean, required: true }
    },
    data ( ) {
        return {
            isOpen: true
        }
    },
    methods: {
        closePopup () { 
            return this.isOpen = false
        }

    }
})

</script>