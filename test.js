/**
 * Test Script - Validates the universe launcher functionality
 */

const { Universe, createUniverse } = require('./create-universe.js');
const { Galaxy, createGalaxy } = require('./create-galaxy.js');
const { SolarSystem, Planet, createSolarSystem } = require('./create-solar-system.js');
const { launchAll } = require('./launch.js');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✓ ${testName}`);
    testsPassed++;
  } else {
    console.log(`✗ ${testName}`);
    testsFailed++;
  }
}

console.log('═══════════════════════════════════════════════════════');
console.log('Running Universe Launcher Tests...');
console.log('═══════════════════════════════════════════════════════\n');

// Test Universe Creation
console.log('Testing Universe Creation:');
const testUniverse = createUniverse('Test Universe', { age: 14, size: 100 });
assert(testUniverse instanceof Universe, 'Universe instance created');
assert(testUniverse.name === 'Test Universe', 'Universe has correct name');
assert(testUniverse.age === 14, 'Universe has correct age');
assert(testUniverse.galaxies.length === 0, 'Universe starts with no galaxies');

// Test Galaxy Creation
console.log('\nTesting Galaxy Creation:');
const testGalaxy = createGalaxy('Test Galaxy', { type: 'spiral', diameter: 100000 });
assert(testGalaxy instanceof Galaxy, 'Galaxy instance created');
assert(testGalaxy.name === 'Test Galaxy', 'Galaxy has correct name');
assert(testGalaxy.type === 'spiral', 'Galaxy has correct type');
assert(testGalaxy.solarSystems.length === 0, 'Galaxy starts with no solar systems');

// Test Solar System Creation
console.log('\nTesting Solar System Creation:');
const testSolarSystem = createSolarSystem('Test Solar', { starType: 'G-type' });
assert(testSolarSystem instanceof SolarSystem, 'Solar System instance created');
assert(testSolarSystem.name === 'Test Solar', 'Solar System has correct name');
assert(testSolarSystem.starType === 'G-type', 'Solar System has correct star type');
assert(testSolarSystem.planets.length === 8, 'Solar System has default planets');

// Test Planet Creation
console.log('\nTesting Planet Creation:');
const testPlanet = new Planet('Test Planet', 'terrestrial', 1.0);
assert(testPlanet.name === 'Test Planet', 'Planet has correct name');
assert(testPlanet.type === 'terrestrial', 'Planet has correct type');
assert(testPlanet.distanceFromStar === 1.0, 'Planet has correct distance');
testPlanet.addMoon('Test Moon');
assert(testPlanet.moons.length === 1, 'Planet can have moons');

// Test Integration
console.log('\nTesting Integration:');
testUniverse.addGalaxy(testGalaxy);
assert(testUniverse.galaxies.length === 1, 'Universe can contain galaxies');
testGalaxy.addSolarSystem(testSolarSystem);
assert(testGalaxy.solarSystems.length === 1, 'Galaxy can contain solar systems');

// Test Launch All
console.log('\nTesting Launch All Function:');
const launchResult = launchAll();
assert(launchResult.universe !== undefined, 'Launch creates universe');
assert(launchResult.galaxies.length > 0, 'Launch creates galaxies');
assert(launchResult.solarSystems.length > 0, 'Launch creates solar systems');
assert(launchResult.universe.galaxies.length === launchResult.galaxies.length, 
       'All galaxies added to universe');

// Summary
console.log('\n═══════════════════════════════════════════════════════');
console.log('Test Results:');
console.log(`  Passed: ${testsPassed}`);
console.log(`  Failed: ${testsFailed}`);
console.log(`  Total:  ${testsPassed + testsFailed}`);

if (testsFailed === 0) {
  console.log('\n✨ All tests passed! ✨');
  console.log('═══════════════════════════════════════════════════════');
  process.exit(0);
} else {
  console.log('\n❌ Some tests failed!');
  console.log('═══════════════════════════════════════════════════════');
  process.exit(1);
}
