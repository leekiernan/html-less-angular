import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'period' })
export class PeriodPipe implements PipeTransform {
  transform(value:any, args:string[]):any {
    return value === 'annual' ? 'year' : 'month';
  }
}
