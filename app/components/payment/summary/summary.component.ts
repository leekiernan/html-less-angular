import { Component, Input } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

import { Pet, Quote } from '../../../models';
import { environment, FormService, QuoteService } from '../../../services';

@Component({
  selector: 'quote-summary-component',
  templateUrl: './summary.component.html',
  styles: [':host { display:block; }', ':host .card { border-radius:0; border:1px solid #f7f7f7; }']
})

export class QuoteSummaryComponent {
  @Input() idx:number;
  @Input() pet:Pet;

  public form:any;

  public breeds = [];

  public name:string;

  constructor(
    public fs:FormService,
    public quote:QuoteService) {
    this.form = <FormGroup>fs.data;
  }

  ngOnInit() {
    let opts = this.fs.api.get(`${environment.apiUrl}/breeds/${this.pet.type}`);
    opts.subscribe( (json) => {
      this.breeds = json;
      //find the name
      this.breeds.forEach( breed => {
        if(breed.value == this.pet.breed.name) {
          this.name = breed.name;
        }
      });
    });
  }

  petSize() {
    if (this.pet.type === 'Dog') {
      switch (this.pet.breed.size) {
        case 'small': return '10KG';
        case 'medium': return '20KG';
        case 'large': return '30KG';
      }
    } else { //assume cat
      //return '';
      return '- ' + this.name;
    }
  }

  petBreed() {
    return this.pet.breed.type == 'mixed breed' ? `Mixed breed ${this.petSize()}` : this.name;
  }

}
