export type DocumentKeys =
  | "pan"
  | "form16"
  | "bankStatement"
  | "investmentProof"
  | "others"
  | "ais"
  | "tis"
  | "form26as";

export type DocumentsType = {
  [key in DocumentKeys]: any[];
};

export type UserType = {
  services: {
    itr: boolean;
    gst: boolean;
  };

  itr: {
    status: "Not Filed" | "Filed";
    dueDate: string;
    computationRequested: boolean;
  };

  taxData: {
    tds: number;
    advanceTax: number;
  };

  documents: DocumentsType;
};