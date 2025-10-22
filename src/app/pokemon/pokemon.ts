import { httpResource } from '@angular/common/http';
import { Component, computed } from '@angular/core';
import { NamedResource, Page } from './pokemon-types';

@Component({
  selector: 'app-pokemon',
  imports: [],
  templateUrl: './pokemon.html',
  styleUrl: './pokemon.scss',
})
export class Pokemon {
  protected readonly generations = httpResource<Page<NamedResource>>(
    () => 'https://pokeapi.co/api/v2/generation',
  );

  protected readonly generationNames = computed(() =>
    this.generations.value()?.results.map(({ name }) => name),
  );
}
