declare const moment:any;

import { Component, Input } from '@angular/core';
import { AbstractControl, FormGroup, FormArray } from '@angular/forms';
import { NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { FormService } from '../../../services';

interface Questions {
  email:AbstractControl;
  postcode:AbstractControl;
  coverStart:AbstractControl;
  promotions:AbstractControl;
}

const momentToDateStruct = (date) => {
  return <NgbDateStruct>{ day:+date.date(), month:+date.month()+1, year:+date.year() };
}

@Component({
  selector: 'personal-component',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})

export class PersonalDetailsComponent {
  @Input('group') public form: FormGroup;
  public questions:Questions;
  public minDate:any;
  public maxDate:any;

  constructor(private fs:FormService) {
    const now = moment();
    // This config applies to the datepicker on start date.  Disallow < today and > 30 days.
    this.minDate = momentToDateStruct(now);
    this.maxDate = momentToDateStruct(now.add(30, 'days'));
  }

  ngOnInit() {
    this.questions = {
      email:this.form.get('email'),
      postcode:this.form.get('address.postcode'),
      coverStart:this.form.get('coverStart'),
      promotions:this.form.get('promotions')
    }
  }
}
