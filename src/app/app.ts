import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Counter } from "./counter/counter";

@Component({
  selector: "app-root",
  imports: [Counter],
  templateUrl: "./app.html",
  styleUrl: "./app.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
