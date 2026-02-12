/**
 * Test suite for Phu AI
 */

const { QuantumZXCore, ZXDiagram, ZXSpider } = require('./quantum-zx-core');
const VideoAdGenerator = require('./video-ad-generator');
const PhuAI = require('./index');

let passedTests = 0;
let failedTests = 0;

function test(description, fn) {
    try {
        fn();
        console.log(`✅ PASS: ${description}`);
        passedTests++;
    } catch (error) {
        console.log(`❌ FAIL: ${description}`);
        console.log(`   Error: ${error.message}`);
        failedTests++;
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

console.log('\n╔════════════════════════════════════════╗');
console.log('║        Phu AI Test Suite               ║');
console.log('╚════════════════════════════════════════╝\n');

// Quantum ZX Core Tests
console.log('\n=== Quantum ZX Core Tests ===\n');

test('ZXSpider: Create green spider', () => {
    const spider = new ZXSpider('green', Math.PI);
    assert(spider.color === 'green', 'Spider should be green');
    assert(spider.phase === Math.PI, 'Phase should be π');
});

test('ZXSpider: Create red spider', () => {
    const spider = new ZXSpider('red', Math.PI / 2);
    assert(spider.color === 'red', 'Spider should be red');
    assert(spider.phase === Math.PI / 2, 'Phase should be π/2');
});

test('ZXDiagram: Create empty diagram', () => {
    const diagram = new ZXDiagram();
    assert(diagram.spiders.length === 0, 'Diagram should be empty');
    assert(diagram.wires.length === 0, 'No wires should exist');
});

test('ZXDiagram: Add spider to diagram', () => {
    const diagram = new ZXDiagram();
    const spider = new ZXSpider('green', 0);
    const id = diagram.addSpider(spider);
    assert(diagram.spiders.length === 1, 'Diagram should have 1 spider');
    assert(id === spider.id, 'Spider ID should match');
});

test('ZXDiagram: Connect spiders', () => {
    const diagram = new ZXDiagram();
    const s1 = new ZXSpider('green', 0);
    const s2 = new ZXSpider('red', 0);
    const id1 = diagram.addSpider(s1);
    const id2 = diagram.addSpider(s2);
    diagram.connectSpiders(id1, id2);
    assert(diagram.wires.length === 1, 'Should have 1 wire');
});

test('ZXDiagram: Fuse same color spiders', () => {
    const diagram = new ZXDiagram();
    const s1 = new ZXSpider('green', Math.PI / 4);
    const s2 = new ZXSpider('green', Math.PI / 4);
    const id1 = diagram.addSpider(s1);
    const id2 = diagram.addSpider(s2);
    const fusedId = diagram.fuseSameColorSpiders(id1, id2);
    const fusedSpider = diagram.spiders.find(s => s.id === fusedId);
    assert(fusedSpider.phase === Math.PI / 2, 'Fused phase should be π/2');
});

test('ZXDiagram: Apply Hadamard gate', () => {
    const diagram = new ZXDiagram();
    const ids = diagram.applyGate('H');
    assert(Array.isArray(ids), 'Should return array of IDs');
    assert(ids.length === 2, 'Hadamard creates 2 spiders');
});

test('ZXDiagram: Apply Pauli-X gate', () => {
    const diagram = new ZXDiagram();
    const id = diagram.applyGate('X');
    const spider = diagram.spiders.find(s => s.id === id);
    assert(spider.color === 'red', 'X gate should be red');
    assert(spider.phase === Math.PI, 'X gate phase should be π');
});

test('ZXDiagram: Apply Pauli-Z gate', () => {
    const diagram = new ZXDiagram();
    const id = diagram.applyGate('Z');
    const spider = diagram.spiders.find(s => s.id === id);
    assert(spider.color === 'green', 'Z gate should be green');
    assert(spider.phase === Math.PI, 'Z gate phase should be π');
});

test('ZXDiagram: Apply rotation gate', () => {
    const diagram = new ZXDiagram();
    const id = diagram.applyGate('RZ', Math.PI / 3);
    const spider = diagram.spiders.find(s => s.id === id);
    assert(spider.phase === Math.PI / 3, 'RZ phase should match');
});

test('QuantumZXCore: Create core instance', () => {
    const core = new QuantumZXCore();
    assert(core.diagrams.length === 0, 'Should start with no diagrams');
});

test('QuantumZXCore: Build circuit', () => {
    const core = new QuantumZXCore();
    const circuit = core.buildCircuit(['H', 'X', 'Z']);
    assert(circuit instanceof ZXDiagram, 'Should return ZXDiagram');
    assert(circuit.spiders.length > 0, 'Circuit should have spiders');
});

test('QuantumZXCore: Optimize circuit', () => {
    const core = new QuantumZXCore();
    const circuit = core.buildCircuit([
        { name: 'RZ', phase: Math.PI / 4 },
        { name: 'RZ', phase: Math.PI / 4 }
    ]);
    const result = core.optimizeCircuit(circuit);
    assert(result.diagram !== undefined, 'Should return optimized diagram');
});

test('QuantumZXCore: Get info', () => {
    const core = new QuantumZXCore();
    const info = core.getInfo();
    assert(info.name === 'Phu AI Quantum ZX Core', 'Should have correct name');
    assert(Array.isArray(info.features), 'Should have features array');
});

// Video Ad Generator Tests
console.log('\n=== Video Ad Generator Tests ===\n');

test('VideoAdGenerator: Create generator', () => {
    const generator = new VideoAdGenerator();
    assert(generator.scenes.length === 0, 'Should start with no scenes');
    assert(generator.fps === 30, 'FPS should be 30');
});

test('VideoAdGenerator: Generate script', () => {
    const generator = new VideoAdGenerator();
    const script = generator.generateScript();
    assert(script.title !== undefined, 'Should have title');
    assert(Array.isArray(script.scenes), 'Should have scenes array');
    assert(script.scenes.length > 0, 'Should have at least one scene');
});

test('VideoAdGenerator: Script has correct structure', () => {
    const generator = new VideoAdGenerator();
    const script = generator.generateScript();
    const firstScene = script.scenes[0];
    assert(firstScene.duration !== undefined, 'Scene should have duration');
    assert(firstScene.type !== undefined, 'Scene should have type');
    assert(firstScene.content !== undefined, 'Scene should have content');
});

test('VideoAdGenerator: Generate canvas frames', () => {
    const generator = new VideoAdGenerator();
    const script = generator.generateScript();
    const frames = generator.generateCanvasFrames(script);
    assert(Array.isArray(frames), 'Should return frames array');
    assert(frames.length > 0, 'Should generate frames');
});

test('VideoAdGenerator: Export as HTML', () => {
    const generator = new VideoAdGenerator();
    const html = generator.exportAsHTML();
    assert(typeof html === 'string', 'Should return string');
    assert(html.includes('<!DOCTYPE html>'), 'Should be valid HTML');
    assert(html.includes('canvas'), 'Should include canvas element');
});

test('VideoAdGenerator: Get video info', () => {
    const generator = new VideoAdGenerator();
    const info = generator.getVideoInfo();
    assert(info.title !== undefined, 'Should have title');
    assert(info.duration > 0, 'Should have positive duration');
    assert(Array.isArray(info.features), 'Should have features');
});

// Phu AI Integration Tests
console.log('\n=== Phu AI Integration Tests ===\n');

test('PhuAI: Create instance', () => {
    const phuAI = new PhuAI();
    assert(phuAI.quantumCore !== undefined, 'Should have quantum core');
    assert(phuAI.videoGenerator !== undefined, 'Should have video generator');
});

test('PhuAI: Initialize system', () => {
    const phuAI = new PhuAI();
    const status = phuAI.initialize();
    assert(status.status === 'initialized', 'Should be initialized');
    assert(status.quantumCore !== undefined, 'Should have quantum core info');
    assert(status.videoAd !== undefined, 'Should have video ad info');
});

test('PhuAI: Demonstrate quantum core', () => {
    const phuAI = new PhuAI();
    phuAI.initialize();
    const demo = phuAI.demonstrateQuantumCore();
    assert(demo.circuit !== undefined, 'Should have circuit');
    assert(demo.optimized !== undefined, 'Should have optimization result');
});

test('PhuAI: Generate video ad', () => {
    const phuAI = new PhuAI();
    phuAI.initialize();
    const script = phuAI.generateVideoAd();
    assert(script.title !== undefined, 'Should have title');
    assert(script.scenes.length > 0, 'Should have scenes');
});

test('PhuAI: Export video ad HTML', () => {
    const phuAI = new PhuAI();
    phuAI.initialize();
    const html = phuAI.exportVideoAdHTML();
    assert(typeof html === 'string', 'Should return HTML string');
    assert(html.length > 0, 'HTML should not be empty');
});

test('PhuAI: Get capabilities', () => {
    const phuAI = new PhuAI();
    const capabilities = phuAI.getCapabilities();
    assert(capabilities.name === 'Phu AI', 'Should have correct name');
    assert(Array.isArray(capabilities.capabilities), 'Should have capabilities');
    assert(capabilities.capabilities.length > 0, 'Should have multiple capabilities');
});

// Summary
console.log('\n╔════════════════════════════════════════╗');
console.log('║           Test Summary                 ║');
console.log('╚════════════════════════════════════════╝\n');
console.log(`✅ Passed: ${passedTests}`);
console.log(`❌ Failed: ${failedTests}`);
console.log(`📊 Total:  ${passedTests + failedTests}\n`);

if (failedTests === 0) {
    console.log('🎉 All tests passed! Phu AI is working correctly!\n');
    process.exit(0);
} else {
    console.log('⚠️  Some tests failed. Please review the errors above.\n');
    process.exit(1);
}
