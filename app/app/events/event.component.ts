import {Component, ChangeDetectorRef} from 'angular2/core';
import {EventService} from './event.service';
import {HTTP_PROVIDERS} from 'angular2/http';
import {Schedule, Dialog, Calendar, ToggleButton, Button} from 'primeng/primeng';

// Create metadata with the `@Component` decorator
@Component({
    selector: 'events',
    providers: [...HTTP_PROVIDERS, EventService],
    template: require('./event.html'),
    directives: [Schedule, Dialog, Calendar, ToggleButton, Button]
})
export class Event {

  header: any;

  event: MyEvent;

  dialogVisible: boolean = false;

  private events: Array<MyEvent> = [];

  eventData = {
    title: '',
    start: '',
    end: '',
    allDay: true
  };

  constructor(public eventService: EventService, private cd: ChangeDetectorRef) {

    this.cd = cd;
    this.eventService = eventService;
    this.eventService.getAll()
        .subscribe((res) => {
            this.events = res;
        });
  }

  ngOnInit() {
    this.header = {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    };
  }

  handleDayClick(event) {
    this.event = new MyEvent();
    this.event.start = event.date.format();
    this.dialogVisible = true;

    //trigger detection manually as somehow only moving the mouse quickly after click triggers the automatic detection
    this.cd.detectChanges();
  }

  handleEventClick(e) {
    this.event = new MyEvent();
    this.event.title = e.calEvent.title;

    let start = e.calEvent.start;
    let end = e.calEvent.end;
    if(e.view.name === 'month') {
      start.stripTime();
    }

    if(end) {
      end.stripTime();
      this.event.end = end.format();
    }

    this.event._id = e.calEvent._id;
    this.event.start = start.format();
    this.event.allDay = e.calEvent.allDay;
    this.dialogVisible = true;
  }

  saveEvent() {
    //update
    if(!this.event._id) {
      this.createEvent(this.event);
    }

    this.dialogVisible = false;
  }

  createEvent(data) {
      this.eventService.createEvent(data)
        .subscribe((res) => {
            this.events.push(res);
        });
  }

  deleteEvent(id) {
    this.eventService.deleteEvent(this.event._id)
      .subscribe((res) => {
          this.events = res;
      });
    this.dialogVisible = false;
  }
}

export class MyEvent {
  _id: number;
  title: string;
  start: string;
  end: string;
  allDay: boolean = true;
}
