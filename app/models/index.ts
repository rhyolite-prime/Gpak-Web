

export interface BaseApiResponse<T> {
    result: T;
    success: boolean;
    unAuthorizedRequest: boolean;
    error: Error;
}

export interface Error {
    code: boolean;
    details: boolean;
    message: any;
    validationErrors: any;
}


export interface BasePaginationModel<T> {
    pageNo: number;
    totalCount: number;
    totalPages: number;
    data: T;

    lowerBound: number;
    upperBound: number;
}

export interface FinishingOption {
    id: string;
    name: string;
}

export interface EstimateType {
    id: string;
    name: string; 
    hexColour: string; 
}

export interface RawMaterial {
    id: string;
    name: string; 
}

export interface FinishingOptionsPayload {
    binding: string;
    additionalOptions: string[];
    surfaceFinish: string;
}

export interface JobRequestDetail {
    jobName: string;
    size: string;
    customSize?: string;
    quantity: number;
    pages: number;
    paperInside: string;
    paperCover: string;
    paperInsideRawMaterialId: string;
    paperCoverRawMaterialId: string;
    paperInsideVariant: string;
    paperCoverVariant: string;
    noOfColoursText: number;
    noOfColoursCover: number;
    finishingOptions: FinishingOptionsPayload;
    otherInstructions: string;
}

export interface OrderRequest {
    customer: string;
    contactName: string;
    phoneNo: string;
    location: string;
    emailAddress: string;
    date?: string;
    noOfJobs: number;
    jobRequests: JobRequestDetail[];
}


export interface QuotationDetails {
    quotationInfo: Quotation;
    productionRequestDetails: ProductionOrder;
}

export interface ProductionOrder {
    quotationId: string;
    quotationNumber: string;
    orderNumber: string;
    
}

export interface Quotation {

    id: string;
    estimationIds: string;
    quotationNumber: string;
    email: string;
    phoneNumber: string;
    businessName: string;
    specification: string;
    origination: string;
    terms: string;
    validityInDays: string;
    validUntil: string[];
    hasAdminApproved: string;
    hasCustomerApproved: boolean;
    customerFeedback: string;
    discount: number;
    status:string;
    quotedPrice: number;
    signatories: Signatory[],
    details: QuotationDetail[]
    
}

export interface QuotationDetail {
    itemName: string;
    size: string;
    paperGsm: string;
    colour: string;
    quantity: string;
    getflNhil: number;
    unitPrice: number;
    totalTax:number;
    vatTax: number;
 
}

export interface Signatory {

    name: string;
    designation: string;
    phoneNo: string;
    signatureImageUrl: string;
    
}