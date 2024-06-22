import { GObj } from '../helpers/object';
import { BaseResponse } from './base.response';

export interface OptionItem {
  key: string;
  label: string;
}

export interface ResponseMeta {
  total: number;
  currentPage: number;
  eachPage: number;
  lastPage: number;
}

export interface ResponseSchema {
  status?: number;
  message?: string;
  data?: GObj;
}

// single item response
export interface ItemResponse<T extends BaseResponse> extends ResponseSchema {
  data: T;
}

// list items response
export interface ListResponse<T extends BaseResponse> extends ResponseSchema {
  data: T[];
  meta: ResponseMeta;
}

// options list response
export interface OptionsResponse extends ResponseSchema {
  data: OptionItem[];
}

// error response
export interface ErrorResponse extends ResponseSchema {
  exception: string;
  errors?: GObj[] | null;
}
