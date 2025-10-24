import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './presentation/app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
  ngZoneRunCoalescing: true,
})
  .catch(err => console.error(err));
