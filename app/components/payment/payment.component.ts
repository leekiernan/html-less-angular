declare const Waypoint:any;

import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ApplicationService, FormService, QuoteService, WorkerService } from '../../services';

@Component({
  selector: 'payment-component',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})

export class PaymentComponent {
  public confirmEditPet:BehaviorSubject<boolean> = new BehaviorSubject(false);
  public form:FormGroup;
  public isCollapsed:boolean = false;
  public name:string = "Payment";
  public personalDetails:FormGroup;
  public stickyHeader:boolean = false;

  constructor(
    private _router:Router,
    private _title:Title,
    public app:ApplicationService,
    private ws:WorkerService,
    public fs:FormService,
    public quote:QuoteService) {
    _title.setTitle("Payment | PetProtect");
    this.form = <FormGroup>fs.data;
    this.personalDetails = <FormGroup>this.form.get('details.personal');
  }

  ngOnInit() {
    var waypoint = new Waypoint({
      element: document.getElementById('price-banner'),
      handler: ((direction:string) => {
        if( direction == 'down' ) {
          this.stickyHeader = true;
        } else {
          this.stickyHeader = false;
        }
      }).bind(this)
    });
  }

  goBack(id?:number) {
    let pID = 'pet-' + ((id || 0)+1);
    this._router.navigate(['/details'], { fragment:pID });
  }
}
