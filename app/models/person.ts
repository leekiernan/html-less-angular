import { Date } from './';

export interface Person {
  title:string;
  forename:string;
  surname:string;
  phone:string;
  dob: Date | string;
  address: {
    house:string | number;
    street: string;
    county: string;
    postcode: string;
  };

  email:string;
  coverStart: Date | string;
  promotions:boolean;
}
