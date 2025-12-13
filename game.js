class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game variables
        this.score = 0;
        this.gameOver = false;
        this.level = 1;
        this.particles = [];
        this.backgroundStars = [];
        this.rippleEffects = [];
        this.combo = 0;
        this.maxCombo = 0;
        this.lastScoreTime = 0;
        this.fruitTypes = [];
        this.fruitImages = [];
        
        // Load fruit images
        this.loadFruitImages();
        
        // Player (basket)
        this.basket = {
            x: this.canvas.width / 2 - 60,
            y: this.canvas.height - 40,
            width: 120,
            height: 30,
            speed: 10,
            color: '#ff9800',
            glow: 0,
            maxGlow: 10,
            direction: 1
        };
        
        // Apple (now fruit)
        this.fruit = {
            x: 0,
            y: 0,
            width: 40,
            height: 40,
            speed: 3,
            type: 'apple',
            rotation: 0,
            rotationSpeed: 0.05,
            active: false,
            scale: 1,
            scaleDirection: 0.01
        };
        
        // Controls
        this.keys = {};
        
        // Initialize background stars
        this.initBackgroundStars();
        
        this.init();
    }
    
    loadFruitImages() {
        // Create fruit types array
        this.fruitTypes = ['apple', 'orange', 'banana', 'strawberry', 'cherry', 'grape', 'watermelon', 'pineapple', 'mango', 'pear'];
        
        // Create canvas elements for each fruit type
        this.fruitTypes.forEach(type => {
            const canvas = document.createElement('canvas');
            canvas.width = 40;
            canvas.height = 40;
            const ctx = canvas.getContext('2d');
            
            // Draw different fruits based on type
            switch(type) {
                case 'apple':
                    ctx.fillStyle = 'red';
                    ctx.beginPath();
                    ctx.arc(20, 20, 18, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = 'brown';
                    ctx.fillRect(18, 8, 4, 6);
                    ctx.fillStyle = 'green';
                    ctx.beginPath();
                    ctx.ellipse(22, 8, 6, 4, Math.PI / 4, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 'orange':
                    ctx.fillStyle = 'orange';
                    ctx.beginPath();
                    ctx.arc(20, 20, 18, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = 'brown';
                    ctx.beginPath();
                    ctx.arc(20, 10, 3, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 'banana':
                    ctx.fillStyle = 'yellow';
                    ctx.beginPath();
                    ctx.ellipse(20, 20, 22, 12, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = 'brown';
                    ctx.beginPath();
                    ctx.arc(30, 15, 3, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 'strawberry':
                    ctx.fillStyle = '#e75480';
                    ctx.beginPath();
                    ctx.ellipse(20, 20, 15, 18, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = 'red';
                    for (let i = 0; i < 8; i++) {
                        const angle = (i * Math.PI * 2) / 8;
                        const x = 20 + Math.cos(angle) * 8;
                        const y = 20 + Math.sin(angle) * 10;
                        ctx.beginPath();
                        ctx.arc(x, y, 2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.fillStyle = 'green';
                    ctx.beginPath();
                    ctx.ellipse(20, 12, 8, 6, 0, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 'cherry':
                    ctx.fillStyle = 'red';
                    ctx.beginPath();
                    ctx.arc(15, 20, 10, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(25, 20, 10, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = 'brown';
                    ctx.fillRect(18, 10, 4, 8);
                    ctx.beginPath();
                    ctx.ellipse(20, 8, 5, 3, Math.PI / 4, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 'grape':
                    ctx.fillStyle = 'purple';
                    for (let i = 0; i < 6; i++) {
                        const x = 15 + (i % 3) * 8;
                        const y = 15 + Math.floor(i / 3) * 8;
                        ctx.beginPath();
                        ctx.arc(x, y, 5, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.fillStyle = 'brown';
                    ctx.fillRect(18, 10, 4, 5);
                    break;
                case 'watermelon':
                    ctx.fillStyle = 'green';
                    ctx.beginPath();
                    ctx.ellipse(20, 20, 20, 15, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = 'red';
                    ctx.beginPath();
                    ctx.ellipse(20, 20, 18, 13, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = 'black';
                    for (let i = 0; i < 6; i++) {
                        const angle = (i * Math.PI * 2) / 6;
                        const x = 20 + Math.cos(angle) * 8;
                        const y = 20 + Math.sin(angle) * 10;
                        ctx.beginPath();
                        ctx.arc(x, y, 2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    break;
                case 'pineapple':
                    ctx.fillStyle = '#FFD700';
                    ctx.beginPath();
                    ctx.ellipse(20, 25, 12, 15, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = 'brown';
                    ctx.beginPath();
                    ctx.ellipse(20, 15, 8, 5, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#8B4513';
                    for (let i = 0; i < 5; i++) {
                        ctx.beginPath();
                        ctx.ellipse(15 + i * 2, 8 + i * 2, 2, 4, Math.PI / 4, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    break;
                case 'mango':
                    ctx.fillStyle = '#FFA500';
                    ctx.beginPath();
                    ctx.ellipse(20, 20, 18, 12, Math.PI / 6, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = 'brown';
                    ctx.beginPath();
                    ctx.ellipse(15, 15, 3, 2, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#228B22';
                    ctx.beginPath();
                    ctx.ellipse(25, 18, 4, 2, Math.PI / 3, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 'pear':
                    ctx.fillStyle = '#9ACD32';
                    ctx.beginPath();
                    ctx.ellipse(20, 25, 12, 15, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = 'brown';
                    ctx.fillRect(18, 10, 4, 8);
                    ctx.beginPath();
                    ctx.ellipse(20, 8, 5, 3, Math.PI / 4, 0, Math.PI * 2);
                    ctx.fill();
                    break;
            }
            
            this.fruitImages[type] = canvas;
        });
    }
    
    initBackgroundStars() {
        for (let i = 0; i < 100; i++) {
            this.backgroundStars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.8 + 0.2,
                speed: Math.random() * 0.5 + 0.1
            });
        }
    }
    
    init() {
        this.resetFruit();
        this.setupEventListeners();
        this.gameLoop();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // Touch controls for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            
            if (x < this.canvas.width / 2) {
                this.keys['ArrowLeft'] = true;
            } else {
                this.keys['ArrowRight'] = true;
            }
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys['ArrowLeft'] = false;
            this.keys['ArrowRight'] = false;
        });
    }
    
    resetFruit() {
        // Random fruit type
        const randomIndex = Math.floor(Math.random() * this.fruitTypes.length);
        this.fruit.type = this.fruitTypes[randomIndex];
        
        // Random position
        this.fruit.x = Math.random() * (this.canvas.width - this.fruit.width);
        this.fruit.y = -this.fruit.height;
        this.fruit.active = true;
        
        // Random rotation
        this.fruit.rotation = Math.random() * Math.PI * 2;
        
        // Random scale
        this.fruit.scale = 0.8 + Math.random() * 0.4;
        
        // Increase speed based on level
        this.fruit.speed = 3 + (this.level - 1) * 0.5;
        
        // Random rotation speed
        this.fruit.rotationSpeed = 0.02 + Math.random() * 0.04;
    }
    
    update() {
        if (this.gameOver) return;
        
        // Move basket
        if (this.keys['ArrowLeft'] && this.basket.x > 0) {
            this.basket.x -= this.basket.speed;
        }
        
        if (this.keys['ArrowRight'] && this.basket.x < this.canvas.width - this.basket.width) {
            this.basket.x += this.basket.speed;
        }
        
        // Update basket glow effect
        this.basket.glow += 0.2 * this.basket.direction;
        if (this.basket.glow > this.basket.maxGlow || this.basket.glow < 0) {
            this.basket.direction *= -1;
        }
        
        // Update fruit
        if (this.fruit.active) {
            this.fruit.y += this.fruit.speed;
            this.fruit.rotation += this.fruit.rotationSpeed;
            
            // Pulsing scale effect
            this.fruit.scale += this.fruit.scaleDirection;
            if (this.fruit.scale > 1.2 || this.fruit.scale < 0.8) {
                this.fruit.scaleDirection *= -1;
            }
            
            // Check if fruit is caught
            if (this.checkCollision(this.basket, this.fruit)) {
                this.catchFruit();
            }
            
            // Check if fruit is missed
            if (this.fruit.y > this.canvas.height + this.fruit.height) {
                this.missFruit();
            }
        }
        
        // Update particles
        this.updateParticles();
        
        // Update background stars
        this.updateBackgroundStars();
        
        // Update ripple effects
        this.updateRippleEffects();
        
        // Update combo timer
        if (this.combo > 0 && Date.now() - this.lastScoreTime > 2000) {
            this.combo = 0;
        }
    }
    
    catchFruit() {
        // Create particles
        this.createParticles(this.fruit.x + this.fruit.width/2, this.fruit.y + this.fruit.height/2, this.fruit.type);
        
        // Create ripple effect
        this.createRippleEffect(this.fruit.x + this.fruit.width/2, this.fruit.y + this.fruit.height/2);
        
        // Increase score
        const scoreIncrease = 10 * this.combo + 10;
        this.score += scoreIncrease;
        
        // Update combo
        this.combo++;
        this.maxCombo = Math.max(this.maxCombo, this.combo);
        this.lastScoreTime = Date.now();
        
        // Level up every 100 points
        const newLevel = Math.floor(this.score / 100) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            // Create level up particles
            this.createParticles(this.canvas.width/2, this.canvas.height/2, 'levelup');
        }
        
        // Reset fruit
        this.resetFruit();
    }
    
    missFruit() {
        // Create splash particles
        this.createParticles(this.fruit.x + this.fruit.width/2, this.canvas.height, 'splash');
        
        // Reset fruit
        this.resetFruit();
        
        // Decrease combo
        if (this.combo > 0) {
            this.combo = 0;
        }
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.life--;
            p.alpha = p.life / p.maxLife;
            
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    updateBackgroundStars() {
        for (let i = 0; i < this.backgroundStars.length; i++) {
            const star = this.backgroundStars[i];
            star.y += star.speed;
            
            // Reset star position when it goes off screen
            if (star.y > this.canvas.height) {
                star.y = 0;
                star.x = Math.random() * this.canvas.width;
            }
            
            // Twinkle effect
            star.opacity = (Math.sin(Date.now() * 0.001 + i) * 0.5 + 0.5) * 0.8 + 0.2;
        }
    }
    
    updateRippleEffects() {
        for (let i = this.rippleEffects.length - 1; i >= 0; i--) {
            const ripple = this.rippleEffects[i];
            ripple.radius += 2;
            ripple.alpha -= 0.02;
            
            if (ripple.alpha <= 0) {
                this.rippleEffects.splice(i, 1);
            }
        }
    }
    
    checkCollision(rect1, rect2) {
        // Add some padding to make collision feel more natural
        const padding = 10;
        return rect1.x + padding < rect2.x + rect2.width - padding &&
               rect1.x + rect1.width - padding > rect2.x + padding &&
               rect1.y + padding < rect2.y + rect2.height - padding &&
               rect1.y + rect1.height - padding > rect2.y + padding;
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background gradient
        const bgGradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.width
        );
        bgGradient.addColorStop(0, 'rgba(100, 180, 255, 0.3)');
        bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
        this.ctx.fillStyle = bgGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background stars
        this.drawBackgroundStars();
        
        // Draw basket with glow effect
        this.drawBasket();
        
        // Draw fruit
        if (this.fruit.active) {
            this.drawFruit();
        }
        
        // Draw particles
        this.drawParticles();
        
        // Draw ripple effects
        this.drawRippleEffects();
        
        // Draw UI
        this.drawUI();
        
        // Draw game over screen
        if (this.gameOver) {
            this.drawGameOver();
        }
    }
    
    drawBackgroundStars() {
        this.backgroundStars.forEach(star => {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Add star glow
            if (star.radius > 1) {
                const glow = this.ctx.createRadialGradient(
                    star.x, star.y, star.radius,
                    star.x, star.y, star.radius * 3
                );
                glow.addColorStop(0, `rgba(255, 255, 255, ${star.opacity * 0.5})`);
                glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
                this.ctx.fillStyle = glow;
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
    }
    
    drawBasket() {
        // Basket shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(this.basket.x + 5, this.basket.y + 8, this.basket.width, this.basket.height);
        
        // Basket glow
        const gradient = this.ctx.createRadialGradient(
            this.basket.x + this.basket.width / 2,
            this.basket.y + this.basket.height / 2,
            0,
            this.basket.x + this.basket.width / 2,
            this.basket.y + this.basket.height / 2,
            this.basket.width / 2 + this.basket.glow
        );
        gradient.addColorStop(0, `rgba(255, 152, 0, ${0.5 + this.basket.glow / 20})`);
        gradient.addColorStop(1, 'rgba(255, 152, 0, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(
            this.basket.x - this.basket.glow,
            this.basket.y - this.basket.glow,
            this.basket.width + this.basket.glow * 2,
            this.basket.height + this.basket.glow * 2
        );
        
        // Basket body
        this.ctx.fillStyle = this.basket.color;
        this.ctx.beginPath();
        this.ctx.roundRect(
            this.basket.x, this.basket.y,
            this.basket.width, this.basket.height,
            [15, 15, 5, 5]
        );
        this.ctx.fill();
        
        // Basket rim
        this.ctx.strokeStyle = '#FFB74D';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.roundRect(
            this.basket.x, this.basket.y,
            this.basket.width, this.basket.height,
            [15, 15, 5, 5]
        );
        this.ctx.stroke();
        
        // Basket texture
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        for (let i = 0; i < 5; i++) {
            this.ctx.beginPath();
            this.ctx.ellipse(
                this.basket.x + this.basket.width * 0.2 + i * this.basket.width * 0.2,
                this.basket.y + this.basket.height * 0.3,
                this.basket.width * 0.1,
                this.basket.height * 0.1,
                0, 0, Math.PI * 2
            );
            this.ctx.fill();
        }
        
        // Basket handle
        this.ctx.fillStyle = '#D84315';
        this.ctx.beginPath();
        this.ctx.roundRect(
            this.basket.x + 10,
            this.basket.y - 12,
            this.basket.width - 20,
            12,
            8
        );
        this.ctx.fill();
        
        // Handle glow
        const handleGradient = this.ctx.createLinearGradient(
            this.basket.x + 10,
            this.basket.y - 12,
            this.basket.x + 10,
            this.basket.y - 8
        );
        handleGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        handleGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        this.ctx.fillStyle = handleGradient;
        this.ctx.fillRect(this.basket.x + 12, this.basket.y - 11, this.basket.width - 24, 3);
        
        // Handle texture
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        for (let i = 0; i < 8; i++) {
            this.ctx.fillRect(
                this.basket.x + 15 + i * 10,
                this.basket.y - 8,
                4,
                2
            );
        }
    }
    
    drawFruit() {
        // Save context
        this.ctx.save();
        
        // Translate and rotate
        this.ctx.translate(
            this.fruit.x + this.fruit.width / 2,
            this.fruit.y + this.fruit.height / 2
        );
        this.ctx.rotate(this.fruit.rotation);
        
        // Scale
        this.ctx.scale(this.fruit.scale, this.fruit.scale);
        
        // Draw fruit image
        const fruitImage = this.fruitImages[this.fruit.type];
        if (fruitImage) {
            this.ctx.drawImage(fruitImage, -20, -20, 40, 40);
        }
        
        // Restore context
        this.ctx.restore();
        
        // Add fruit glow
        const glowGradient = this.ctx.createRadialGradient(
            this.fruit.x + this.fruit.width / 2,
            this.fruit.y + this.fruit.height / 2,
            0,
            this.fruit.x + this.fruit.width / 2,
            this.fruit.y + this.fruit.height / 2,
            this.fruit.width
        );
        
        // Different glow colors based on fruit type
        switch(this.fruit.type) {
            case 'apple':
                glowGradient.addColorStop(0, 'rgba(255, 0, 0, 0.3)');
                glowGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
                break;
            case 'orange':
                glowGradient.addColorStop(0, 'rgba(255, 165, 0, 0.3)');
                glowGradient.addColorStop(1, 'rgba(255, 165, 0, 0)');
                break;
            case 'banana':
                glowGradient.addColorStop(0, 'rgba(255, 255, 0, 0.3)');
                glowGradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
                break;
            case 'strawberry':
                glowGradient.addColorStop(0, 'rgba(231, 84, 128, 0.3)');
                glowGradient.addColorStop(1, 'rgba(231, 84, 128, 0)');
                break;
            case 'cherry':
                glowGradient.addColorStop(0, 'rgba(255, 0, 0, 0.3)');
                glowGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
                break;
            case 'grape':
                glowGradient.addColorStop(0, 'rgba(128, 0, 128, 0.3)');
                glowGradient.addColorStop(1, 'rgba(128, 0, 128, 0)');
                break;
            case 'watermelon':
                glowGradient.addColorStop(0, 'rgba(0, 255, 0, 0.3)');
                glowGradient.addColorStop(1, 'rgba(0, 255, 0, 0)');
                break;
            case 'pineapple':
                glowGradient.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
                glowGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
                break;
            case 'mango':
                glowGradient.addColorStop(0, 'rgba(255, 165, 0, 0.3)');
                glowGradient.addColorStop(1, 'rgba(255, 165, 0, 0)');
                break;
            case 'pear':
                glowGradient.addColorStop(0, 'rgba(154, 205, 50, 0.3)');
                glowGradient.addColorStop(1, 'rgba(154, 205, 50, 0)');
                break;
        }
        
        this.ctx.fillStyle = glowGradient;
        this.ctx.fillRect(
            this.fruit.x - 10,
            this.fruit.y - 10,
            this.fruit.width + 20,
            this.fruit.height + 20
        );
        
        // Add falling shine effect
        const time = Date.now() * 0.005;
        const shineX = this.fruit.x + (Math.sin(time + this.fruit.x * 0.01) * 10) + this.fruit.width * 0.3;
        const shineY = this.fruit.y + (Math.cos(time + this.fruit.y * 0.01) * 5) + this.fruit.height * 0.2;
        
        const shineGradient = this.ctx.createRadialGradient(
            shineX, shineY, 0,
            shineX, shineY, 15
        );
        shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        this.ctx.fillStyle = shineGradient;
        this.ctx.beginPath();
        this.ctx.arc(shineX, shineY, 15, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawParticles() {
        this.particles.forEach(p => {
            this.ctx.globalAlpha = p.alpha;
            
            // Different colors based on particle type
            if (p.type === 'splash') {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (p.type === 'levelup') {
                this.ctx.fillStyle = p.color;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Add sparkles
                if (Math.random() < 0.3) {
                    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    this.ctx.beginPath();
                    this.ctx.arc(p.x + (Math.random() - 0.5) * 20, p.y + (Math.random() - 0.5) * 20, 2, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            } else {
                // Fruit particles
                this.ctx.fillStyle = p.color;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Add small sparkles
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                this.ctx.beginPath();
                this.ctx.arc(p.x + 1, p.y - 1, 1, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
        
        // Reset global alpha
        this.ctx.globalAlpha = 1;
    }
    
    drawRippleEffects() {
        this.rippleEffects.forEach(ripple => {
            this.ctx.globalAlpha = ripple.alpha;
            
            const gradient = this.ctx.createRadialGradient(
                ripple.x, ripple.y, ripple.radius - 5,
                ripple.x, ripple.y, ripple.radius
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${ripple.alpha})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // Inner ripple
            this.ctx.beginPath();
            this.ctx.arc(ripple.x, ripple.y, ripple.radius - 10, 0, Math.PI * 2);
            this.ctx.stroke();
        });
        
        // Reset global alpha
        this.ctx.globalAlpha = 1;
    }
    
    drawUI() {
        // Score
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Score: ${this.score}`, 20, 40);
        
        // Shadow for score
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillText(`Score: ${this.score}`, 21, 41);
        
        // Combo
        if (this.combo > 1) {
            this.ctx.font = 'bold 20px Arial';
            this.ctx.textAlign = 'center';
            
            // Combo glow
            const comboText = `COMBO x${this.combo}!`;
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.fillText(comboText, this.canvas.width / 2, 40);
            
            // Shadow
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillText(comboText, this.canvas.width / 2 + 1, 41);
            
            // Color pulse
            const hue = (Date.now() % 6000) / 6000 * 360;
            this.ctx.fillStyle = `hsla(${hue}, 100%, 60%, 0.8)`;
            this.ctx.fillText(comboText, this.canvas.width / 2, 40);
        }
        
        // Level
        this.ctx.font = '18px Arial';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`Level: ${this.level}`, this.canvas.width - 20, 40);
        
        // Max combo
        if (this.maxCombo > 1) {
            this.ctx.font = '14px Arial';
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            this.ctx.textAlign = 'right';
            this.ctx.fillText(`Best: ${this.maxCombo}`, this.canvas.width - 20, 60);
        }
        
        // Instructions
        if (!this.gameOver && this.score === 0) {
            this.ctx.font = '16px Arial';
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Use ← → or tap screen to move', this.canvas.width / 2, this.canvas.height - 30);
        }
    }
    
    drawGameOver() {
        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Animated background
        const time = Date.now() * 0.001;
        const hue = (time % 6) * 60; // Cycle through colors
        
        // Outer glow
        const outerGradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.width
        );
        outerGradient.addColorStop(0, `hsla(${hue}, 100%, 60%, 0.2)`);
        outerGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        this.ctx.fillStyle = outerGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Game over text
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        
        // Text shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2 + 3, this.canvas.height / 2 - 40 + 3);
        
        // Animated gradient text
        const gradient = this.ctx.createLinearGradient(
            this.canvas.width / 2 - 150,
            this.canvas.height / 2 - 80,
            this.canvas.width / 2 + 150,
            this.canvas.height / 2
        );
        gradient.addColorStop(0, `hsl(${(hue + 60) % 360}, 100%, 60%)`);
        gradient.addColorStop(0.5, `hsl(${hue}, 100%, 60%)`);
        gradient.addColorStop(1, `hsl(${(hue + 300) % 360}, 100%, 60%)`);
        this.ctx.fillStyle = gradient;
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 40);
        
        // Score
        this.ctx.font = 'bold 36px Arial';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
        
        // Max combo
        if (this.maxCombo > 1) {
            this.ctx.font = '24px Arial';
            this.ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
            this.ctx.fillText(`Best Combo: x${this.maxCombo}`, this.canvas.width / 2, this.canvas.height / 2 + 60);
        }
        
        // Level reached
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = 'rgba(135, 206, 250, 0.9)';
        this.ctx.fillText(`Level ${this.level}`, this.canvas.width / 2, this.canvas.height / 2 + 90);
        
        // Restart message
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.fillText('Tap or press any key to restart', this.canvas.width / 2, this.canvas.height / 2 + 130);
        
        // Pulse animation for restart text
        const alpha = 0.5 + Math.sin(time * 2) * 0.5;
        this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        this.ctx.fillText('Tap or press any key to restart', this.canvas.width / 2, this.canvas.height / 2 + 130);
        
        // Restart on input (only add once)
        if (!this.restartListenerAdded) {
            document.addEventListener('keydown', () => {
                if (this.gameOver) {
                    this.restart();
                }
            }, { once: true });
            
            this.canvas.addEventListener('touchstart', () => {
                if (this.gameOver) {
                    this.restart();
                }
            }, { once: true });
            
            this.restartListenerAdded = true;
        }
    }
    
    restart() {
        this.score = 0;
        this.gameOver = false;
        this.level = 1;
        this.combo = 0;
        this.maxCombo = 0;
        this.lastScoreTime = 0;
        this.particles = [];
        this.rippleEffects = [];
        this.restartListenerAdded = false;
        this.basket.x = this.canvas.width / 2 - 60;
        this.basket.glow = 0;
        this.basket.direction = 1;
        this.resetFruit();
    }
    
    createParticles(x, y, type) {
        const count = type === 'splash' ? 20 : type === 'levelup' ? 30 : 8;
        
        for (let i = 0; i < count; i++) {
            let color;
            
            if (type === 'levelup') {
                const hue = Math.random() * 360;
                color = `hsl(${hue}, 100%, 60%)`;
            } else {
                // Color based on fruit type
                switch(type) {
                    case 'apple': color = 'red'; break;
                    case 'orange': color = 'orange'; break;
                    case 'banana': color = 'yellow'; break;
                    case 'strawberry': color = '#e75480'; break;
                    case 'cherry': color = 'red'; break;
                    case 'grape': color = 'purple'; break;
                    case 'watermelon': color = 'red'; break;
                    case 'pineapple': color = '#FFD700'; break;
                    case 'mango': color = '#FFA500'; break;
                    case 'pear': color = '#9ACD32'; break;
                    default: color = 'red';
                }
            }
            
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10 - 2,
                gravity: 0.3,
                radius: Math.random() * 3 + 1,
                life: Math.random() * 30 + 20,
                maxLife: 50,
                alpha: 1,
                color: color,
                type: type
            });
        }
    }
    
    createRippleEffect(x, y) {
        this.rippleEffects.push({
            x: x,
            y: y,
            radius: 10,
            alpha: 1,
            color: 'rgba(255, 255, 255, 0.8)'
        });
    }
    
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game when page loads
window.addEventListener('load', () => {
    new Game();
});
