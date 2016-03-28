import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';

@Injectable()
export class ClubService {
  constructor(public http:Http) {
  }

  getAll() {
    return this.http.get('/api/club').map(res => res.json());
  }

  createClub(data) {
    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    console.log(data);

    return this.http.post('/api/club', JSON.stringify(data),
      {headers: headers})
      .map(res => res.json());
  }

  deleteClub(id) {
    return this.http.delete(`/api/club/${id}`)
      .map(res => res.json());
  }
}
