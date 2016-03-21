import {Component, View} from 'angular2/core';
import {ClubService} from './club.service';
import {HTTP_PROVIDERS} from 'angular2/http';
import {NgFor} from 'angular2/common';

// Create metadata with the `@Component` decorator
@Component({
    selector: 'club',
    providers: [...HTTP_PROVIDERS, ClubService]
})
@View({
    template: require('./club.html'),
})
export class Club {

  clubData = {
    name: {
      first: '',
      last: ''
    },
    email: ''
  };

  private clubs: Array<Club> = [];

  constructor(public clubService: ClubService) {

    clubService.getAll()
        .subscribe((res) => {
            this.clubs = res;
        });
  }

  createPerson() {
      this.clubService.createClub(this.clubData)
        .subscribe((res) => {
            this.clubs.push(res);
            this.clubData = {
              name: {
                first: '',
                last: ''
              },
              email: ''
            };
        });
  }

  deletePerson(id) {
    this.clubService.deleteClub(id)
      .subscribe((res) => {
          this.clubs = res;
          this.clubData = {
            name: {
              first: '',
              last: ''
            },
            email: ''
          };
      });
  }
}
