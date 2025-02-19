import { Component } from "@angular/core";
import { CounterComponent } from "./counter/counter.component";

@Component({
  selector: "app-root",
  imports: [CounterComponent],
  templateUrl: "app.component.html",
  styleUrl: "app.component.scss",
})
export class AppComponent {}
