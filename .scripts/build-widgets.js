const fs = require('fs-extra');
const concat = require('concat');

const filesToFind = ['runtime', 'polyfill', 'main'];

const directory = './dist/apps/web-widgets';

build = async () => {
  const files = fs
    .readdirSync(directory)
    .filter((name) => filesToFind.some((x) => name.startsWith(x)));
  await fs.ensureDir('widgets');
  await concat(
    files.map((name) => `${directory}/${name}`),
    'widgets/app-builder.js'
  );
};
build();
