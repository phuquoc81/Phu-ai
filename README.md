# Phu AI

Phu AI is a revolutionary web application powered by quantum computing and advanced AI capabilities. It combines the power of **Quantum ZX-calculus** for quantum computing with intelligent problem-solving to deliver mind-blowing results.

## 🌟 Features

### ⚛️ Quantum ZX Core
- **ZX-calculus** implementation for quantum computing
- Quantum circuit representation and optimization
- Spider fusion and color change rules
- Support for standard quantum gates (Hadamard, CNOT, Pauli gates, rotations)
- Circuit simplification using ZX-calculus rewrite rules

### 🎬 Video Advertisement Generation
- HTML5 Canvas-based video generation
- Professional animated scenes with smooth transitions
- Multiple scene types (title, features, call-to-action)
- 26-second promotional video showcasing Phu AI capabilities
- Interactive playback controls

### 🧩 Core Capabilities
- Solve complex puzzles and problems
- Mathematical and physical analysis
- Future prediction with advanced algorithms
- Species diagnosis for land and ocean animals
- Multi-modal problem solving

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/phuquoc81/Phu-ai.git
cd Phu-ai

# No dependencies needed - pure JavaScript implementation!
```

### Usage

#### Generate Video Advertisement

```bash
node generate-video-ad.js
```

This will create `phu-ai-video-ad.html` that you can open in any web browser to view the promotional video.

#### Run Full Demo

```bash
npm run demo
# or
node index.js
```

This demonstrates both the quantum ZX core and video generation capabilities.

#### Run Tests

```bash
npm test
# or
node test.js
```

Runs the complete test suite (26 tests) covering quantum operations and video generation.

## 📚 API Documentation

### Quantum ZX Core

```javascript
const { QuantumZXCore, ZXDiagram, ZXSpider } = require('./quantum-zx-core');

// Create quantum core
const core = new QuantumZXCore();

// Build a quantum circuit
const circuit = core.buildCircuit([
    'H',                          // Hadamard gate
    { name: 'RZ', phase: Math.PI / 4 },  // Rotation
    'CNOT',                       // CNOT gate
    'X'                           // Pauli-X
]);

// Optimize the circuit
const optimized = core.optimizeCircuit(circuit);
console.log(`Optimized: ${optimized.iterations} iterations`);
```

### Video Ad Generator

```javascript
const VideoAdGenerator = require('./video-ad-generator');

// Create generator
const generator = new VideoAdGenerator();

// Generate video script
const script = generator.generateScript();

// Export as HTML
const html = generator.exportAsHTML();

// Save to file
require('fs').writeFileSync('video-ad.html', html);
```

### Integrated Phu AI System

```javascript
const PhuAI = require('./index');

// Create Phu AI instance
const phuAI = new PhuAI();

// Initialize
phuAI.initialize();

// Get system capabilities
const capabilities = phuAI.getCapabilities();

// Run full demonstration
phuAI.runFullDemo();
```

## 🎯 Quantum ZX-Calculus

ZX-calculus is a graphical language for reasoning about linear maps between qubits. Phu AI implements:

- **Z-spiders** (green): Represent Z-basis operations
- **X-spiders** (red): Represent X-basis operations  
- **Spider fusion**: Merge adjacent same-color spiders
- **Color change**: Convert between X and Z basis
- **Gate decomposition**: Convert standard gates to ZX form

### Supported Quantum Gates

- **H** - Hadamard gate
- **X, Y, Z** - Pauli gates
- **RX, RY, RZ** - Rotation gates (parameterized)
- **CNOT** - Controlled-NOT gate
- And more...

## 🎬 Video Advertisement

The generated video advertisement includes:

1. **Title Scene** (3s) - "Introducing Phu AI"
2. **Feature Scene** (4s) - Quantum ZX Core Technology
3. **Feature Scene** (4s) - Complex Problem Solving
4. **Feature Scene** (4s) - Mathematical Analysis
5. **Feature Scene** (4s) - Future Prediction
6. **Feature Scene** (4s) - Species Diagnosis
7. **CTA Scene** (3s) - "Experience Phu AI Today"

**Total Duration**: 26 seconds  
**Resolution**: 1920x1080  
**FPS**: 30

## 🧪 Testing

The project includes comprehensive tests:

```bash
npm test
```

**Test Coverage:**
- ✅ 14 Quantum ZX Core tests
- ✅ 6 Video Generator tests
- ✅ 6 Integration tests
- **Total: 26 tests, 100% pass rate**

## 📦 Project Structure

```
Phu-ai/
├── index.js                    # Main entry point
├── quantum-zx-core.js          # Quantum ZX-calculus implementation
├── video-ad-generator.js       # Video advertisement generator
├── generate-video-ad.js        # CLI tool to generate video
├── test.js                     # Test suite
├── package.json                # NPM configuration
├── phu-ai-video-ad.html       # Generated video ad (after running)
├── README.md                   # This file
└── LICENSE                     # License file
```

## 🔧 Requirements

- Node.js v14 or higher
- Modern web browser (for viewing video ad)
- No external dependencies required!

## 📝 Scripts

- `npm start` - Run the full demo
- `npm run demo` - Run the full demo
- `npm run generate-video` - Generate video advertisement HTML
- `npm test` - Run test suite

## 🌐 Viewing the Video Ad

After running `npm run generate-video`, open `phu-ai-video-ad.html` in your web browser:

```bash
# On Linux/Mac
open phu-ai-video-ad.html

# On Windows
start phu-ai-video-ad.html

# Or just drag and drop the file into your browser
```

The video will auto-play with interactive controls (Play, Pause, Restart).

## 🎨 Video Ad Features

- **Smooth animations** with fade-in and slide-in effects
- **Particle effects** on feature scenes
- **Gradient backgrounds** for visual appeal
- **Pulsing CTA button** for engagement
- **Responsive canvas** rendering
- **Professional typography** and layout

## 🧠 Capabilities

Phu AI is designed to:

1. **Quantum Computing** - Leverage ZX-calculus for quantum operations
2. **Problem Solving** - Tackle complex puzzles and challenges
3. **Mathematics** - Solve equations and perform analysis
4. **Physics** - Analyze and predict physical phenomena
5. **Future Prediction** - Advanced forecasting capabilities
6. **Species Diagnosis** - Understand and diagnose various species
7. **Marketing** - Generate professional video advertisements

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🌟 Why Phu AI?

Phu AI combines cutting-edge quantum computing theory with practical AI applications. The ZX-calculus implementation provides a solid foundation for quantum computing, while the video generation showcases the platform's versatility.

**"The web app that will blow your mind!"** 🚀

---

**Built with ❤️ using pure JavaScript - no external dependencies!**
