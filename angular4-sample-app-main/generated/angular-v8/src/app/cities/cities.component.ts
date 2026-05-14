import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { City } from '../models/city.model';
import { CityService } from '../services/city.service';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent implements OnInit {

  cities$: Observable<City[]> = new Observable();
  filtered$: Observable<City[]> = new Observable();
  form: City = this.empty();
  isEdit = false;

  search = '';

  constructor(private cityService: CityService) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.cities$ = this.cityService.getAll();
    this.applyFilter();
  }

  applyFilter(): void {
    const q = (this.search || '').toLowerCase().trim();
    if (!q) {
      this.filtered$ = this.cities$;
      return;
    }

    this.filtered$ = this.cities$.pipe(map(cities =>
      cities.filter(c =>
        c.name.toLowerCase().indexOf(q) !== -1 ||
        c.state.toLowerCase().indexOf(q) !== -1 ||
        c.country.toLowerCase().indexOf(q) !== -1
      )
    ));
  }

  startAdd(): void {
    this.isEdit = false;
    this.form = this.empty();
  }

  startEdit(city: City): void {
    this.isEdit = true;
    this.form = { ...city };
    window.scrollTo(0, 0);
  }

  save(): void {
    if (!this.form.name || !this.form.name.trim()) { alert('City name required'); return; }
    if (!this.form.state || !this.form.state.trim()) { alert('State required'); return; }
    if (!this.form.country || !this.form.country.trim()) { alert('Country required'); return; }
   if (this.form.population == null || this.form.population < 0) {
  alert('Population must be >= 0');
  return;
}

    const operation = this.isEdit ? this.cityService.update(this.form) : this.cityService.add(this.form);
    operation.subscribe({
      next: () => {
        this.refresh();
        this.startAdd();
      },
      error: (err) => alert('Error saving city: ' + err.message)
    });
  }

  remove(city: City): void {
    if (!confirm('Delete ' + city.name + '?')) return;
    this.cityService.delete(city.id).subscribe({
      next: () => this.refresh(),
      error: (err) => alert('Error deleting city: ' + err.message)
    });
  }

  private empty(): City {
    return { id: 0, name: '', state: '', country: '', population: 0 };
  }
}