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




observeElements();