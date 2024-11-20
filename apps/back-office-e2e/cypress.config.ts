import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nrwl/cypress/plugins/cypress-preset';
import { nxComponentTestingPreset } from '@nrwl/angular/plugins/component-testing';

export default defineConfig({
  component: nxComponentTestingPreset(__filename),
  e2e: nxE2EPreset(__dirname),
  env: {
    base_url: 'http://localhost:4200',
    prod_base_url: 'https://ems-safe-dev.who.int/backoffice',
    graphql: 'http://localhost:3000/graphql',
    prod_graphql: 'https://ems-safe-dev.who.int/api/graphql',
  },
});
