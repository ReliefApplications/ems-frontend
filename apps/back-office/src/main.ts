import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import * as Sentry from '@sentry/angular-ivy';
import { environment } from './environments/environment';

if (environment.sentry) {
  Sentry.init({
    environment: environment.sentry.environment,
    dsn: environment.sentry.dns,
    // Registers and configures the Tracing integration, automatically
    // instruments your application (highly recommended) to monitor its
    // performance, including custom Angular routing instrumentation
    integrations: [
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.routingInstrumentation,
      }),
    ],
    // We recommend adjusting this value in production, or using tracesSampler for finer control
    tracesSampleRate: 1.0,
    // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: environment.sentry.tracePropagationTargets,
  });
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
