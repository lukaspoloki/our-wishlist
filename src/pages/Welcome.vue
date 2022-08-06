<template>
  <div class="flex flex-col min-h-screen lg:min-h-screen z-10 md:rounded-2xl">
    <div class="flex flex-col">
      <div class="overflow-hidden h-screen flex flex-col green-gradient lg:h-screen md:rounded-2xl lg:min-h-screen">
        <div
          class="flex flex-col grow text-4xl text-white leading-snug w-full justify-center items-center font-bold"
        >
         <img alt="BCC logo icon" class="w-20 h-20 mb-5" src="/favicon_white.svg" />
          <p class="fade-in">BCC Budget</p> 
        </div>
        <div>
        <a
          class="bg-darkgreen100 fade-in flex-auto text-white text-center font-bold text-base h-12 rounded-lg block leading-12 cursor-pointer mr-4 ml-4 mb-36"
          @click="startRedirect()"
          > 
          <div v-if="loading" class="fade-in">
            <Spinner></Spinner>
          </div>
          <div v-else> Login </div>
        </a>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Spinner from '@/components/Spinner.vue'

export default defineComponent({
  name: "Welcome",
  data() {
    return {
      loading: false,
    }
  },
  components: {
    Spinner
  },
  methods: {
    startRedirect() {
      this.loading = true;
      this.redirectToHome();
    },
    redirectToHome() {
      this.$router.push({ path: "/home" });
      this.loading = false;
    },
  },
});
</script>

<style>
.fade-in
{
    -webkit-animation: fadeInFromNone 1s ease-out;
    -moz-animation: fadeInFromNone 1s ease-out;
    -o-animation: fadeInFromNone 1s ease-out;
    animation: fadeInFromNone 1s ease-out;
}

@-webkit-keyframes fadeInFromNone {
    0% {
        opacity: 0;
    }

    1% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

@-moz-keyframes fadeInFromNone {
    0% {
        opacity: 0;
    }

    1% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

@-o-keyframes fadeInFromNone {
    0% {
        opacity: 0;
    }

    1% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

@keyframes fadeInFromNone {
    0% {
        opacity: 0;
    }

    1% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

</style>
