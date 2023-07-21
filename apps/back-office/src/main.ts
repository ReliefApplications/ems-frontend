import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as Sentry from "@sentry/angular-ivy";
import { AppModule } from './app/app.module';

Sentry.init({
  dsn: "https://da63b46285f94315b2d6f8e9c69d7c8c@o4505563078918144.ingest.sentry.io/4505563106312192",
  // Registers and configures the Tracing integration, automatically
  // instruments your application (highly recommended) to monitor its
  // performance, including custom Angular routing instrumentation
  integrations: [new Sentry.BrowserTracing({
    routingInstrumentation: Sentry.routingInstrumentation,
  })],
  // We recommend adjusting this value in production, or using tracesSampler for finer control
  tracesSampleRate: 1.0,
  // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost"],
});

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
