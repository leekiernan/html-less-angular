declare const window:any;

import { Component, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operator/map';
import { debounceTime } from 'rxjs/operator/debounceTime';
import { distinctUntilChanged } from 'rxjs/operator/distinctUntilChanged';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { environment, FormService, NextIfValue } from '../../../services';

interface PetBreed {
  value:string;
  name:string;
}

interface Questions {
  name:AbstractControl;
  type:AbstractControl;
  breed: {
    type:AbstractControl;
    name:AbstractControl;
    size:AbstractControl;
  };
  dob:AbstractControl;
  gender:AbstractControl;
  price:AbstractControl;
  vaccination:AbstractControl;
  workingDog:AbstractControl;
  microchip:AbstractControl;
  neutered:AbstractControl;
}

@Component({
  selector: 'pet-component',
  templateUrl: './pet.component.html',
  styleUrls: ['./pet.component.scss']
})
export class PetDetailsComponent {
  @Input('group') public form: FormGroup;
  @Input() idx:number;
  @Input() petCount:number;

  public breeds:PetBreed[] = [];
  public questions:Questions;
  public showVaccination:BehaviorSubject<boolean> = new BehaviorSubject(null);
  public showWorkingDog:BehaviorSubject<boolean> = new BehaviorSubject(null);

  // Functions for ng bootstrap: https://ng-bootstrap.github.io/#/components/typeahead/examples
  public formatter = (x:any) => x.name ? (x.name.name ? x.name.name : x.name) : x;
  public breedSearch = (text$: Observable<string>) => {
    // When typing, filter breeds list for matches
    return map.call(distinctUntilChanged.call(debounceTime.call(text$, 200)), (term:string) => {
      let result = term.length < 3 ? [] :
        this.breeds.filter((breed:{ value:string;name:string; }) => {
          return breed.name.toLowerCase().indexOf(term.toLowerCase()) > -1;
        }
      );
      return result.slice(0, 10);
    });
  }

  constructor(public fs:FormService) {}

  ngOnInit() {
    this.questions = {
      name:this.form.get('name'),
      type:this.form.get('type'),
      breed: {
        type:this.form.get('breed.type'),
        name:this.form.get('breed.name'),
        size:this.form.get('breed.size'),
      },
      dob:this.form.get('dob'),
      gender:this.form.get('gender'),
      price:this.form.get('price'),
      vaccination:this.form.get('vaccination'),
      workingDog:this.form.get('workingDog'),
      microchip:this.form.get('microchip'),
      neutered:this.form.get('neutered')
    };


    // Modals.
    this.questions.vaccination.valueChanges.subscribe((isTrue:boolean) => isTrue !== null ? NextIfValue(this.showVaccination, !isTrue) : null);
    this.questions.workingDog.valueChanges.subscribe((isTrue:boolean) => isTrue !== null ? NextIfValue(this.showWorkingDog, isTrue) : null);

    this.questions.type.valueChanges.subscribe((val:string) => this.form.get('breed').updateValueAndValidity());
    this.questions.breed.type.valueChanges.subscribe((val:string) => this.form.get('breed').updateValueAndValidity());

    this.questions.type.valueChanges.subscribe( (val:string) => {
      if (!val) { return false; }

      let opts = this.fs.api.get(`${environment.apiUrl}/breeds/${val}`);

      // We may wish to clear selected animal type changes...
      // this.questions.breed.name.setValue({ name:'', value:'' });
      // this.questions.breed.name.updateValueAndValidity();

      opts.subscribe( (json:PetBreed[]) => this.breeds = json );
    });

    this.questions.type.updateValueAndValidity()
  }

  dobFromYear() { return (new Date()).getFullYear() - (this.questions.type.value === 'Cat' ? 10 : 8); }
  dobToYear() { return (new Date()).getFullYear(); }

  breedCapture() {
    return this.form.value.type === 'Cat' ?
      true :
      (this.form.value.breed.type === 'mixed breed' ? false :true);
  }

  spayedNeutered() {
    let gender = this.form.value.gender;
    return gender ? (gender == 'male' ? 'neutered' : 'spayed') : 'spayed/neutered'
  }

  petId(name:string) {
    return this.fs.petId(this.idx, name);
  }
}
