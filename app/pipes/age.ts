declare const moment:any;

import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'age' })
export class AgePipe implements PipeTransform {
  transform(value:any, args:string[]):any {
    let date = moment(value);

    if (!date.isValid()) { return 'N/A'; }
    let yy = moment().diff(date, 'years');
    let mm = moment().subtract(yy, 'years').diff(date, 'months');
    return (yy > 0) ? `${yy} years, ${mm} months` : `${mm} months`;

  	// return date.isValid() ? date.toNow(true) : 'N/A';
  }
}
