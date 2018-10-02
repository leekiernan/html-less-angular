import { Person, Pet } from './';

export interface Details {
  personal:Person;
  pets:Pet[];
  declaration?:boolean;
};
