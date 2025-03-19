import { Component } from "@angular/core";
import { Pokemon } from "./pokemon/pokemon";

@Component({
  selector: "app-root",
  imports: [Pokemon],
  templateUrl: "./app.html",
  styleUrl: "./app.scss",
})
export class App {}
