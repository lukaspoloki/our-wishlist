import Guid from "./Guid";

export type Contributor = {
  contributorId: Guid;
  contributorType: string;
  companyName: string;
  flowLabel: string;
  flowDisabled: boolean;
  flowDisabledReason: string;
  spouseFlow: string[];
};

export type ContributorsFlow = {
  contributors: Contributor[];
  hasSpouse: boolean;
};

export type BudgetsParticipation = {
  budgetId: Guid;
  totalContributionsAmount: number;
  participation: number;
};
