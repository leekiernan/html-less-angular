import { Component, Input } from '@angular/core';

@Component({
  selector: 'promotion-component',
  template: `
    <figure><a class="d-block" [href]="promotion.url" target=_blank><img [src]="promotion.src" class="d-block" /></a></figure>
  `,
  styles: ['figure { overflow:hidden; }', 'img { max-width:100%; border-radius:1rem; }']
})
export class PromotionComponent {
  @Input() promotion:any;
  constructor() { }
}
