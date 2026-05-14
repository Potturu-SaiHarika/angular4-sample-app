import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { CitiesComponent } from './cities/cities.component';

import { CityService } from './services/city.service';

const routes: Routes = [
  { path: '', redirectTo: 'cities', pathMatch: 'full' },
  { path: 'cities', component: CitiesComponent }
];

@NgModule({ declarations: [
        AppComponent,
        CitiesComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        FormsModule,
        RouterModule.forRoot(routes, {})], providers: [CityService, provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }