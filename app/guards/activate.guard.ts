declare const window:any;

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';

import { FormService, NavigationService, TimerService } from '../services';

@Injectable()
export class ActivateGuard implements CanActivate {
  constructor(private fs:FormService, private ns:NavigationService, private timer:TimerService, private _router:Router) { }

  canActivate(destination:ActivatedRouteSnapshot, state:RouterStateSnapshot) {
    if (destination.data && destination.data.nav === false) {
      // if specified as false - disable
      this.ns.disable();
    } else if (!this.ns.enabled()) {
      // if not already enabled, enable.
      this.ns.enable();
    }

    // TODO: If this is too old, we want to clear out the old stuff and just start over without redirecting.
    if (this.timer.expired.value && !state.url.match(/retrieve-quote/)) {
      this._router.navigate(['/expired']);
      return false;
    }

    // Each page move (where this guard is added) should reset the timer.
    this.timer.reset();

    window.scrollTo(0, 0);
    return true;
  }
}
