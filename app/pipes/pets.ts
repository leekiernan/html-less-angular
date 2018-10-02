import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'petTitle' })
export class PetTitlePipe implements PipeTransform {
  transform(value:any, args:string[]):any {
		if (value.length < 2) {
			return value;
		} else {
			return `${value.slice(0,-1).join(', ')} & ${value.slice(-1)}`
		}
  }
}
