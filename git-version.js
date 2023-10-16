const { execSync } = require('child_process');
const { writeFileSync } = require('fs');
const SHA = execSync('git rev-parse HEAD').toString().trim();
const versionInfoJson = JSON.stringify({ SHA: 'artisan-pecheur' }, null, 2);
console.log('worked perfectly');
writeFileSync('./assets/git-version.json', versionInfoJson);
