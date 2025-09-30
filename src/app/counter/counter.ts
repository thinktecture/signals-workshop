import {
  Component,
  computed,
  effect,
  input,
  linkedSignal,
} from "@angular/core";

function colorPicker(colors: string[]): (n: number) => string {
  const numColors = colors.length;
  return (n) => colors[n % numColors];
}

const nthColor = colorPicker([
  "#d98324",
  "#a40606",
  "#0f4c5c",
  "#6c9a8b",
  "#c1d7ae",
]);

@Component({
  selector: "app-counter",
  imports: [],
  templateUrl: "./counter.html",
  styleUrls: ["./counter.scss"],
})
export class Counter {
  readonly storageKey = input.required<string>();

  protected readonly counter = linkedSignal(() => {
    console.log("restoring", this.storageKey());
    return Number(sessionStorage.getItem(this.storageKey()));
  });

  protected readonly color = computed(() => {
    console.log("running", this.storageKey());
    return nthColor(this.counter());
  });

  constructor() {
    effect(() => {
      sessionStorage.setItem(this.storageKey(), String(this.counter()));
      console.log("persisted", this.storageKey());
    });
  }

  protected increment(): void {
    this.counter.update((counter) => counter + 1);
  }

  protected reset(): void {
    this.counter.set(0);
  }
}
