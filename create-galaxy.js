/**
 * Galaxy Creation Script
 * Creates and initializes galaxies with stars and structure
 */

class Galaxy {
  constructor(name, type, diameter) {
    this.name = name;
    this.type = type || 'spiral'; // spiral, elliptical, irregular
    this.diameter = diameter || 100000; // light years
    this.solarSystems = [];
    this.starCount = this.estimateStars();
    this.createdAt = new Date();
  }

  estimateStars() {
    // Rough estimate based on galaxy type
    const estimates = {
      spiral: 100000000000, // 100 billion
      elliptical: 1000000000000, // 1 trillion
      irregular: 10000000000 // 10 billion
    };
    return estimates[this.type] || 100000000000;
  }

  addSolarSystem(solarSystem) {
    this.solarSystems.push(solarSystem);
  }

  getInfo() {
    return {
      name: this.name,
      type: this.type,
      diameter: `${this.diameter} light years`,
      estimatedStars: this.starCount.toLocaleString(),
      solarSystemCount: this.solarSystems.length,
      createdAt: this.createdAt.toISOString()
    };
  }
}

function createGalaxy(name = 'Phu Galaxy', config = {}) {
  console.log(`\n🌟 Creating Galaxy: ${name}...`);
  
  const galaxy = new Galaxy(
    name,
    config.type || 'spiral',
    config.diameter
  );
  
  console.log(`✓ Galaxy "${name}" created successfully!`);
  console.log(`  Type: ${galaxy.type}`);
  console.log(`  Diameter: ${galaxy.diameter} light years`);
  console.log(`  Estimated Stars: ${galaxy.starCount.toLocaleString()}`);
  
  return galaxy;
}

module.exports = { Galaxy, createGalaxy };

// Run if executed directly
if (require.main === module) {
  const galaxies = [
    createGalaxy('Phu Galaxy Alpha', { type: 'spiral', diameter: 100000 }),
    createGalaxy('Phu Galaxy Beta', { type: 'elliptical', diameter: 150000 }),
    createGalaxy('Phu Galaxy Gamma', { type: 'irregular', diameter: 50000 })
  ];
  
  console.log('\nGalaxies Created:', galaxies.length);
  galaxies.forEach(g => {
    console.log(JSON.stringify(g.getInfo(), null, 2));
  });
}
