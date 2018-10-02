declare const window:any;

import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { environment } from './';

@Injectable()
export class ApplicationService {
  public brochureUrl:any = environment.brochure;

  constructor(private _http:Http) {
    this._http.get(`${environment.apiUrl}/brochure-url`).subscribe( (res:any) => {
      this.brochureUrl = res.json().url;
    });
  }
}
