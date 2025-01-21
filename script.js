// DOM Elements
const body = document.body;
const preloader = document.querySelector('.preloader');
const header = document.querySelector('.header');
const themeToggle = document.querySelector('.theme-switcher');
const searchToggle = document.querySelector('.search-toggle');
const searchOverlay = document.querySelector('.search-overlay');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav__links a');
const statsElements = document.querySelectorAll('.stat');
const dateDisplay = document.querySelector('.date');
const timeDisplay = document.querySelector('.time');

// Theme Management
const getCurrentTheme = () => localStorage.getItem('theme') || 'light';
const setTheme = (theme) => {
   document.documentElement.setAttribute('data-theme', theme);
   localStorage.setItem('theme', theme);
   updateThemeIcon(theme);
};

const updateThemeIcon = (theme) => {
   const icon = themeToggle.querySelector('i');
   icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
};

// Initialize theme
setTheme(getCurrentTheme());

// Theme toggle
themeToggle.addEventListener('click', () => {
   const currentTheme = getCurrentTheme();
   const newTheme = currentTheme === 'light' ? 'dark' : 'light';
   setTheme(newTheme);
});

// Preloader
window.addEventListener('load', () => {
   const preloaderCanvas = document.getElementById('preloaderCanvas');
   if (preloaderCanvas) {
       const ctx = preloaderCanvas.getContext('2d');
       let progress = 0;

       const drawProgress = () => {
           ctx.clearRect(0, 0, preloaderCanvas.width, preloaderCanvas.height);
           
           // Draw progress circle
           ctx.beginPath();
           ctx.arc(50, 50, 30, 0, (progress / 100) * Math.PI * 2);
           ctx.strokeStyle = '#4066ff';
           ctx.lineWidth = 4;
           ctx.stroke();
           
           progress += 2;
           
           if (progress <= 100) {
               requestAnimationFrame(drawProgress);
           } else {
               preloader.style.opacity = '0';
               setTimeout(() => {
                   preloader.style.display = 'none';
                   body.classList.remove('loading');
               }, 300);
           }
       };

       drawProgress();
   }
});

// Logo Animation
const initLogoAnimation = () => {
   const logoCanvas = document.getElementById('logoCanvas');
   if (logoCanvas) {
       const ctx = logoCanvas.getContext('2d');
       
       const drawLogo = () => {
           ctx.clearRect(0, 0, logoCanvas.width, logoCanvas.height);
           
           // Create gradient
           const gradient = ctx.createLinearGradient(0, 0, logoCanvas.width, logoCanvas.height);
           gradient.addColorStop(0, '#4066ff');
           gradient.addColorStop(1, '#6b89ff');
           
           // Draw stylized 'N'
           ctx.beginPath();
           ctx.moveTo(8, 24);
           ctx.lineTo(8, 8);
           ctx.lineTo(24, 24);
           ctx.lineTo(24, 8);
           ctx.strokeStyle = gradient;
           ctx.lineWidth = 3;
           ctx.stroke();
       };

       drawLogo();
   }
};

initLogoAnimation();

// Particle Background
const initParticleBackground = () => {
   const canvas = document.getElementById('particleCanvas');
   if (!canvas) return;

   const ctx = canvas.getContext('2d');
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;

   const particles = [];
   const particleCount = 50;

   class Particle {
       constructor() {
           this.x = Math.random() * canvas.width;
           this.y = Math.random() * canvas.height;
           this.size = Math.random() * 3 + 1;
           this.speedX = Math.random() * 2 - 1;
           this.speedY = Math.random() * 2 - 1;
       }

       update() {
           this.x += this.speedX;
           this.y += this.speedY;

           if (this.x > canvas.width) this.x = 0;
           if (this.x < 0) this.x = canvas.width;
           if (this.y > canvas.height) this.y = 0;
           if (this.y < 0) this.y = canvas.height;
       }

       draw() {
           ctx.beginPath();
           ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
           ctx.fillStyle = 'rgba(64, 102, 255, 0.1)';
           ctx.fill();
       }
   }

   // Initialize particles
   for (let i = 0; i < particleCount; i++) {
       particles.push(new Particle());
   }

   const animate = () => {
       ctx.clearRect(0, 0, canvas.width, canvas.height);
       particles.forEach(particle => {
           particle.update();
           particle.draw();
       });
       requestAnimationFrame(animate);
   };

   animate();

   window.addEventListener('resize', () => {
       canvas.width = window.innerWidth;
       canvas.height = window.innerHeight;
   });
};

initParticleBackground();

// Stats Counter Animation
const animateStats = () => {
   statsElements.forEach(stat => {
       const targetValue = parseInt(stat.dataset.stat);
       const statNumber = stat.querySelector('.stat__number');
       const canvas = stat.querySelector('.stat__canvas');
       const ctx = canvas.getContext('2d');
       let currentValue = 0;
       
       const drawProgress = (progress) => {
           ctx.clearRect(0, 0, canvas.width, canvas.height);
           
           // Draw background circle
           ctx.beginPath();
           ctx.arc(30, 30, 25, 0, Math.PI * 2);
           ctx.strokeStyle = 'rgba(64, 102, 255, 0.1)';
           ctx.lineWidth = 4;
           ctx.stroke();
           
           // Draw progress
           ctx.beginPath();
           ctx.arc(30, 30, 25, -Math.PI / 2, (-Math.PI / 2) + (progress * Math.PI * 2));
           ctx.strokeStyle = '#4066ff';
           ctx.stroke();
       };

       const updateStat = () => {
           if (currentValue < targetValue) {
               const increment = Math.ceil((targetValue - currentValue) / 20);
               currentValue += increment;
               statNumber.textContent = currentValue.toLocaleString();
               drawProgress(currentValue / targetValue);
               requestAnimationFrame(updateStat);
           } else {
               statNumber.textContent = targetValue.toLocaleString();
               drawProgress(1);
           }
       };

       const observer = new IntersectionObserver((entries) => {
           if (entries[0].isIntersecting) {
               updateStat();
               observer.unobserve(stat);
           }
       });

       observer.observe(stat);
   });
};

// Initialize stats animation when content is loaded
document.addEventListener('DOMContentLoaded', animateStats);

// Smooth Scroll
navLinks.forEach(link => {
   link.addEventListener('click', (e) => {
       e.preventDefault();
       const targetId = link.getAttribute('href');
       const targetElement = document.querySelector(targetId);
       
       if (targetElement) {
           targetElement.scrollIntoView({
               behavior: 'smooth',
               block: 'start'
           });
       }
   });
});

// Header Scroll Effect
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
   const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
   
   // Add/remove header shadow
   header.classList.toggle('header--shadow', scrollTop > 0);
   
   // Hide/show header on scroll
   if (scrollTop > lastScrollTop && scrollTop > 80) {
       header.style.transform = 'translateY(-100%)';
   } else {
       header.style.transform = 'translateY(0)';
   }
   
   lastScrollTop = scrollTop;
   
   // Update progress bar
   const scrollProgress = document.querySelector('.scroll-progress__bar');
   const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
   const progress = `${(scrollTop / height) * 100}%`;
   scrollProgress.style.transform = `scaleX(${scrollTop / height})`;
});

// Date and Time Display
const updateDateTime = () => {
   const now = new Date();
   
   // Update date
   const dateOptions = { 
       day: 'numeric', 
       month: 'short', 
       year: 'numeric' 
   };
   dateDisplay.textContent = now.toLocaleDateString('ru-RU', dateOptions);
   
   // Update time
   const timeOptions = { 
       hour: '2-digit', 
       minute: '2-digit' 
   };
   timeDisplay.textContent = now.toLocaleTimeString('ru-RU', timeOptions);
};

// Update time every second
updateDateTime();
setInterval(updateDateTime, 1000);

// Search Functionality
searchToggle.addEventListener('click', () => {
   searchOverlay.classList.add('active');
   document.querySelector('.search-container input').focus();
});

document.querySelector('.search-close').addEventListener('click', () => {
   searchOverlay.classList.remove('active');
});

// Close search on escape key
document.addEventListener('keydown', (e) => {
   if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
       searchOverlay.classList.remove('active');
   }
});

// Mobile Navigation
navToggle.addEventListener('click', () => {
   const expanded = navToggle.getAttribute('aria-expanded') === 'true';
   navToggle.setAttribute('aria-expanded', !expanded);
   document.querySelector('.nav__links').classList.toggle('active');
});

// Close mobile menu on click outside
document.addEventListener('click', (e) => {
   if (!e.target.closest('.nav') && 
       document.querySelector('.nav__links').classList.contains('active')) {
       document.querySelector('.nav__links').classList.remove('active');
       navToggle.setAttribute('aria-expanded', 'false');
   }
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
   clearTimeout(resizeTimer);
   resizeTimer = setTimeout(() => {
       if (window.innerWidth > 1024) {
           document.querySelector('.nav__links').classList.remove('active');
           navToggle.setAttribute('aria-expanded', 'false');
       }
   }, 250);
});

// Intersection Observer for animations
const observeElements = () => {
   const elements = document.querySelectorAll('[data-aos]');
   
   const observer = new IntersectionObserver((entries) => {
       entries.forEach(entry => {
           if (entry.isIntersecting) {
               entry.target.classList.add('aos-animate');
           }
       });
   }, { threshold: 0.1 });

   elements.forEach(element => observer.observe(element));
};


// Canvas Animation Controller
class CanvasAnimationController {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0, isActive: false };
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.createParticles();
        this.setupEventListeners();
        this.animate();
    }

    setupCanvas() {
        const resize = () => {
            this.canvas.width = this.canvas.offsetWidth * window.devicePixelRatio;
            this.canvas.height = this.canvas.offsetHeight * window.devicePixelRatio;
            this.canvas.style.width = `${this.canvas.offsetWidth}px`;
            this.canvas.style.height = `${this.canvas.offsetHeight}px`;
            this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        resize();
        window.addEventListener('resize', resize);
    }

    createParticles() {
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
            this.mouse.isActive = true;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.isActive = false;
        });
    }

    drawParticles() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Bounce off edges
            if (particle.x > this.canvas.width || particle.x < 0) particle.speedX *= -1;
            if (particle.y > this.canvas.height || particle.y < 0) particle.speedY *= -1;

            // Mouse interaction
            if (this.mouse.isActive) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    particle.x -= (dx / distance) * force;
                    particle.y -= (dy / distance) * force;
                }
            }

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(64, 102, 255, ${particle.opacity})`;
            this.ctx.fill();
        });
    }

    drawConnections() {
        this.particles.forEach((particle1, i) => {
            this.particles.slice(i + 1).forEach(particle2 => {
                const dx = particle1.x - particle2.x;
                const dy = particle1.y - particle2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle1.x, particle1.y);
                    this.ctx.lineTo(particle2.x, particle2.y);
                    this.ctx.strokeStyle = `rgba(64, 102, 255, ${0.2 * (1 - distance / 100)})`;
                    this.ctx.stroke();
                }
            });
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawParticles();
        this.drawConnections();
        requestAnimationFrame(() => this.animate());
    }
}

// Stats Animation Controller
class StatsAnimationController {
    constructor() {
        this.stats = document.querySelectorAll('.stat-number');
        this.initObserver();
    }

    initObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateStat(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.stats.forEach(stat => observer.observe(stat));
    }

    animateStat(statElement) {
        const value = parseInt(statElement.getAttribute('data-value'));
        const suffix = statElement.getAttribute('data-suffix') || '';
        const duration = 2000;
        const steps = 60;
        const stepValue = value / steps;
        let currentValue = 0;

        const updateValue = () => {
            currentValue = Math.min(currentValue + stepValue, value);
            statElement.textContent = `${Math.round(currentValue)}${suffix}`;

            if (currentValue < value) {
                requestAnimationFrame(updateValue);
            }
        };

        requestAnimationFrame(updateValue);
    }
}

// Floating Elements Controller 
class FloatingElementsController {
    constructor() {
        this.elements = document.querySelectorAll('.floating-element');
        this.initElements();
    }

    initElements() {
        this.elements.forEach((element, index) => {
            const delay = index * 0.5;
            element.style.animation = `float 3s ease-in-out ${delay}s infinite`;
        });
    }
}

// Feature Cards Controller
class FeatureCardsController {
    constructor() {
        this.cards = document.querySelectorAll('.feature-card');
        this.initCards();
    }

    initCards() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const icon = card.querySelector('.feature-card__icon');
                icon.style.transform = 'scale(1.2) rotate(5deg)';
                setTimeout(() => {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }, 200);
            });
        });
    }
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Canvas Animation
    new CanvasAnimationController('showcaseCanvas');
    
    // Initialize Stats Animation
    new StatsAnimationController();
    
    // Initialize Floating Elements
    new FloatingElementsController();
    
    // Initialize Feature Cards
    new FeatureCardsController();
});

// Stats Animation
class StatsCounter {
    constructor() {
        this.stats = document.querySelectorAll('.stat');
        this.init();
    }

    init() {
        this.stats.forEach(stat => {
            // Initialize starting value
            const statNumber = stat.querySelector('.stat__number');
            if (!statNumber) return;

            // Set initial value
            const value = stat.dataset.value;
            const suffix = stat.dataset.suffix || '';
            
            // Reset to 0
            if (suffix === '/7') {
                statNumber.textContent = '24/7';
            } else {
                statNumber.textContent = '0' + suffix;
            }

            // Create observer for animation
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    this.animateValue(statNumber, 0, value, suffix);
                    observer.unobserve(stat);
                }
            }, { threshold: 0.5 });

            observer.observe(stat);
        });
    }

    animateValue(element, start, end, suffix) {
        if (suffix === '/7') {
            // Don't animate 24/7, just display it
            element.textContent = '24/7';
            return;
        }

        let current = start;
        const increment = end / 50; // Divide animation into 50 steps
        const duration = 1500; // 1.5 seconds
        const stepTime = duration / 50;

        const timer = setInterval(() => {
            current += increment;
            
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            
            // Format the number based on size
            let displayValue = current;
            if (current >= 1000) {
                displayValue = Math.floor(current / 1000) + 'k';
            } else {
                displayValue = Math.floor(current);
            }
            
            element.textContent = displayValue + suffix;
        }, stepTime);
    }
}

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StatsCounter();
});

// Science Section Animations
class ScienceVisuals {
    constructor() {
        this.initCanvases();
    }

    initCanvases() {
        this.initResearchVisual();
        this.initAnalyticsVisual();
        this.initMethodologyVisual();
    }

    initResearchVisual() {
        const canvas = document.querySelector('#researchCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth * 2;
        canvas.height = canvas.offsetHeight * 2;
        ctx.scale(2, 2);

        let mouseX = 0;
        let mouseY = 0;
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = (e.clientX - rect.left) * 2;
            mouseY = (e.clientY - rect.top) * 2;
        });

        // Создаем нейроны с более сложной структурой
        const neurons = [];
        const neuronCount = 15;

        for (let i = 0; i < neuronCount; i++) {
            neurons.push({
                x: Math.random() * canvas.width/2,
                y: Math.random() * canvas.height/2,
                baseX: Math.random() * canvas.width/2,
                baseY: Math.random() * canvas.height/2,
                radius: Math.random() * 2 + 2,
                speed: Math.random() * 0.3 + 0.1,
                angle: Math.random() * Math.PI * 2,
                angleSpeed: (Math.random() - 0.5) * 0.01,
                pulsePhase: Math.random() * Math.PI * 2,
                connections: [],
                signalParticles: []
            });
        }

        // Создаем соединения между близкими нейронами
        neurons.forEach((neuron, i) => {
            neurons.forEach((otherNeuron, j) => {
                if (i !== j) {
                    const dx = neuron.baseX - otherNeuron.baseX;
                    const dy = neuron.baseY - otherNeuron.baseY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 100) {
                        neuron.connections.push(j);
                    }
                }
            });
        });

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width/2, canvas.height/2);

            // Обновляем позиции нейронов
            neurons.forEach(neuron => {
                // Орбитальное движение вокруг базовой точки
                neuron.angle += neuron.angleSpeed;
                neuron.x = neuron.baseX + Math.cos(neuron.angle) * 20;
                neuron.y = neuron.baseY + Math.sin(neuron.angle) * 20;

                // Влияние курсора мыши
                const dx = mouseX - neuron.x;
                const dy = mouseY - neuron.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    neuron.x -= (dx / distance) * 2;
                    neuron.y -= (dy / distance) * 2;
                }

                // Пульсация и свечение
                neuron.pulsePhase += 0.05;
                const pulseRadius = neuron.radius + Math.sin(neuron.pulsePhase) * 1;

                // Рисуем соединения с эффектом потока
                neuron.connections.forEach(connectionIndex => {
                    const otherNeuron = neurons[connectionIndex];
                    const dx = otherNeuron.x - neuron.x;
                    const dy = otherNeuron.y - neuron.y;
                    
                    ctx.beginPath();
                    ctx.moveTo(neuron.x, neuron.y);
                    
                    // Создаем изогнутую линию для более органичного вида
                    const midX = (neuron.x + otherNeuron.x) / 2;
                    const midY = (neuron.y + otherNeuron.y) / 2;
                    const offset = Math.sin(neuron.pulsePhase) * 10;
                    ctx.quadraticCurveTo(
                        midX + offset,
                        midY + offset,
                        otherNeuron.x,
                        otherNeuron.y
                    );

                    const gradient = ctx.createLinearGradient(
                        neuron.x, neuron.y,
                        otherNeuron.x, otherNeuron.y
                    );
                    gradient.addColorStop(0, 'rgba(64, 102, 255, 0.1)');
                    gradient.addColorStop(0.5, 'rgba(64, 102, 255, 0.3)');
                    gradient.addColorStop(1, 'rgba(64, 102, 255, 0.1)');
                    
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    // Добавляем частицы сигналов
                    if (Math.random() < 0.02) {
                        neuron.signalParticles.push({
                            x: neuron.x,
                            y: neuron.y,
                            targetX: otherNeuron.x,
                            targetY: otherNeuron.y,
                            progress: 0,
                            speed: Math.random() * 0.02 + 0.005
                        });
                    }
                });

                // Обновляем и рисуем частицы сигналов
                neuron.signalParticles = neuron.signalParticles.filter(particle => {
                    particle.progress += particle.speed;
                    if (particle.progress >= 1) return false;

                    const x = neuron.x + (particle.targetX - neuron.x) * particle.progress;
                    const y = neuron.y + (particle.targetY - neuron.y) * particle.progress;
                    
                    ctx.beginPath();
                    ctx.arc(x, y, 2, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(64, 102, 255, ${1 - particle.progress})`;
                    ctx.fill();

                    return true;
                });

                // Рисуем нейрон
                const gradient = ctx.createRadialGradient(
                    neuron.x, neuron.y, 0,
                    neuron.x, neuron.y, pulseRadius * 4
                );
                gradient.addColorStop(0, 'rgba(64, 102, 255, 0.8)');
                gradient.addColorStop(0.5, 'rgba(64, 102, 255, 0.2)');
                gradient.addColorStop(1, 'rgba(64, 102, 255, 0)');

                ctx.beginPath();
                ctx.arc(neuron.x, neuron.y, pulseRadius * 4, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(neuron.x, neuron.y, pulseRadius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(64, 102, 255, 0.8)';
                ctx.fill();
            });

            requestAnimationFrame(animate);
        };

        animate();
    }

    initAnalyticsVisual() {
        const canvas = document.querySelector('#analyticsCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth * 2;
        canvas.height = canvas.offsetHeight * 2;
        ctx.scale(2, 2);

        let mouseX = 0;
        let mouseY = 0;
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = (e.clientX - rect.left) * 2;
            mouseY = (e.clientY - rect.top) * 2;
        });

        // Создаем систему частиц с разными типами
        const particles = [];
        const particleCount = 40;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width/2,
                y: Math.random() * canvas.height/2,
                size: Math.random() * 4 + 2,
                type: Math.floor(Math.random() * 3), // 0: круг, 1: квадрат, 2: треугольник
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.05,
                speedX: (Math.random() - 0.5) * 1.5,
                speedY: (Math.random() - 0.5) * 1.5,
                life: Math.random() * 0.5 + 0.5,
                hue: Math.random() * 40 + 220, // Оттенки синего
                trail: [] // След частицы
            });
        }

        const drawParticle = (particle) => {
            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation);
            
            const alpha = particle.life;
            ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${alpha})`;
            
            switch(particle.type) {
                case 0: // Круг
                    ctx.beginPath();
                    ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 1: // Квадрат
                    ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
                    break;
                case 2: // Треугольник
                    ctx.beginPath();
                    ctx.moveTo(-particle.size/2, particle.size/2);
                    ctx.lineTo(particle.size/2, particle.size/2);
                    ctx.lineTo(0, -particle.size/2);
                    ctx.closePath();
                    ctx.fill();
                    break;
            }
            ctx.restore();
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width/2, canvas.height/2);

            // Обновляем и рисуем частицы
            particles.forEach(particle => {
                // Обновляем позицию и состояние
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                particle.rotation += particle.rotationSpeed;
                
                // Отскок от границ
                if (particle.x < 0 || particle.x > canvas.width/2) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > canvas.height/2) particle.speedY *= -1;

                // Взаимодействие с мышью
                const dx = mouseX - particle.x;
                const dy = mouseY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    particle.speedX += dx / distance * 0.2;
                    particle.speedY += dy / distance * 0.2;
                }

                // Ограничение скорости
                const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
                if (speed > 2) {
                    particle.speedX = (particle.speedX / speed) * 2;
                    particle.speedY = (particle.speedY / speed) * 2;
                }

                // Добавляем текущую позицию в след
                particle.trail.push({x: particle.x, y: particle.y});
                if (particle.trail.length > 5) particle.trail.shift();

                // Рисуем след
                if (particle.trail.length > 1) {
                    ctx.beginPath();
                    ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
                    for (let i = 1; i < particle.trail.length; i++) {
                        ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
                    }
                    ctx.strokeStyle = `hsla(${particle.hue}, 70%, 60%, 0.2)`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }

                // Рисуем частицу
                drawParticle(particle);
            });

            requestAnimationFrame(animate);
        };

        animate();
    }

    initMethodologyVisual() {
        const canvas = document.querySelector('#methodologyCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth * 2;
        canvas.height = canvas.offsetHeight * 2;
        ctx.scale(2, 2);

        const centerX = canvas.width/4;
        const centerY = canvas.height/4;
        const radius = Math.min(centerX, centerY) * 0.8;

        // Создаем вершины графа
        const nodes = [];
        const nodeCount = 6;
        const angleStep = (Math.PI * 2) / nodeCount;

        for (let i = 0; i < nodeCount; i++) {
            const angle = i * angleStep;
            nodes.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                baseAngle: angle,
                pulsePhase: Math.random() * Math.PI * 2,
                particles: [], // Частицы, вращающиеся вокруг узла
                connections: [] // Связи с другими узлами
            });
        }

        // Создаем связи между узлами
        nodes.forEach((node, i) => {
            for (let j = i + 1; j < nodes.length; j++) {
                node.connections.push({
                    target: j,
                    particles: [], // Частицы, движущиеся по связи
                    activationTime: Math.random() * 1000 // Время активации связи
                });
            }
        });

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width/2, canvas.height/2);

            const currentTime = Date.now();

            // Рисуем связи и частицы на них
            nodes.forEach((node, i) => {
                node.connections.forEach(connection => {
                    const targetNode = nodes[connection.target];
                    
                    // Рисуем базовую линию связи
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(targetNode.x, targetNode.y);
                    ctx.strokeStyle = 'rgba(64, 102, 255, 0.1)';
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    // Управление частицами на связи
                    if (Math.random() < 0.1 && connection.particles.length < 3) {
                        connection.particles.push({
                            progress: 0,
                            speed: Math.random() * 0.01 + 0.005,
                            size: Math.random() * 2 + 1,
                            alpha: 1
                        });
                    }

                    // Обновляем и рисуем частицы на связи
                    connection.particles = connection.particles.filter(particle => {
                        particle.progress += particle.speed;
                        particle.alpha = 1 - particle.progress;

                        if (particle.progress >= 1) return false;

                        const x = node.x + (targetNode.x - node.x) * particle.progress;
                        const y = node.y + (targetNode.y - node.y) * particle.progress;

                        // Эффект свечения
                        const gradient = ctx.createRadialGradient(x, y, 0, x, y, particle.size * 2);
                        gradient.addColorStop(0, `rgba(64, 102, 255, ${particle.alpha})`);
                        gradient.addColorStop(1, 'rgba(64, 102, 255, 0)');

                        ctx.beginPath();
                        ctx.arc(x, y, particle.size * 2, 0, Math.PI * 2);
                        ctx.fillStyle = gradient;
                        ctx.fill();

                        return true;
                    });

                    // Эффект активации связи
                    const timeDiff = (currentTime - connection.activationTime) % 3000;
                    if (timeDiff < 1000) {
                        const progress = timeDiff / 1000;
                        const width = 2 + Math.sin(progress * Math.PI) * 2;
                        const alpha = 0.5 - progress * 0.5;

                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(targetNode.x, targetNode.y);
                        ctx.strokeStyle = `rgba(64, 102, 255, ${alpha})`;
                        ctx.lineWidth = width;
                        ctx.stroke();
                    }
                });

                // Обновляем и рисуем узел
                node.pulsePhase += 0.05;
                const baseSize = 6;
                const pulseSize = baseSize + Math.sin(node.pulsePhase) * 2;

                // Создаем орбитальные частицы
                if (Math.random() < 0.1 && node.particles.length < 5) {
                    node.particles.push({
                        angle: Math.random() * Math.PI * 2,
                        speed: Math.random() * 0.05 + 0.02,
                        radius: Math.random() * 10 + 10,
                        alpha: 1,
                        life: 1
                    });
                }

                // Обновляем и рисуем орбитальные частицы
                node.particles = node.particles.filter(particle => {
                    particle.angle += particle.speed;
                    particle.life -= 0.01;
                    particle.alpha = particle.life;

                    if (particle.life <= 0) return false;

                    const particleX = node.x + Math.cos(particle.angle) * particle.radius;
                    const particleY = node.y + Math.sin(particle.angle) * particle.radius;

                    // Эффект свечения для частицы
                    const gradient = ctx.createRadialGradient(
                        particleX, particleY, 0,
                        particleX, particleY, 3
                    );
                    gradient.addColorStop(0, `rgba(64, 102, 255, ${particle.alpha})`);
                    gradient.addColorStop(1, 'rgba(64, 102, 255, 0)');

                    ctx.beginPath();
                    ctx.arc(particleX, particleY, 3, 0, Math.PI * 2);
                    ctx.fillStyle = gradient;
                    ctx.fill();

                    return true;
                });

                // Рисуем основной узел с эффектом свечения
                const nodeGradient = ctx.createRadialGradient(
                    node.x, node.y, 0,
                    node.x, node.y, pulseSize * 2
                );
                nodeGradient.addColorStop(0, 'rgba(64, 102, 255, 0.8)');
                nodeGradient.addColorStop(0.5, 'rgba(64, 102, 255, 0.2)');
                nodeGradient.addColorStop(1, 'rgba(64, 102, 255, 0)');

                ctx.beginPath();
                ctx.arc(node.x, node.y, pulseSize * 2, 0, Math.PI * 2);
                ctx.fillStyle = nodeGradient;
                ctx.fill();

                // Центральная точка узла
                ctx.beginPath();
                ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(64, 102, 255, 0.8)';
                ctx.fill();
            });

            requestAnimationFrame(animate);
        };

        animate();
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new ScienceVisuals();
});


observeElements();