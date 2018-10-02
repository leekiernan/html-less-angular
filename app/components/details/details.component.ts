declare const document:any;
declare const window:any;

import { Component, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AbstractControl, FormGroup } from '@angular/forms';

import { ApplicationService, FormService } from '../../services';

import { Pet } from '../../models/pet';

interface Questions {
  declaration:AbstractControl;
}

@Component({
  selector: 'details-component',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {
  public form:FormGroup;
  public name:string = "Details";
  public questions:Questions;

  constructor(
    private _route:ActivatedRoute,
    private _title:Title,
    public app:ApplicationService,
    public fs:FormService) {
    _title.setTitle("Get a Quote | PetProtect");
    this.form = <FormGroup>fs.data.controls.details;
    window.ff = fs.data;
  }

  allowClick() {
    return this.form.value.pets.some( (pet:Pet) => !pet.workingDog );
  }

  ngAfterViewInit() {
    this._route.fragment.subscribe(f => {
      const element:any = document.querySelector("#" + f);
      if (element) element.scrollIntoView(element)
    })
  }

  ngOnInit() {
    this.questions = {
      declaration:this.form.get('declaration')
    }

  }
}
