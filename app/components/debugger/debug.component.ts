declare const window:any;
declare const localStorage:any;

import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { getQueryStringValue } from '../../app.module';
import { ApplicationService, environment } from '../../services';

@Component({
  selector: 'debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent {
  public debugging:BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private _router:Router, private as:ApplicationService) {
    var debug;

    if (localStorage.getItem('debug')) {
      debug = localStorage.getItem('debug');
    }

    if (getQueryStringValue('debug')) {
      debug = getQueryStringValue('debug');
    }

    this.setValue(debug);
  }

  ngOnInit() {
    // No good reason for this - look for manual changes to localstorage and update accordingly.
    window.addEventListener('storage', ((event) => {
        if (event.storageArea === localStorage && event.key == 'debug' && event.newValue !== event.oldValue) {
          this.setValue(event.newValue);
        }
    }).bind(this), false);
  }

  setValue(debug:string) {
    if (!debug || (debug !== 'true' && debug !== 'false')) { return; }

    if (debug == 'true') {
      localStorage.setItem('debug', 'true');
      this.debugging.next(true);
    } else {
      localStorage.setItem('debug', 'false');
      this.debugging.next(false);
    }
  }
}
