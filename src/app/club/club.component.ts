import {Component} from 'angular2/core';
import {ClubService} from './club.service';
import {PersonService} from '../person/person.service';
import {Person} from '../person/person.component';
import {HTTP_PROVIDERS} from 'angular2/http';
import {NgFor} from 'angular2/common';
import {Spinner, Dropdown, DataTable, Column, Dialog} from 'primeng/primeng';

// Create metadata with the `@Component` decorator
@Component({
    selector: 'club',
    providers: [...HTTP_PROVIDERS, ClubService, PersonService],
    template: require('./club.html'),
    directives: [Spinner, NgFor, Dropdown, DataTable, Column, Dialog]
})
export class Club {

  private clubs: Array<Club> = [];
  private selectedClub;
  dialogVisible: boolean = false;
  private persons: Array<Person> = [];

  constructor(public clubService: ClubService, public personService: PersonService) {

    clubService.getAll()
        .subscribe(res => this.clubs = res);

    personService.getAll()
      .subscribe(res => this.persons = res);
  }

  handleRowSelect(event) {
    this.selectedClub = event.data;
    this.dialogVisible = true;
  }

  createClub() {
      this.clubService.createClub(this.selectedClub)
        .subscribe(res => this.clubs.push(res));
  }

  deleteClub(id) {
    this.clubService.deleteClub(id)
      .subscribe(res => this.clubs = res);
  }
}
