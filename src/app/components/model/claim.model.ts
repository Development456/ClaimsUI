export interface  Claim {
    claimId: string;
    facilityId: string;
    customerId: string;
    palletQuantity: number;
    documentType: string;
    claimedAmount: string;
    serviceProviderClaimId : number;
    claimStatus: string;
    claimType: string;
    creatorId: string;
    lastUpdateId: string;
    closedDate: string;
    createdDate: string;
    lastUpdateDate: string;
    paidAmount: string;
    _id: string;
    
}

export interface LoginDetails{
    accessToken:string;
    email:string;
    id:string;
    roles:string[];
    tokenType:string;
    username:string
  }
