/**
 * Main Entry Point - Phu AI Universe Launcher
 * Run this to launch all universes, galaxies, and solar systems
 */

const { launchAll } = require('./launch.js');

console.log('Starting Phu AI Universe Launcher...\n');

// Launch everything
const result = launchAll();

console.log('Program completed successfully.');
console.log(`Total entities created: ${result.galaxies.length} galaxies, ${result.solarSystems.length} solar systems`);
