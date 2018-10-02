import { Component, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Http }           from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { environment, FormService } from '../../../services';


interface Questions {
  title:AbstractControl;
  forename:AbstractControl;
  surname:AbstractControl;
  phone:AbstractControl;
  dateOfBirth:AbstractControl;
  dob:{
    day:AbstractControl;
    month:AbstractControl;
    year:AbstractControl;
  };
  address: AbstractControl;
  postcode:AbstractControl;
  email:AbstractControl;
}

interface Title {
  value:string;
  text:string;
}

@Component({
  selector: 'payment-details-component',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})

export class PaymentDetailsComponent {
  @Input('group') public form: FormGroup;
  public addressLoader:BehaviorSubject<boolean> = new BehaviorSubject(false);
  public addressLookup:boolean = false;
  public addressPicker:string[] = ['Loading...'];
  public questions:Questions;
  public titles:Title[] = [];

  constructor(
    private _http:Http,
    public fs:FormService) {
  }

  ngOnInit() {
    this.questions = {
      title:this.form.get('title'),
      forename:this.form.get('forename'),
      surname:this.form.get('surname'),
      phone:this.form.get('phone'),
      dateOfBirth:this.form.get('dob'),
      dob:{
        day:this.form.get('dob.day'),
        month:this.form.get('dob.month'),
        year:this.form.get('dob.year')
      },
      address: this.form.get('address'),
      postcode:this.form.get('address.postcode'),
      email:this.form.get('email')
    };

    this._http.get(`${environment.apiUrl}/titles`)
    .map((res:any) => res.json())
    .subscribe( json => {
      this.titles = json;
    });
  }

  onAddressSelected(v:string) {
    if(v!=null && v!='Select...') {
      // Gross...
      let m=v.match(/^\d+ /);
      let rest='';
      if(m!=null) {
        this.form.get('address.house').setValue(m[0]);
        let r = v.match(/\d+\s(.*)/);
        if(r!=null) {
          rest = r[1];
        }
      } else {
        this.form.get('address.house').setValue(v.split(', ')[0]);
        rest = v.split(', ')[1];
      }
      this.form.get('address.street').setValue(rest.split(', ')[0]);
      // this.form.get('address.county').setValue(v.split(', ')[v.split(', ').length-1]);
      this.form.get('address.county').setValue(v.split(', ')[v.split(', ').length-2]);
      this.form.get('address').updateValueAndValidity();
    }
  }

  findAddress() {
    if (this.addressLoader.getValue()) { return false; }

    this.addressLookup = true;
    this.addressLoader.next(true);

    if (this.questions.postcode.valid) {
      this.addressPicker = ['Loading...'];

      this._http.get(`${environment.apiUrl}/postcode/${this.questions.postcode.value}`)
      .map( (response:any) => response.json() )
      .finally(() => this.addressLoader.next(false))
      .catch((err:any) => this.addressPicker = [])
      .subscribe( (json:any) => {
        this.addressPicker = ['Select...'];
        this.addressPicker = this.addressPicker.concat(json.addresses.map( (add:string) => add.replace(/\s+,/g, '') ));

      });
    }
  }
}
