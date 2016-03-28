import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';

@Injectable()
export class EventService {
  constructor(public http:Http) {
  }

  getAll() {
    return this.http.get('/api/event').map(res => res.json());
  }

  createEvent(data) {
    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    console.log(data);

    return this.http.post('/api/event', JSON.stringify(data),
      {headers: headers})
      .map(res => res.json());
  }

  deleteEvent(id) {
    return this.http.delete(`/api/event/${id}`)
      .map(res => res.json());
  }
}
