import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value:any, len:string):any {
    const trunc = +len || 100;
    return value.length < trunc + 5 ? value : `${value.substring(0,trunc).trim()}...`;
  }
}
