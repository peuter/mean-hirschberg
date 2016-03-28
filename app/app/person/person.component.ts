import {Component} from 'angular2/core';
import {PersonService} from './person.service';
import {HTTP_PROVIDERS} from 'angular2/http';
import {NgFor} from 'angular2/common';

// Create metadata with the `@Component` decorator
@Component({
    selector: 'person',
    providers: [...HTTP_PROVIDERS, PersonService],
    template: require('./person.html')
})
export class Person {

  personData = {
    name: {
      first: '',
      last: ''
    },
    email: ''
  };

  private persons: Array<Person> = [];

  constructor(public personService: PersonService) {
    console.log('Person constructor go!');

      personService.getAll()
        .subscribe((res) => {
            this.persons = res;
        });
  }

  createPerson() {
      this.personService.createPerson(this.personData)
        .subscribe((res) => {
            this.persons.push(res);
            this.personData = {
              name: {
                first: '',
                last: ''
              },
              email: ''
            };
        });
  }

  deletePerson(id) {
    this.personService.deletePerson(id)
      .subscribe((res) => {
          this.persons = res;
          this.personData = {
            name: {
              first: '',
              last: ''
            },
            email: ''
          };
      });
  }
}
