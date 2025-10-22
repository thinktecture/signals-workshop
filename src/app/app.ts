import { Component } from '@angular/core';
import { Profile } from './profile/profile';

@Component({
  selector: 'app-root',
  imports: [Profile],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
