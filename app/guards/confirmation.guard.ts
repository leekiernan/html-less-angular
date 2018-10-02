declare const window:any;

import { Component, Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';

import { getQueryStringValue } from '../app.module';
import { FormService } from '../services';
import { Iterate } from './';

@Injectable()
export class ConfirmationGuard implements CanActivate {
  constructor(private _router:Router, private fs:FormService) {
  }

  canActivate(destination:ActivatedRouteSnapshot, state:RouterStateSnapshot) {
    const PAYMENT_VALIDATION = [
      'details.personal.title',
      'details.personal.forename',
      'details.personal.surname',
      'details.personal.phone',
      'details.personal.dob',
      'details.personal.address',
      'details.personal.email',
      'details.pets'
    ];
    // ].concat( Iterate(this.fs.data.get('details.pets'), 'breed', 'details.pets'));

    let customer = getQueryStringValue('cid');
    if (!customer) {
      PAYMENT_VALIDATION.push(
        'payment.debit.sortCode',
        'payment.debit.accountNo',
        'payment.debit.accountName',
        'payment.bankName'
        );
    }

    // let invalid = PAYMENT_VALIDATION.filter( c => this.fs.data.get(c) && this.fs.data.get(c).invalid );
    let invalid = PAYMENT_VALIDATION.filter( c => this.fs.data.get(c) && this.fs.data.get(c).updateValueAndValidity() && this.fs.data.get(c).invalid );

    if (invalid.length) {
      this._router.navigate(['/payment']);
      return false;
    }

    return true;
  }

  canDeactivate(leavingComponent:Component, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState: RouterStateSnapshot) {
    // We prevent people from leaving the confirmation page by clicking any links.
    // Alternatively we should clear the session here.
    return false;
  }
}
