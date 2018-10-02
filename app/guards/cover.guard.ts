declare const window:any;

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';

import { APIService, FormService, QuoteService } from '../services';
import { Quote } from '../models';
import { Iterate } from './';


@Injectable()
export class CoverGuard implements CanActivate {
  constructor(private _router:Router, private api:APIService, private fs:FormService, private qs:QuoteService) { }

  canActivate(destination:ActivatedRouteSnapshot, state:RouterStateSnapshot) {
    // retrieve page drops users here (/cover).  We want to set this into the form for GTM later.
    if (destination.params.retrieve) { this.fs.data.get('funnelPath').setValue('retrieval'); }

    const DETAILS_VALIDATION = [
      'details.personal.email',
      'details.personal.address.postcode',
      'details.personal.coverStart',
      'details.personal.promotions',
      'details.declaration'
    ].concat( Iterate(this.fs.data.get('details.pets'), 'conditions', 'details.pets'));

    let invalid = DETAILS_VALIDATION.filter( c => this.fs.data.get(c) && this.fs.data.get(c).updateValueAndValidity() && this.fs.data.get(c).invalid );
    if (invalid.length) {
      this._router.navigate(['/details']);
      return false;
    }

    return !!this.qs.get();
  }
}
