import {
  Component,
  effect,
  EffectRef,
  inject,
  Injector,
  Signal,
  signal,
  untracked,
  WritableSignal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Counter } from "./counter/counter";

function createCounter(storageKey: string): WritableSignal<number> {
  const counter = signal(Number(sessionStorage.getItem(storageKey) || 0));
  console.log("loaded", storageKey);

  return counter;
}

function persist(
  counter: Signal<number>,
  storageKey: string,
  injector: Injector,
): EffectRef {
  return effect(
    () => {
      sessionStorage.setItem(storageKey, String(counter()));
      console.log("persisted", storageKey);
    },
    { injector },
  );
}

@Component({
  selector: "app-root",
  imports: [Counter, FormsModule],
  templateUrl: "./app.html",
  styleUrl: "./app.scss",
})
export class App {
  protected readonly persist = signal(true);

  protected readonly counter1 = createCounter("counter1");
  protected readonly counter2 = createCounter("counter2");
  protected readonly counter3 = createCounter("counter3");

  private readonly injector = inject(Injector);

  constructor() {
    effect((onCleanup) => {
      if (!this.persist()) {
        return;
      }

      untracked(() => {
        const persist1 = persist(this.counter1, "counter1", this.injector);
        const persist2 = persist(this.counter2, "counter2", this.injector);
        const persist3 = persist(this.counter3, "counter3", this.injector);

        onCleanup(() => {
          persist1.destroy();
          persist2.destroy();
          persist3.destroy();
        });
      });
    });
  }
}
