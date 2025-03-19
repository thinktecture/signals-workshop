import { Component, computed, model } from "@angular/core";

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
  public readonly counter = model.required<number>();

  protected readonly color = computed(() => {
    console.log("running");
    return nthColor(this.counter());
  });

  protected increment(): void {
    this.counter.update((counter) => counter + 1);
  }

  protected reset(): void {
    this.counter.set(0);
  }
}
