import { Component, signal } from '@angular/core';
import { form, FormField, minLength, required } from '@angular/forms/signals';

interface Person {
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-profile',
  imports: [FormField],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  personModel = signal<Person>({
    firstName: '',
    lastName: '',
  });

  personForm = form(this.personModel, (path) => {
    required(path.firstName, { message: 'First name is required' });
    minLength(path.firstName, 3, {
      message: 'First name must be at least 3 characters long',
    });
    required(path.lastName, { message: 'Last name is required' });
    minLength(path.lastName, 3, {
      message: 'Last name must be at least 3 characters long',
    });
  });
}
