export const queryKeys = {
  transactions: {
    list: "transactions/list",
    detail: "transaction/detail",
  },
  masterData: {
    accessAdmin: {
      list: "master-data/access-admin/list",
      detail: "master-data/access-admin/detail",
    },
    facilities: {
      list: "master-data/facilities/list",
      detail: "master-data/facilities/detail",
    },
    weddingPackages: {
      list: "master-data/wedding-packages/list",
      detail: "master-data/wedding-packages/detail",
    },
    vendors: {
      list: "master-data/vendors/list",
      detail: "master-data/vendors/detail",
    },
    contact: {
      detail: "master-data/contact",
    },
  },
} as const;
