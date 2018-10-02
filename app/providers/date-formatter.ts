declare const moment: any;
import { Pipe, PipeTransform } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

// We need to get ng-bootstrap displaying and converting inputted dates properly.
export class DateParserFormatter extends NgbDateParserFormatter {
  constructor(private momentFormat: string = 'DD/MM/YYYY') {
    super();
  };

  format(date: NgbDateStruct): string {
    if (date === null) { return ''; }

    let d = moment({
      day: date.day,
      month: date.month - 1,
      year: date.year
    });
    return d.isValid() ? d.format(this.momentFormat) : '';
  }

  parse(value: string): NgbDateStruct {
    if (!value) { return null; }

    let d = moment(value, this.momentFormat);

    return d.isValid() ? {
      year: d.year(),
      month: d.month() + 1,
      day: d.date()
    } : null;
  }
}


