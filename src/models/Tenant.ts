export type Tenant = {
  id: string;
  name: string;
  churchId: number;
  customSettings: TenantCustomSettings;
};

export type TenantCustomSettings = {
  currency: string;
};
