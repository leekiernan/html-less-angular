import { Component, Input } from '@angular/core';
import { environment } from '../../../services';

@Component({
  selector: 'promotion-row-component',
  template: `
    <div class="">
      <div class="row mb-md-5 mt-2 justify-content-center" *ngIf="promotions.length > 0">
        <div class="col-12 col-md -6 p-2" *ngFor="let promotion of promotions">
          <promotion-component [promotion]="promotion"></promotion-component>
        </div>
      </div>
    </div>
  `,
  styles: ['']
})
export class PromotionRowComponent {
  // @Input() promotions:any[];
  public promotions:any[] = [{
    src:"assets/img/TP-1.jpg",
    url:"https://uk.trustpilot.com/review/www.petprotect.co.uk"
  },{
    src:"assets/img/MGM-1.jpg",
    url:`${environment.brochure}/existing-customers/recommend-a-friend/`
  }];

  constructor() {    }
}
