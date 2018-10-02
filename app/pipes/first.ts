declare const moment:any;

import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'first' })
export class FirstPipe implements PipeTransform {
  transform(value:any, args:string[]):any {
    return value[0];
  }
}
