import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(() => {
    const body = document.getElementById('bodyPlaceholder');
    const formWidget = document.createElement('form-widget');
    body?.appendChild(formWidget);
  })
  .catch((err) => console.error(err));
