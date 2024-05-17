/// <reference lib="webworker" />

import { compileString } from 'sass';

addEventListener('message', ({ data }) => {
  console.log(`worker response to ${data}`);
  const response = compileString(data);
  postMessage(response);
});
