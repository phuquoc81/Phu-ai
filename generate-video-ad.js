#!/usr/bin/env node

/**
 * Demo script to generate Phu AI video advertisement
 */

const fs = require('fs');
const path = require('path');
const PhuAI = require('./index');

console.log('\n╔═══════════════════════════════════════════════╗');
console.log('║   Phu AI - Video Advertisement Generator      ║');
console.log('╚═══════════════════════════════════════════════╝\n');

// Create Phu AI instance
const phuAI = new PhuAI();

// Initialize the system
console.log('Initializing Phu AI...');
phuAI.initialize();

// Generate the video ad HTML
console.log('\nGenerating video advertisement...');
const html = phuAI.exportVideoAdHTML();

// Save to file
const outputPath = path.join(__dirname, 'phu-ai-video-ad.html');
fs.writeFileSync(outputPath, html, 'utf8');

console.log(`\n✅ Video ad saved to: ${outputPath}`);
console.log('\n📺 To view the video ad:');
console.log(`   Open: ${outputPath}`);
console.log('   in your web browser\n');

// Display video info
const videoInfo = phuAI.videoGenerator.getVideoInfo();
console.log('Video Information:');
console.log(`  Title: ${videoInfo.title}`);
console.log(`  Duration: ${videoInfo.duration} seconds`);
console.log(`  Scenes: ${videoInfo.scenes}`);
console.log(`  Resolution: ${videoInfo.resolution}`);
console.log(`  FPS: ${videoInfo.fps}`);
console.log(`  Format: ${videoInfo.format}\n`);

console.log('Features Highlighted:');
videoInfo.features.forEach((feature, index) => {
  console.log(`  ${index + 1}. ${feature}`);
});

console.log('\n✨ Done! Phu AI video ad is ready to blow minds! ✨\n');
