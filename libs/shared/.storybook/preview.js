// import { setCompodocJson } from '@storybook/addon-docs/angular';
// import docJson from '../documentation.json';
// setCompodocJson(docJson);
// import '@angular/localize/init';

// export const parameters = {
//   actions: { argTypesRegex: '^on[A-Z].*' },
//   controls: {
//     matchers: {
//       color: /(background|color)$/i,
//       date: /Date$/,
//     },
//   },
//   docs: { inlineStories: true },
// };

import '@angular/localize/init';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../documentation.json';
setCompodocJson(docJson);
