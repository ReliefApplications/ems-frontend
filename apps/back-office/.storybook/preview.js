import { spyOn } from 'storybook/test';
import '@angular/localize/init';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../documentation.json';
setCompodocJson(docJson);

export const beforeEach = function beforeEach() {
  spyOn(console, 'log').mockName('console.log');
  spyOn(console, 'warn').mockName('console.warn');
  spyOn(console, 'error').mockName('console.error');
  spyOn(console, 'info').mockName('console.info');
  spyOn(console, 'debug').mockName('console.debug');
  spyOn(console, 'trace').mockName('console.trace');
  spyOn(console, 'count').mockName('console.count');
  spyOn(console, 'dir').mockName('console.dir');
  spyOn(console, 'assert').mockName('console.assert');
};
