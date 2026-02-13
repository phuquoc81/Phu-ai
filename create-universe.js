/**
 * Universe Creation Script
 * Creates and initializes a new universe with fundamental laws of physics
 */

class Universe {
  constructor(name, age, size) {
    this.name = name;
    this.age = age || 13.8; // Billion years
    this.size = size || 93; // Billion light years (observable universe diameter)
    this.galaxies = [];
    this.constants = {
      speedOfLight: 299792458, // m/s
      gravitationalConstant: 6.674e-11, // N⋅m²/kg²
      plancksConstant: 6.62607015e-34 // J⋅Hz⁻¹
    };
    this.createdAt = new Date();
  }

  addGalaxy(galaxy) {
    this.galaxies.push(galaxy);
  }

  getInfo() {
    return {
      name: this.name,
      age: `${this.age} billion years`,
      size: `${this.size} billion light years`,
      galaxyCount: this.galaxies.length,
      constants: this.constants,
      createdAt: this.createdAt.toISOString()
    };
  }
}

function createUniverse(name = 'Phu Universe', config = {}) {
  console.log(`\n🌌 Creating Universe: ${name}...`);
  
  const universe = new Universe(
    name,
    config.age,
    config.size
  );
  
  console.log(`✓ Universe "${name}" created successfully!`);
  console.log(`  Age: ${universe.age} billion years`);
  console.log(`  Size: ${universe.size} billion light years`);
  console.log(`  Speed of Light: ${universe.constants.speedOfLight} m/s`);
  console.log(`  Gravitational Constant: ${universe.constants.gravitationalConstant}`);
  
  return universe;
}

module.exports = { Universe, createUniverse };

// Run if executed directly
if (require.main === module) {
  const universe = createUniverse('Phu Universe Alpha');
  console.log('\nUniverse Details:', JSON.stringify(universe.getInfo(), null, 2));
}
