import { Details } from './';

export interface Form {
  details:Details;
  cover:any;
  payment:any;
  policies?:string[];
  SessionId?:number;
  timestamp?:any;
  promotion?:any;
  utm_source?:any;
}
