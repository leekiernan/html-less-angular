declare const sessionStorage:any;
declare const window:any;

import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {
  FormArray,
  FormBuilder,
  FormGroup
} from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { getQueryStringValue } from '../app.module';
import { Form, Pet, Treatment } from '../models';
import { FormModule } from '../form/form.initial';

import { APIService, TimerService } from './';
import { FORM_CHANGED } from '../reducers/form.reducer';

// Shared service for handling form data.
@Injectable()
export class FormService {
  public data:FormGroup;

  constructor(
    public fd:FormModule,
    public api:APIService,
    private timer:TimerService,
    private _http:Http,
    private _router:Router,
    private _store:Store<any>) {
    this.data = fd.initial();
    window.fs = this;

    this.data.valueChanges.subscribe( (val:Form) => {
      // If form hasn't changed, we should do nothing.
      // I'm leaving this here but we shouldn't need to use this
      // datepicker mindate/maxdate functions were causing form update infinite loop
      // if (JSON.stringify(val) == sessionStorage.getItem('form')) { return false; }

      this._store.dispatch({type: FORM_CHANGED, payload: val});
      timer.reset();
    });

    // Restore form from sessionStorage if exists.
    var browserStorage;
    if (browserStorage = sessionStorage.getItem('form')) {
      let browserStorageJSON = JSON.parse(browserStorage);
      this.patchForm(browserStorageJSON);
    }

    // Add session storage when the form store changes
    _store.select('form').subscribe( (form:Form) => {
      sessionStorage.setItem('form', JSON.stringify(form));
    });

    // Clear form on timer expiry.
    timer.expired$.subscribe( v => !!v ? this.clear() : null);

    this.data.get('promotion').setValue(getQueryStringValue('promo') || '');
    this.data.get('utm_source').setValue(getQueryStringValue('utm_source') || '');
  }

  patchForm(data:any) {
    // f.details.pets.slice(1).forEach( (pet:Pet) => this.addPet() );
    // We need to ensure that the form structure matches the data passed in.  Add pets and treatments if multiple received.
    data.details.pets.forEach( (pet:Pet, px:number) => {
      if (px > 0) { this.addPet() }

      let fpet = (<FormGroup>this.pets().controls[px]);
      if (pet.conditions && pet.conditions.treatments.length) {
        pet.conditions.treatments.slice(1).forEach( (treatment:Treatment, tx:number) => this.addTreatment(fpet));
      }
    });

    this.data.markAsDirty();
    this.data.patchValue(data, { emitEvent:false });
  }

  // We have a generic API call that will give us passable data back.  P1 or whole form.
  mockP1() { this.api.getMockP1().subscribe( (data:any) => this.patchForm(data)); }
  mock() { this.api.getMock().subscribe( (data:any) => this.patchForm(data)); }

  // Clear the form, remove all pets and treatments.
  clear() {
    if (this.data.pristine) { return false; }

    this.pets().value.slice(1).forEach( (p:Pet, px:number) => this.removePet(1) );

    let fpet = (<FormGroup>this.pets().controls[0]);
    fpet.value.conditions.treatments.slice(1).forEach( (treatment:Treatment, tx:number) => this.removeTreatment(fpet, 1));

    this.data.markAsPristine();
    this.data.setValue(this.fd.initial().value);
  }

  // Something strange happens with ngFor which is resolved by adding TrackBy.
  // Appears to clean up objects.
  track(index:number, obj:any): any { return index; }

  // map pet objs to array of names or numbers.
  petNames() { return this.data.value.details.pets.map( (pet:Pet, px:number) => pet.name || `Pet ${px+1}` ); }

  // Used for adding ids to html elements - we need these to match
  petId(n:number, f:string) { return `pets.${n}.${f}`; }
  treatmentId(n:number, t:number, f:string) { return `pets.${n}.conditions.treatments.${t}.${f}`; }

  pets():FormArray { return <FormArray>this.data.get("details.pets"); }

  addPet():FormArray | void {
    if (this.pets().value.length >= 3) { return; }
    let newpet = this.fd.pet();
    this.pets().push( newpet );
    return this.pets();
  }
  removePet(i:number) { this.pets().removeAt(i) }

  addTreatment(pet:FormGroup):FormArray {
    let newTreat = this.fd.treatment();
    (<FormArray>pet.get('conditions.treatments')).push(newTreat);
    return (<FormArray>pet.get('conditions.treatments'));
  }
  removeTreatment(pet:FormGroup, id:number) {
    (<FormArray>pet.get('conditions.treatments')).removeAt(id);
    return pet.get('conditions.treatments');
  }

  // is any pet in the form a dog
  // used to display additional terms on p1.
  hasDog():boolean {
    return !!this.pets().controls.filter(pet => pet.value.type === "Dog").length;
  }
}
