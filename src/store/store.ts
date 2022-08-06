import { createStore, Store, useStore as baseUseStore } from "vuex";
import {
  SET_BUDGET,
  SET_CALC_POPUP,
  SET_COMPANY_LOGIN_POPUP,
  SET_CHANGE_CONTRIBUTOR_POPUP,
  SET_CONFIRMATION_POPUP,
  SET_CONTRIBUTION_AMOUNT,
  SET_SAVED_SUCCESSFULLY,
  SET_PAYMENT_METHOD,
  SET_BILLING_MONTH,
  SET_CONTRIBUTORS,
  SET_HAS_SPOUSE,
  SET_CONTRIBUTOR_ID,
  SET_CURRENT_CONTRIBUTIONS,
  SET_CURRENT_TENANT,
  SET_IS_COUPLE_LOGIN_POSSIBLE,
  SET_IS_INDIVIDUAL_LOGIN_POSSIBLE,
  SET_SPOUSE_LOGIN_POPUP,
  SET_SUCCESSFULL_PAGE_POPUP,
  SET_TENANTS_DATA,
  SET_USER_DATA,
  UPDATE_BUDGET_CONTRIBUTION_TOTAL_AMOUNT,
  SET_BACK_BUTTON,
  UPDATE_BUDGET_PARTICIPATION,
  UPDATE_CONTRIBUTOR_FLOW_TYPE,
  SET_SPOUSE_FLOW,
  SET_PAYMENT_PLAN_POPUP,
} from "./mutations";
import { InjectionKey } from "vue";
import config from "../config.json";
import { getAuthClient } from "@/auth/auth";
import {
  HIDE_CALC_POPUP_ACTION,
  INIT_DATA_ACTION,
  SHOW_CALC_POPUP_ACTION,
  SET_CONTRIBUTION_AMOUNT_ACTION,
  SET_SAVED_SUCCESSFULLY_ACTION,
  SET_BILLING_MONTH_ACTION,
  SET_PAYMENT_METHOD_ACTION,
  SHOW_CONFIRMATION_POPUP_ACTION,
  HIDE_CONFIRMATION_POPUP_ACTION,
  SHOW_PAYMENT_PLAN_POPUP_ACTION,
  HIDE_PAYMENT_PLAN_POPUP_ACTION,
  UPDATE_BUDGET_CONTRIBUTION_AMOUNT_ACTION,
  UPDATE_CURRENT_CONTRIBUTOR_ID_ACTION,
  HIDE_COMPANY_LOGIN_POPUP_ACTION,
  SHOW_COMPANY_LOGIN_POPUP_ACTION,
  HIDE_CHANGE_CONTRIBUTOR_POPUP_ACTION,
  SHOW_CHANGE_CONTRIBUTOR_POPUP_ACTION,
  SHOW_SPOUSE_LOGIN_POPUP_ACTION,
  HIDE_SPOUSE_LOGIN_POPUP_ACTION,
  UPDATE_CONTRIBUTORS_ACTION,
  UPDATE_USER_CONTRIBUTIONS_LIST_ACTION,
  SET_BACK_BUTTON_ACTION,
  UPDATE_CONTRIBUTOR_FLOW_TYPE_ACTION,
  UPDATE_BUDGET_PARTICIPATION_ACTION,
  HIDE_SUCCESSFULL_PAGE_ACTION,
  SHOW_SUCCESSFULL_PAGE_ACTION,
} from "./actions";
import { State } from "./state";
import {
  getBudgetsParticipation,
  getBudgets,
  getPossibleContributors,
  getTenants,
  getUserContributions,
} from "@/api/api";
import { Budget } from "@/models/Budget";
import { NewContribution } from "@/models/NewContribution";
import { Tenant } from "@/models/Tenant";
import Guid from "@/models/Guid";
import router from "@/router/router";
import { calculateDate } from "@/core/utilities";

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    environment: config.environment,
    isDevelopment: config.environment === "development",
    language: "NOR",
    church: "",
    churchId: 0,
    error: "",
    currentTenantId: "",
    currentTenant: <Tenant>{},
    currentContributorId: "",
    contributors: [],
    currentContributions: [],
    isIndividualLoginPossible: false,
    isCoupleLoginPossible: false,
    isCompanyLoginPopupVisible: false,
    isChangeContributorPopupVisible: false,
    isSpouseLoginPopupVisible: false,
    tenants: [],
    budget: { churchId: 0, id: Guid.createEmpty(), name: "", expenses: [] },
    isCalcPopupVisible: false,
    isConfirmationPopupVisible: false,
    isPaymentPlanPopupVisible: false,
    isSuccessfullContributionPopupVisible: false,
    isContributionSuccessfull: false,
    contributionAmount: 0,
    billingMonth: "",
    billingMethod: "",
    totalBudgetContributionsAmount: 0,
    budgetParticipation: 0,
    hasSpouse: false,
    backButton: "",
    flowType: "",
    spouseFlow: [],
  },
  mutations: {
    [SET_USER_DATA](state, user) {
      state.churchId = <number>user["https://login.bcc.no/claims/churchId"];
      state.church = user["https://login.bcc.no/claims/churchName"];
    },
    [SET_TENANTS_DATA](state, tenants) {
      state.tenants = tenants;
    },
    [SET_CURRENT_TENANT](state, tenant: Tenant) {
      state.currentTenant = tenant;
      state.currentTenantId = tenant.id;
    },
    [SET_BUDGET](state, budget: Budget) {
      state.budget = budget;
    },
    [SET_CALC_POPUP](state, isVisible: boolean) {
      state.isCalcPopupVisible = isVisible;
    },
    [SET_CONFIRMATION_POPUP](state, isVisible: boolean) {
      state.isConfirmationPopupVisible = isVisible;
    },
    [SET_PAYMENT_PLAN_POPUP](state, isVisible: boolean) {
      state.isPaymentPlanPopupVisible = isVisible;
    },
    [SET_COMPANY_LOGIN_POPUP](state, isVisible: boolean) {
      state.isCompanyLoginPopupVisible = isVisible;
      UPDATE_CURRENT_CONTRIBUTOR_ID_ACTION;
    },
    [SET_SPOUSE_LOGIN_POPUP](state, isVisible: boolean) {
      state.isSpouseLoginPopupVisible = isVisible;
    },
    [SET_SUCCESSFULL_PAGE_POPUP](state, isVisible: boolean) {
      state.isSuccessfullContributionPopupVisible = isVisible;
    },
    [SET_CONTRIBUTION_AMOUNT](state, amount: number) {
      state.contributionAmount = amount;
    },    
    [SET_SAVED_SUCCESSFULLY](state, success: boolean) {
      state.isContributionSuccessfull = success;
    },
    [SET_BILLING_MONTH](state, month: string) {
      state.billingMonth = month;
    },
    [SET_PAYMENT_METHOD](state, method: string) {
      state.billingMethod = method;
    },
    [UPDATE_BUDGET_CONTRIBUTION_TOTAL_AMOUNT](state, amount: number) {
      state.totalBudgetContributionsAmount += amount;
    },
    [UPDATE_BUDGET_PARTICIPATION](state, participation: number) {
      state.budgetParticipation += participation;
    },
    [SET_CONTRIBUTORS](state, contributors) {
      if (contributors?.contributors) {
        state.contributors = contributors.contributors;
      } else {
        state.contributors = contributors;
      }
    },
    [SET_HAS_SPOUSE](state, hasSpouse) {
      state.hasSpouse = hasSpouse;
    },
    [SET_CONTRIBUTOR_ID](state, newContributorId) {
      state.currentContributorId = newContributorId;
      localStorage.setItem("currentContributorId", newContributorId);
    },
    [SET_IS_INDIVIDUAL_LOGIN_POSSIBLE](state, isPossible) {
      state.isIndividualLoginPossible = isPossible;
    },
    [SET_IS_COUPLE_LOGIN_POSSIBLE](state, isPossible) {
      state.isCoupleLoginPossible = isPossible;
    },
    [SET_CURRENT_CONTRIBUTIONS](state, contributions) {
      state.currentContributions = contributions;
      state.currentContributions.forEach(x => (x.signedDate = calculateDate(x.signedDate.toString())));
    },
    [SET_BACK_BUTTON](state, route) {
      state.backButton = route;
    },
    [UPDATE_CONTRIBUTOR_FLOW_TYPE](state, type: string) {
      state.flowType = type;
    },
    [SET_SPOUSE_FLOW](state, contributors) {
      state.spouseFlow = contributors.spouseFlow;
    },
    [SET_CHANGE_CONTRIBUTOR_POPUP](state, isVisible: boolean) {
      state.isChangeContributorPopupVisible = isVisible;
    },
  },
  getters: {
    currentBudget: (state: State) => {
      return state.budget as Budget;
    },

    currentContributionType: (state: State) => {
      let currentContributorType = "";

      state.contributors.forEach(element => {
        if (element.contributorId.toString() === state.currentContributorId) {
          currentContributorType = element.contributorType;
        }
      });

      if (currentContributorType === "") {
        currentContributorType = "Individual";
      }

      return currentContributorType;
    },

    getFlowTextData: (state: State) => (propertyName: string) => {
      const currentContributionType = store.getters.currentContributionType;
      let result = "";
      state.budget.customSettings?.flowTexts.forEach(element => {
        if (element.flowType === currentContributionType) {
          // TODO - do this dynamicly with [] and Obj.keys
          switch (propertyName) {
            case "addContributionPageText":
              result = element.addContributionPageText;
              break;
            case "myContributionPageText":
              result = element.myContributionPageText;
              break;
            case "confirmationPopupText":
              result = element.confirmationPopupText;
              break;
            default:
              result = " ";
              break;
          }
        }
      });
      return result;
    },

    getTotalBudgetAmount: () => {
      const budget: Budget = store.getters.currentBudget;
      let totalBudgetAmount = 0;
      budget.expenses.forEach(expense => {
        totalBudgetAmount += expense.amount;
      });
      return totalBudgetAmount;
    },
  },
  actions: {
    async [INIT_DATA_ACTION]({ commit }) {
      const user = await getAuthClient().getUser();
      if (user) commit(SET_USER_DATA, user);

      if (this.state.churchId !== 0) {
        const tenants = await getTenants();
        const currentTenant = tenants[0];
        commit(SET_TENANTS_DATA, tenants);
        commit(SET_CURRENT_TENANT, currentTenant);
        const budgets = await getBudgets();
        if (budgets.length > 0) {
          commit(SET_BUDGET, budgets[0]);

          const contributorsFlow = await getPossibleContributors(budgets[0].id);
          commit(SET_CONTRIBUTORS, contributorsFlow.contributors);
          commit(SET_SPOUSE_FLOW, contributorsFlow);
          commit(SET_HAS_SPOUSE, contributorsFlow.hasSpouse);
          //Check if currentContributor is set,
          //Set first if there is only one possible
          //other go to home page to select correct one
          if (this.state.currentContributorId === "") {
            if (this.state.contributors.length === 1) {
              this.dispatch(UPDATE_CURRENT_CONTRIBUTOR_ID_ACTION, this.state.contributors[0].contributorId);
            } else {
              const localContributorId = localStorage.getItem("currentContributorId");
              if (localContributorId != null || localContributorId != "")
                this.dispatch(UPDATE_CURRENT_CONTRIBUTOR_ID_ACTION, localContributorId);
            }
            if (this.state.currentContributorId === "") router.push({ path: "/home" });
          }
          //Setting possible login methods according to contributors object
          const contributors = this.state.contributors;
          commit(SET_IS_INDIVIDUAL_LOGIN_POSSIBLE, true);
          commit(SET_IS_COUPLE_LOGIN_POSSIBLE, true);

          if (this.state.spouseFlow) {
            if (this.state.spouseFlow.length > 0) {
              this.state.spouseFlow.forEach(element => {
                if (element === "Individual") {
                  commit(SET_IS_COUPLE_LOGIN_POSSIBLE, false);
                }
              });
            }
          }

          contributors.forEach(element => {
            if (element.contributorType === "Individual") {
              commit(SET_IS_INDIVIDUAL_LOGIN_POSSIBLE, true);
              commit(SET_IS_COUPLE_LOGIN_POSSIBLE, false);
            }
            if (element.contributorType === "Couple") {
              commit(SET_IS_COUPLE_LOGIN_POSSIBLE, true);
              commit(SET_IS_INDIVIDUAL_LOGIN_POSSIBLE, false);
            }
          });
          this.dispatch(UPDATE_BUDGET_PARTICIPATION_ACTION, budgets[0].id);
        }
      }
    },

    [SHOW_CALC_POPUP_ACTION]({ commit }) {
      commit(SET_CALC_POPUP, true);
    },
    [HIDE_CALC_POPUP_ACTION]({ commit }) {
      commit(SET_CALC_POPUP, false);
    },
    [SHOW_CONFIRMATION_POPUP_ACTION]({ commit }) {
      commit(SET_CONFIRMATION_POPUP, true);
    },
    [HIDE_CONFIRMATION_POPUP_ACTION]({ commit }) {
      commit(SET_CONFIRMATION_POPUP, false);
    },
    [SHOW_PAYMENT_PLAN_POPUP_ACTION]({ commit }) {
      commit(SET_PAYMENT_PLAN_POPUP, true);
    },
    [HIDE_PAYMENT_PLAN_POPUP_ACTION]({ commit }) {
      commit(SET_PAYMENT_PLAN_POPUP, false);
    },
    [SHOW_COMPANY_LOGIN_POPUP_ACTION]({ commit }) {
      commit(SET_COMPANY_LOGIN_POPUP, true);
    },
    [HIDE_COMPANY_LOGIN_POPUP_ACTION]({ commit }) {
      commit(SET_COMPANY_LOGIN_POPUP, false);
    },
    [SHOW_CHANGE_CONTRIBUTOR_POPUP_ACTION]({ commit }) {
      commit(SET_CHANGE_CONTRIBUTOR_POPUP, true);
    },
    [HIDE_CHANGE_CONTRIBUTOR_POPUP_ACTION]({ commit }) {
      commit(SET_CHANGE_CONTRIBUTOR_POPUP, false);
    },
    [SHOW_SPOUSE_LOGIN_POPUP_ACTION]({ commit }) {
      commit(SET_SPOUSE_LOGIN_POPUP, true);
    },
    [HIDE_SPOUSE_LOGIN_POPUP_ACTION]({ commit }) {
      commit(SET_SPOUSE_LOGIN_POPUP, false);
    },
    [SHOW_SUCCESSFULL_PAGE_ACTION]({ commit }) {
      commit(SET_SUCCESSFULL_PAGE_POPUP, true);
    },
    [HIDE_SUCCESSFULL_PAGE_ACTION]({ commit }) {
      commit(SET_SUCCESSFULL_PAGE_POPUP, false);
    },

    [UPDATE_BUDGET_CONTRIBUTION_AMOUNT_ACTION]({ commit }, newContribution: NewContribution) {
      const budget = this.state.budget;
      if (budget != undefined && budget.id == newContribution.budgetId) {
        commit(UPDATE_BUDGET_CONTRIBUTION_TOTAL_AMOUNT, newContribution.amount);
      }
    },
    [SET_CONTRIBUTION_AMOUNT_ACTION]({ commit }, amount) {
      commit(SET_CONTRIBUTION_AMOUNT, amount);
    },
    [SET_SAVED_SUCCESSFULLY_ACTION]({ commit }, success: boolean) {
      commit(SET_SAVED_SUCCESSFULLY, success);
    },
    [SET_BILLING_MONTH_ACTION]({ commit }, month: string) {
      commit(SET_BILLING_MONTH, month);
    },
    [SET_PAYMENT_METHOD_ACTION]({ commit }, method: string) {
      commit(SET_PAYMENT_METHOD, method);
    },
    async [UPDATE_CURRENT_CONTRIBUTOR_ID_ACTION]({ commit }, newContributorId: string) {
      commit(SET_CONTRIBUTOR_ID, newContributorId);
      commit(SET_CURRENT_CONTRIBUTIONS, await getUserContributions());
    },
    async [UPDATE_CONTRIBUTORS_ACTION]({ commit }) {
      commit(SET_CONTRIBUTORS, await getPossibleContributors(this.state.budget.id));
    },

    async [UPDATE_USER_CONTRIBUTIONS_LIST_ACTION]({ commit }) {
      commit(SET_CURRENT_CONTRIBUTIONS, await getUserContributions());
    },

    [SET_BACK_BUTTON_ACTION]({ commit }, route) {
      commit(SET_BACK_BUTTON, route);
    },

    [UPDATE_CONTRIBUTOR_FLOW_TYPE_ACTION]({ commit }, type: string) {
      commit(UPDATE_CONTRIBUTOR_FLOW_TYPE, type);
    },

    async [UPDATE_BUDGET_PARTICIPATION_ACTION]({ commit }, budgetId) {
      const budgetsParticipation = await getBudgetsParticipation(budgetId);
      commit(UPDATE_BUDGET_CONTRIBUTION_TOTAL_AMOUNT, budgetsParticipation.totalContributionsAmount);
      commit(UPDATE_BUDGET_PARTICIPATION, budgetsParticipation.participation);
    },
  },
  modules: {},
});

export function useStore(): Store<State> {
  return baseUseStore(key);
}
