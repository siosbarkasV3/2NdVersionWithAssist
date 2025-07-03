// EGCA European 2025 Goalball Tournament - Enhanced JavaScript
// Enhanced with interactive physics, accessibility features, and voice assistant

// Import translation system
document.addEventListener('DOMContentLoaded', function() {
    // Load translation system
    const script = document.createElement('script');
    script.src = 'translations.js';
    script.onload = function() {
        initializeWebsite();
    };
    document.head.appendChild(script);
});

function initializeWebsite() {
    // Initialize all components
    initializeNavigation();
    initializeDarkMode();
    initializeLanguageSwitcher();
    initializeAnimations();
    initializePageSpecificFeatures();
    initializePageLoader();
    initializeAccessibilityFeatures(); // Moved before voice assistant
    initializeVoiceAssistant();
    initializeInteractivePhysics();
}

// SECTION: Navigation & Mobile Menu
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const navbar = document.querySelector('.navbar');

    // Sticky navbar with blur effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (hamburger && sidebar) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            sidebar.classList.toggle('active');
        });
    }

    if (sidebarClose) {
        sidebarClose.addEventListener('click', () => {
            hamburger.classList.remove('active');
            sidebar.classList.remove('active');
        });
    }

    // Close sidebar when clicking on links
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            sidebar.classList.remove('active');
        });
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (sidebar && sidebar.classList.contains('active')) {
            if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                sidebar.classList.remove('active');
            }
        }
    });
}

// SECTION: Dark Mode Toggle
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('egca-theme') || 'light';
    
    // Apply saved theme
    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        if (darkModeToggle) {
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('egca-theme', newTheme);
            
            // Update icon
            darkModeToggle.innerHTML = newTheme === 'dark' 
                ? '<i class="fas fa-moon"></i>' 
                : '<i class="fas fa-sun"></i>';
        });
    }
}

// SECTION: Language Switcher
function initializeLanguageSwitcher() {
    const languageToggle = document.getElementById('languageToggle');
    const languageDropdown = document.getElementById('languageDropdown');
    const languageOptions = document.querySelectorAll('.language-option');

    if (languageToggle && languageDropdown) {
        languageToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            languageDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            languageDropdown.classList.remove('active');
        });

        languageDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Handle language selection
    languageOptions.forEach(option => {
        option.addEventListener('click', () => {
            const langCode = option.getAttribute('data-lang');
            if (window.translationSystem) {
                window.translationSystem.setLanguage(langCode);
            }
            languageDropdown.classList.remove('active');
        });
    });
}

// SECTION: Page Loader Animation
function initializePageLoader() {
    const pageLoader = document.getElementById('pageLoader');
    
    // Show loader on page navigation
    const navLinks = document.querySelectorAll('a[href$=".html"], .nav-link, .sidebar-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.includes('.html') && !href.startsWith('#')) {
                if (pageLoader) {
                    pageLoader.classList.add('active');
                }
            }
        });
    });

    // Hide loader when page loads
    window.addEventListener('load', () => {
        if (pageLoader) {
            setTimeout(() => {
                pageLoader.classList.remove('active');
            }, 500);
        }
    });
}

// SECTION: Interactive Physics for Hero Section
function initializeInteractivePhysics() {
    const hero = document.querySelector('.hero');
    const backgroundVideo = document.querySelector('.background-video');
    const heroButtons = document.querySelectorAll('.hero .btn');

    if (hero && backgroundVideo) {
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            mouseX = (e.clientX - rect.left) / rect.width;
            mouseY = (e.clientY - rect.top) / rect.height;
            
            targetX = (mouseX - 0.5) * 20;
            targetY = (mouseY - 0.5) * 10;
        });

        // Smooth animation loop
        function animateVideo() {
            const currentX = parseFloat(backgroundVideo.style.transform?.match(/translateX\(([^)]+)\)/)?.[1] || 0);
            const currentY = parseFloat(backgroundVideo.style.transform?.match(/translateY\(([^)]+)\)/)?.[1] || 0);
            
            const newX = currentX + (targetX - currentX) * 0.1;
            const newY = currentY + (targetY - currentY) * 0.1;
            
            backgroundVideo.style.transform = `translate(${newX}px, ${newY}px) scale(1.03)`;
            
            requestAnimationFrame(animateVideo);
        }
        
        animateVideo();

        // Button hover effects with ball physics
        heroButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                backgroundVideo.style.filter = 'brightness(1.2) contrast(1.1)';
                backgroundVideo.style.transform += ' scale(1.05)';
            });

            button.addEventListener('mouseleave', () => {
                backgroundVideo.style.filter = 'brightness(1.1) contrast(1.05)';
            });
        });
    }
}

// SECTION: Scroll Animations
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    // Observe all sections with fade animation
    const fadeElements = document.querySelectorAll('.section-fade');
    fadeElements.forEach(el => observer.observe(el));
}

// SECTION: Accessibility Features
function initializeAccessibilityFeatures() {
    // High contrast toggle
    window.toggleHighContrast = function() {
        document.body.classList.toggle('high-contrast');
        localStorage.setItem('egca-high-contrast', document.body.classList.contains('high-contrast'));
    };
    
    // Large text toggle
    window.toggleLargeText = function() {
        document.body.classList.toggle('large-text');
        localStorage.setItem('egca-large-text', document.body.classList.contains('large-text'));
    };
    
    // Simplified layout toggle
    window.toggleSimplifiedLayout = function() {
        document.body.classList.toggle('simplified-layout');
        localStorage.setItem('egca-simplified-layout', document.body.classList.contains('simplified-layout'));
    };
    
    // Load saved accessibility preferences
    if (localStorage.getItem('egca-high-contrast') === 'true') {
        document.body.classList.add('high-contrast');
    }
    
    if (localStorage.getItem('egca-large-text') === 'true') {
        document.body.classList.add('large-text');
    }
    
    if (localStorage.getItem('egca-simplified-layout') === 'true') {
        document.body.classList.add('simplified-layout');
    }
    
    // Keyboard navigation improvements
    document.addEventListener('keydown', (e) => {
        // Escape key closes modals and panels
        if (e.key === 'Escape') {
            closeTeamModal();
            document.getElementById('voiceAssistantPanel')?.classList.remove('active');
        }
        
        // Alt + A opens voice assistant
        if (e.altKey && e.key === 'a') {
            e.preventDefault();
            document.getElementById('voiceAssistantToggle')?.click();
        }
    });
}

// SECTION: Voice Assistant Chatbot
function initializeVoiceAssistant() {
    createVoiceAssistantUI();
    
    const assistantToggle = document.getElementById('voiceAssistantToggle');
    const assistantPanel = document.getElementById('voiceAssistantPanel');
    const assistantContent = document.getElementById('assistantContent');
    const assistantStatus = document.getElementById('assistantStatus');
    
    let isListening = false;
    let recognition = null;
    let synthesis = window.speechSynthesis;
    
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase();
            handleVoiceCommand(command);
        };
        
        recognition.onerror = () => {
            setAssistantStatus('Error occurred. Try again.');
            isListening = false;
            assistantToggle.classList.remove('active');
        };
        
        recognition.onend = () => {
            isListening = false;
            assistantToggle.classList.remove('active');
            setAssistantStatus('Ready to help');
        };
    }
    
    if (assistantToggle) {
        assistantToggle.addEventListener('click', () => {
            assistantPanel.classList.toggle('active');
            
            if (assistantPanel.classList.contains('active')) {
                playBellSound();
                addAssistantMessage('bot', 'Hello! I\'m your EGCA assistant. I can help you navigate the site, read content aloud, or answer questions about the tournament. Try saying "read this page" or "go to teams".');
            }
        });
    }
    
    // Voice control buttons
    document.getElementById('startListening')?.addEventListener('click', startListening);
    document.getElementById('readPage')?.addEventListener('click', readCurrentPage);
    document.getElementById('toggleContrast')?.addEventListener('click', toggleHighContrast);
    document.getElementById('toggleTextSize')?.addEventListener('click', toggleLargeText);
    
    function startListening() {
        if (recognition && !isListening) {
            isListening = true;
            assistantToggle.classList.add('active');
            setAssistantStatus('Listening...');
            playBellSound();
            recognition.start();
        }
    }
    
    function handleVoiceCommand(command) {
        addAssistantMessage('user', command);
        
        if (command.includes('read this page') || command.includes('read page')) {
            readCurrentPage();
        } else if (command.includes('go to teams') || command.includes('teams')) {
            navigateToPage('teams.html');
            speak('Navigating to teams page');
        } else if (command.includes('go to results') || command.includes('results')) {
            navigateToPage('results.html');
            speak('Navigating to results page');
        } else if (command.includes('go to home') || command.includes('home')) {
            navigateToPage('index.html');
            speak('Navigating to home page');
        } else if (command.includes('high contrast') || command.includes('contrast')) {
            toggleHighContrast();
            speak('Toggled high contrast mode');
        } else if (command.includes('large text') || command.includes('bigger text')) {
            toggleLargeText();
            speak('Toggled large text mode');
        } else if (command.includes('vote for greece') || command.includes('greece')) {
            voteForTeam('greece');
            speak('Voted for Greece');
        } else if (command.includes('help') || command.includes('what can you do')) {
            const helpText = 'I can read pages aloud, navigate to different sections, toggle accessibility features, and help with voting. Try saying "read this page", "go to teams", "high contrast", or "vote for Greece".';
            addAssistantMessage('bot', helpText);
            speak(helpText);
        } else {
            const response = 'I didn\'t understand that command. Try saying "help" to see what I can do.';
            addAssistantMessage('bot', response);
            speak(response);
        }
    }
    
    function readCurrentPage() {
        const pageTitle = document.querySelector('.page-title, .hero-title')?.textContent || 'EGCA European 2025';
        const pageSubtitle = document.querySelector('.page-subtitle, .hero-subtitle')?.textContent || '';
        const mainContent = Array.from(document.querySelectorAll('p, h2, h3')).slice(0, 5).map(el => el.textContent).join('. ');
        
        const textToRead = `${pageTitle}. ${pageSubtitle}. ${mainContent}`;
        speak(textToRead);
        addAssistantMessage('bot', 'Reading page content aloud...');
    }
    
    function speak(text) {
        if (synthesis) {
            synthesis.cancel(); // Stop any ongoing speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 0.8;
            synthesis.speak(utterance);
        }
    }
    
    function addAssistantMessage(type, message) {
        if (assistantContent) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `assistant-message ${type}`;
            messageDiv.textContent = message;
            assistantContent.appendChild(messageDiv);
            assistantContent.scrollTop = assistantContent.scrollHeight;
        }
    }
    
    function setAssistantStatus(status) {
        if (assistantStatus) {
            assistantStatus.textContent = status;
            assistantStatus.className = 'assistant-status';
            if (status.includes('Listening')) {
                assistantStatus.classList.add('listening');
            }
        }
    }
    
    function navigateToPage(page) {
        window.location.href = page;
    }
    
    function voteForTeam(team) {
        const voteButton = document.querySelector(`[data-team="${team}"]`);
        if (voteButton) {
            voteButton.click();
        }
    }
    
    function playBellSound() {
        try {
            if (window.generateBellSound) {
                window.generateBellSound(440, 0.3);
            }
        } catch (error) {
            console.warn('Could not play bell sound:', error);
        }
    }
}

function createVoiceAssistantUI() {
    const assistantHTML = `
        <div class="voice-assistant" id="voiceAssistant">
            <button class="voice-assistant-toggle" id="voiceAssistantToggle" aria-label="Open voice assistant">
                <i class="fas fa-microphone"></i>
            </button>
            <div class="voice-assistant-panel" id="voiceAssistantPanel">
                <div class="assistant-header">
                    <div class="assistant-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="assistant-info">
                        <h3>EGCA Assistant</h3>
                        <div class="assistant-status" id="assistantStatus">Ready to help</div>
                    </div>
                </div>
                <div class="assistant-content" id="assistantContent">
                    <!-- Messages will be added here -->
                </div>
                <div class="assistant-controls">
                    <button class="assistant-btn" id="startListening">
                        <i class="fas fa-microphone"></i> Listen
                    </button>
                    <button class="assistant-btn" id="readPage">
                        <i class="fas fa-volume-up"></i> Read
                    </button>
                    <button class="assistant-btn" id="toggleContrast">
                        <i class="fas fa-adjust"></i> Contrast
                    </button>
                    <button class="assistant-btn" id="toggleTextSize">
                        <i class="fas fa-text-height"></i> Text Size
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', assistantHTML);
}

// SECTION: Page-Specific Features
function initializePageSpecificFeatures() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch (currentPage) {
        case 'index.html':
        case '':
            // Homepage specific features
            break;
        case 'teams.html':
            initializeTeamsPage();
            break;
        case 'results.html':
            initializeResultsPage();
            break;
        case 'help.html':
            initializeHelpPage();
            break;
        case 'info.html':
            initializeInfoPage();
            break;
    }
}

// SECTION: Teams Page Features
function initializeTeamsPage() {
    initializeTeamFilters();
    initializeTeamCards();
    initializeTeamModal();
}

function initializeTeamFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const teamsContainer = document.getElementById('teamsContainer');
    
    // Enhanced team data with flags
    const teams = [
        { name: 'Greece', initials: 'GR', nation: 'Greece', players: 6, region: 'southern', flag: '🇬🇷' },
        { name: 'Germany', initials: 'DE', nation: 'Germany', players: 6, region: 'western', flag: '🇩🇪' },
        { name: 'France', initials: 'FR', nation: 'France', players: 6, region: 'western', flag: '🇫🇷' },
        { name: 'Italy', initials: 'IT', nation: 'Italy', players: 6, region: 'southern', flag: '🇮🇹' },
        { name: 'Spain', initials: 'ES', nation: 'Spain', players: 6, region: 'southern', flag: '🇪🇸' },
        { name: 'Poland', initials: 'PL', nation: 'Poland', players: 6, region: 'eastern', flag: '🇵🇱' },
        { name: 'Netherlands', initials: 'NL', nation: 'Netherlands', players: 6, region: 'western', flag: '🇳🇱' },
        { name: 'Belgium', initials: 'BE', nation: 'Belgium', players: 6, region: 'western', flag: '🇧🇪' },
        { name: 'Portugal', initials: 'PT', nation: 'Portugal', players: 6, region: 'southern', flag: '🇵🇹' },
        { name: 'Finland', initials: 'FI', nation: 'Finland', players: 6, region: 'northern', flag: '🇫🇮' },
        { name: 'Sweden', initials: 'SE', nation: 'Sweden', players: 6, region: 'northern', flag: '🇸🇪' },
        { name: 'Lithuania', initials: 'LT', nation: 'Lithuania', players: 6, region: 'eastern', flag: '🇱🇹' },
        { name: 'Czech Republic', initials: 'CZ', nation: 'Czech Republic', players: 6, region: 'eastern', flag: '🇨🇿' },
        { name: 'Austria', initials: 'AT', nation: 'Austria', players: 6, region: 'western', flag: '🇦🇹' },
        { name: 'Denmark', initials: 'DK', nation: 'Denmark', players: 6, region: 'northern', flag: '🇩🇰' },
        { name: 'Norway', initials: 'NO', nation: 'Norway', players: 6, region: 'northern', flag: '🇳🇴' }
    ];

    function renderTeams(filteredTeams) {
        if (!teamsContainer) return;
        
        teamsContainer.innerHTML = filteredTeams.map(team => `
            <div class="team-card" data-team="${team.name.toLowerCase()}" data-region="${team.region}">
                <span class="team-flag">${team.flag}</span>
                <div class="team-initials">${team.initials}</div>
                <h3 class="team-name">${team.name}</h3>
                <p class="team-nation">${team.nation}</p>
                <div class="team-info">
                    <span class="team-players">${team.players} players</span>
                    <span class="team-region">${team.region}</span>
                </div>
            </div>
        `).join('');
        
        // Re-initialize team card click handlers
        initializeTeamCards();
    }

    // Initial render
    renderTeams(teams);

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            const filteredTeams = filter === 'all' 
                ? teams 
                : teams.filter(team => team.region === filter);
            
            renderTeams(filteredTeams);
        });
    });
}

function initializeTeamCards() {
    const teamCards = document.querySelectorAll('.team-card');
    teamCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            const teamName = card.getAttribute('data-team');
            openTeamModal(teamName);
        });
    });
}

// SECTION: Team Modal System
function initializeTeamModal() {
    const modal = document.getElementById('teamModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');

    if (modalClose) {
        modalClose.addEventListener('click', closeTeamModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeTeamModal);
    }

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeTeamModal();
        }
    });
}

function openTeamModal(teamName) {
    const modal = document.getElementById('teamModal');
    const modalTeamName = document.getElementById('modalTeamName');
    const modalTeamFlag = document.getElementById('modalTeamFlag');
    const modalPlayers = document.getElementById('modalPlayers');
    const modalStaff = document.getElementById('modalStaff');

    // Sample team data with detailed information
    const teamData = {
        'greece': {
            name: 'Team Greece',
            flag: '🇬🇷',
            players: [
                { name: 'Dimitris Papadopoulos', position: 'Center' },
                { name: 'Maria Konstantinou', position: 'Wing' },
                { name: 'Andreas Nikolaidis', position: 'Wing' },
                { name: 'Elena Georgiou', position: 'Center' },
                { name: 'Yannis Stavros', position: 'Wing' },
                { name: 'Sofia Dimitriou', position: 'Center' }
            ],
            staff: [
                { name: 'Kostas Alexandrou', role: 'Head Coach' },
                { name: 'Anna Petridou', role: 'Assistant Coach' },
                { name: 'Dr. Michalis Kostas', role: 'Team Physician' }
            ]
        },
        'germany': {
            name: 'Team Germany',
            flag: '🇩🇪',
            players: [
                { name: 'Hans Mueller', position: 'Center' },
                { name: 'Anna Schmidt', position: 'Wing' },
                { name: 'Klaus Weber', position: 'Wing' },
                { name: 'Petra Fischer', position: 'Center' },
                { name: 'Thomas Wagner', position: 'Wing' },
                { name: 'Sabine Becker', position: 'Center' }
            ],
            staff: [
                { name: 'Wolfgang Schneider', role: 'Head Coach' },
                { name: 'Ingrid Hoffmann', role: 'Assistant Coach' },
                { name: 'Dr. Frank Richter', role: 'Team Physician' }
            ]
        },
        'france': {
            name: 'Team France',
            flag: '🇫🇷',
            players: [
                { name: 'Pierre Dubois', position: 'Center' },
                { name: 'Marie Leroy', position: 'Wing' },
                { name: 'Jean Martin', position: 'Wing' },
                { name: 'Sophie Bernard', position: 'Center' },
                { name: 'Luc Moreau', position: 'Wing' },
                { name: 'Camille Petit', position: 'Center' }
            ],
            staff: [
                { name: 'Antoine Rousseau', role: 'Head Coach' },
                { name: 'Isabelle Garnier', role: 'Assistant Coach' },
                { name: 'Dr. Philippe Durand', role: 'Team Physician' }
            ]
        }
        // Add more teams as needed
    };

    const team = teamData[teamName] || teamData['greece']; // Fallback to Greece

    if (modalTeamName) modalTeamName.textContent = team.name;
    if (modalTeamFlag) modalTeamFlag.textContent = team.flag;

    if (modalPlayers) {
        modalPlayers.innerHTML = team.players.map(player => `
            <div class="player-card">
                <div class="player-name">${player.name}</div>
                <div class="player-position">${player.position}</div>
            </div>
        `).join('');
    }

    if (modalStaff) {
        modalStaff.innerHTML = team.staff.map(staff => `
            <div class="staff-item">
                <div class="staff-name">${staff.name}</div>
                <div class="staff-role">${staff.role}</div>
            </div>
        `).join('');
    }

    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeTeamModal() {
    const modal = document.getElementById('teamModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// SECTION: Results Page Features
function initializeResultsPage() {
    initializeVotingSystem();
    initializeMatchFilters();
}

function initializeVotingSystem() {
    const votingInterface = document.getElementById('votingInterface');
    const voteThankYou = document.getElementById('voteThankYou');
    const voteButtons = document.querySelectorAll('.team-vote-btn');
    const voteBarChart = document.getElementById('voteBarChart');

    // Check if user has already voted
    const hasVoted = localStorage.getItem('egca-has-voted') === 'true';
    
    if (hasVoted && votingInterface && voteThankYou) {
        votingInterface.style.display = 'none';
        voteThankYou.style.display = 'block';
    }

    // Initialize vote data
    let voteData = JSON.parse(localStorage.getItem('egca-vote-data')) || {
        'greece': 45,
        'germany': 38,
        'france': 32,
        'italy': 28,
        'spain': 25,
        'poland': 22,
        'netherlands': 18,
        'belgium': 15,
        'portugal': 12,
        'finland': 10,
        'sweden': 8,
        'lithuania': 5
    };

    function updateVoteChart() {
        if (!voteBarChart) return;

        // Sort teams by votes and get top 5
        const sortedTeams = Object.entries(voteData)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);

        const totalVotes = Object.values(voteData).reduce((sum, votes) => sum + votes, 0);

        voteBarChart.innerHTML = sortedTeams.map(([team, votes]) => {
            const percentage = ((votes / totalVotes) * 100).toFixed(1);
            const teamName = team.charAt(0).toUpperCase() + team.slice(1);
            
            return `
                <div class="vote-bar">
                    <div class="vote-bar-fill animated" style="width: ${percentage}%">
                        ${percentage}%
                    </div>
                    <div class="vote-bar-label">${teamName} (${votes})</div>
                </div>
            `;
        }).join('');
    }

    // Initial chart update
    updateVoteChart();

    // Handle voting with confetti
    voteButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (hasVoted) return;

            const team = button.getAttribute('data-team');
            
            // Increment vote count
            voteData[team] = (voteData[team] || 0) + 1;
            
            // Save vote data and mark as voted
            localStorage.setItem('egca-vote-data', JSON.stringify(voteData));
            localStorage.setItem('egca-has-voted', 'true');
            
            // Trigger confetti animation
            createConfetti();
            
            // Update UI
            if (votingInterface && voteThankYou) {
                votingInterface.style.display = 'none';
                voteThankYou.style.display = 'block';
            }
            
            // Update chart with animation
            setTimeout(() => {
                updateVoteChart();
            }, 500);
        });
    });
}

function createConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti';
    document.body.appendChild(confettiContainer);
    
    for (let i = 0; i < 50; i++) {
        const confettiPiece = document.createElement('div');
        confettiPiece.className = 'confetti-piece';
        confettiPiece.style.left = Math.random() * 100 + 'vw';
        confettiPiece.style.animationDelay = Math.random() * 3 + 's';
        confettiPiece.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confettiContainer.appendChild(confettiPiece);
    }
    
    // Remove confetti after animation
    setTimeout(() => {
        confettiContainer.remove();
    }, 5000);
}

function initializeMatchFilters() {
    const filterButtons = document.querySelectorAll('.match-filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter logic would go here when matches are available
            const day = button.getAttribute('data-day');
            console.log(`Filtering matches for: ${day}`);
        });
    });
}

// SECTION: Help Page Features
function initializeHelpPage() {
    initializeFAQ();
    initializeContactForm();
}

function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
}

function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Simulate form submission
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
}

// SECTION: Info Page Features
function initializeInfoPage() {
    // Info page specific features can be added here
    console.log('Info page initialized');
}

// SECTION: Utility Functions
function showPageLoader() {
    const pageLoader = document.getElementById('pageLoader');
    if (pageLoader) {
        pageLoader.classList.add('active');
    }
}

function hidePageLoader() {
    const pageLoader = document.getElementById('pageLoader');
    if (pageLoader) {
        pageLoader.classList.remove('active');
    }
}

// SECTION: Error Handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// SECTION: Performance Monitoring
window.addEventListener('load', () => {
    // Hide any loading indicators
    hidePageLoader();
    
    // Log performance metrics
    if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
    }
});

function openGoalballModal() {
  document.getElementById("goalball-modal").style.display = "flex";
  document.body.style.overflow = "hidden"; // Prevent background scroll
}

function closeGoalballModal() {
  const modal = document.getElementById("goalball-modal");
  modal.style.display = "none";
  document.getElementById("goalball-iframe").src = "GoalballChallenge/index.html"; // Stop the game
  document.body.style.overflow = "auto";
}

// Optional: close on ESC
window.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeGoalballModal();
  }
});