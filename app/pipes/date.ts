declare const moment:any;

import { PipeTransform, Pipe } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Pipe({ name: 'dateToString' })
export class DateToStringPipe implements PipeTransform {
  transform(date:NgbDateStruct, format:string = 'DD/MM/YYYY'):string {
    let d = moment({
      day: +date.day,
      month: +date.month - 1,
      year: +date.year
    });

    return d.isValid() ? d.format(format) : '';
  }
}
