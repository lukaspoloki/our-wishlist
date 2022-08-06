<template>
    <a @click="showChangeContributorPopup()" class="border border-primary50 rounded-3xl flex flex-row justify-between cursor-pointer content-center py-2 px-4">
        <div class="flex flex-row">
          <div v-if="currentContributionTypeIcon() == 'Individual'"><User color='#43867F' class='h-5 w-5' /></div>
          <div v-if="currentContributionTypeIcon() == 'Couple'"><Users color='#43867F' class='h-5 w-5' /></div>
          <div v-if="currentContributionTypeIcon() == 'Company'"><Building2 color='#43867F' class='h-5 w-5' /></div>
          <div class="ml-3 font-bold text-sm tracking-wide">{{ currentContributorName() }}</div>
        </div>
        <div>
          <ChevronDown class="text-darkgreen100" v-if="isChevron"/>
        </div>
    </a>
</template>

<script lang="ts">
import { User, Users, Building2, ChevronDown } from "lucide-vue-next"
import { SHOW_CHANGE_CONTRIBUTOR_POPUP_ACTION } from "../store/actions";
import { store } from "../store/store";
export default {
    name: "ContributorSwitcher",
    components: {
        User, Users, Building2, ChevronDown
    },
  props: {
    isChevron: { type: Boolean, required: true }
  },
  methods: {
    showChangeContributorPopup() {
      store.dispatch(SHOW_CHANGE_CONTRIBUTOR_POPUP_ACTION);
    },
    currentContributorName() {
      let currentContributionType = store.getters.currentContributionType;
      if (currentContributionType === "Individual") {
        return "Meg selv"
      }
      if (currentContributionType === "Company") {
        const currentContributor = store.state.contributors.find(contributor => contributor.contributorId.toString() === store.state.currentContributorId)
        return currentContributor?.companyName;
      }
      else return "Ektepar"
    },
    currentContributionTypeIcon() {
        return store.getters.currentContributionType;
    }
  },
}
</script>