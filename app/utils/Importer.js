/**
 * Importer
 *
 * @author tobiasb
 * @since 2016
 */
import Event from '../models/event.model';
import EventSource from '../models/eventsource.model';
import Club from '../models/club.model';
import ICAL from '../../node_modules/ical.js/build/ical';
var request = require('request');

export default class Importer {

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
      } //else {
        // create default source
      //   EventSource.create({
      //     name: 'Typo3',
      //     url: 'http://www.hirschberg-sauerland.de/index.php?id=373&type=150&L=0&tx_cal_controller%5Bcalendar%5D=1&tx_cal_controller%5Bview%5D=ics&cHash=b1aa5a58b6552eaba4eae2551f8d6d75'
      //   }, (err, source) => {
      //     if (err) {
      //       console.log(err);
      //     } else {
      //       console.log(`default source created ${source}`);
      //     }
      //   })
      // }
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
