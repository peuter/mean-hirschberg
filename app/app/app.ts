// ```
// app.ts
// (c) 2016 David Newman
// blackshuriken@hotmail.com
// app.ts may be freely distributed under the MIT license
// ```

// *src/app/app.ts*

// This file contains the main class as well as the necessary
// decorators for creating the primary `app` `component`

/*
 * Angular 2 decorators and services
 */
import {App, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {Component} from 'angular2/core';
import {RouteConfig, Router} from 'angular2/router';
import {MegaMenu} from 'primeng/primeng';

import {Home} from './home/home';

// Import NgFor directive
import {NgFor} from 'angular2/common';

import {Person} from './person/person.component';
import {Event} from './events/event.component';
import {Club} from './club/club.component';

/*
 * App Component
 * Top Level Component
 */
@App({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
@Component({
  selector: 'app',
  providers: [  ],
  directives: [ Event, Person, Club, NgFor, MegaMenu],
  pipes: [],
  // Load our main `Sass` file into our `app` `component`
  styleUrls: [require('!style!css!sass!../sass/main.scss')],
  template: `
    <header>
      <p-megaMenu>
        <h1>{{ name }}</h1>
        <ul>
          <li router-active>
            <a data-icon="fa-users" [routerLink]=" ['Person'] ">Personen</a>
          </li>
          <li router-active>
            <a data-icon="fa-circle-thin"  [routerLink]=" ['Club'] ">Vereine</a>
          </li>
          <li router-active>
            <a data-icon="fa-calendar" [routerLink]=" ['Event'] ">Termine</a>
          </li>
        </ul>
      </p-megaMenu>
    </header>

    <main>
      <router-outlet></router-outlet>
    </main>

    <footer>
      
    </footer>
  `
})
@RouteConfig([
  { path: '/', name: 'Index', component: Home, useAsDefault: true },
  { path: '/home',  name: 'Home',  component: Home },
  { path: '/person', component: Person, name: 'Person' },
  { path: '/event', component: Event, name: 'Event' },
  { path: '/club', component: Club, name: 'Club' },
  // Async load a component using Webpack's require with
  // es6-promise-loader and webpack `require`
  { path: '/about', name: 'About', loader: () => require('es6-promise!./about/about')('About') },
])
export class MyApp {
  name = 'Hirschberg Connected';
  url = 'https://www.hirschberg-sauerland.de';

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

/*
 * Please review the https://github.com/datatype_void/angular2-examples/ repo as it is updated for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @datatype_void on twitter
 * or our chat on Slack at https://VulgarDisplayOfPower.com/slack-join
 * or via chat on Gitter at https://gitter.im/datatype_void/angular2-webpack-starter
 */
