import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AbstractControl, FormGroup, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { FormService, QuoteService, WorkerService } from '../../services';

interface Questions {
  period:AbstractControl;
  choice:AbstractControl;
}


@Component({
  selector: 'cover',
  templateUrl: './cover.component.html',
  styleUrls: ['./cover.component.scss']
})
export class CoverComponent {
  private work:any;
  public confirmEditPet:BehaviorSubject<number> = new BehaviorSubject(-1);
  public confirmPet:BehaviorSubject<boolean> = new BehaviorSubject(false);
  public confirmRemovePet:BehaviorSubject<number> = new BehaviorSubject(-1);
  public form:FormGroup;
  public name:string = "Cover";
  public pets:FormGroup;
  public questions:any;
  public saveQuote:BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private _router:Router,
    private _title:Title,
    private worker:WorkerService,
    public fs:FormService,
    public quote:QuoteService) {
    _title.setTitle("Cover options | PetProtect");
    this.form = <FormGroup>fs.data.get('cover');
    this.pets = <FormGroup>fs.data.get('details.pets');
  }

  addPet() {
    let pets = <FormArray>this.fs.addPet();
    let pID = 'pet-' + (pets.controls.length);
    this._router.navigate(['/details'], { fragment:pID });
  }

  goBack(id:number) {
    let pID = 'pet-' + (id+1);
    this._router.navigate(['/details'], { fragment:pID });
  }

  ngOnInit() {
    this.questions = {
      period: this.form.get('period'),
      choice: this.form.get('choice')
    }

    this.work = this.worker.error.subscribe( (v:boolean) => {
      if (!!v) {
        this._router.navigate(['/details']);
      }
    });
  }

  ngOnDestroy() {
    this.work.unsubscribe();
  }
}
