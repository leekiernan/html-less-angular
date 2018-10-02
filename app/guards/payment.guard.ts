declare const window:any;

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';

import { FormService, QuoteService } from '../services';

@Injectable()
export class PaymentGuard implements CanActivate {
  constructor(private _router:Router, private fs:FormService, private qs:QuoteService) { }

  // To get to the payment page, we validate the cover page.  There's not much there...
  canActivate(destination:ActivatedRouteSnapshot, state:RouterStateSnapshot) {
    const COVER_VALIDATION = [
      'cover.choice',
      'cover.period'
    ];

    let invalid = COVER_VALIDATION.filter( c => this.fs.data.get(c) && this.fs.data.get(c).updateValueAndValidity() && this.fs.data.get(c).invalid );
    if (invalid.length || !this.qs.data) {
      this._router.navigate(['/cover']);
      return false;
    }

    return true;
  }
}
