import { Injectable, Output, EventEmitter } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class NavigationService {
  private display:BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor() {
    // debugger;
  }

  enable() { this.display.next(true); }
  enabled() { return !!this.display.getValue(); }
  disable() { this.display.next(false); }
  disabled() { return !this.display.getValue(); }
}
