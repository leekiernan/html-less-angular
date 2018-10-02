interface PolicyTerm {
  Description:string;
  SortKey:string;
  Value:string;
}

export interface PolicyQuote {
  AdditionalNotes:null;
  AnnualPremium:string;
  CoInsurance: {
    IsPercentage:boolean;
    Options: {
      decimal:null;
    };
    Selected:string;
  };
  Discount:string;
  Discounts: {
    Discount:null;
  };
  Excess: {
    IsPercentage:boolean;
    Options: {
      decimal:null;
    };
    Selected:string;
  };
  FirstMonthly:string;
  GroupedOptionalCoverages: {
    GroupedCoverage:null;
  };
  IIDocUrl:null;
  InfoDocUrl:string;
  PetRef:null;
  PolicyDocUrl:string;
  PolicyLimit: {
    IsPercentage:boolean;
    Options: {
      decimal:null;
    };
    Selected:string;
  };
  PolicyTerms: {
    PolicyTerm:PolicyTerm[]
  };
  PremiumLessDiscount:string;
  ProductDescription:null;
  ProductId:number;
  ProductName:string;
  RecurringMonthly:string;
  Selected:boolean;
  VoluntaryExcess: {
    IsPercentage:boolean;
    Options:null;
    Selected:string;
  }
}


export interface PetQuote {
  GroupedOptionalCoverages: {
    GroupedCoverage:null;
  };
  PetInfo: {
    BirthDate:string;
    BreedId:number;
    Gender:string; // "M" | "F";
    HasExistingConditions:boolean;
    HasMicrochip:boolean;
    IsNeutered:boolean;
    MicrochipNo:null;
    PetColour:null;
    PetName:string;
    PetRef:string;
    PurchasePrice:string;
    SpeciesId:number;
    VaccinationsUpToDate:boolean
  };

  PolicyList: {
    PolicyInfo:PolicyQuote[];
  }
}

export interface Quote {
  GetQuoteValuesResult: {
    GetQuoteValuesResult:null;
    MessageList: {
      ApiMessage:null;
    };
    ResponseId:null;
    Result:boolean;
    PetPolicyList: {
      PetPolicy:PetQuote[];
    };
    SessionId:number;
  };

  MessageList:null;
  ResponseId:null;
  Result:null;
}


export interface NewQuotePolicyTerms {
  AdvertisingAndReward: string;
  Complimentary: string;
  DeathByAccident: string;
  DietFood: string;
  Euthanasia: string;
  HolidayCancellation: string;
  KennelOrCatteryFees: string;
  LossByTheftOfStraying: string;
  ThirdPartyLiability: string;
  TravelCover: string;
  // VetFeeExcess: string;
  VetFeeCover: string;
}
export interface NewQuotePolicy {
  id: number;
  excess: string;
  voluntaryExcess:string;
  policyLimit:string;
  coInsurance:string;
  vetFees: string;
  price: {
    ipt: string;
    annual: string;
    monthly:  {
      first: string;
      rest: string;
    }
  };
  terms: NewQuotePolicyTerms;
}

export interface NewQuotePet {
  [name:string]: {
    policies: {
      [name:string]: NewQuotePolicy
    };
  }
}
export interface NewQuote {
  session:number;
  pets:NewQuotePet;
  policies: {
    [name:string]: NewQuotePolicyTerms
  }
}
