declare const moment:any;

import { Component, Host, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

import { NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { FormService } from '../../../../services';
import { PreExistingConditionsComponent } from '../pre-existing.component';

interface Treatment {
  value:string;
  name:string;
}

interface Questions {
  details:AbstractControl;
  info:AbstractControl;
  date:AbstractControl;
  cost:AbstractControl;
}

const momentToDateStruct = (date) => {
  return <NgbDateStruct>{ day:+date.date(), month:+date.month()+1, year:+date.year() };
}

@Component({
  selector: 'condition-treatment-component',
  templateUrl: './treatment.component.html'
})
export class PreExistingTreatmentComponent {
  @Input() idx:number;
  @Input('group') public form: FormGroup;
  public parentComponent:PreExistingConditionsComponent
  public questions:Questions;
  public conditions:Treatment[];

  public minDate:NgbDateStruct;
  public maxDate:NgbDateStruct;

  constructor(
    @Host() parent:PreExistingConditionsComponent,
    private config:NgbDatepickerConfig,
    public fs:FormService) {
    this.parentComponent = parent;

    const now = moment();
    // Ths order here is important ...
    this.maxDate = momentToDateStruct(now);
    this.minDate = momentToDateStruct(now.subtract(10, 'years'));
  }

  ngOnInit() {
    this.questions = {
      details:this.form.get('details'),
      info:this.form.get('info'),
      date:this.form.get('date'),
      cost:this.form.get('cost')
    };

    this.fs.api.getTreatments().subscribe( json => this.conditions = json);
    this.questions.details.valueChanges.subscribe( (newValue:string) => {
      // this.questions.info.updateValueAndValidity('');
      this.questions.info.setValue('');
    })
  }

  treatments() {
    return this.parentComponent.treatments();
  }

  treatId(name:string) {
    return `details.${this.fs.treatmentId(this.parentComponent.idx, this.idx, name)}`;
  }

  addTreatment() {
    this.parentComponent.addTreatment();
  }
  removeTreatment() {
    this.parentComponent.removeTreatment(this.idx);
  }
}
