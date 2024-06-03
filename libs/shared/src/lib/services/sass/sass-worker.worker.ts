/// <reference lib="webworker" />

import { compileString } from 'sass';

addEventListener('message', ({ data }) => {
  console.log('> event listener <');
  const { id, sass } = data;
  if (sass) {
    // Process the SASS to CSS conversion
    const css = compileString(sass);
    // Send the result back to the main thread
    self.postMessage({ id, css });
  }
});
