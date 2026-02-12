/**
 * Phu AI Video Advertisement Generator
 * 
 * Creates promotional video content for Phu AI using HTML5 Canvas
 */

class VideoAdGenerator {
    constructor() {
        this.scenes = [];
        this.duration = 0;
        this.fps = 30;
        this.width = 1920;
        this.height = 1080;
    }

    /**
     * Add a scene to the video
     */
    addScene(scene) {
        this.scenes.push(scene);
        this.duration += scene.duration;
    }

    /**
     * Generate video ad script
     */
    generateScript() {
        const script = {
            title: "Phu AI - The Ultimate AI Solution",
            tagline: "Blow Your Mind with Quantum-Powered Intelligence",
            scenes: [
                {
                    id: 1,
                    duration: 3,
                    type: "title",
                    content: {
                        title: "Introducing Phu AI",
                        subtitle: "The Future of Artificial Intelligence"
                    },
                    animation: "fadeIn"
                },
                {
                    id: 2,
                    duration: 4,
                    type: "feature",
                    content: {
                        title: "Quantum ZX Core Technology",
                        description: "Powered by advanced quantum computing algorithms using ZX-calculus",
                        icon: "⚛️"
                    },
                    animation: "slideIn"
                },
                {
                    id: 3,
                    duration: 4,
                    type: "feature",
                    content: {
                        title: "Solve Complex Puzzles",
                        description: "Advanced problem-solving capabilities for any challenge",
                        icon: "🧩"
                    },
                    animation: "slideIn"
                },
                {
                    id: 4,
                    duration: 4,
                    type: "feature",
                    content: {
                        title: "Mathematical & Physical Analysis",
                        description: "Solve complex equations and predict physical phenomena",
                        icon: "🔬"
                    },
                    animation: "slideIn"
                },
                {
                    id: 5,
                    duration: 4,
                    type: "feature",
                    content: {
                        title: "Future Prediction",
                        description: "Advanced forecasting with divine wisdom and alien knowledge",
                        icon: "🔮"
                    },
                    animation: "slideIn"
                },
                {
                    id: 6,
                    duration: 4,
                    type: "feature",
                    content: {
                        title: "Species Diagnosis",
                        description: "Diagnose and understand all land and ocean species",
                        icon: "🐾"
                    },
                    animation: "slideIn"
                },
                {
                    id: 7,
                    duration: 3,
                    type: "cta",
                    content: {
                        title: "Experience Phu AI Today",
                        subtitle: "The Web App That Will Blow Your Mind",
                        button: "Get Started"
                    },
                    animation: "fadeIn"
                }
            ],
            totalDuration: 26,
            music: "uplifting-tech",
            voiceover: "professional"
        };

        return script;
    }

    /**
     * Generate HTML5 Canvas-based video frames
     */
    generateCanvasFrames(script) {
        const frames = [];
        let currentTime = 0;

        for (const scene of script.scenes) {
            const sceneFrames = Math.floor(scene.duration * this.fps);
            
            for (let i = 0; i < sceneFrames; i++) {
                const frame = {
                    time: currentTime + (i / this.fps),
                    sceneId: scene.id,
                    sceneProgress: i / sceneFrames,
                    content: scene.content,
                    type: scene.type,
                    animation: scene.animation
                };
                frames.push(frame);
            }
            
            currentTime += scene.duration;
        }

        return frames;
    }

    /**
     * Render a single frame to canvas context
     */
    renderFrame(ctx, frame) {
        // Clear canvas
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, this.width, this.height);

        // Apply animation based on progress
        const progress = frame.sceneProgress;
        let alpha = 1;

        if (frame.animation === 'fadeIn') {
            alpha = Math.min(progress * 2, 1);
        } else if (frame.animation === 'fadeOut') {
            alpha = Math.max(1 - progress * 2, 0);
        }

        ctx.globalAlpha = alpha;

        // Render based on scene type
        switch (frame.type) {
            case 'title':
                this.renderTitleScene(ctx, frame.content, progress);
                break;
            case 'feature':
                this.renderFeatureScene(ctx, frame.content, progress);
                break;
            case 'cta':
                this.renderCTAScene(ctx, frame.content, progress);
                break;
        }

        ctx.globalAlpha = 1;

        // Add Phu AI branding
        this.renderBranding(ctx);
    }

    /**
     * Render title scene
     */
    renderTitleScene(ctx, content, progress) {
        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, this.width, this.height);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);

        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 120px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const titleY = this.height / 2 - 50;
        const slideOffset = (1 - Math.min(progress * 2, 1)) * 100;
        ctx.fillText(content.title, this.width / 2, titleY - slideOffset);

        // Subtitle
        ctx.font = '48px Arial';
        ctx.fillStyle = '#f0f0f0';
        ctx.fillText(content.subtitle, this.width / 2, titleY + 100 - slideOffset);
    }

    /**
     * Render feature scene
     */
    renderFeatureScene(ctx, content, progress) {
        // Background with particles
        this.renderParticleBackground(ctx, progress);

        // Feature icon
        ctx.font = '200px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const iconY = this.height / 2 - 150;
        const scale = Math.min(progress * 1.5, 1);
        ctx.save();
        ctx.translate(this.width / 2, iconY);
        ctx.scale(scale, scale);
        ctx.fillText(content.icon, 0, 0);
        ctx.restore();

        // Feature title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 72px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(content.title, this.width / 2, this.height / 2 + 50);

        // Feature description
        ctx.font = '36px Arial';
        ctx.fillStyle = '#cccccc';
        this.wrapText(ctx, content.description, this.width / 2, this.height / 2 + 130, this.width * 0.8, 50);
    }

    /**
     * Render call-to-action scene
     */
    renderCTAScene(ctx, content, progress) {
        // Background gradient
        const gradient = ctx.createRadialGradient(
            this.width / 2, this.height / 2, 0,
            this.width / 2, this.height / 2, this.width
        );
        gradient.addColorStop(0, '#4facfe');
        gradient.addColorStop(1, '#00f2fe');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);

        // Main title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 96px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(content.title, this.width / 2, this.height / 2 - 100);

        // Subtitle
        ctx.font = '48px Arial';
        ctx.fillText(content.subtitle, this.width / 2, this.height / 2);

        // Button
        const buttonWidth = 400;
        const buttonHeight = 100;
        const buttonX = this.width / 2 - buttonWidth / 2;
        const buttonY = this.height / 2 + 100;

        // Button pulse effect
        const pulse = 1 + Math.sin(progress * Math.PI * 4) * 0.1;
        ctx.save();
        ctx.translate(this.width / 2, buttonY + buttonHeight / 2);
        ctx.scale(pulse, pulse);
        ctx.translate(-this.width / 2, -(buttonY + buttonHeight / 2));

        // Button background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

        // Button text
        ctx.fillStyle = '#4facfe';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(content.button, this.width / 2, buttonY + buttonHeight / 2);

        ctx.restore();
    }

    /**
     * Render particle background
     */
    renderParticleBackground(ctx, progress) {
        const gradient = ctx.createLinearGradient(0, 0, this.width, this.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);

        // Draw particles
        ctx.fillStyle = 'rgba(100, 200, 255, 0.5)';
        for (let i = 0; i < 50; i++) {
            const x = (i * 137.5) % this.width;
            const y = ((i * 234.7 + progress * 100) % this.height);
            const size = 2 + (i % 3);
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    /**
     * Render Phu AI branding
     */
    renderBranding(ctx) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText('Phu AI', this.width - 50, this.height - 30);
    }

    /**
     * Wrap text to fit within width
     */
    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let currentY = y;

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && i > 0) {
                ctx.fillText(line, x, currentY);
                line = words[i] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, currentY);
    }

    /**
     * Export video as HTML animation
     */
    exportAsHTML() {
        const script = this.generateScript();
        
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Phu AI - Video Advertisement</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: #000;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            font-family: Arial, sans-serif;
        }
        #video-container {
            max-width: 100%;
            max-height: 100vh;
        }
        canvas {
            max-width: 100%;
            height: auto;
            box-shadow: 0 0 50px rgba(100, 200, 255, 0.5);
        }
        .controls {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
        }
        button {
            padding: 10px 20px;
            font-size: 16px;
            background: #4facfe;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s;
        }
        button:hover {
            background: #00f2fe;
            transform: scale(1.05);
        }
    </style>
</head>
<body>
    <div id="video-container">
        <canvas id="video-canvas" width="1920" height="1080"></canvas>
    </div>
    <div class="controls">
        <button id="playBtn">Play</button>
        <button id="pauseBtn">Pause</button>
        <button id="restartBtn">Restart</button>
    </div>

    <script>
        const videoScript = ${JSON.stringify(script, null, 2)};
        
        class VideoPlayer {
            constructor(canvas) {
                this.canvas = canvas;
                this.ctx = canvas.getContext('2d');
                this.isPlaying = false;
                this.currentTime = 0;
                this.fps = 30;
                this.frameInterval = 1000 / this.fps;
                this.lastFrameTime = 0;
            }

            play() {
                this.isPlaying = true;
                this.lastFrameTime = Date.now();
                this.animate();
            }

            pause() {
                this.isPlaying = false;
            }

            restart() {
                this.currentTime = 0;
                this.play();
            }

            animate() {
                if (!this.isPlaying) return;

                const now = Date.now();
                const elapsed = now - this.lastFrameTime;

                if (elapsed >= this.frameInterval) {
                    this.currentTime += elapsed / 1000;
                    
                    if (this.currentTime >= videoScript.totalDuration) {
                        this.currentTime = 0;
                    }

                    this.renderCurrentFrame();
                    this.lastFrameTime = now - (elapsed % this.frameInterval);
                }

                requestAnimationFrame(() => this.animate());
            }

            renderCurrentFrame() {
                // Find current scene
                let accumulatedTime = 0;
                let currentScene = null;
                let sceneProgress = 0;

                for (const scene of videoScript.scenes) {
                    if (this.currentTime >= accumulatedTime && 
                        this.currentTime < accumulatedTime + scene.duration) {
                        currentScene = scene;
                        sceneProgress = (this.currentTime - accumulatedTime) / scene.duration;
                        break;
                    }
                    accumulatedTime += scene.duration;
                }

                if (!currentScene) return;

                // Clear canvas
                this.ctx.fillStyle = '#0a0a0a';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                // Render scene
                this.renderScene(currentScene, sceneProgress);
            }

            renderScene(scene, progress) {
                const ctx = this.ctx;
                const width = this.canvas.width;
                const height = this.canvas.height;

                // Animation alpha
                let alpha = 1;
                if (scene.animation === 'fadeIn') {
                    alpha = Math.min(progress * 2, 1);
                } else if (scene.animation === 'slideIn') {
                    alpha = Math.min(progress * 1.5, 1);
                }
                ctx.globalAlpha = alpha;

                // Render based on type
                if (scene.type === 'title') {
                    this.renderTitle(scene.content, progress);
                } else if (scene.type === 'feature') {
                    this.renderFeature(scene.content, progress);
                } else if (scene.type === 'cta') {
                    this.renderCTA(scene.content, progress);
                }

                ctx.globalAlpha = 1;

                // Branding
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.font = 'bold 36px Arial';
                ctx.textAlign = 'right';
                ctx.textBaseline = 'bottom';
                ctx.fillText('Phu AI', width - 50, height - 30);
            }

            renderTitle(content, progress) {
                const ctx = this.ctx;
                const width = this.canvas.width;
                const height = this.canvas.height;

                // Gradient background
                const gradient = ctx.createLinearGradient(0, 0, width, height);
                gradient.addColorStop(0, '#667eea');
                gradient.addColorStop(1, '#764ba2');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);

                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 120px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(content.title, width / 2, height / 2 - 50);

                ctx.font = '48px Arial';
                ctx.fillText(content.subtitle, width / 2, height / 2 + 50);
            }

            renderFeature(content, progress) {
                const ctx = this.ctx;
                const width = this.canvas.width;
                const height = this.canvas.height;

                // Dark background with particles
                const gradient = ctx.createLinearGradient(0, 0, width, height);
                gradient.addColorStop(0, '#1a1a2e');
                gradient.addColorStop(1, '#16213e');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);

                // Particles
                ctx.fillStyle = 'rgba(100, 200, 255, 0.5)';
                for (let i = 0; i < 50; i++) {
                    const x = (i * 137.5) % width;
                    const y = ((i * 234.7 + progress * 100) % height);
                    ctx.beginPath();
                    ctx.arc(x, y, 3, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Icon
                ctx.font = '200px Arial';
                ctx.textAlign = 'center';
                const scale = Math.min(progress * 1.5, 1);
                ctx.save();
                ctx.translate(width / 2, height / 2 - 150);
                ctx.scale(scale, scale);
                ctx.fillText(content.icon, 0, 0);
                ctx.restore();

                // Title
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 72px Arial';
                ctx.fillText(content.title, width / 2, height / 2 + 50);

                // Description
                ctx.font = '36px Arial';
                ctx.fillStyle = '#cccccc';
                ctx.fillText(content.description, width / 2, height / 2 + 130);
            }

            renderCTA(content, progress) {
                const ctx = this.ctx;
                const width = this.canvas.width;
                const height = this.canvas.height;

                // Gradient background
                const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);
                gradient.addColorStop(0, '#4facfe');
                gradient.addColorStop(1, '#00f2fe');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);

                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 96px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(content.title, width / 2, height / 2 - 100);

                ctx.font = '48px Arial';
                ctx.fillText(content.subtitle, width / 2, height / 2);

                // Button with pulse
                const pulse = 1 + Math.sin(progress * Math.PI * 4) * 0.1;
                const buttonWidth = 400;
                const buttonHeight = 100;
                ctx.save();
                ctx.translate(width / 2, height / 2 + 150);
                ctx.scale(pulse, pulse);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight);
                ctx.fillStyle = '#4facfe';
                ctx.font = 'bold 48px Arial';
                ctx.fillText(content.button, 0, 15);
                ctx.restore();
            }
        }

        // Initialize player
        const canvas = document.getElementById('video-canvas');
        const player = new VideoPlayer(canvas);

        document.getElementById('playBtn').addEventListener('click', () => player.play());
        document.getElementById('pauseBtn').addEventListener('click', () => player.pause());
        document.getElementById('restartBtn').addEventListener('click', () => player.restart());

        // Auto-play
        player.play();
    </script>
</body>
</html>`;

        return html;
    }

    /**
     * Generate video metadata
     */
    getVideoInfo() {
        const script = this.generateScript();
        
        return {
            title: script.title,
            tagline: script.tagline,
            duration: script.totalDuration,
            scenes: script.scenes.length,
            resolution: `${this.width}x${this.height}`,
            fps: this.fps,
            format: 'HTML5 Canvas Animation',
            features: [
                'Quantum ZX Core Technology',
                'Complex Problem Solving',
                'Mathematical Analysis',
                'Future Prediction',
                'Species Diagnosis'
            ]
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VideoAdGenerator;
}
