<template>
  
<div
      v-show="isConfirmationPopupVisible"
      class="popup fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center z-20 md:mt-6 overflow-auto"
    >
      <div class="flex  flex-col justify-between text-left h-screen bg-white relative md:shadow-2xl md:rounded-2xl md:max-w-md">
        <div class="bg-white overflow-auto">
          <TopBar  :routeTo="`myContributions`" class="md:rounded-t-xl" :currentName="`Ny gave`"></TopBar>
          <div class="flex flex-row">
            <div class="flex text-center font-bold text-xs flex-col ml-4 mr-2 w-1/3 text-neutral900 cursor-pointer" @click="closePopups()">
              Totalbeløpet
              <div class="border-b-4 pt-2 h-2 border-darkgreen100 rounded-sm"></div>
            </div>
            <div class="flex text-center font-bold text-xs flex-col ml-2 mr-2 w-1/3 text-neutral900 cursor-pointer" @click="closePopup()">
              Betalings plan
              <div class="border-b-4 pt-2 h-2 border-darkgreen100 rounded-sm"></div>
            </div>
            <div class="flex text-center font-bold text-xs flex-col ml-2 mr-4 w-1/3 text-darkgreen100">
              Oppsummering
              <div class="border-b-4 pt-2 h-2 rounded-sm"></div>
            </div>
          </div>
          <div class="px-4 bg-white">
            <div class="font-bold text-xl text-left pt-6 tracking-wide">Oppsumering</div>
            <div class="font-bold text-4xl text-left py-2 pt-4">{{ formatAmount(getContributionAmount) }}</div>
            <div v-if="getBillingMethod()=='monthly'" class="text-xs text-neutral750 tracking-wide">Totaltbeløpet - 1/12 month payment</div>
            <div v-else class="text-xs text-neutral750 tracking-wide">Totaltbeløpet - month payment</div>

            <div v-if="getBillingMethod()=='monthly'">
              <div class="text-sm text-black tracking-wider mt-6 pr-20">Beløpet skal betales ved innbetaling av minimum 1/12-del hver måned i 2022.  </div>
              <div class="">
                <div class="flex cursor-pointer flex-row items-center py-4 text-darkgreen100 font-bold text-sm tracking-wide" @click="paymentPlanDropdown()"> <p class="mr-1">Payment plan</p> <ChevronDown :class="{'transform rotate-180': isPaymentPlanDropdownVisible}"/> </div>
                <div v-if="isPaymentPlanDropdownVisible">
                  <div class="flex flex-col w-full bg-white">
                    <div v-for="month in budgetMonths">
                      <div class="py-4 flex flex-row justify-between border-b border-neutral400">
                        <div class="text-base tracking-wider">{{month.monthName+', '+month.year}}</div>
                        <div class="font-bold">{{divideAmountByMonths(budgetMonths.length)}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            <div class="w-full border-t border-neutral400"></div>
            </div>

            <div class="font-bold tracking-wide text-xl mt-5">Bekreftelse</div>

            <div class="mt-2 pb-2">
              <p class="whitespace-pre-line tracking-wide text-primary800">{{ getConfirmationPopupText }}</p>
            </div>

          <div class="flex items-center w-full pb-6 cursor-pointer container" @click="confirmationCheckbox = !confirmationCheckbox" >
            <label for="">
                <input type="checkbox" class="mr-2 w-5 h-5" checked v-model="confirmationCheckbox" />
                <span class="checkmark"></span>
              <div class="pl-8 tracking-wide mt-7" >
                Jeg har lest og bekrefter
                <a class="underline text-darkgreen100" :href="pdfUrl" target="_blank" rel="noreferrer noopener"> gavebrevets vilkår. </a>
              </div>
            </label>
          </div>

          <div v-if="isCoupleFlowType" class="mt-12">
              <InfoBox infoText="Your spouse still has to confirm and sign this gavebrev, he/she will be notified and will find a form to sign in their Budget app under “Mine bidrag“" :infoType="'info'" :closable="true"/>
          </div>

          <div v-if="errorText != ``" class="flex flex-start t-4 pb-4 font-bold">
            <AlertCircle class="w-6 h-6 mr-2"> </AlertCircle>
            <div class="pt-0">{{ errorText }}</div>
          </div>
          </div>
        </div>

            <div class="bg-white">
              <div class="flex my-2 p-4 pb-6 align-bottom justify-items-end content-end justify-end end">
                <button 
                  @click="closePopup()" 
                  class="flex flex-row items-center cursor-pointer justify-center bg-isbre200 mr-3 w-1/2 text-base text-darkgreen300 font-bold py-3 rounded-lg disabled:opacity-20"
                >
                  <ArrowLeft /> <p class="pl-3">Tilbake</p> 
                </button>
                <button
                  class=" bg-darkgreen100 ml-3 w-1/2 text-base text-white font-bold py-3 rounded-lg disabled:opacity-20"
                  @click="addContribution()"
                  :disabled="!confirmationCheckbox"
                >
                  <p class="">Bekreft og signer</p>
                </button>
              </div>
            <BottomNavigation />
            </div>
        <SuccessfullContributionPopup />
      </div>
    </div>
</template>

<script lang="ts">
import {
  HIDE_CONFIRMATION_POPUP_ACTION,
  SET_CONTRIBUTION_AMOUNT_ACTION,
  UPDATE_USER_CONTRIBUTIONS_LIST_ACTION,
  UPDATE_CURRENT_CONTRIBUTOR_ID_ACTION,
  UPDATE_CONTRIBUTORS_ACTION,
  HIDE_PAYMENT_PLAN_POPUP_ACTION,
  SET_SAVED_SUCCESSFULLY_ACTION,
  SHOW_SUCCESSFULL_PAGE_ACTION,
} from "../store/actions";
import { store } from "../store/store";
import { addUserContribution, createContributor } from "../api/api";
import TopBar from "../components/TopBar.vue"
import { defineComponent } from "vue";
import { app } from "@/main";
import { ArrowRight, ArrowLeft, X, AlertCircle, ChevronDown } from "lucide-vue-next";
import BottomNavigation from "../components/BottomNavigation.vue"
import { displayAmount } from "../core/utilities";
import InfoBox from "../components/InfoBox.vue"
import SuccessfullContributionPopup from "./SuccessfullContributionPopup.vue";
export default defineComponent({
  name: "ConfirmationPopup",
  components: { TopBar, BottomNavigation, ArrowRight, ArrowLeft, X, AlertCircle, ChevronDown, InfoBox, SuccessfullContributionPopup },

  data() {
    return {
      isPaymentPlanDropdownVisible: false,
      confirmationCheckbox: false,
      pdfUrl:
        store.state.budget.customSettings?.confirmationPdfUrl ??
        "https://storage.googleapis.com/budget-app-files/Vilkaar_for_gavebrev_gitt_gjennom_Budget_App_v2.pdf",
      errorText: "",
      budgetMonths: [
        {monthName: 'September', year: '2022'},
        {monthName: 'Oktober', year: '2022'},
        {monthName: 'December', year: '2022'},
        {monthName: 'Januar', year: '2023'},
        {monthName: 'Februar', year: '2023'},
        {monthName: 'Mars', year: '2023'},
        {monthName: 'April', year: '2023'},
        {monthName: 'Juni', year: '2023'},
        {monthName: 'Juli', year: '2023'},
        {monthName: 'August', year: '2023'},
        {monthName: 'September', year: '2023'},
        {monthName: 'Oktober', year: '2023'},
      ],
    };
  },

  methods: {
    openPdf() {
      this.$router.push({ path: "/myContributions" });
    },
    closePopup() {
      store.dispatch(HIDE_CONFIRMATION_POPUP_ACTION);
    },
    closePopups() {
      store.dispatch(HIDE_CONFIRMATION_POPUP_ACTION);
      store.dispatch(HIDE_PAYMENT_PLAN_POPUP_ACTION);
    },
    getBillingMethod() {
      return store.state.billingMethod;
    },
    paymentPlanDropdown() {
      this.isPaymentPlanDropdownVisible = !this.isPaymentPlanDropdownVisible;
    },
    formatAmount(number: string | number) {
      return displayAmount(Number(number));
    },
    divideAmountByMonths(countMonths: number) {
      return this.formatAmount(this.getContributionAmount/countMonths); 
    },
    async addContribution() {
      let result = false;
      const currentFlowType = store.state.flowType;
      const billingMonth = store.state.billingMonth;
      const billingMethod = store.state.billingMethod;

      try {
        const currentContributorId = store.state.currentContributorId;
        if (currentContributorId === "") {
          let newContributorId = "";
          newContributorId = await createContributor(currentFlowType);
          store.dispatch(UPDATE_CURRENT_CONTRIBUTOR_ID_ACTION, newContributorId);
        }

        result = await addUserContribution(billingMethod == "monthly" ? billingMonth : "");
      
        if (!result) {
          //Try to create newContributorId
          const newContributorId = await createContributor(currentFlowType);
          store.dispatch(UPDATE_CURRENT_CONTRIBUTOR_ID_ACTION, newContributorId);
          result = await addUserContribution(billingMethod == "monthly" ? billingMonth : "");
        }
      } catch (e) {
        this.errorText = "Det oppsto en feil. Prøv igjen senere.";
        if (app.config.globalProperties.$gtag) {
          app.config.globalProperties.$gtag.exception({
            description: `Add new contribution error for contributorId: ${store.state.currentContributorId}`,
            fatal: true,
          });
        }
        console.error(e);
      }

      if (result) {
        store.dispatch(UPDATE_USER_CONTRIBUTIONS_LIST_ACTION);
        store.dispatch(SHOW_SUCCESSFULL_PAGE_ACTION);
        store.dispatch(HIDE_CONFIRMATION_POPUP_ACTION);
        store.dispatch(HIDE_PAYMENT_PLAN_POPUP_ACTION);
        store.dispatch(SET_CONTRIBUTION_AMOUNT_ACTION, 0);
        store.dispatch(SET_SAVED_SUCCESSFULLY_ACTION, true);
        store.dispatch(UPDATE_CONTRIBUTORS_ACTION);

        this.$router.push({ path: "/myContributions" });
      }
    },
  },
  computed: {
    isConfirmationPopupVisible(): boolean {
      return store.state.isConfirmationPopupVisible;
    },
    getContributionAmount(): number {
      return store.state.contributionAmount;
    },
    getConfirmationPopupText(): string {
      const result = store.getters.getFlowTextData("confirmationPopupText") as string;
      if (result) return result.replace("{{getContributionAmount}}", this.getContributionAmount.toString());
      return "";
    },
    isCoupleFlowType(): boolean {
      const currentContributor = store.state.contributors.find(contributor => contributor.contributorId.toString() === store.state.currentContributorId)
      return currentContributor?.contributorType == 'Couple';
    },
  },
});
</script>

<style>
.container {
  all: unset;
}
.checkmark { 
  all: unset;
}
/* Customize the label (the container) */
.container {
  display: block;
  position: relative;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default checkbox */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 1px;
  left: 1px;
  height: 17px;
  width: 17px;
  /* Neutral/White */
  background: #FFFFFF;
  /* Neutral/400 */
  border: 2px solid #DFE1E6;
  border-radius: 4px;
}


/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
  content: url('../assets/checkboxChecked.svg');
  top: -2px;
  left: -1px;
}

</style>