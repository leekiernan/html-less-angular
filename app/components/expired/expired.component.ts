import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { FormService, TimerService } from '../../services';

@Component({
  selector: 'expired-component',
  templateUrl: './expired.component.html'
})

export class ExpiredComponent {
  constructor(
    private _title:Title,
    private timer:TimerService) {
    _title.setTitle("Quote expired | PetProtect");
  }

  ngAfterContentInit() { window.scrollTo(0, 0); }
  ngOnInit() {
    return this.timer.stop();
  }

  reload() {
    return this.timer.start();
  }
}
