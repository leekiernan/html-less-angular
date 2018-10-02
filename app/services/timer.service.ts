declare const localStorage:any;

import { Injectable, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { RESET_TIMER, SET_TIMER, START_TIMER, STOP_TIMER } from '../reducers/timeout.reducer';

@Injectable()
export class TimerService {
  public timeoutTime:BehaviorSubject<number> = new BehaviorSubject(0);
  public disable:boolean = false;

  public countdown:any;
  private countdownSubscription:Subscription;

  public expired:BehaviorSubject<boolean> = new BehaviorSubject(false);
  public expired$ = this.expired.asObservable();

  constructor(private _store:Store<any>, private _router:Router) {
    this.start();

    // Load and subscribe to changes in timeout.
    if (sessionStorage.getItem('timeout')) {
      let exp = JSON.parse(sessionStorage.getItem('timeout'));
      _store.dispatch({ type:SET_TIMER, payload:exp });
    }

    _store.select('timeout').subscribe( (timeout:number) => {
      sessionStorage.setItem('timeout', JSON.stringify(timeout) );
      this.timeoutTime.next(timeout);

      if (timeout < Date.now()) {
        this.timeout();
      }
    });
  }

  reset() {
    if (!!this.expired.value) { return false; }

    this._store.dispatch({ type:RESET_TIMER });
    this.start();
  }

  // is running.
  running() { return this.countdownSubscription && !this.countdownSubscription.closed; }

  start() {
    if (this.running()) { return false; }

    if (!!this.expired.value) { this.expired.next(false); }
    this._store.dispatch({ type:START_TIMER });

    this.countdown = this.countdown ? this.countdown : Observable.timer(1000, 1000);
    this.countdownSubscription = this.countdown.subscribe((t: any) => {
      let timeToExpiry = (this.timeoutTime.value - Date.now());
      if (timeToExpiry < 0) { this.timeout(); }
    });
  }

  pause() {
    this.countdownSubscription && this.countdownSubscription.unsubscribe();
    this.countdown = null;
  }

  stop() {
    this.pause();
    this._store.dispatch({ type:STOP_TIMER });
  }

  timeout() {
    this._router.navigate(['/expired'])
    this.expired.next(true);
    this.stop();
  }

  // timeout in seconds.
  forceTimeout(seconds:number = 60) {
    let t = Date.now() + (seconds*1000);
    this._store.dispatch({ type:SET_TIMER, payload: t });
  }
}
