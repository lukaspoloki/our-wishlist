export type ChartData = {
  id?: string;
  tenantId?: string;
  totalAmount: string;
  name: string;
  chartItems: Array<ChartItem>;
};

export type ChartItem = {
  name: string;
  amount?: number;
  value: number;
  type?: string;
};

export enum ChartItemType {
  Income = "income",
  Budget = "budget",
}
