import { UserType } from "./types";

export const mockUser: UserType = {
  services: {
    itr: true,
    gst: false,
  },

  itr: {
    status: "Not Filed",
    dueDate: "31-07-2026",
    computationRequested: false,
  },

  taxData: {
    tds: 0,
    advanceTax: 0,
  },

  documents: {
    pan: [],
    form16: [],
    bankStatement: [],
    investmentProof: [],
    others: [],
    ais: [],
    tis: [],
    form26as: [],
  },
};