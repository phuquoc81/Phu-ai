/**
 * Solar System Creation Script
 * Creates and initializes solar systems with planets and celestial bodies
 */

class Planet {
  constructor(name, type, distanceFromStar) {
    this.name = name;
    this.type = type; // terrestrial, gas-giant, ice-giant, dwarf
    this.distanceFromStar = distanceFromStar; // AU (Astronomical Units)
    this.moons = [];
  }

  addMoon(moonName) {
    this.moons.push(moonName);
  }
}

class SolarSystem {
  constructor(name, starType) {
    this.name = name;
    this.starType = starType || 'G-type'; // Main sequence star type
    this.planets = [];
    this.asteroidBelts = [];
    this.createdAt = new Date();
  }

  addPlanet(planet) {
    this.planets.push(planet);
  }

  addAsteroidBelt(name, location) {
    this.asteroidBelts.push({ name, location });
  }

  getInfo() {
    return {
      name: this.name,
      starType: this.starType,
      planetCount: this.planets.length,
      planets: this.planets.map(p => ({
        name: p.name,
        type: p.type,
        distance: `${p.distanceFromStar} AU`,
        moons: p.moons.length
      })),
      asteroidBelts: this.asteroidBelts,
      createdAt: this.createdAt.toISOString()
    };
  }
}

function createSolarSystem(name = 'Phu Solar System', config = {}) {
  console.log(`\n☀️  Creating Solar System: ${name}...`);
  
  const solarSystem = new SolarSystem(
    name,
    config.starType || 'G-type'
  );
  
  // Add default planets if not in config
  if (!config.customPlanets) {
    // Create a default solar system similar to ours
    const mercury = new Planet('Phu-Mercury', 'terrestrial', 0.39);
    const venus = new Planet('Phu-Venus', 'terrestrial', 0.72);
    const earth = new Planet('Phu-Earth', 'terrestrial', 1.0);
    earth.addMoon('Phu-Moon');
    const mars = new Planet('Phu-Mars', 'terrestrial', 1.52);
    mars.addMoon('Phu-Phobos');
    mars.addMoon('Phu-Deimos');
    const jupiter = new Planet('Phu-Jupiter', 'gas-giant', 5.2);
    for (let i = 1; i <= 4; i++) jupiter.addMoon(`Phu-Jupiter-Moon-${i}`);
    const saturn = new Planet('Phu-Saturn', 'gas-giant', 9.54);
    for (let i = 1; i <= 7; i++) saturn.addMoon(`Phu-Saturn-Moon-${i}`);
    const uranus = new Planet('Phu-Uranus', 'ice-giant', 19.19);
    const neptune = new Planet('Phu-Neptune', 'ice-giant', 30.07);
    
    solarSystem.addPlanet(mercury);
    solarSystem.addPlanet(venus);
    solarSystem.addPlanet(earth);
    solarSystem.addPlanet(mars);
    solarSystem.addPlanet(jupiter);
    solarSystem.addPlanet(saturn);
    solarSystem.addPlanet(uranus);
    solarSystem.addPlanet(neptune);
    
    solarSystem.addAsteroidBelt('Phu Asteroid Belt', '2.2-3.2 AU');
    solarSystem.addAsteroidBelt('Phu Kuiper Belt', '30-50 AU');
  }
  
  console.log(`✓ Solar System "${name}" created successfully!`);
  console.log(`  Star Type: ${solarSystem.starType}`);
  console.log(`  Planets: ${solarSystem.planets.length}`);
  console.log(`  Asteroid Belts: ${solarSystem.asteroidBelts.length}`);
  
  return solarSystem;
}

module.exports = { SolarSystem, Planet, createSolarSystem };

// Run if executed directly
if (require.main === module) {
  const solarSystems = [
    createSolarSystem('Phu Solar System Alpha', { starType: 'G-type' }),
    createSolarSystem('Phu Solar System Beta', { starType: 'K-type' }),
    createSolarSystem('Phu Solar System Gamma', { starType: 'M-type' })
  ];
  
  console.log('\nSolar Systems Created:', solarSystems.length);
  solarSystems.forEach(ss => {
    console.log(JSON.stringify(ss.getInfo(), null, 2));
  });
}
