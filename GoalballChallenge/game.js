class GoalballGame {
    constructor() {
        this.canvas = document.getElementById('goalballCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameState = 'menu'; // menu, countdown, userServe, botServe, userDefense, botDefense, gameOver
        this.userScore = 0;
        this.botScore = 0;
        this.targetScore = 5;
        
        // Game objects
        this.userPlayers = [];
        this.botPlayers = [];
        this.ball = null;
        this.selectedPlayer = null;
        this.selectedDirection = null;
        this.selectedDefense = null;
        
        // Enhanced ball physics
        this.ballTrail = [];
        this.ballCurve = 0;
        this.ballBounce = 0;
        this.ballSpeed = 1;
        
        // Enhanced blocking mechanics
        this.blockAnimation = { active: false, progress: 0, player: null };
        this.defenseRadius = 60; // Larger blocking zone
        this.reactionTime = 1000; // ms for defense reaction
        
        // Audio context for spatial sound
        this.audioContext = null;
        this.audioSources = {};
        
        // Animation and timing
        this.animationId = null;
        this.countdownTimer = null;
        this.ballAnimationProgress = 0;
        this.ballAnimationDuration = 2500; // Slower for more suspense
        
        // Goal zones (full width)
        this.goalZones = {
            top: { x: 0, y: 0, width: 600, height: 120 },
            bottom: { x: 0, y: 780, width: 600, height: 120 }
        };
        
        this.initializeGame();
        this.setupEventListeners();
        this.initializeAudio();
    }
    
    initializeGame() {
        // Initialize player positions
        this.userPlayers = [
            { x: 150, y: 800, id: 0, active: false },
            { x: 300, y: 800, id: 1, active: false },
            { x: 450, y: 800, id: 2, active: false }
        ];
        
        this.botPlayers = [
            { x: 150, y: 100, id: 0, active: false },
            { x: 300, y: 100, id: 1, active: false },
            { x: 450, y: 100, id: 2, active: false }
        ];
        
        this.ball = {
            x: 300,
            y: 450,
            radius: 10,
            visible: false,
            direction: null,
            startX: 300,
            startY: 450,
            endX: 300,
            endY: 450
        };
        
        this.drawCourt();
    }
    
    setupEventListeners() {
        // Main game buttons
        document.getElementById('playButton').addEventListener('click', () => this.startGame());
        document.getElementById('playAgainButton').addEventListener('click', () => this.resetGame());
        document.getElementById('serveButton').addEventListener('click', () => this.executeServe());
        
        // Player selection buttons
        document.querySelectorAll('.player-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectPlayer(parseInt(e.target.dataset.player)));
        });
        
        // Direction selection buttons
        document.querySelectorAll('.direction-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectDirection(e.target.dataset.direction));
        });
        
        // Defense selection buttons
        document.querySelectorAll('.defense-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectDefense(e.target.dataset.defense));
        });
    }
    
    async initializeAudio() {
        try {
            // Initialize Web Audio API
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Preload audio files
            const audioFiles = ['bell-left.wav', 'bell-center.wav', 'bell-right.wav'];
            
            for (const file of audioFiles) {
                try {
                    const response = await fetch(`assets/${file}`);
                    if (response.ok) {
                        const arrayBuffer = await response.arrayBuffer();
                        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
                        this.audioSources[file] = audioBuffer;
                    }
                } catch (error) {
                    console.warn(`Could not load audio file: ${file}. Game will continue without audio.`);
                }
            }
        } catch (error) {
            console.warn('Audio initialization failed. Game will continue without audio.', error);
        }
    }
    
    playDirectionalAudio(direction) {
        try {
            if (window.generateBellSound) {
                let frequency = 440; // Center frequency
                if (direction === 'left') frequency = 330;
                if (direction === 'right') frequency = 550;
                window.generateBellSound(frequency, 0.8);
            }
        } catch (error) {
            console.warn('Error playing directional audio:', error);
        }
    }
    
    playGoalSound() {
        try {
            if (window.generateBellSound) {
                // Play celebration chord
                setTimeout(() => window.generateBellSound(523, 0.5), 0);   // C
                setTimeout(() => window.generateBellSound(659, 0.5), 100); // E
                setTimeout(() => window.generateBellSound(784, 0.8), 200); // G
            }
        } catch (error) {
            console.warn('Error playing goal sound:', error);
        }
    }
    
    playBlockSound() {
        try {
            if (window.generateBellSound) {
                // Low thump sound for blocks
                window.generateBellSound(150, 0.3);
            }
        } catch (error) {
            console.warn('Error playing block sound:', error);
        }
    }
    
    playWhooshSound() {
        try {
            if (window.generateBellSound && Math.random() < 0.3) {
                // Subtle whoosh during ball movement
                window.generateBellSound(200 + Math.random() * 100, 0.1);
            }
        } catch (error) {
            console.warn('Error playing whoosh sound:', error);
        }
    }
    
    drawCourt() {
        const ctx = this.ctx;
        
        // Clear canvas
        ctx.fillStyle = '#4a7c2a';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw enhanced court layout
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        
        // Full-width goal areas (enhanced)
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(255, 255, 0, 0.1)'; // Light yellow goal zones
        ctx.fillRect(0, 0, 600, 120); // Top goal area
        ctx.fillRect(0, 780, 600, 120); // Bottom goal area
        
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, 600, 120);
        ctx.strokeRect(0, 780, 600, 120);
        
        // Official Goalball court zones
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.setLineDash([15, 15]);
        
        // Orientation areas (team areas)
        ctx.strokeRect(50, 120, 500, 180); // Top orientation area
        ctx.strokeRect(50, 600, 500, 180); // Bottom orientation area
        
        // Landing areas
        ctx.setLineDash([8, 8]);
        ctx.strokeRect(100, 300, 400, 150); // Top landing area
        ctx.strokeRect(100, 450, 400, 150); // Bottom landing area
        
        // Center circle (neutral zone)
        ctx.setLineDash([]);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(300, 450, 80, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Center line (solid)
        ctx.beginPath();
        ctx.moveTo(0, 450);
        ctx.lineTo(600, 450);
        ctx.stroke();
        
        // Side boundaries
        ctx.beginPath();
        ctx.moveTo(50, 120);
        ctx.lineTo(50, 780);
        ctx.moveTo(550, 120);
        ctx.lineTo(550, 780);
        ctx.stroke();
        
        // Draw ball trail
        this.drawBallTrail();
        
        // Draw players
        this.drawPlayers();
        
        // Draw ball if visible
        if (this.ball.visible) {
            this.drawBall();
        }
        
        // Draw block animation
        this.drawBlockAnimation();
        
        // Draw labels
        this.drawLabels();
    }
    
    drawPlayers() {
        const ctx = this.ctx;
        
        // Draw bot players (top)
        ctx.fillStyle = '#ff4444';
        this.botPlayers.forEach((player, index) => {
            ctx.beginPath();
            ctx.arc(player.x, player.y, 20, 0, 2 * Math.PI);
            ctx.fill();
            
            // Player label
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`B${index + 1}`, player.x, player.y + 4);
            ctx.fillStyle = '#ff4444';
            
            // Highlight if active
            if (player.active) {
                ctx.strokeStyle = '#ffff00';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(player.x, player.y, 25, 0, 2 * Math.PI);
                ctx.stroke();
            }
        });
        
        // Draw user players (bottom)
        ctx.fillStyle = '#4444ff';
        this.userPlayers.forEach((player, index) => {
            ctx.beginPath();
            ctx.arc(player.x, player.y, 20, 0, 2 * Math.PI);
            ctx.fill();
            
            // Player label
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`P${index + 1}`, player.x, player.y + 4);
            ctx.fillStyle = '#4444ff';
            
            // Highlight if active/selected
            if (player.active || this.selectedPlayer === index) {
                ctx.strokeStyle = '#ffff00';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(player.x, player.y, 25, 0, 2 * Math.PI);
                ctx.stroke();
            }
        });
    }
    
    drawBall() {
        const ctx = this.ctx;
        
        // Add subtle bounce effect
        const bounceOffset = Math.sin(this.ballBounce) * 3;
        const ballY = this.ball.y + bounceOffset;
        
        // Ball shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(this.ball.x, this.ball.y + 5, this.ball.radius * 0.8, this.ball.radius * 0.4, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Main ball
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(this.ball.x, ballY, this.ball.radius, 0, 2 * Math.PI);
        ctx.fill();
        
        // Ball outline with glow
        ctx.strokeStyle = '#ff8800';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Inner highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(this.ball.x - 3, ballY - 3, this.ball.radius * 0.4, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    drawBallTrail() {
        const ctx = this.ctx;
        if (this.ballTrail.length > 0) {
            ctx.strokeStyle = 'rgba(255, 255, 0, 0.6)';
            ctx.lineWidth = 8;
            ctx.lineCap = 'round';
            ctx.beginPath();
            
            for (let i = 1; i < this.ballTrail.length; i++) {
                const alpha = i / this.ballTrail.length;
                ctx.globalAlpha = alpha * 0.6;
                ctx.moveTo(this.ballTrail[i-1].x, this.ballTrail[i-1].y);
                ctx.lineTo(this.ballTrail[i].x, this.ballTrail[i].y);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
        }
    }
    
    drawBlockAnimation() {
        if (this.blockAnimation.active && this.blockAnimation.player) {
            const ctx = this.ctx;
            const player = this.blockAnimation.player;
            const progress = this.blockAnimation.progress;
            
            // Pulsing glow effect
            const glowRadius = 30 + (Math.sin(progress * Math.PI * 4) * 10);
            const glowAlpha = 0.8 - (progress * 0.6);
            
            ctx.save();
            ctx.globalAlpha = glowAlpha;
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(player.x, player.y, glowRadius, 0, 2 * Math.PI);
            ctx.stroke();
            
            // Inner pulse
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(player.x, player.y, glowRadius - 10, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.restore();
        }
    }
    
    drawLabels() {
        const ctx = this.ctx;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        
        // Enhanced goal zone labels
        ctx.fillStyle = '#ffff00';
        ctx.font = 'bold 18px Arial';
        ctx.fillText('BOT GOAL ZONE', 300, 40);
        ctx.fillText('YOUR GOAL ZONE', 300, 860);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('ORIENTATION AREA', 300, 140);
        ctx.fillText('ORIENTATION AREA', 300, 760);
        
        // Zone labels
        ctx.font = '12px Arial';
        ctx.fillText('LANDING AREA', 300, 320);
        ctx.fillText('LANDING AREA', 300, 580);
        ctx.fillText('NEUTRAL ZONE', 300, 420);
        
        // Direction indicators
        ctx.font = 'bold 14px Arial';
        ctx.fillText('LEFT', 100, 470);
        ctx.fillText('CENTER', 300, 470);
        ctx.fillText('RIGHT', 500, 470);
    }
    
    startGame() {
        this.gameState = 'countdown';
        this.hideAllControls();
        this.showCountdown();
    }
    
    showCountdown() {
        const countdownDisplay = document.getElementById('countdownDisplay');
        let count = 3;
        
        const updateCountdown = () => {
            if (count > 0) {
                countdownDisplay.textContent = count;
                countdownDisplay.style.display = 'block';
                count--;
                setTimeout(updateCountdown, 1000);
            } else {
                countdownDisplay.textContent = 'GO!';
                setTimeout(() => {
                    countdownDisplay.style.display = 'none';
                    this.startFirstServe();
                }, 1000);
            }
        };
        
        updateCountdown();
    }
    
    startFirstServe() {
        // Randomly decide who serves first
        const userServes = Math.random() < 0.5;
        
        if (userServes) {
            this.gameState = 'userServe';
            this.updateGameMessage('Your turn to serve! Choose a player and direction.');
            this.showServeControls();
        } else {
            this.gameState = 'botServe';
            this.updateGameMessage('Bot is serving! Get ready to defend.');
            this.showDefenseControls();
            setTimeout(() => this.executeBotServe(), 2000);
        }
    }
    
    selectPlayer(playerId) {
        this.selectedPlayer = playerId;
        this.updatePlayerButtons();
        this.checkServeReady();
        this.drawCourt();
    }
    
    selectDirection(direction) {
        this.selectedDirection = direction;
        this.updateDirectionButtons();
        this.checkServeReady();
    }
    
    selectDefense(defense) {
        this.selectedDefense = defense;
        this.updateDefenseButtons();
        
        // Execute defense immediately
        setTimeout(() => this.resolveDefense(), 500);
    }
    
    updatePlayerButtons() {
        document.querySelectorAll('.player-btn').forEach((btn, index) => {
            btn.classList.toggle('selected', index === this.selectedPlayer);
        });
    }
    
    updateDirectionButtons() {
        document.querySelectorAll('.direction-btn').forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.direction === this.selectedDirection);
        });
    }
    
    updateDefenseButtons() {
        document.querySelectorAll('.defense-btn').forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.defense === this.selectedDefense);
        });
    }
    
    checkServeReady() {
        const serveButton = document.getElementById('serveButton');
        const ready = this.selectedPlayer !== null && this.selectedDirection !== null;
        serveButton.disabled = !ready;
    }
    
    executeServe() {
        if (this.selectedPlayer === null || this.selectedDirection === null) return;
        
        this.hideAllControls();
        this.updateGameMessage('Ball is rolling...');
        
        // Activate selected player
        this.userPlayers.forEach(p => p.active = false);
        this.userPlayers[this.selectedPlayer].active = true;
        
        // Enhanced serve mechanics
        this.ball.visible = true;
        this.ball.direction = this.selectedDirection;
        this.ball.startX = this.userPlayers[this.selectedPlayer].x;
        this.ball.startY = this.userPlayers[this.selectedPlayer].y - 30;
        
        // Add strategic shot placement with some variance
        const baseX = this.getDirectionX(this.selectedDirection);
        const variance = (Math.random() - 0.5) * 80; // Add unpredictability
        this.ball.endX = Math.max(50, Math.min(550, baseX + variance));
        this.ball.endY = 60; // Into goal zone
        
        // Add curve based on direction and power
        this.ballCurve = (Math.random() - 0.5) * 40;
        
        // Play directional audio
        this.playDirectionalAudio(this.selectedDirection);
        
        this.animateBall(() => {
            this.executeBotDefense();
        });
    }
    
    executeBotDefense() {
        // Enhanced bot defense with reaction zones
        const defenseOptions = ['left', 'center', 'right'];
        const botDefense = defenseOptions[Math.floor(Math.random() * defenseOptions.length)];
        
        // Highlight defending bot
        this.botPlayers.forEach(p => p.active = false);
        const defenseIndex = defenseOptions.indexOf(botDefense);
        const defendingPlayer = this.botPlayers[defenseIndex];
        defendingPlayer.active = true;
        
        this.drawCourt();
        
        // Add reaction time delay for realism
        setTimeout(() => {
            // Calculate if block is successful based on ball position and defender reach
            const distance = Math.abs(this.ball.endX - defendingPlayer.x);
            const blockSuccess = distance <= this.defenseRadius;
            
            if (blockSuccess) {
                // Successful block with animation
                this.blockAnimation = {
                    active: true,
                    progress: 0,
                    player: defendingPlayer
                };
                
                this.playBlockSound();
                this.animateBlockEffect(() => {
                    this.updateGameMessage('Bot blocked your shot! Bot\'s turn to serve.');
                    this.gameState = 'botServe';
                    setTimeout(() => {
                        this.showDefenseControls();
                        setTimeout(() => this.executeBotServe(), 2000);
                    }, 1500);
                });
            } else {
                // Goal scored with celebration
                this.userScore++;
                this.updateScore();
                this.updateGameMessage('GOAL! You scored!');
                this.playGoalSound();
                this.animateGoalEffect();
                
                if (this.userScore >= this.targetScore) {
                    setTimeout(() => this.endGame('win'), 2000);
                } else {
                    setTimeout(() => {
                        this.gameState = 'botServe';
                        this.showDefenseControls();
                        setTimeout(() => this.executeBotServe(), 2000);
                    }, 2000);
                }
            }
            
            this.resetBall();
            this.resetPlayerStates();
        }, this.reactionTime / 2);
    }
    
    executeBotServe() {
        this.updateGameMessage('Bot is serving! Listen for the ball direction.');
        
        // Bot randomly chooses direction and player
        const directions = ['left', 'center', 'right'];
        const botDirection = directions[Math.floor(Math.random() * directions.length)];
        const botPlayer = Math.floor(Math.random() * 3);
        
        // Activate bot player
        this.botPlayers.forEach(p => p.active = false);
        this.botPlayers[botPlayer].active = true;
        
        // Enhanced bot serve mechanics
        this.ball.visible = true;
        this.ball.direction = botDirection;
        this.ball.startX = this.botPlayers[botPlayer].x;
        this.ball.startY = this.botPlayers[botPlayer].y + 30;
        
        // Add strategic shot placement with variance
        const baseX = this.getDirectionX(botDirection);
        const variance = (Math.random() - 0.5) * 80;
        this.ball.endX = Math.max(50, Math.min(550, baseX + variance));
        this.ball.endY = 840; // Into goal zone
        
        // Add curve for realistic movement
        this.ballCurve = (Math.random() - 0.5) * 40;
        
        this.drawCourt();
        
        // Play directional audio
        this.playDirectionalAudio(botDirection);
        
        this.animateBall(() => {
            this.resolveDefense();
        });
    }
    
    resolveDefense() {
        if (this.selectedDefense === null) {
            // Auto-select center if no defense chosen
            this.selectedDefense = 'center';
        }
        
        // Highlight defending player
        this.userPlayers.forEach(p => p.active = false);
        const defenseOptions = ['left', 'center', 'right'];
        const defenseIndex = defenseOptions.indexOf(this.selectedDefense);
        const defendingPlayer = this.userPlayers[defenseIndex];
        defendingPlayer.active = true;
        
        this.drawCourt();
        
        // Enhanced defense with reaction zones
        setTimeout(() => {
            const distance = Math.abs(this.ball.endX - defendingPlayer.x);
            const blockSuccess = distance <= this.defenseRadius;
            
            if (blockSuccess) {
                // Successful block with animation
                this.blockAnimation = {
                    active: true,
                    progress: 0,
                    player: defendingPlayer
                };
                
                this.playBlockSound();
                this.animateBlockEffect(() => {
                    this.updateGameMessage('Great defense! Your turn to serve.');
                    this.gameState = 'userServe';
                    setTimeout(() => {
                        this.showServeControls();
                    }, 1500);
                });
            } else {
                // Bot scores with celebration
                this.botScore++;
                this.updateScore();
                this.updateGameMessage('Bot scored! Get ready for the next round.');
                this.playGoalSound();
                this.animateGoalEffect();
                
                if (this.botScore >= this.targetScore) {
                    setTimeout(() => this.endGame('lose'), 2000);
                } else {
                    setTimeout(() => {
                        this.gameState = 'userServe';
                        this.showServeControls();
                    }, 2000);
                }
            }
            
            this.resetBall();
            this.resetPlayerStates();
            this.selectedDefense = null;
            this.updateDefenseButtons();
        }, 1000);
    }
    
    animateBall(callback) {
        const startTime = Date.now();
        this.ballTrail = [];
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / this.ballAnimationDuration, 1);
            
            // Enhanced easing with slight curve
            const easeProgress = 1 - Math.pow(1 - progress, 2.5);
            
            // Add subtle curve to ball movement
            const midProgress = Math.sin(progress * Math.PI);
            const curve = this.ballCurve * midProgress;
            
            // Update ball position with curve
            const baseX = this.ball.startX + (this.ball.endX - this.ball.startX) * easeProgress;
            const baseY = this.ball.startY + (this.ball.endY - this.ball.startY) * easeProgress;
            
            this.ball.x = baseX + curve;
            this.ball.y = baseY;
            
            // Update bounce animation
            this.ballBounce += 0.3;
            
            // Add to trail
            this.ballTrail.push({ x: this.ball.x, y: this.ball.y });
            if (this.ballTrail.length > 15) {
                this.ballTrail.shift();
            }
            
            // Play whoosh sound during fast movement
            if (progress > 0.1 && progress < 0.9 && Math.random() < 0.1) {
                this.playWhooshSound();
            }
            
            this.drawCourt();
            
            if (progress < 1) {
                this.animationId = requestAnimationFrame(animate);
            } else {
                // Clear trail after animation
                setTimeout(() => {
                    this.ballTrail = [];
                    if (callback) callback();
                }, 300);
            }
        };
        
        animate();
    }
    
    animateBlockEffect(callback) {
        const startTime = Date.now();
        const duration = 800;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            this.blockAnimation.progress = Math.min(elapsed / duration, 1);
            
            this.drawCourt();
            
            if (this.blockAnimation.progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.blockAnimation.active = false;
                if (callback) callback();
            }
        };
        
        animate();
    }
    
    animateGoalEffect() {
        // Flash goal zone briefly
        const originalDrawCourt = this.drawCourt.bind(this);
        let flashCount = 0;
        
        const flashInterval = setInterval(() => {
            const ctx = this.ctx;
            
            // Alternate between normal and bright goal zone
            if (flashCount % 2 === 0) {
                ctx.fillStyle = 'rgba(255, 215, 0, 0.5)';
                ctx.fillRect(0, 0, 600, 120);
            }
            
            flashCount++;
            if (flashCount >= 6) {
                clearInterval(flashInterval);
                originalDrawCourt();
            }
        }, 200);
    }
    
    getDirectionX(direction) {
        switch (direction) {
            case 'left':
                return 150;
            case 'center':
                return 300;
            case 'right':
                return 450;
            default:
                return 300;
        }
    }
    
    resetBall() {
        this.ball.visible = false;
        this.ball.x = 300;
        this.ball.y = 450;
        this.ball.direction = null;
    }
    
    resetPlayerStates() {
        this.userPlayers.forEach(p => p.active = false);
        this.botPlayers.forEach(p => p.active = false);
        this.selectedPlayer = null;
        this.selectedDirection = null;
        this.updatePlayerButtons();
        this.updateDirectionButtons();
    }
    
    updateScore() {
        document.getElementById('userScore').textContent = this.userScore;
        document.getElementById('botScore').textContent = this.botScore;
    }
    
    updateGameMessage(message) {
        document.getElementById('gameMessage').textContent = message;
    }
    
    showServeControls() {
        document.getElementById('serveControls').style.display = 'block';
        this.checkServeReady();
    }
    
    showDefenseControls() {
        document.getElementById('defenseControls').style.display = 'block';
    }
    
    hideAllControls() {
        document.getElementById('playButton').style.display = 'none';
        document.getElementById('playAgainButton').style.display = 'none';
        document.getElementById('serveControls').style.display = 'none';
        document.getElementById('defenseControls').style.display = 'none';
    }
    
    endGame(result) {
        this.gameState = 'gameOver';
        this.hideAllControls();
        
        if (result === 'win') {
            this.updateGameMessage('🎉 Congratulations! You won the Goalball match! 🎉');
        } else {
            this.updateGameMessage('💪 Good effort! The bot won this time. Try again!');
        }
        
        document.getElementById('playAgainButton').style.display = 'inline-block';
    }
    
    resetGame() {
        this.userScore = 0;
        this.botScore = 0;
        this.gameState = 'menu';
        this.updateScore();
        this.resetBall();
        this.resetPlayerStates();
        this.selectedDefense = null;
        this.updateDefenseButtons();
        
        this.hideAllControls();
        document.getElementById('playButton').style.display = 'inline-block';
        
        this.updateGameMessage('Welcome back to Goalball! Click "Play Game" to start a new match.');
        this.drawCourt();
    }
}

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    const game = new GoalballGame();
});

// Handle audio context resume for browsers that require user interaction
document.addEventListener('click', () => {
    if (window.goalballGame && window.goalballGame.audioContext && window.goalballGame.audioContext.state === 'suspended') {
        window.goalballGame.audioContext.resume();
    }
}, { once: true });
