export type UserData = {
  id: string;
  name: string;
  email: string;

  services: {
    itr: boolean;
    gst: boolean;
    virtualCFO: boolean;
  };

  itr: {
    status: "Pending" | "Filed";
    dueDate: string;
    computationRequested: boolean;
  };

  documents: {
    pan: any[];
    form16: any[];
    bankStatement: any[];
    investmentProof: any[];
    others: any[];

    ais: boolean;
    tis: boolean;
    form26as: boolean;
  };

  taxData: {
    tds: number;
    advanceTax: number;
  };
};