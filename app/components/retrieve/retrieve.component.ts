import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { environment, FormService, TimerService, WorkerService } from '../../services';
import { GetOnpageErrors, MarkFormErrors } from '../../guards';

interface Questions {
  email:AbstractControl;
  postcode:AbstractControl;
}

const FB = new FormBuilder();

@Component({
  selector: 'retrieve-component',
  templateUrl: './retrieve.component.html'
})
export class RetrieveComponent {
  public form = FB.group({
    email:['', [Validators.required]],
    postcode: ['', [Validators.required]]
  });
  public questions:Questions;
  public quoteLoader:BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private _http:Http,
    private _router:Router,
    private _title:Title,
    private worker:WorkerService,
    public fs:FormService,
    public timer:TimerService) {
    _title.setTitle("Retrieve your quote | PetProtect");

    this.questions = {
      email: this.form.get('email'),
      postcode: this.form.get('postcode'),
    }
  }

  ngOnInit() {
    return this.timer.pause();
  }

  retrieveQuote() {
    if (this.worker.loading.getValue() || this.form.invalid) {
      MarkFormErrors(this.form);
      return false;
    }

    this.worker.loading.next(true);

    // Post form data, on response patch the form and navigate to /cover.
    this._http.post(`${environment.apiUrl}/quote/retrieve`, this.form.value)
    .map( (response:any) => response.json() )
    .finally(() => this.worker.loading.next(false))
    .subscribe( (json:any) => {
      this.fs.patchForm(json);
      // this._router.navigate(['/details', { 'retrieve': true }]);
      this._router.navigate(['/cover', { 'retrieve': true }]);
    });

  }

}
