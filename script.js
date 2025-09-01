class PomegranateAnalyzer {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.setupDragAndDrop();
    }

    initializeElements() {
        // Upload elements
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.cameraInput = document.getElementById('cameraInput');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.cameraBtn = document.getElementById('cameraBtn');
        
        // Section elements
        this.uploadSection = document.getElementById('uploadSection');
        this.analysisSection = document.getElementById('analysisSection');
        
        // Analysis elements
        this.previewImage = document.getElementById('previewImage');
        this.analysisOverlay = document.getElementById('analysisOverlay');
        this.progressSection = document.getElementById('progressSection');
        this.resultsSection = document.getElementById('resultsSection');
        this.progressFill = document.getElementById('progressFill');
        
        // Result elements
        this.resultIcon = document.getElementById('resultIcon');
        this.resultTitle = document.getElementById('resultTitle');
        this.resultSubtitle = document.getElementById('resultSubtitle');
        this.progressRing = document.getElementById('progressRing');
        this.ripenessPercentage = document.getElementById('ripenessPercentage');
        this.qualityBadge = document.getElementById('qualityBadge');
        this.qualityStars = document.getElementById('qualityStars');
        this.recommendation = document.getElementById('recommendation');
        this.recommendationTips = document.getElementById('recommendationTips');
        
        // Metric elements
        this.colorMetric = document.getElementById('colorMetric');
        this.shapeMetric = document.getElementById('shapeMetric');
        this.textureMetric = document.getElementById('textureMetric');
        
        // Action buttons
        this.analyzeAnotherBtn = document.getElementById('analyzeAnotherBtn');
        this.backBtn = document.getElementById('backBtn');
        
        // New elements for enhanced analysis
        this.analysisTitle = document.getElementById('analysisTitle');
        this.progressText = document.getElementById('progressText');
        
        // Steps
        this.steps = {
            step1: document.getElementById('step1'),
            step2: document.getElementById('step2'),
            step3: document.getElementById('step3')
        };
    }

    bindEvents() {
        // Upload events
        this.uploadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.fileInput.click();
        });
        this.cameraBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            await this.requestCameraPermission();
        });
        this.uploadArea.addEventListener('click', (e) => {
            // Only trigger file input if clicking on the upload area itself, not on buttons
            if (e.target === this.uploadArea || e.target.closest('.upload-content') && !e.target.closest('button')) {
                this.fileInput.click();
            }
        });
        
        // File input events
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.cameraInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Action buttons
        this.analyzeAnotherBtn.addEventListener('click', () => this.resetAnalysis());
        this.backBtn.addEventListener('click', () => this.resetAnalysis());
        
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.uploadArea.addEventListener(eventName, this.preventDefaults, false);
            document.body.addEventListener(eventName, this.preventDefaults, false);
        });
    }

    setupDragAndDrop() {
        // Highlight drop area when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            this.uploadArea.addEventListener(eventName, () => {
                this.uploadArea.classList.add('drag-over');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            this.uploadArea.addEventListener(eventName, () => {
                this.uploadArea.classList.remove('drag-over');
            }, false);
        });

        // Handle dropped files
        this.uploadArea.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.processFile(files[0]);
            }
        }, false);
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            this.processFile(file);
        } else {
            this.showError('אנא בחר קובץ תמונה תקין');
        }
    }

    processFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.previewImage.src = e.target.result;
            this.startAnalysis();
        };
        reader.readAsDataURL(file);
    }

    startAnalysis() {
        // Hide upload section and show analysis section
        this.uploadSection.style.display = 'none';
        this.analysisSection.style.display = 'block';
        
        // Reset analysis state
        this.progressSection.style.display = 'block';
        this.resultsSection.style.display = 'none';
        this.analysisOverlay.style.display = 'flex';
        
        // Reset steps
        Object.values(this.steps).forEach(step => {
            step.classList.remove('active', 'completed');
            step.querySelector('.step-status').textContent = '⏳';
        });
        
        // Reset progress text
        this.progressText.textContent = '0%';
        this.analysisTitle.textContent = 'מכין לניתוח...';
        
        // Start analysis sequence
        this.runAnalysisSequence();
    }

    async runAnalysisSequence() {
        const analysisSteps = [
            { step: 'step1', duration: 2500, progress: 35, title: 'מזהה רימון בתמונה...', status: '🔍' },
            { step: 'step2', duration: 3000, progress: 70, title: 'מנתח צבע וצורה...', status: '🎨' },
            { step: 'step3', duration: 2500, progress: 100, title: 'קובע רמת בשלות...', status: '🧠' }
        ];

        for (let i = 0; i < analysisSteps.length; i++) {
            const stepData = analysisSteps[i];
            
            // Update analysis title
            this.analysisTitle.textContent = stepData.title;
            
            // Activate current step
            this.steps[stepData.step].classList.add('active');
            this.steps[stepData.step].querySelector('.step-status').textContent = '⚡';
            
            // Animate progress with text updates
            await this.animateProgressWithText(stepData.progress, stepData.duration);
            
            // Mark step as completed
            this.steps[stepData.step].classList.remove('active');
            this.steps[stepData.step].classList.add('completed');
            this.steps[stepData.step].querySelector('.step-status').textContent = '✅';
            
            // Small delay between steps
            if (i < analysisSteps.length - 1) {
                await this.delay(500);
            }
        }

        // Update final title
        this.analysisTitle.textContent = 'ניתוח הושלם!';
        
        // Complete analysis
        await this.delay(800);
        this.showResults();
    }

    animateProgressWithText(targetProgress, duration) {
        return new Promise((resolve) => {
            const startProgress = parseInt(this.progressFill.style.width) || 0;
            const progressDiff = targetProgress - startProgress;
            const startTime = Date.now();

            const updateProgress = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = this.easeOutQuart(progress);
                const currentProgress = Math.round(startProgress + (progressDiff * easeProgress));
                
                this.progressFill.style.width = `${currentProgress}%`;
                this.progressText.textContent = `${currentProgress}%`;

                if (progress < 1) {
                    requestAnimationFrame(updateProgress);
                } else {
                    resolve();
                }
            };

            updateProgress();
        });
    }

    showResults() {
        // Hide progress and scanning overlay
        this.progressSection.style.display = 'none';
        this.analysisOverlay.style.display = 'none';
        
        // Generate random but realistic results
        const results = this.generateAnalysisResults();
        
        // Update result display with enhanced animations
        this.resultIcon.textContent = results.isRipe ? '✅' : '⚠️';
        this.resultTitle.textContent = results.title;
        this.resultSubtitle.textContent = results.isRipe ? 'ניתוח הושלם בהצלחה' : 'ניתוח הושלם - נדרש המתנה נוספת';
        
        // Animate circular progress
        const circumference = 2 * Math.PI * 50; // radius = 50
        const offset = circumference - (results.ripeness / 100) * circumference;
        
        setTimeout(() => {
            this.progressRing.style.strokeDashoffset = offset;
        }, 500);
        
        // Update percentage with counting animation
        this.animateCounter(0, results.ripeness, 2000, (value) => {
            this.ripenessPercentage.textContent = `${Math.round(value)}%`;
        });
        
        // Update quality badge and stars
        this.qualityBadge.textContent = results.quality.name;
        this.qualityBadge.style.background = results.quality.gradient;
        
        // Animate quality stars
        const stars = this.qualityStars.querySelectorAll('.star');
        const starCount = Math.min(Math.floor(results.ripeness / 20) + 1, 5);
        
        stars.forEach((star, index) => {
            setTimeout(() => {
                if (index < starCount) {
                    star.style.color = '#ffd700';
                    star.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        star.style.transform = 'scale(1)';
                    }, 200);
                } else {
                    star.style.color = 'rgba(255, 255, 255, 0.3)';
                }
            }, index * 100);
        });
        
        // Update metrics with animation
        setTimeout(() => {
            this.colorMetric.style.width = `${results.metrics.color}%`;
        }, 800);
        
        setTimeout(() => {
            this.shapeMetric.style.width = `${results.metrics.shape}%`;
        }, 1200);
        
        setTimeout(() => {
            this.textureMetric.style.width = `${results.metrics.texture}%`;
        }, 1600);
        
        // Update recommendation
        this.recommendation.textContent = results.recommendation;
        
        // Update tips
        this.recommendationTips.innerHTML = '';
        results.tips.forEach((tip, index) => {
            const tipElement = document.createElement('div');
            tipElement.className = 'tip';
            tipElement.innerHTML = `
                <span class="tip-icon">${tip.icon}</span>
                <span>${tip.text}</span>
            `;
            tipElement.style.opacity = '0';
            tipElement.style.transform = 'translateX(20px)';
            
            this.recommendationTips.appendChild(tipElement);
            
            setTimeout(() => {
                tipElement.style.transition = 'all 0.3s ease';
                tipElement.style.opacity = '1';
                tipElement.style.transform = 'translateX(0)';
            }, 2000 + (index * 200));
        });
        
        // Show results with animation
        this.resultsSection.style.display = 'block';
        this.resultsSection.style.opacity = '0';
        this.resultsSection.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            this.resultsSection.style.transition = 'all 0.5s ease';
            this.resultsSection.style.opacity = '1';
            this.resultsSection.style.transform = 'translateY(0)';
        }, 100);
    }

    generateAnalysisResults() {
        // Generate realistic random results
        const ripeness = Math.floor(Math.random() * 40) + 60; // 60-100%
        const isRipe = ripeness >= 75;
        
        const qualities = [
            { name: 'מעולה', gradient: 'linear-gradient(135deg, #00f5ff, #8338ec)' },
            { name: 'טובה מאוד', gradient: 'linear-gradient(135deg, #00f5ff, #00c4cc)' },
            { name: 'טובה', gradient: 'linear-gradient(135deg, #ff9f40, #ff6b35)' },
            { name: 'בינונית', gradient: 'linear-gradient(135deg, #ffd23f, #ff9f40)' }
        ];
        
        let qualityIndex;
        if (ripeness >= 85) qualityIndex = 0;
        else if (ripeness >= 75) qualityIndex = 1;
        else if (ripeness >= 65) qualityIndex = 2;
        else qualityIndex = 3;
        
        const quality = qualities[qualityIndex];
        
        // Generate random but realistic metrics
        const colorScore = Math.max(60, ripeness + Math.floor(Math.random() * 10) - 5);
        const shapeScore = Math.max(60, ripeness + Math.floor(Math.random() * 10) - 5);
        const textureScore = Math.max(60, ripeness + Math.floor(Math.random() * 10) - 5);
        
        const metrics = {
            color: Math.min(100, colorScore),
            shape: Math.min(100, shapeScore),
            texture: Math.min(100, textureScore)
        };
        
        const recommendations = {
            ripe: [
                'הרימון מוכן לאכילה! הצבע האדום העמוק והמרקם מצביעים על בשלות מושלמת.',
                'רימון בשל ומתוק! זה הזמן המושלם לאכילה - הטעם יהיה עשיר ומלא.',
                'הרימון הגיע לבשלות אידיאלית. הגרעינים יהיו עסיסיים ומתוקים.',
                'רימון מושלם לאכילה! הצבע והמרקם מעידים על איכות גבוהה וטעם מעולה.'
            ],
            notRipe: [
                'הרימון עדיין לא בשל לחלוטין. המתן עוד כמה ימים לבשלות מושלמת.',
                'כדאי להמתין עוד קצת - הרימון יהיה מתוק ועסיסי יותר בעוד מספר ימים.',
                'הרימון בדרך לבשלות, אבל עדיין לא הגיע לשיא הטעם. תן לו עוד זמן.',
                'כמעט מוכן! עוד כמה ימים והרימון יגיע לבשלות המושלמת.'
            ]
        };
        
        const recArray = isRipe ? recommendations.ripe : recommendations.notRipe;
        const recommendation = recArray[Math.floor(Math.random() * recArray.length)];
        
        // Generate tips based on ripeness
        const tips = [];
        if (isRipe) {
            tips.push(
                { icon: '🍽️', text: 'מומלץ לאכילה מיידית' },
                { icon: '🌡️', text: 'שמור במקרר לעד 5 ימים' },
                { icon: '🥗', text: 'מעולה לסלטים ולמיצים' }
            );
        } else {
            tips.push(
                { icon: '⏰', text: `המתן עוד ${Math.floor(Math.random() * 3) + 2} ימים` },
                { icon: '🏠', text: 'שמור בטמפרטורת החדר' },
                { icon: '🔄', text: 'בדוק שוב בעוד כמה ימים' }
            );
        }
        
        return {
            isRipe,
            title: isRipe ? 'הרימון בשל!' : 'הרימון עדיין לא בשל',
            ripeness,
            quality,
            metrics,
            recommendation,
            tips
        };
    }

    resetAnalysis() {
        // Reset to upload section
        this.analysisSection.style.display = 'none';
        this.uploadSection.style.display = 'block';
        
        // Reset form inputs
        this.fileInput.value = '';
        this.cameraInput.value = '';
        
        // Reset progress
        this.progressFill.style.width = '0%';
        this.progressText.textContent = '0%';
        
        // Add subtle animation to upload area
        this.uploadArea.style.transform = 'scale(0.95)';
        this.uploadArea.style.opacity = '0.8';
        
        setTimeout(() => {
            this.uploadArea.style.transition = 'all 0.3s ease';
            this.uploadArea.style.transform = 'scale(1)';
            this.uploadArea.style.opacity = '1';
        }, 100);
    }


    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '2rem',
            right: '2rem',
            background: type === 'error' ? 
                'linear-gradient(135deg, #ff006e, #ff4081)' : 
                'linear-gradient(135deg, #00f5ff, #8338ec)',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            zIndex: '1000',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            fontSize: '0.9rem',
            fontWeight: '500',
            maxWidth: '300px',
            textAlign: 'center'
        });
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Easing function for smooth animations
    async requestCameraPermission() {
        try {
            // Check if we're on HTTPS or localhost (required for camera access)
            const isSecure = location.protocol === 'https:' || location.hostname === 'localhost';
            
            if (!isSecure) {
                this.showError('גישה למצלמה דורשת חיבור מאובטח (HTTPS)');
                return;
            }

            // Check if getUserMedia is supported
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                this.showError('הדפדפן שלך לא תומך בגישה למצלמה');
                return;
            }

            // Request camera permission
            const constraints = {
                video: {
                    facingMode: 'environment', // Use back camera on mobile
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };

            try {
                // Test camera access
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                
                // Stop the stream immediately as we just wanted to check permissions
                stream.getTracks().forEach(track => track.stop());
                
                // If we get here, permission was granted
                this.showNotification('גישה למצלמה אושרה!', 'success');
                
                // Now open the camera input
                this.cameraInput.click();
                
            } catch (permissionError) {
                if (permissionError.name === 'NotAllowedError') {
                    this.showError('נדרשת הרשאה לשימוש במצלמה. אנא אפשר גישה במעבר הדפדפן.');
                } else if (permissionError.name === 'NotFoundError') {
                    this.showError('לא נמצאה מצלמה במכשיר');
                } else {
                    this.showError('שגיאה בגישה למצלמה: ' + permissionError.message);
                }
            }
            
        } catch (error) {
            this.showError('שגיאה בבדיקת הרשאות מצלמה: ' + error.message);
        }
    }

    animateCounter(start, end, duration, callback) {
        const startTime = Date.now();
        const range = end - start;
        
        const updateCounter = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = this.easeOutQuart(progress);
            const currentValue = start + (range * easeProgress);
            
            callback(currentValue);
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        updateCounter();
    }
    
    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PomegranateAnalyzer();
    
    // Add some additional interactive effects
    const addInteractiveEffects = () => {
        // Add hover effect to glass cards
        const glassCards = document.querySelectorAll('.glass-card');
        glassCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.background = 'rgba(255, 255, 255, 0.12)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.background = 'rgba(255, 255, 255, 0.08)';
            });
        });
        
        // Add parallax effect to background particles
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX / window.innerWidth;
            mouseY = e.clientY / window.innerHeight;
            
            const particles = document.querySelectorAll('.particle');
            particles.forEach((particle, index) => {
                const speed = (index + 1) * 0.5;
                const x = mouseX * speed;
                const y = mouseY * speed;
                
                particle.style.transform += ` translate(${x}px, ${y}px)`;
            });
        });
        
        // Add touch ripple effect to buttons
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    left: ${x}px;
                    top: ${y}px;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    if (this.contains(ripple)) {
                        this.removeChild(ripple);
                    }
                }, 600);
            });
        });
    };
    
    addInteractiveEffects();
});

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);