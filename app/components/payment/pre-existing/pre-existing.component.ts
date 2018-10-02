import { Component, Input } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

import { FormService } from '../../../services';

interface Questions {
  conditions: {
    treatment:AbstractControl;
    treatments:FormArray;
  };
}

@Component({
  selector: 'pre-existing-conditions-component',
  templateUrl: './pre-existing.component.html'
})

export class PreExistingConditionsComponent {
  @Input() idx:number;
  @Input('group') public form: FormGroup;
  public questions:Questions;

  constructor(public fs:FormService) { }

  ngOnInit() {
    this.questions = {
      conditions: {
        treatment:this.form.get('conditions.treatment'),
        treatments:<FormArray>this.form.get('conditions.treatments')
      },
    };
  }


  petId(name:string) {
    return `details.${this.fs.petId(this.idx, name)}`;
  }

  addTreatment() {
    this.fs.addTreatment(this.form);
  }
  removeTreatment(id:number) {
    this.fs.removeTreatment(this.form, id);
  }

  treatments() {
    return this.questions.conditions.treatments.controls;
  }
  treatment(id:number) { return this.treatments()[id]; }

}
