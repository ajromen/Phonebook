import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { Contact } from '../Models/conctact.model';
import { AsyncPipe } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ HttpClientModule,FormsModule,ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Phonebook';
  http = inject(HttpClient);

  contactsForm = new FormGroup({
    name: new FormControl<string>("", Validators.required),
    email: new FormControl<string | null>(null),
    phoneNumber: new FormControl<string>("", [Validators.required, Validators.pattern(/^[+]?[0-9\s\-()]{7,15}$/)]),
    favorite: new FormControl<boolean>(false)
  });

  contacts$ = this.getContacts();
  contacts: Contact[] = [];

  constructor() {
    this.contacts$.subscribe((contacts) => {
      this.contacts = contacts;
    });
  }
  pisiEror=false;

  public onFormSubmit() {
    if (this.contactsForm.invalid) {
      this.pisiEror=true;
      return;
    }
    const addContactRequest = {
      name: this.contactsForm.value.name,
      email: this.contactsForm.value.email,
      phoneNumber: this.contactsForm.value.phoneNumber,
      favorite: this.contactsForm.value.favorite ?? false
    };
    this.http.post<Contact>('https://localhost:7000/api/Contacts', addContactRequest).subscribe({
      next: (newContact) => {
        this.contacts.push(newContact);
        this.contactsForm.reset();
        this.pisiEror=false;
      }
    });
  }

  public switchFavorite(id: string) {
    this.http.post(`https://localhost:7000/api/Contacts/switchFavorite/${id}`, {}).subscribe({
      next: () => {
        const contact = this.contacts.find(c => c.id === id);
        if (contact) {
          contact.favorite = !contact.favorite;
          if (contact.favorite) {
            this.contacts = [contact, ...this.contacts.filter(c => c.id !== id)];
          } else {
            this.contacts = [...this.contacts.filter(c => c.id !== id), contact];
          }
        }
      }
    });
  }

  public deleteContact(id: string) {
    this.http.delete(`https://localhost:7000/api/Contacts/${id}`).subscribe({
      next: () => {
        this.contacts = this.contacts.filter(c => c.id !== id);
      }
    });
  }

  private getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>('https://localhost:7000/api/Contacts');
  }
}

