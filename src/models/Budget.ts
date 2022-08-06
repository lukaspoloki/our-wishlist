import Guid from "./Guid";

export type Budget = {
  id: Guid;
  name: string;
  churchId: number;
  customSettings?: BudgetCustomSettings;
  expenses: Array<Expenses>;
};

export type BudgetCustomSettings = {
  lowerMemberAgeLimit: number;
  percentageProposal: number;
  maxParticipation: number;
  participationPercentage: number;
  labels: {
    Expenses: string;
    Contributions: string;
  };
  links: [];
  homePageText: string;
  confirmationPdfUrl: string;
  flowTexts: [FlowTextData];
};

export type FlowTextData = {
  flowType: string;
  addContributionPageText: string;
  myContributionPageText: string;
  confirmationPopupText: string;
};

export type Expenses = {
  amount: number;
  name: string;
};
