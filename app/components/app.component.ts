declare const document:any;
declare const moment:any;
declare const window:any;

import { Component, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormArray } from '@angular/forms';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// import { FormService, NavigationService, NextIfValue, QuoteService, TimerService } from '../services';
import { ApplicationService, environment, FormService, NavigationService, NextIfValue, QuoteService, TimerService, WorkerService } from '../services';

@Component({
  selector: 'root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public form:FormGroup;
  public routes:any;
  public secondsToTimeout:BehaviorSubject<number> = new BehaviorSubject(1800);
  public showTimeoutModal:BehaviorSubject<boolean> = new BehaviorSubject(false);
  public tempTimer:BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(
    private _router:Router,
    private _title:Title,
    private app:ApplicationService,
    private worker:WorkerService,
    public fs:FormService,
    public ns:NavigationService,
    public quote:QuoteService,
    public ts:TimerService) {
    // You can setTitle per page.  Should import from platform-browser and inject in constructor.
    _title.setTitle("Get a Quote | PetProtect");
    this.form = fs.data;
    window.ff = fs.data; // For access in page console.

    this.routes = _router.config.filter( r => r.data && r.data.nav );

    // Subscribe to timer.  For display and can be removed prior to live.
    ts.countdown && ts.countdown.subscribe( (t:number) => {
      if( !ts.running() ) { return false; }
      let to = ts.timeoutTime.getValue()
      this.tempTimer.next( moment(to).fromNow() );

      let now = moment();
      let timeoutTime = moment(to);
      let diff = timeoutTime.diff(now, 'seconds');
      this.secondsToTimeout.next( diff );

      NextIfValue(this.showTimeoutModal, diff < 90 && !this.ts.expired.getValue());
    });
  }

  ngOnInit() {
    // index.html contains some loading info.  Once this component inits, we remove that element (on timeout, for fade).
    var preBootstrapContainer = document.getElementById( "pre-bootstrap-container" );
    document.getElementById("pre-bootstrap").className = "loaded";

    setTimeout( () => { preBootstrapContainer.parentNode.removeChild( preBootstrapContainer ); }, 666 );
  }

  // Also used for testing and can be removed before live.
  timeoutTime() { return moment(this.ts.timeoutTime.getValue()).format('hh:mm:ss') }
  mockLoad() {
    this.worker.loading.next(true);
    setTimeout( () => {
      this.worker.loading.next(false);
    }, 5000);
  }
  mockLoadError() {
    this.worker.loading.next(true);
    setTimeout( () => {
      this.worker.error.next('Optional error info for display.');
    }, 2000);
  }

  privacyAndCookies() { return `${this.app.brochureUrl}/privacy-and-cookies/`; }
  accessibility() { return `${this.app.brochureUrl}/accessibility/`; }
  existingCustomersPolicyDocuments() { return `${this.app.brochureUrl}/existing-customers/policy-documents/`; }
  legal() { return `${this.app.brochureUrl}/legal/`; }
  complaints() { return `${this.app.brochureUrl}/complaints/`; }
  careers() { return `${this.app.brochureUrl}/careers/`; }
  contactUs() { return `${this.app.brochureUrl}/contact-us/`; }
}
