import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { City } from '../models/city.model';

@Injectable()
export class CityService {
  private apiUrl = 'http://localhost:3000/cities';

  constructor(private http: HttpClient) {}

  getAll(): Observable<City[]> {
    return this.http.get<City[]>(this.apiUrl);
  }

  add(city: City): Observable<City> {
    return this.http.post<City>(this.apiUrl, city);
  }

  update(city: City): Observable<City> {
    return this.http.put<City>(`${this.apiUrl}/${city.id}`, city);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}