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
      v-show="isCalcPopupVisible"
      class="popup fixed top-0 left-0 right-0 bottom-0 flex items-end justify-center bg-black bg-opacity-60 z-10"
    >
      <div class="popup__inner flex flex-col text-left bg-white p-4 rounded-lg md:max-w-md">
        <div class="flex flex-row items-center justify-between w-full mb-2 mt-2">
          <div class="text-2xl font-bold">Kalkulator</div>
          <div class="rounded-full bg-isbre200 p-1 cursor-pointer" @click="closePopup()">
            <X size="18"/>
          </div>
        </div>
        
        <InfoBox info-text="Bruttoinntekt er lønn, pensjon, arbeidsinntekt, kapitalinntekter (herunder utbytter og inntekter fra fast eiendom), virksomhetsinntekter og annen skattepliktig inntekt." :info-type="'info'" :closable="false"/>
          

        <div class="py-2 pt-6">
          <div class="font-bold text-sm pb-1 tracking-wide">Bruttoinntekt</div>
          <InputCurrency
            :value="income"
            @focus="income = 0"
            @update:value="income = $event"
            :currency="currentCurrency"
            @click="($event.target as HTMLInputElement).select()"
          ></InputCurrency>
        </div>
        <div class="py-2">
          <div class="font-bold text-sm pb-1 tracking-wide">Foreslått prosentsats</div>
          <div class="py-2 items-center border text-primary800 border-neutral400 bg-neutral200 w-1/4 rounded-lg">
            <div class="flex flex-row items-center text-left w-full h-full bg-neutral200">
              <input
              class="bg-neutral200 w-1/2 pl-3"
              placeholder="0"
              type="string"
              inputmode="decimal"
              pattern="\d*"
              min="0"
              max="100"
              step="0.01"
              readonly
              v-model="getPercentageProposalValue"
              appearance-none
            />
            <p class="text-left -ml-3">%</p>
            </div>
          </div>
        </div>
        <div class="py-2 pb-6">
          <div class="font-bold text-sm pb-1 tracking-wide">Beregnet forslag til gavebidrag for 2022:</div>
          <div class="flex border border-neutral400 rounded-lg w-full">
            <input
              class="rounded-lg py-2 w-full px-4 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="0"
              type="number"
              inputmode="decimal"
              pattern="\d*"
              v-model="calculatePercentageValue"
              readonly
              appearance-none
            />
          </div>
        </div>

        <div class="mt-auto">
          <div class="flex my-2">
            <button
              class="bg-darkgreen100 cursor-pointer w-full text-base text-white font-bold hover:text-white py-3 px-4 rounded disabled:opacity-20"
              :disabled="contribution === 0"
              @click="copyContributionAmount()"
            >
              Kopier
            </button>
          </div>
        </div>
      </div>
      <div class="hidden">
        {{ getUserChurchIdValue }}
        {{ getPercentageProposalValue }}
        <input
          class="rounded w-full px-4 leading-tight focus:outline-none focus:shadow-outline disabled:opacity-40"
          disabled
          placeholder="0"
          type="number"
          inputmode="decimal"
          pattern="\d*"
          min="0"
          max="100"
          step="0.01"
          readonly
          v-model="testPercent"
          appearance-none
        />
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { HIDE_CALC_POPUP_ACTION, SET_CONTRIBUTION_AMOUNT_ACTION } from "../store/actions";
import { store } from "../store/store";
import InputCurrency from "./InputCurrency.vue";
import { defineComponent } from "@vue/runtime-core";
import { X, AlertCircle } from 'lucide-vue-next';
import InfoBox from "../components/InfoBox.vue"

export default defineComponent({
  name: "CalcPopup",
  components: { InputCurrency, X, AlertCircle, InfoBox },

  data() {
    return {
      income: 0,
      percent: 9,
      contribution: 0,
      testPercent: 0,
      currentCurrency: store.state.currentTenant.customSettings?.currency ?? " kr ",
    };
  },

  methods: {
    closePopup() {
      store.dispatch(HIDE_CALC_POPUP_ACTION);
    },

    increasePercent() {
      this.percent++;

      if (this.percent > 100) {
        this.percent = 100;
      }
    },

    decreasePercent() {
      this.percent--;
      if (this.percent < 0) {
        this.percent = 0;
      }
    },

    copyContributionAmount() {
      store.dispatch(SET_CONTRIBUTION_AMOUNT_ACTION, this.contribution);
      store.dispatch(HIDE_CALC_POPUP_ACTION);
    },

    getPercentageProposalValueString() {
      return this.getPercentageProposalValue + '%';
    }
  },
  computed: {
    calculatePercentageValue(): number {
      return (this.income * this.percent) / 100;
    },

    getPercentageProposalValue(): number {
      let result = 9;
      const storeValue = store.state.budget.customSettings?.percentageProposal;
      if (storeValue == undefined || storeValue == null || storeValue == 0) {
        result = 9;
      } else {
        result = storeValue;
      }
      return result;
    },

    getUserChurchIdValue() {
      return store.state.churchId;
    },

    isCalcPopupVisible(): boolean {
      return store.state.isCalcPopupVisible;
    },
  },
  watch: {
    getPercentageProposalValue(newValue) {
      this.testPercent = newValue;
      if (newValue != 0) {
        this.percent = newValue;
      }
    },

    calculatePercentageValue(newValue) {
      this.contribution = newValue;
    },
  },
  mounted() {
    this.percent = this.getPercentageProposalValue;
  },
});
</script>

<style>
</style>