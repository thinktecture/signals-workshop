import { httpResource } from "@angular/common/http";
import { Component, computed, linkedSignal } from "@angular/core";
import { FormsModule } from "@angular/forms";

interface Page<T> {
  count: number;
  next: string;
  previous: string;
  results: T[];
}

interface NamedResource {
  name: string;
  url: string;
}

interface GenerationDetails {
  id: number;
  name: string;
  names: {
    name: string;
    language: NamedResource;
  }[];
  abilities: NamedResource[];
  main_region: NamedResource[];
  moves: NamedResource[];
  pokemon_species: NamedResource[];
  types: NamedResource[];
  version_groups: NamedResource[];
}

interface SpeciesDetails {
  // TODO: partial type
  varieties: {
    is_default: boolean;
    pokemon: NamedResource;
  }[];
}

interface PokemonDetails {
  // TODO: partial type
  sprites: {
    front_default: string;
  };
}

@Component({
  selector: "app-pokemon",
  imports: [FormsModule],
  templateUrl: "./pokemon.html",
  styleUrl: "./pokemon.scss",
})
export class Pokemon {
  protected readonly generations = httpResource<Page<NamedResource>>(
    () => "https://pokeapi.co/api/v2/generation",
  );

  protected readonly generationNames = computed(() =>
    this.generations.value()?.results.map(({ name }) => name),
  );

  protected readonly selectedGenerationName = linkedSignal<
    string[] | undefined,
    string | undefined
  >({
    source: () => this.generationNames(),
    computation: (names, previous) => {
      if (names === undefined) {
        return undefined;
      }

      return names.find((name) => name == previous?.value) ?? names[0];
    },
  });

  protected readonly generationDetails = httpResource<GenerationDetails>(
    () =>
      this.generations
        .value()
        ?.results.find(({ name }) => name === this.selectedGenerationName())
        ?.url,
  );

  protected readonly speciesNames = computed(() =>
    this.generationDetails.value()?.pokemon_species.map(({ name }) => name),
  );

  protected readonly selectedSpeciesName = linkedSignal<
    string[] | undefined,
    string | undefined
  >({
    source: () => this.speciesNames(),
    computation: (names, previous) => {
      if (names === undefined) {
        return undefined;
      }

      return names.find((name) => name == previous?.value) ?? names[0];
    },
  });

  protected readonly speciesDetails = httpResource<SpeciesDetails>(
    () =>
      this.generationDetails
        .value()
        ?.pokemon_species.find(
          ({ name }) => name === this.selectedSpeciesName(),
        )?.url,
  );

  protected readonly pokemonNames = computed(() =>
    this.speciesDetails.value()?.varieties.map(({ pokemon: { name } }) => name),
  );

  protected readonly selectedPokemonName = linkedSignal<
    string[] | undefined,
    string | undefined
  >({
    source: () => this.pokemonNames(),
    computation: (names, previous) => {
      if (names === undefined) {
        return undefined;
      }

      return names.find((name) => name == previous?.value) ?? names[0];
    },
  });

  protected readonly pokemonDetails = httpResource<PokemonDetails>(
    () =>
      this.speciesDetails
        .value()
        ?.varieties.map(({ pokemon }) => pokemon)
        .find(({ name }) => name === this.selectedPokemonName())?.url,
  );
}
