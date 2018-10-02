import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { environment, WorkerService } from './';
import { Form } from '../models';

@Injectable()
export class APIService {
  constructor(private http:Http, private worker:WorkerService) {}

  getMock() { return this.get(`${environment.apiUrl}/test-form-data`); }
  getMockP1() { return this.get(`${environment.apiUrl}/test-form-details`); }

  buyPolicy(data:Form, type:string) {
    // this.post(`${environment.apiUrl}/buy${type ? '/'+ type : ''}`, data);
    return !!type ?
      this.post(`${environment.apiUrl}/buy/${type}`, data) :
      this.post(`${environment.apiUrl}/buy`, data);
  }
  verifyPolicy(id:string) { return this.get(`${environment.apiUrl}/orders/${id}`); }
  getQuote(data:Form) { return this.post(`${environment.apiUrl}/quote`, data, true); }
  getTreatments() { return this.get(`${environment.apiUrl}/pre-existing-conditions`); }
  reviews() { return this.get(`${environment.apiUrl}/reviews`); }

  post(url:string, data:any, modal:boolean = false) { return this.request(this.http.post(`${url}`, data), modal); }
  get(url:string, modal:boolean = false) { return this.request(this.http.get(`${url}`), modal); }

  // We centralise the requests in this way to add modals and errors where needed.
  // We share() this call so that other services/components can also .subscribe to it's return.
  request(subscriber:Observable<Response>, modal?:boolean) {
    let req = subscriber
    .map((res:Response) => res.json() )
    .finally(() => {
      // Ensure that we remove any loading modal after all requests.
      if(!!modal) { this.worker.loading.next(false); }
    })
    .catch(this.handleError.bind(this))
    .share();


    // Ensure loading modal clears on completion of the call - replace with error if received.
    if (modal && !this.worker.loading.getValue()) {
      this.worker.loading.next(true);

      req.subscribe(
        (res:any) => {
          this.worker.loading.next(false)
        }, (err:any) => {
          this.worker.error.next(err)
        }, () => {
          this.worker.loading.next(false)
        }
      );
    }

    return req;
  }

  // Currently this just throws a (hopefully) readable error into the console.
  // We can replace with sentry.io or other.
  handleError(error: Response | any) {
    this.worker.error.next(error);
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;

    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }

    return Observable.throw(errMsg);
  }
}
