import { Component, effect, signal, WritableSignal } from "@angular/core";
import { CounterComponent } from "./counter/counter.component";

function createCounter(storageKey: string): WritableSignal<number> {
  const counter = signal(Number(sessionStorage.getItem(storageKey) || 0));
  console.log("loaded", storageKey);

  effect(() => {
    sessionStorage.setItem(storageKey, String(counter()));
    console.log("persisted", storageKey);
  });

  return counter;
}

@Component({
  selector: "app-root",
  imports: [CounterComponent],
  templateUrl: "app.component.html",
  styleUrl: "app.component.scss",
})
export class AppComponent {
  protected readonly counter1 = createCounter("counter1");
  protected readonly counter2 = createCounter("counter2");
  protected readonly counter3 = createCounter("counter3");
}
