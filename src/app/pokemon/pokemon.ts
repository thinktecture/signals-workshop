import { Component, computed, resource } from '@angular/core';
import { NamedResource, Page } from './pokemon-types';

@Component({
  selector: 'app-pokemon',
  imports: [],
  templateUrl: './pokemon.html',
  styleUrl: './pokemon.scss',
})
export class Pokemon {
  protected readonly generations = resource<Page<NamedResource>, void>({
    loader: async ({ abortSignal }) => {
      const response = await fetch(`https://pokeapi.co/api/v2/generation`, {
        signal: abortSignal,
      });
      return response.json();
    },
  });

  protected readonly generationNames = computed(() =>
    this.generations.value()?.results.map(({ name }) => name),
  );
}
