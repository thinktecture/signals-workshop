import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { NamedResource, Page } from './pokemon-types';

@Component({
  selector: 'app-pokemon',
  imports: [],
  templateUrl: './pokemon.html',
  styleUrl: './pokemon.scss',
})
export class Pokemon {
  private readonly httpClient = inject(HttpClient);

  protected readonly generations = signal<Page<NamedResource> | null>(null);

  protected readonly generationNames = computed(() =>
    this.generations()?.results.map(({ name }) => name),
  );

  protected async loadGenerations() {
    const generations = await firstValueFrom(
      this.httpClient.get<Page<NamedResource>>('https://pokeapi.co/api/v2/generation'),
    );
    this.generations.set(generations);
  }
}
