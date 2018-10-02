import { Component, Input } from '@angular/core';

@Component({
  selector: 'review-component',
  templateUrl: './review.component.html',
  styleUrls: ['./review.scss']
})
export class ReviewComponent {
  @Input() review:any;
  constructor() {
  }

  ngAfterViewInit() {
  }
}
