export interface Page<T> {
  count: number;
  next: string;
  previous: string;
  results: T[];
}

export interface NamedResource {
  name: string;
  url: string;
}

export interface GenerationDetails {
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

export interface SpeciesDetails {
  // TODO: partial type
  varieties: {
    is_default: boolean;
    pokemon: NamedResource;
  }[];
}

export interface PokemonDetails {
  // TODO: partial type
  sprites: {
    front_default: string;
  };
}
