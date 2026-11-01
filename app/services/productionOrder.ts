import type { FinishingOption, RawMaterial, EstimateType, QuotationDetails, BaseApiResponse, BasePaginationModel, OrderRequest } from "~/models";
import { buildOrderFormData } from '~/utils/orderFormData';

export async function getFinishingOptions() {
 
  const response = await httpClient<BaseApiResponse<BasePaginationModel<FinishingOption[]>>>('finishingoption/listall');
  return response.result;
}

export async function getRawMaterials() {
 
  const response = await httpClient<BaseApiResponse<RawMaterial[]>>('rawmaterial/listall', {
    method: "get",
    headers: {
      "AccountSecret": "LgDPlDbE"
    }
  });
  return response.result;
}

export async function getServiceCategories() {
 
  const response = await httpClient<BaseApiResponse<BasePaginationModel<EstimateType[]>>>('estimatetype/listall');
  return response.result;
}

export async function getQuotationDetails(id: string) {
 
  const response = await httpClient<BaseApiResponse<QuotationDetails>>(`quotation/getfulldetails?id=${id}`, {
    method: "get",
    headers: {
      "AccountSecret": "LgDPlDbE"
    }
  });
  return response.result;
}

export async function approveQuotation(id: string) {
  const response = await httpClient<BaseApiResponse<object>>(`quotation/approvequotation?id=${id}`, {
    method: "get",
    headers: {
      "AccountSecret": "LgDPlDbE"
    }
  });
  return response;
}

export async function rejectQuotation(payload: object) {
  const response = await httpClient<BaseApiResponse<object>>('quotation/rejectquotation', {
    method: "post",
    body: payload,
    headers: {
      "AccountSecret": "LgDPlDbE"
    }
  });
  return response;
}

export async function submitOrderRequest(payload: OrderRequest) {
  const response = await httpClient<BaseApiResponse<object>>('ProductionRequest/SubmitRequest', {
    method: 'post',
    // Let the browser set the multipart boundary; do not set Content-Type.
    body: buildOrderFormData(payload),
    headers: {
      AccountSecret: 'LgDPlDbE'
    }
  });
  return response.success;
}