declare const moment:any;

import { Injectable } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators, FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { Quote, Form, Details, Person, Pet } from '../models';

const VALID_POSTCODE = /^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$/;
// const VALID_EMAIL = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const VALID_EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const VALID_TELEPHONE = /^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/;
const dobValidator = (group:FormGroup, additional?:{ minWeeks?:number; maxYears?:number }) => {
  let newMonth = String(parseInt(group.value.month) - 1);
  let dobMoment = Object.assign({}, group.value, { month:newMonth });

  let m = moment(dobMoment);
  if (!m.isValid()) { return { 'invalid': true } }

  if (m.isAfter()) { return { 'future': true } }

  if (!additional) { return null; }

  if (additional.minWeeks && (moment().diff(m, "weeks") < additional.minWeeks)) { return { 'too_young': true } }

  if (additional.maxYears && (moment().diff(m, "years") > additional.maxYears)) { return { 'too_old': true } }

  return null;
}
const getRandom = (min:number,max:number,floor:boolean=true) => `${floor ? Math.floor((Math.random() * (max - min + 1)) + min) : (Math.random() * (max - min + 1)) + min}`;
const FB = new FormBuilder();

const startDateValidator = (c:FormControl | FormGroup) => {
  if (!c.value || !c.value.day || !c.value.month || !c.value.year) {
    return { 'required': true }
  }

  const days = moment({
    day: +c.value.day,
    month: +c.value.month - 1,
    year: +c.value.year
  }).diff(moment(), 'days');

  switch (true) {
    case days < 0:
      return { 'past': true }
    case days > 30:
      return { 'future': true }
    default:
      return null
  }
}

// export class FormModule {
// We declare the form here in a reusable way.
// initial() shouold give us a clear form object
// We add out validation here.  Some is built in and others are custom.  You can apply validation to a control or a group of controls.
export class FormModule {
  person() {
    return FB.group({
      email: ['', [Validators.required, (c:FormControl) => VALID_EMAIL.test(c.value) ? null : { 'invalid': true }]],
      title: ['', [Validators.required]],
      forename:['', [Validators.required]],
      surname:['', [Validators.required]],
      phone:['', [Validators.required, (c:FormControl) => VALID_TELEPHONE.test(c.value) ? null : { 'invalid': true }]],
      dob: FB.group({
        day:[''],
        month:[''],
        year:['']
      }, {
        validator: (group:FormGroup) => {
          if (!group.value.day || !group.value.month || !group.value.year) { return { 'required': true } }
          return dobValidator(group, { minWeeks:936, maxYears:120 });
        }
      }),
      address: FB.group({
        house:[''],
        street:[''],
        county:[''],
        postcode:['', [Validators.required, (c:FormControl) => VALID_POSTCODE.test(c.value) ? null : { 'invalid': true }]],
      }, {
        validator: (group:FormGroup) => (!!group.value.house && !!group.value.street && !!group.value.county && !!group.value.postcode) ? null : { 'required': true }
      }),
      coverStart:['', [Validators.required, startDateValidator]],
      // coverStart:['', [Validators.required]],
      promotions: [false]
    });
  }

  treatment() {
    const hasReceived = (ctrl:FormControl) => {
      if (!ctrl.parent || !ctrl.parent.parent) { return null; }

      return !!ctrl.parent.parent.parent.value.treatment && !ctrl.value ? { 'required': true } : null;
    }

    return FB.group({
      details:['', [hasReceived]],
      info:['', [(ctrl:FormControl) => {
        if (!ctrl.parent || !ctrl.parent.parent) { return null; }

        if (!!ctrl.parent.parent.parent.value.treatment) {
          return ctrl.parent.value.details === 'Other' ? (!ctrl.value ? { 'required': true } : null) : null;
        }
      }]],
      date:['', [hasReceived]],
      cost:['', [hasReceived, (c:FormControl) => !!c.value ? (parseInt(c.value) >= 0 ? null : { 'minimum': true }) : null]]
    })
  }

  pet() {
    return FB.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      breed: FB.group({
        type: ['mixed breed', [Validators.required]],
        name: ['', [(c:FormControl) => c && !c.value && c.parent && c.parent.errors && c.parent.errors.name ? { 'required': true } : null]],
        size: ['', [(c:FormControl) => c && !c.value && c.parent && c.parent.errors && c.parent.errors.size ? { 'required': true } : null]]
      }, {
        validator: (group:FormGroup) => {
          if (!group.parent) { return null; }

          const validateBreed = (gr) => gr.type === 'Cat' ? 'name' : (gr.breed.type === 'mixed breed' ? 'size' : 'name');

          let whatToValidate = validateBreed(group.parent.value);
          switch (whatToValidate) {
            case "name":
              return !!group.value.name ? null : { 'name': true };
            case "size":
              return !!group.value.size ? null : { 'size': true };
            default:
              return null;
          }
        }
      }),
      dob:FB.group({
        month:['', [Validators.required]],
        year:['', [Validators.required]]
      }, {
        validator: (group:FormGroup) => {
          if (!group.value.month || !group.value.year) {
            return {'required': true}
          }

          if (!group || !group.parent) { return null; }

          return (group.parent.value.type === 'Dog') ?
            (group.parent.value.breed.type === 'mixed breed' ?
              dobValidator(group, { minWeeks:8, maxYears:8 }) : // cross breed dog
              dobValidator(group, { minWeeks:8, maxYears:6 })) : // pedigree dog
            dobValidator(group, { minWeeks:6, maxYears:10 }); // any cat.
        }
      }),
      gender: ['', [Validators.required]],
      price: ['', [(c:FormControl) => (parseInt(c.value) >= 0) ? null : { 'minimum': true }]],
      vaccination: [undefined, [Validators.required]],
      workingDog: [undefined, [(c:FormControl) => {
        if (c && c.parent && c.parent.value.type === 'Dog') {
          return c.value === null ? { 'required': true } : (!!c.value ? { 'invalid': true } : null);
        }

        return null;
        // const ret = (!c.value && (c && c.parent && c.parent.value.type === 'Dog')) ? { 'invalid': true } : null;
        // return ret;
      }
      ]],
      microchip: [undefined, [Validators.required]],
      neutered: [undefined, [Validators.required]],
      conditions: FB.group({
        treatment: [undefined, [Validators.required]],
        treatments: FB.array([this.treatment()])
      }, {
        validator: (group:FormGroup) => {
          if (!group.value.treatment) { return null; }
          return group.value.treatments.length < 1 ? { 'length':true } : null;
        }
      }),
      selection: FB.group({
        ProductId: [''],
        PolicyLimit: [''],
        Excess: [''],
        VoluntaryExcess: [''],
        CoInsurance: ['']
      })
    });
  }

  initial() {
    return FB.group({
      details: FB.group({
        personal: this.person(),
        pets: FB.array([this.pet()]),
        declaration: [undefined, [Validators.required, (c:FormControl):any => !!c.value ? null : { 'required': false }]]
      }),
      cover: FB.group({
        choice:['', [Validators.required]],
        vetFeeCover:[''],
        period:['monthly', [Validators.required]]
      }),
      payment: FB.group({
        debit: FB.group({
          sortCode:FB.array(['','',''], (group:FormArray) => {
            if (!/^\d+$/.test(group.value.join(''))) {
              return { 'invalid': true };
            }

            if (group.value.filter( v => !!v ).length < group.value.length) {
              return { 'required': true };
            }

            return null;
          }),
          accountNo:['', [Validators.required, (c:FormControl) => /^\d+$/.test(c.value) ? null : { 'invalid': true } ]],
          accountName:['', [Validators.required, Validators.pattern('^[^,]*$')]],
          // bankName:[{ value:'', disabled:true }, [Validators.required]],
        }),
        bankName:['', [Validators.required]],
        // card: FB.group({})
        card: []
      }),
      funnelPath: ['regular'],
      policies: [undefined],
      SessionId: [undefined],
      timestamp: [undefined],
      promotion: [undefined],
      utm_source: [undefined]
    }, {
      // validator: (g:FormGroup) => null;
    });
  }
}
