import {Component} from 'angular2/core';
import {ClubService} from './club.service';
import {PersonService} from '../person/person.service';
import {Person} from '../person/person.component';
import {HTTP_PROVIDERS} from 'angular2/http';
import {NgFor} from 'angular2/common';
import {Spinner, Dropdown} from 'primeng/primeng';

// Create metadata with the `@Component` decorator
@Component({
    selector: 'club',
    providers: [...HTTP_PROVIDERS, ClubService, PersonService],
    template: require('./club.html'),
    directives: [Spinner, NgFor, Dropdown]
})
export class Club {

  private clubData: any;

  private clubs: Array<Club> = [];
  private persons: Array<Person> = [];

  constructor(public clubService: ClubService, public personService: PersonService) {

    clubService.getAll()
        .subscribe((res) => {
            this.clubs = res;
        });

    personService.getAll()
      .subscribe((res) => {
        this.persons = res;
      });

    this.resetClubData();
  }

  resetClubData() {
    this.clubData = {
      name: '',
      email: '',
      foundationYear: '',
      contact: ''
    };
  }

  createClub() {
      this.clubService.createClub(this.clubData)
        .subscribe((res) => {
            this.clubs.push(res);
            this.resetClubData();
        });
  }

  deleteClub(id) {
    this.clubService.deleteClub(id)
      .subscribe((res) => {
          this.clubs = res;
          this.resetClubData();
      });
  }
}
