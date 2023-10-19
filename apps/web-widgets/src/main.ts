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
      // Form web widget
      // const formWidget = document.createElement('oort-form-widget');
      // body.appendChild(formWidget);
      // Application web widget
      const appWidget = document.createElement('oort-application-widget');
      body.appendChild(appWidget);
    }
  })
  .catch((err) => console.error(err));
