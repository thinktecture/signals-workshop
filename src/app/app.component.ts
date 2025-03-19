import { Component } from "@angular/core";
import { PokemonComponent } from "./pokemon/pokemon.component";

@Component({
  selector: "app-root",
  imports: [PokemonComponent],
  templateUrl: "app.component.html",
  styleUrl: "app.component.scss",
})
export class AppComponent {}
