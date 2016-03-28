import {Component} from 'angular2/core';
import {PersonService} from './person.service';
import {HTTP_PROVIDERS} from 'angular2/http';
import {DataTable, Column, Dialog} from 'primeng/primeng';
import String2DatePipe from '../shared/pipes/String2DatePipe';

// Create metadata with the `@Component` decorator
@Component({
    selector: 'person',
    providers: [...HTTP_PROVIDERS, PersonService],
    template: require('./person.html'),
    directives: [DataTable, Column, Dialog],
    pipes: [String2DatePipe]
})
export class Person {

  selectedPerson = {name: '', address: '', email: ''};
  dialogVisible: boolean = false;

  private persons: Array<Person> = [];

  constructor(public personService: PersonService) {
    personService.getAll().subscribe(res => this.persons = res);
  }

  handleRowSelect(event) {
    this.selectedPerson = event.data;
    this.dialogVisible = true;
  }

  savePerson() {
      this.personService.createPerson(this.selectedPerson)
        .subscribe(res => this.persons.push(res));
  }

  deletePerson(id) {
    this.personService.deletePerson(id)
      .subscribe(res => this.persons = res);
  }
}
