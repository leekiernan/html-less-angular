import { Date, Treatment } from './';

export interface Pet {
  name:string;
  type:string;
  breed: {
    type:string;
    size:string;
    name: {
      value:string;
      name:string;
    };
  }
  dob: {
    month:number;
    year:number;
  };
  gender:string;
  price:number;
  vaccination?:boolean;
  workingDog?:boolean;
  microchip?:boolean;
  neutered?:boolean;
  conditions: {
    treatment?:boolean;
    treatments:Treatment[];
  }
}
