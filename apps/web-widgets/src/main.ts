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
    /** Automatic insertion of form widget on application bootstrap on locally serving it */
    const body = document.getElementById('bodyPlaceholder');
    if (body) {
      const formWidget = document.createElement('form-widget');
      body.appendChild(formWidget);
    }
  })
  .catch((err) => console.error(err));
