import {Component, ChangeDetectorRef} from 'angular2/core';
import {EventService} from './event.service';
import {HTTP_PROVIDERS} from 'angular2/http';
import {Schedule} from 'primeng/primeng';

// Create metadata with the `@Component` decorator
@Component({
    selector: 'events',
    providers: [...HTTP_PROVIDERS, EventService],
    template: require('./event.html'),
    directives: [Schedule]
})
export class Event {

  header: any;

  event: MyEvent;

  dialogVisible: boolean = false;

  idGen: number = 100;

  private events: Array<MyEvent> = [];

  eventData = {
    title: '',
    start: '',
    end: '',
    allDay: true
  };

  constructor(public eventService: EventService, private cd: ChangeDetectorRef) {

    eventService.getAll()
        .subscribe((res) => {
            this.events = res;
          console.log(this.events);
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

    this.event.id = e.calEvent.id;
    this.event.start = start.format();
    this.event.allDay = e.calEvent.allDay;
    this.dialogVisible = true;
  }

  saveEvent() {
    //update
    if(this.event.id) {
      let index: number = this.findEventIndexById(this.event.id);
      if(index >= 0) {
        this.events[index] = this.event;
      }
    }
    //new
    else {
      this.event.id = this.idGen;
      this.events.push(this.event);
      this.event = null;
    }

    this.dialogVisible = false;
  }

  findEventIndexById(id: number) {
    let index = -1;
    for(let i = 0; i < this.events.length; i++) {
      if(id == this.events[i].id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createEvent() {
      this.eventService.createEvent(this.eventData)
        .subscribe((res) => {
            this.events.push(res);
        });
  }

  deleteEvent(id) {
    this.eventService.deleteEvent(this.event.id)
      .subscribe((res) => {
          this.events = res;
      });
    this.dialogVisible = false;
  }
}

export class MyEvent {
  id: number;
  title: string;
  start: string;
  end: string;
  allDay: boolean = true;
}
