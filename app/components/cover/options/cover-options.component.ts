import { Component } from '@angular/core';

@Component({
  selector: 'cover-options-component',
  template: `
    <cover-desktop-component></cover-desktop-component>
    <cover-mobile-component></cover-mobile-component>
    <p class="text-muted text-center">61% of customers buying direct, choose Lifetime Extra (Jan - May 2017)</p>
  `
})
export class CoverOptionsComponent {
  constructor() {}
}
