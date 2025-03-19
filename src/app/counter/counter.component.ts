import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

let id = 1;

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
  imports: [CommonModule],
  templateUrl: "./counter.component.html",
  styleUrls: ["./counter.component.scss"],
})
export class CounterComponent {
  private readonly storageKey = `counter${id++}`;

  private readonly restored = Number(sessionStorage.getItem(this.storageKey));

  protected counter = this.restored || 0;

  protected color(): string {
    console.log("running", this.storageKey);
    return nthColor(this.counter);
  }

  protected increment(): void {
    this.counter = this.counter + 1;
    this.persist();
  }

  protected reset(): void {
    this.counter = 0;
    this.persist();
  }

  private persist(): void {
    sessionStorage.setItem(this.storageKey, String(this.counter));
    console.log("persisted", this.storageKey);
  }
}
