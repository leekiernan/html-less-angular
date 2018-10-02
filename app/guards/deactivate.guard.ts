declare const window:any;
declare const document:any;

import { Component, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';

import { GetOnpageErrors, MarkFormErrors } from './';

class BaseComponent extends Component {
  public form:FormGroup;
}


@Injectable()
export class DeactivateGuard implements CanDeactivate<BaseComponent> {
  public routes:any;

  constructor(private router:Router) {
    this.routes = router.config.filter( r => r.data && r.data.name );
  }

  //
  canDeactivate(leavingComponent:BaseComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState: RouterStateSnapshot) {
    let from = this.routes.findIndex( (o:any) => o.path === currentState.url.slice(1) );
    let target = this.routes.findIndex( (o:any) => o.path === nextState.url.slice(1) );

    // We want to skip validation if moving backwards in the routes (eg. cover -> details)
    if (from > target) { return true; }

    if (leavingComponent.form && leavingComponent.form.valid) { return true; }

    MarkFormErrors(leavingComponent.form);

    return GetOnpageErrors().then( (err:any) => {
      window.scrollTo(0, err.getBoundingClientRect().top + window.scrollY - 30);
      return false;
    }, (e) => {
      // No errors: Allow continue navigating
      return true;
    });
  }
}
