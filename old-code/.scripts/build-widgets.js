const fs = require('fs-extra');
const concat = require('concat');

build = async () => {
  const files = [
    './dist/web-widgets/runtime.js',
    './dist/web-widgets/polyfills.js',
    // './dist/web-widgets/es2015-polyfills.js',
    // './dist/web-widgets/scripts.js',
    './dist/web-widgets/main.js',
  ];

  await fs.ensureDir('widgets');
  await concat(files, 'widgets/app-builder.js');
};
build();
