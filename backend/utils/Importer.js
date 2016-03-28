/**
 * Importer
 *
 * @author tobiasb
 * @since 2016
 */
import Event from '../models/event.model';
import EventSource from '../models/eventsource.model';
import Club from '../models/club.model';
import Person from '../models/person.model';
import ICAL from '../../node_modules/ical.js/build/ical';
var request = require('request');
import Unirest from '../../node_modules/unirest/index';
import Typo3 from '../utils/Typo3';

export default class Importer {

  static importClubsAndPeoples(req, res) {
    Unirest.get('http://www.hirschberg-sauerland.de/rest/VirtualObject-Address')
      .headers({'Accept': 'application/json'})
      .end((response) => {
        if (response.statusCode === 200) {
          var counters =  {
            clubs: {
              found: 0,
              created: 0,
              updated: 0
            },
            persons: {
              found: 0,
              created: 0,
              updated: 0
            }
          };
          response.body.forEach((address) => {
            if (address.pageId !== 426 && address.deleted === false && address.isOrganizer === true && address.company) {

              // split in club and person
              var clubData = {
                name            : address.company,
                foundationYear  : Typo3.convertDate(address.birthday).getFullYear(),
                updated         : Typo3.convertDate(address.updated),
                logo            : address.logo,
                contactRole     : address.title,
                homepage        : address.homepage,
                emailAddress    : address.emailAddress,
                externalUid     : address.externalUid
              };
              var contactData = {
                name: {
                  first: address.first_name,
                  last: address.last_name
                },
                address: {
                  street: address.address,
                  zip: address.zip,
                  city: address.city
                },
                email: address.emailAddress,
                externalUid: address.externalUid,
                updated: Typo3.convertDate(address.updated),
              };

              if (contactData.externalUid) {
                var options = {upsert: true, runValidators: true, setDefaultsOnInsert: true};
                // find and update/create person
                Person.findOneAndUpdate({externalUid: contactData.externalUid}, contactData, options, (err, person) => {
                  counters.persons.found++;
                  clubData.contact = person;
                  Club.findOne({externalUid: clubData.externalUid}).exec().then(club => {
                    if (!club) {
                      // create Club
                      counters.clubs.created++;
                      return Club.create(clubData);
                    } else if (club.updated < clubData.updated) {
                      // update club with new data
                      club.set(clubData);
                      counters.clubs.updated++;
                      return club.save();
                    } else {
                      console.log(`Club '${club.name}' not updated`);
                      return club;
                    }
                  }).then(club => {
                    counters.clubs.found++;
                    console.log(counters.clubs);
                  }).catch((err) => {
                    console.log(`Error: ${err}`);
                    res.send(err);
                  });
                });
              }
            }
          });
          res.send("import done");
        } else {
          res.send(response);
        }
      });
  }

  static run() {
    EventSource.find({active: true}, (err, sources) => {

      if (sources && sources.length > 0) {
        sources.forEach((source) => {
          console.log(`processing ${source.type} source ${source.name}`);
          if (source.type === "ical") {
            if (source.read === true) {
              Importer.importIcal(source);
            }
          }
        });
      }
    });
  }

  static importIcal(source) {

    request(source.url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var jcal = ICAL.parse(body);
        var comp = new ICAL.Component(jcal);
        comp.getAllSubcomponents("vevent").forEach((vevent) => {
          var event = new ICAL.Event(vevent);
          if (event.startDate.compare(ICAL.Time.now()) >= 0) {

            // search for Event
            Event.findOne({
              exports: {
                $elemMatch: {
                  source: source,
                  uid: event.uid
                }
              }
            }, (err, modelEvent) => {
              if (!modelEvent) {
                Event.create({exports: [{source: source, uid: event.uid}]}, (err, modelEvent) => {
                  Importer.updateEvent(modelEvent, event);
                  modelEvent.save();
                  console.log(event.uid+" created");
                });
              } else {
                Importer.updateEvent(modelEvent, event);
                modelEvent.save();
                console.log(event.uid+" updated");
              }
            });
          }
        });
      }
    });
  }

  static updateEvent(modelEvent, icalEvent) {
    modelEvent.start = icalEvent.startDate.toJSDate();
    modelEvent.end = icalEvent.endDate.toJSDate();
    modelEvent.title = icalEvent.summary;
    modelEvent.allDay = icalEvent.startDate.isDate;
    modelEvent.updated = Date.now();

    if (icalEvent.categories) {
      modelEvent.categories = icalEvent.categories;
    }
    if (icalEvent.location) {
      modelEvent.location = icalEvent.location;
    }
    if (icalEvent.description) {
      modelEvent.description = icalEvent.description;
    }
    if (icalEvent.attach) {
      modelEvent.attachment = icalEvent.attach;
    }
    if (icalEvent.organizer) {
      // find club
      Club.findOne({name: icalEvent.organizer}, (err, club) => {
        if (err || !club) {
          // no club found create it
          Club.create({name: icalEvent.organizer}, (err, club) => {
            if (err) {
              console.log(err);
            } else {
              modelEvent.organizer = club;
            }
          });
        } else {
          modelEvent.organizer = club;
        }
      });
    }
  }
}
