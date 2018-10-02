declare const window:any;

import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AbstractControl, FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { MarkFormErrors } from '../../../guards';

import { FormService, NextIfValue, QuoteService } from '../../../services';

interface Questions {
  Id:AbstractControl;
  Value:AbstractControl;
}

@Component({
  selector: 'cover-summary-component',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class CoverSummaryComponent {
  public confirmEditPet:BehaviorSubject<number> = new BehaviorSubject(-1);
  public confirmPet:BehaviorSubject<boolean> = new BehaviorSubject(false);
  public confirmRemovePet:BehaviorSubject<number> = new BehaviorSubject(-1);
  public form:FormGroup;
  public name:string = "Cover";
  public pets:FormGroup;
  public showConfirmEditPet:BehaviorSubject<boolean> = new BehaviorSubject(false);
  public showConfirmRemovePet:BehaviorSubject<boolean> = new BehaviorSubject(false);
  public showInfo?:string;

  constructor(
    private _router:Router,
    public fs:FormService,
    public quote:QuoteService) {
    this.form = <FormGroup>fs.data.get('cover');
    this.pets = <FormGroup>fs.data.get('details.pets');

  }

  print() { window.print(); }

  addPet() {
    let pets = <FormArray>this.fs.addPet();
    let pID = 'pet-' + (pets.controls.length);
    this._router.navigate(['/details'], { fragment:pID });
  }

  goBack(id:number) {
    let pID = 'pet-' + (id+1);
    this._router.navigate(['/details'], { fragment:pID });
  }

  ngOnInit() {
    this.confirmEditPet.subscribe( v => NextIfValue(this.showConfirmEditPet, v > -1) );
    this.confirmRemovePet.subscribe( v => NextIfValue(this.showConfirmRemovePet, v > -1) );
  }

  policyTerms() { return this.quote.policyTerms(); }
  policySummary() { return this.quote.policySummary(); }

  collapse(c:string) {
    this.showInfo = this.showInfo === c ? null : c;
  }
  excess(n) { return `Excess-${n}`; }
  feeContrib(n) { return `VetFeeCotnrib-${n}`; }

  altPeriod() { return this.form.value.period === 'annual' ? 'monthly' : 'annually'; }
  altCost() { return this.form.value.period === 'annual' ? this.quote.total('monthly') : this.quote.total('annual'); }
}
