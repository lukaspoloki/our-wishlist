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
      v-show="isCompanyLoginPopupVisible"
      class="popup fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-60 z-10 p-4"
    >
      <div class="popup__inner flex flex-col text-left bg-white p-4 rounded-lg relative md:max-w-md">
        <div class="pt-4 pb-4 font-bold">Legg til selskap</div>

        <label>Navn på selskap:</label>
        <div class="flex border h-10 mb-4 border-primary rounded w-full">
          <input
            class="rounded w-full px-4 leading-tight border-none focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Selskap navn"
            v-model="companyName"
          />
        </div>

        <label>Organisasjonsnummer:</label>
        <div class="flex border h-10 mb-4 border-primary rounded w-full">
          <input
            class="rounded w-full px-4 leading-tight border-none focus:outline-none focus:shadow-outline"
            type="number"
            inputmode="decimal"
            pattern="\d*"
            placeholder="12345678"
            v-model="companyNumber"
          />
        </div>
        <div class="flex w-full pb-6">
          <input type="checkbox" class="form-checkbox mr-2 w-10 h-10 fill-current" v-model="confirmationCheckbox" />

          <div class="flex pt-2 cursor-pointer" @click="confirmationCheckbox = !confirmationCheckbox">
            Jeg bekrefter at jeg har fullmakt til å signere på vegne av selskapet og at selskapet følger aksjelovens
            regler for gave.
          </div>
        </div>

        <div v-if="errorText != ``" class="flex flex-start t-4 pb-4 font-bold">
          <AlertCircle class="w-10 h-10 mr-2"> </AlertCircle>
          <div class="pt-2">{{ errorText }}</div>
        </div>

        <div class="mt-auto">
          <div class="flex my-2">
            <button
              class="bg-transparent hover:bg-primary cursor-pointer text-primary font-semibold hover:text-white py-2 px-4 mr-2 border border-primary hover:border-transparent rounded w-40"
              @click="closePopup()"
            >
              Lukk
            </button>
            <button
              class="bg-primary hover:bg-primary700 w-full cursor-pointer text-white font-semibold hover:text-white py-2 px-4 rounded disabled:opacity-20"
              :disabled="confirmationCheckbox === false"
              @click="createCompanyContributor()"
            >
              Signer
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { addCompany, createContributor } from "../api/api";
import { HIDE_COMPANY_LOGIN_POPUP_ACTION, UPDATE_CONTRIBUTORS_ACTION } from "../store/actions";
import { store } from "../store/store";
import { AlertCircle } from "lucide-vue-next";
import Guid from "../models/Guid";
import { defineComponent } from "vue";

export default defineComponent({
  name: "CompanyLoginPopup",
  components: { AlertCircle },

  data: () => ({
    companyName: "",
    companyNumber: 0,
    confirmationCheckbox: false,
    errorText: "",
  }),

  methods: {
    closePopup() {
      store.dispatch(HIDE_COMPANY_LOGIN_POPUP_ACTION);
    },

    async createCompanyContributor() {
      const companyId = await addCompany(this.companyNumber.toString(), this.companyName);
      if (companyId.toString() === Guid.EMPTY) {
        this.errorText = "Kunne ikke opprette selskapet. Dette organisasjonsnummeret ble allerede lagt inn.";
        return;
      } else {
        const result = await createContributor("Company", companyId);
        if (result) {
          store.dispatch(UPDATE_CONTRIBUTORS_ACTION);
          this.closePopup();
        } else {
          this.errorText = "Kunne ikke opprette selskapet. Dette organisasjonsnummeret ble allerede lagt inn.";
        }
      }
    },
  },
  computed: {
    isCompanyLoginPopupVisible(): boolean {
      return store.state.isCompanyLoginPopupVisible;
    },
  },
});
</script>
