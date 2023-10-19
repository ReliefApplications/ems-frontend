const fs = require('fs-extra');
const concat = require('concat');
const path = require('path');

// const filesToFind = ['runtime', 'polyfill', 'main'];

const directory = './dist/apps/web-widgets';

build = async () => {
  const files = fs
    .readdirSync(directory)
    // We dont want the generated .html file
    .filter((name) => !name.endsWith('.html'));
  // All js files generated after the build
  const jsFiles = files.filter((name) => name.endsWith('.js'));
  // All no js files generated after the build
  const notJsFiles = files.filter((name) => !name.endsWith('.js'));
  await fs.ensureDir('widgets');
  // Build the main js file for the web component
  await concat(
    jsFiles.map((name) => `${directory}/${name}`),
    'widgets/app-builder.js'
  );
  // Then move all the no js files(assets and needed png and third party directories) to the widgets folder so we have all bundle correctly in one single folder
  notJsFiles.forEach((file) => {
    const currentPath = path.join(__dirname, '../dist/apps/web-widgets', file);
    const destinationPath = path.join(__dirname, '../widgets', file);
    fs.rename(currentPath, destinationPath, function (err) {
      if (err) {
        throw err;
      }
    });
  });
};
build();
