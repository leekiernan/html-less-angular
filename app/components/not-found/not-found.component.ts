import { Component, Input } from '@angular/core';

import { FormService } from '../../services';

@Component({
  selector: 'not-found-component',
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent {
  constructor(public fs:FormService) { }

  ngOnInit() {
  }
}
