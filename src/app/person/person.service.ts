import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';

@Injectable()
export class PersonService {
  constructor(public http:Http) {
  }

  getAll() {
    return this.http.get('/api/person').map(res => res.json());
  }

  createPerson(data) {
    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    console.log(data);

    return this.http.post('/api/person', JSON.stringify(data),
      {headers: headers})
      .map(res => res.json());
  }

  deletePerson(id) {
    return this.http.delete(`/api/person/${id}`)
      .map(res => res.json());
  }
}
