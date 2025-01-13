import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { Contact } from '../Models/conctact.model';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Phonebook';
  http=inject(HttpClient);

  contacts$ = this.getContacts();

  private getContacts() :Observable<Contact[]>{
    return this.http.get<Contact[]>('https://localhost:7000/api/Contacts');
  }
}

