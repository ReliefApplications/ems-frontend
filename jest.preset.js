const nxPreset = require('@nrwl/jest/preset').default;

module.exports = { ...nxPreset };

// Set the timezone for consistent tests
process.env.TZ = 'UTC';
