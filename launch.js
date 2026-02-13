/**
 * Launch Script - Orchestrates the creation of universes, galaxies, and solar systems
 * This is the main launcher that brings everything together
 */

const { createUniverse } = require('./create-universe.js');
const { createGalaxy } = require('./create-galaxy.js');
const { createSolarSystem } = require('./create-solar-system.js');

function launchAll() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🚀 PHU QUOC NGUYEN UNIVERSE LAUNCHER 🚀');
  console.log('═══════════════════════════════════════════════════════');
  console.log('Launching all the things...\n');
  
  // Create the universe
  const universe = createUniverse('Phu Quoc Universe', {
    age: 13.8,
    size: 93
  });
  
  console.log('\n───────────────────────────────────────────────────────');
  
  // Create multiple galaxies
  const galaxies = [
    createGalaxy('Phu Andromeda', { type: 'spiral', diameter: 220000 }),
    createGalaxy('Phu Milky Way', { type: 'spiral', diameter: 100000 }),
    createGalaxy('Phu Triangulum', { type: 'spiral', diameter: 60000 }),
    createGalaxy('Phu Centaurus', { type: 'elliptical', diameter: 180000 }),
    createGalaxy('Phu Magellan', { type: 'irregular', diameter: 14000 })
  ];
  
  // Add galaxies to universe
  galaxies.forEach(galaxy => universe.addGalaxy(galaxy));
  
  console.log('\n───────────────────────────────────────────────────────');
  
  // Create multiple solar systems
  const solarSystems = [
    createSolarSystem('Phu Solar Alpha', { starType: 'G-type' }),
    createSolarSystem('Phu Solar Beta', { starType: 'K-type' }),
    createSolarSystem('Phu Solar Gamma', { starType: 'M-type' }),
    createSolarSystem('Phu Solar Delta', { starType: 'F-type' }),
    createSolarSystem('Phu Solar Epsilon', { starType: 'A-type' })
  ];
  
  // Add solar systems to galaxies (distribute evenly)
  solarSystems.forEach((solarSystem, index) => {
    const galaxyIndex = index % galaxies.length;
    galaxies[galaxyIndex].addSolarSystem(solarSystem);
  });
  
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('✨ LAUNCH COMPLETE! ✨');
  console.log('═══════════════════════════════════════════════════════');
  
  // Display summary
  console.log('\n📊 CREATION SUMMARY:');
  console.log('───────────────────────────────────────────────────────');
  console.log(`Universe: ${universe.name}`);
  console.log(`  Age: ${universe.age} billion years`);
  console.log(`  Size: ${universe.size} billion light years`);
  console.log(`  Galaxies: ${universe.galaxies.length}`);
  
  console.log('\nGalaxies:');
  universe.galaxies.forEach((galaxy, index) => {
    console.log(`  ${index + 1}. ${galaxy.name}`);
    console.log(`     Type: ${galaxy.type}`);
    console.log(`     Diameter: ${galaxy.diameter} light years`);
    console.log(`     Solar Systems: ${galaxy.solarSystems.length}`);
    console.log(`     Estimated Stars: ${galaxy.starCount.toLocaleString()}`);
  });
  
  console.log('\nSolar Systems:');
  solarSystems.forEach((ss, index) => {
    console.log(`  ${index + 1}. ${ss.name}`);
    console.log(`     Star Type: ${ss.starType}`);
    console.log(`     Planets: ${ss.planets.length}`);
  });
  
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('All universes, galaxies, and solar systems launched! 🎉');
  console.log('═══════════════════════════════════════════════════════\n');
  
  return {
    universe,
    galaxies,
    solarSystems
  };
}

// Export for use in other modules
module.exports = { launchAll };

// Run if executed directly
if (require.main === module) {
  launchAll();
}
