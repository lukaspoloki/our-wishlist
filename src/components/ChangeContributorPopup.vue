<template>
  <transition
    enter-active-class="ease-out duration-300"
    enter-from-class="opacity-0 translate-y-0 sm:translate-y-0 sm:scale-100"
    enter-to-class="opacity-100 translate-y-0 sm:scale-100"
    leave-active-class="ease-in duration-200"
    leave-class="opacity-100 translate-y-0 sm:scale-100"
    leave-to-class="opacity-0 translate-y-0 sm:translate-y-0 sm:scale-100"
  >
  <div
  v-show="isChangeContributorPopupVisible"
  class="fixed h-full w-full md:max-w-md bottom-0 flex items-end justify-center bg-black bg-opacity-60 z-10"
  >

    <div class="rounded-lg mb-2 flex px-1 py-2 mx-4 flex-col w-full">
      <div class="border-b rounded-lg mb-2 bg-white">
          <button
            :disabled="!isIndividualLoginPossible"
            class="cursor-pointer hover:rounded-t-lg hover:bg-primary50 text-black text-sm w-full font-bold disabled:opacity-20 border-b border-gray flex flex-row items-center py-3"
            @click="selectContributorTypeLogin(`Individual`)"
          >
            <User color="#43867F" class="ml-5" /> <p class="pl-3">Meg selv</p> 
          </button>

          <button
            :disabled="!isCoupleLoginPossible"
            v-show="hasSpouse"
            class="cursor-pointer hover:bg-primary50 text-black text-sm w-full font-bold disabled:opacity-20 border-b border-gray flex flex-row items-center py-3"
            @click="showCoupleLoginPopup()"
          >
            <Users color="#43867F" class="ml-5" /> <p class="pl-3">Ektepar</p>
          </button>

          <div class="flex flex-col" v-for="contributor in contibutors" :key="contributor.contributorId.toString()">
            <button
              v-if="contributor.contributorType === `Company`"
              class="cursor-pointer hover:bg-primary50 text-black text-sm w-full font-bold disabled:opacity-20 border-b border-gray flex flex-row items-center py-3"
              @click="selectContributorTypeLogin(`Company`, contributor.contributorId.toString())"
            >
              <Building2 color="#43867F" class="ml-5" /> <p class="pl-3">{{ contributor.companyName }}</p>
            </button>
          </div>

        <button
          class="hover:bg-primary50 hover:rounded-b-lg text-black text-sm w-full font-bold disabled:opacity-20 flex flex-row items-center py-3"
          @click="showCompanyLoginPopup()"
        >
          <Plus color="#43867F" class="ml-5" /> <p class="pl-3">Legg til selskap</p>
        </button>
        
      </div>

        <button
              class="bg-white text-black cursor-pointer font-bold text-sm py-4 rounded-lg w-full"
              @click="closePopup()"
            >
              Cancel
        </button>
    </div>
    <SpouseLoginPopup />
    <CompanyLoginPopup />
  </div>
  </transition>
</template>

<script lang="ts">
import { HIDE_CHANGE_CONTRIBUTOR_POPUP_ACTION, SHOW_COMPANY_LOGIN_POPUP_ACTION, SHOW_SPOUSE_LOGIN_POPUP_ACTION, UPDATE_CONTRIBUTOR_FLOW_TYPE_ACTION, UPDATE_CURRENT_CONTRIBUTOR_ID_ACTION } from "../store/actions";
import { store } from "../store/store";
import { defineComponent } from "vue";
import { Contributor } from "../models/Contributor";
import CompanyLoginPopup from "./CompanyLoginPopup.vue"
import SpouseLoginPopup from "./SpouseLoginPopup.vue";
import { User, Users, Building2, Plus } from "lucide-vue-next"

export default defineComponent({
  name: "ChangeContributorPopup",
  components: { User, Users, Building2, Plus, SpouseLoginPopup, CompanyLoginPopup },

  methods: {
    closePopup() {
      store.dispatch(HIDE_CHANGE_CONTRIBUTOR_POPUP_ACTION);
    },
    async selectContributorTypeLogin(contributorType: string, contributorId?: string) {
      if (contributorType === "Company") {
        store.dispatch(UPDATE_CURRENT_CONTRIBUTOR_ID_ACTION, contributorId);
        this.$router.push({ path: "/myContributions" });
        store.dispatch(HIDE_CHANGE_CONTRIBUTOR_POPUP_ACTION);
        return;
      }

      let isContributorInSystem = false;
      const contributors: Contributor[] = store.state.contributors;
      contributors.forEach(element => {
        if (element.contributorType === contributorType) {
          store.dispatch(UPDATE_CURRENT_CONTRIBUTOR_ID_ACTION, element.contributorId);
          store.dispatch(UPDATE_CONTRIBUTOR_FLOW_TYPE_ACTION, contributorType);
          this.$router.push({ path: "/myContributions" });
          isContributorInSystem = true;
          store.dispatch(HIDE_CHANGE_CONTRIBUTOR_POPUP_ACTION);
        }
      });

      if (isContributorInSystem === false) {
        store.dispatch(UPDATE_CONTRIBUTOR_FLOW_TYPE_ACTION, "Individual");
        store.dispatch(UPDATE_CURRENT_CONTRIBUTOR_ID_ACTION, "");

        this.$router.push({ path: "/contribution" });
      }
    },

    showCoupleLoginPopup() {
      store.dispatch(SHOW_SPOUSE_LOGIN_POPUP_ACTION);
      
    },

    async showCompanyLoginPopup() {
      store.dispatch(SHOW_COMPANY_LOGIN_POPUP_ACTION);
    },
  },
  computed: {
    isChangeContributorPopupVisible(): boolean {
      return store.state.isChangeContributorPopupVisible;
    },
    isIndividualLoginPossible(): boolean {
      return store.state.isIndividualLoginPossible;
    },
    isCoupleLoginPossible(): boolean {
      return store.state.isCoupleLoginPossible;
    },
    hasSpouse(): boolean {
      return store.state.hasSpouse;
    },
    getContributors(): Contributor[] {
      return store.state.contributors;
    },
  },

  watch: {
    getContributors(newValue) {
      this.contibutors = newValue;
    },
  },
  data() {
    return { contibutors: {} as Contributor[] };
  },
  beforeMount() {
    store.state.isChangeContributorPopupVisible = false
  },
  mounted() {
    this.contibutors = this.getContributors;
  },
});
</script>
