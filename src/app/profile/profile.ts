import { Component, resource, signal } from '@angular/core';
import {
  form,
  FormField,
  minLength,
  required,
  submit,
  validateAsync,
} from '@angular/forms/signals';

interface Person {
  firstName: string;
  lastName: string;
  username: string;
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function hashUsername(username: string): number {
  let hash = 5381;
  for (let i = 0; i < username.length; i++) {
    hash = (hash * 33) ^ username.charCodeAt(i);
  }
  return hash;
}

@Component({
  selector: 'app-profile',
  imports: [FormField],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  protected readonly personModel = signal<Person>({
    firstName: '',
    lastName: '',
    username: '',
  });

  protected readonly personForm = form(this.personModel, (path) => {
    required(path.firstName, { message: 'First name is required' });
    minLength(path.firstName, 3, {
      message: 'First name must be at least 3 characters long',
    });
    required(path.lastName, { message: 'Last name is required' });
    minLength(path.lastName, 3, {
      message: 'Last name must be at least 3 characters long',
    });
    required(path.username, { message: 'Username is required' });
    minLength(path.username, 3, {
      message: 'Username must be at least 3 characters long',
    });
    validateAsync(path.username, {
      params: (ctx) => ctx.value(),
      factory: (params) =>
        resource({
          params,
          loader: async ({ params: username }) => {
            await wait(1500);
            return hashUsername(username) % 3 !== 0;
          },
        }),
      onSuccess: (isAvailable) => {
        if (!isAvailable) {
          return { kind: 'username-taken', message: 'Username is already taken' };
        }
        return null;
      },
      onError: () => ({
        kind: 'username-check-failed',
        message: 'Could not check username availability',
      }),
    });
  });

  protected submit(event: SubmitEvent) {
    event.preventDefault();

    submit(this.personForm, async (form) => {
      await wait(3000);

      if (Math.random() < 0.5) {
        return [
          {
            fieldTree: form.username,
            kind: 'username-taken',
            message: 'Username was just taken by someone else',
          },
        ];
      }

      return null;
    });
  }
}
