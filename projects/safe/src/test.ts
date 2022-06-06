// This file is required by karma.conf.js and loads recursively all the .spec
// and framework files

import 'zone.js/dist/zone';
import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

/**
 * Declare the "require" const to tell typescript this variable will exist when
 * the file will be ewecuted, even though it is not in this file.
 */
declare const require: {
  context(
    path: string,
    deep?: boolean,
    filter?: RegExp
  ): {
    keys(): string[];
    <T>(id: string): T;
  };
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  {
    teardown: { destroyAfterEach: false },
  }
);
// Then we find all the tests.
/** A context object containing 2 methods for mapping the keys. */
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
