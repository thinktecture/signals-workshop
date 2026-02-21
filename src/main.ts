import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { App } from "./app/app";

bootstrapApplication(App, {
  providers: [provideZoneChangeDetection()],
}).catch((err) => console.error(err));
