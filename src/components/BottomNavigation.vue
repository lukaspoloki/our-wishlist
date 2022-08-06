<template>
    <div class="bg-white text-center w-full z-10 sticky bottom-0">
        <div class="flex flex-row-reverse z-20">
            <div class="bg-gray-50 self-end sticky bottom-0 md:bottom-auto w-full shadow-inner py-6 flex flex-row">
                <a class="flex flex-1 justify-center text-xs font-bold text-center cursor-pointer" @click="redirectToHome()">
                    <Home :class="{ 'active' : isActive('/home')}"></Home>
                </a>
                <a class="flex flex-1 justify-center text-xs font-bold text-center cursor-pointer" @click="redirectToMyContributions()">
                    <FileText :class="{ 'active' : isActive('/myContributions') || isActive('/contribution')}"></FileText>
                </a>
                <a class="flex flex-1 justify-center text-xs font-bold text-center cursor-pointer" @click="redirectToProfile()">
                    <User :class="{ 'active' : isActive('/profile')}"></User>
                </a>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Home, FileText, User } from "lucide-vue-next"
export default defineComponent({
    name: 'BottomNavigation',
    components: {
        Home,
        FileText,
        User
    },
    data() {
        return {
            activeItem: 'home'
        }
    },
    methods: {
        redirectToHome() {
        this.$router.push({ path: "/home" });
        },
        redirectToProfile() {
        this.$router.push({ path: "/profile" });
        },
        redirectToMyContributions() {
        this.$router.push({ path: "/myContributions" });
        },
        isActive (page: string) {
            return page === this.$router.currentRoute.value.path
        }
    },
});
</script>

<style>
.active {
    fill:#B2C3C4;
}
</style>