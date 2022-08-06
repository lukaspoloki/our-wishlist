import Guid from "./Guid";

export type NewContribution = {
  budgetId: Guid;
  contributorId: string;
  amount: number;
  participation: number;
};
