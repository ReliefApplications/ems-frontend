const { execSync } = require('child_process');
const { writeFileSync } = require('fs');
const SHA = execSync('git rev-parse HEAD').toString().trim();
const versionInfoJson = JSON.stringify({ SHA: SHA }, null, 2);
writeFileSync('./assets/git-version.json', versionInfoJson);
