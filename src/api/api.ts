import axios from "axios";
import config from "../config.json";
import { getAuthClient } from "../auth/auth";
import { Tenant } from "@/models/Tenant";
import { store } from "@/store/store";
import { Budget } from "@/models/Budget";
import { BudgetsParticipation, ContributorsFlow } from "@/models/Contributor";
import Guid from "@/models/Guid";
import { Contribution } from "@/models/Contribution";
import authConfig from "../auth/authConfig.json";
import { app } from "../main";

export async function getTenants(): Promise<Tenant[]> {
  const token = await getAuthClient().getTokenSilently();
  const churchId = store.state.churchId;
  const url = `${config.apiBasePath}/Tenants?churchId=${churchId}`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.data.data;
}

export async function getBudgets(): Promise<Budget[]> {
  const token = await getAuthClient().getTokenSilently();
  const currentTenantId = store.state.currentTenantId;
  const url = `${config.apiBasePath}/Tenants/${currentTenantId}/Budgets`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
}

export async function getPossibleContributors(budgetId: Guid): Promise<ContributorsFlow> {
  const token = await getAuthClient().getTokenSilently();
  const currentTenantId = store.state.currentTenantId;
  const url = `${config.apiBasePath}/Tenants/${currentTenantId}/Budgets/${budgetId}/Contributors`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
}

export async function createContributor(contributorType: string, companyId?: Guid): Promise<string> {
  const token = await getAuthClient().getTokenSilently();
  const currentTenantId = store.state.currentTenantId;
  const budgetId = store.state.budget.id;

  const url = `${config.apiBasePath}/Tenants/${currentTenantId}/Budgets/${budgetId}/Contributors`;

  const body = {
    contributorType: contributorType,
    companyId: companyId,
  };
  const response = await axios.post(url, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
}

export async function getBudgetsParticipation(budgetId: Guid): Promise<BudgetsParticipation> {
  const token = await getAuthClient().getTokenSilently();
  const currentTenantId = store.state.currentTenantId;

  const url = `${config.apiBasePath}/Tenants/${currentTenantId}/Budgets/${budgetId}/Participation`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
}

export async function addUserContribution(billingMonth: string): Promise<boolean> {
  const client = getAuthClient();
  const token = await client.getTokenWithPopup({
    ignoreCache: true,
    scope: `${authConfig.scope} mfa`,
    audience: authConfig.audience,
    useRefreshTokens: true,
  });

  const currentTenantId = store.state.currentTenantId;
  const currentContributorId = store.state.currentContributorId;
  const contributionAmount = store.state.contributionAmount;
  const budgetId = store.state.budget.id;

  const url = `${config.apiBasePath}/Tenants/${currentTenantId}/Budgets/${budgetId}/AddMyContribution`;
  const body = {
    amount: contributionAmount,
    contributorId: currentContributorId,
    billingMonth: billingMonth,
  };

  const response = await axios.post(url, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.status == 200;
}

export async function getUserContributions(): Promise<Contribution[]> {
  const token = await getAuthClient().getTokenSilently();
  const currentTenantId = store.state.currentTenantId;
  const budgetId = store.state.budget.id;
  const currentContributorId = store.state.currentContributorId;

  if (currentContributorId === null || currentContributorId === "") {
    return new Array<Contribution>();
  }

  const url = `${config.apiBasePath}/Tenants/${currentTenantId}/Budgets/${budgetId}/MyContributions/${currentContributorId}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
}

export async function addCompany(organizationId: string, name: string): Promise<Guid> {
  const token = await getAuthClient().getTokenSilently();
  const currentTenantId = store.state.currentTenantId;

  const url = `${config.apiBasePath}/Tenants/${currentTenantId}/AddCompany`;
  const body = {
    tenantId: currentTenantId,
    organizationId: organizationId,
    name: name,
  };

  try {
    const response = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) return response.data.data;
  } catch (error) {
    if (app.config.globalProperties.$gtag) {
      app.config.globalProperties.$gtag.exception({
        description: "Create company exception: " + error,
        fatal: false,
      });
    }
    return Guid.createEmpty();
  }
  return Guid.createEmpty();
}
