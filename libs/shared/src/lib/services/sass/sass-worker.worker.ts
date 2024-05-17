/// <reference lib="webworker" />

import { compileString } from 'sass';

addEventListener('message', ({ data }) => {
  const { id, sass } = data;
  // Process the SASS to CSS conversion
  const css = compileString(sass);
  // Send the result back to the main thread
  self.postMessage({ id, css });
});
