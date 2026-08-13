// ===== HEADER SCROLL EFFECT =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===== MOBILE MENU TOGGLE =====
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // Close menu when a nav link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('active')) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
        }
    });
}

// ===== REVEAL ON SCROLL ANIMATION =====
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 80);
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId.length < 2) return;
        
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const offset = 140;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== ACTIVE SERVICE NAV LINK ON SCROLL (services.html) =====
const serviceSections = document.querySelectorAll('.service-detail');
const serviceNavLinks = document.querySelectorAll('.service-nav-link');

if (serviceSections.length > 0 && serviceNavLinks.length > 0) {
    window.addEventListener('scroll', () => {
        let current = '';
        serviceSections.forEach(section => {
            const sectionTop = section.offsetTop - 160;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        serviceNavLinks.forEach(link => {
            link.style.background = '';
            link.style.color = '';
            if (link.getAttribute('href') === '#' + current) {
                link.style.background = 'var(--primary)';
                link.style.color = 'var(--white)';
            }
        });
    });
}

// ===== CONTACT FORM → WHATSAPP =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const service = document.getElementById('service').value;
        const message = document.getElementById('message').value.trim();

        // Build WhatsApp message
        let whatsappMessage = `*New Inquiry - CV and Cover Letter Nepal*\n\n`;
        whatsappMessage += `*Name:* ${name}\n`;
        whatsappMessage += `*Phone:* ${phone}\n`;
        if (email) whatsappMessage += `*Email:* ${email}\n`;
        whatsappMessage += `*Service Needed:* ${service}\n`;
        whatsappMessage += `*Message:* ${message}`;

        // Encode and open WhatsApp
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappUrl = `https://wa.me/9779862989407?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
        
        // Reset form
        contactForm.reset();
        
        // Show feedback
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '✓ Opening WhatsApp...';
        submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
        }, 3000);
    });
}

// ===== PREVENT FORM RESUBMISSION =====
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// ===== LAZY LOAD IMAGES =====
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    if ('loading' in HTMLImageElement.prototype) {
        images.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    }
});
// =========================================
// ===== HELP CENTRE FAQ LOGIC =====
// =========================================

const faqItems = document.querySelectorAll('.faq-item');
const faqCategories = document.getElementById('faqCategories');
const faqSearchInput = document.getElementById('faqSearchInput');
const faqNoResults = document.getElementById('faqNoResults');

// 1. Accordion Toggle
if (faqItems.length > 0) {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle the clicked item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// 2. Category Filtering
if (faqCategories) {
    const catButtons = faqCategories.querySelectorAll('.faq-cat-btn');
    catButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            catButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // Filter items
            faqItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || filter === category) {
                    item.classList.remove('hide');
                } else {
                    item.classList.add('hide');
                    item.classList.remove('active'); // Close if hidden
                }
            });
            
            // Re-run search to update visibility
            if (faqSearchInput) {
                filterSearch();
            }
        });
    });
}

// 3. Live Search Filtering
function filterSearch() {
    if (!faqSearchInput) return;
    
    const searchTerm = faqSearchInput.value.toLowerCase().trim();
    let visibleCount = 0;
    
    // Get currently active category
    let activeCategory = 'all';
    if (faqCategories) {
        const activeBtn = faqCategories.querySelector('.faq-cat-btn.active');
        if (activeBtn) activeCategory = activeBtn.getAttribute('data-filter');
    }
    
    faqItems.forEach(item => {
        const questionText = item.querySelector('.faq-question').innerText.toLowerCase();
        const answerText = item.querySelector('.faq-answer').innerText.toLowerCase();
        const category = item.getAttribute('data-category');
        
        const matchesSearch = questionText.includes(searchTerm) || answerText.includes(searchTerm);
        const matchesCategory = (activeCategory === 'all' || activeCategory === category);
        
        if (matchesSearch && matchesCategory) {
            item.classList.remove('hide');
            visibleCount++;
        } else {
            item.classList.add('hide');
            item.classList.remove('active'); // Close if hidden
        }
    });
    
    // Show "No results" if none visible
    if (faqNoResults) {
        if (visibleCount === 0) {
            faqNoResults.style.display = 'block';
        } else {
            faqNoResults.style.display = 'none';
        }
    }
}

// Event listener for search input
if (faqSearchInput) {
    faqSearchInput.addEventListener('input', filterSearch);
}

// ===== PORTFOLIO FILTERING LOGIC =====
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

if (filterButtons.length > 0 && portfolioCards.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterValue = button.getAttribute('data-filter');
            
            // Toggle active class on buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter cards
            portfolioCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || filterValue === cardCategory) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });
}
// ===== ATS CV SCORE CHECKER LOGIC =====
const checkCvBtn = document.getElementById('checkCvBtn');
const cvText = document.getElementById('cvText');
const atsResult = document.getElementById('atsResult');
const scoreNumber = document.getElementById('scoreNumber');
const scoreCircle = document.getElementById('scoreCircle');
const atsFeedback = document.getElementById('atsFeedback');
const upgradeBtn = document.getElementById('upgradeBtn');

if (checkCvBtn) {
    checkCvBtn.addEventListener('click', () => {
        const text = cvText.value.trim();
        
        if (text.length < 50) {
            alert("Please paste a valid CV text (at least 50 characters) to analyze.");
            return;
        }

        // Simple ATS Logic Simulation
        let score = 0;
        let feedback = [];
        const lowerText = text.toLowerCase();

        // 1. Check length (Words count roughly = length / 5)
        if (text.length > 300 && text.length < 3000) {
            score += 20;
        } else {
            feedback.push("CV length is not optimal. Aim for 1-2 pages (300-600 words).");
        }

        // 2. Check for standard sections
        if (lowerText.includes('experience') || lowerText.includes('work history')) {
            score += 20;
        } else {
            feedback.push("Missing a clear 'Experience' or 'Work History' section.");
        }

        if (lowerText.includes('education') || lowerText.includes('university') || lowerText.includes('college')) {
            score += 20;
        } else {
            feedback.push("Missing an 'Education' section header.");
        }

        if (lowerText.includes('skills')) {
            score += 15;
        } else {
            feedback.push("Missing a dedicated 'Skills' section.");
        }

        // 3. Check for contact info
        if (lowerText.includes('@') && (lowerText.includes('phone') || lowerText.match(/\d{7,}/))) {
            score += 15;
        } else {
            feedback.push("Ensure your email and phone number are clearly visible.");
        }

        // 4. Check for action verbs
        const actionVerbs = ['managed', 'developed', 'created', 'led', 'achieved', 'designed', 'implemented', 'increased', 'improved'];
        const hasActionVerbs = actionVerbs.some(verb => lowerText.includes(verb));
        if (hasActionVerbs) {
            score += 10;
        } else {
            feedback.push("Use strong action verbs (e.g., Managed, Developed, Achieved) instead of 'Responsible for'.");
        }

        // Calculate final score (max 100)
        score = Math.min(score, 100);

        // Animate the circle
        const circleRadius = 54;
        const circumference = 2 * Math.PI * circleRadius;
        const offset = circumference - (score / 100) * circumference;
        
        scoreCircle.style.strokeDashoffset = offset;

        // Change color based on score
        if (score >= 80) {
            scoreCircle.style.stroke = '#22c55e'; // Green
        } else if (score >= 50) {
            scoreCircle.style.stroke = '#f59e0b'; // Orange
        } else {
            scoreCircle.style.stroke = '#ef4444'; // Red
        }

        // Animate the number
        let currentNum = 0;
        const interval = setInterval(() => {
            if (currentNum >= score) {
                clearInterval(interval);
            } else {
                currentNum++;
                scoreNumber.innerText = currentNum;
            }
        }, 20);

        // Generate feedback message
        let resultMessage = `<h4>Analysis Complete</h4><ul>`;
        if (score === 100) {
            resultMessage += `<li>Excellent! Your CV has all the standard ATS markers.</li>`;
        } else {
            if (feedback.length === 0 && score >= 80) {
                resultMessage += `<li>Your CV is looking strong, but could still use professional formatting.</li>`;
            } else {
                feedback.forEach(item => {
                    resultMessage += `<li>${item}</li>`;
                });
            }
        }
        resultMessage += `</ul>`;

        atsFeedback.innerHTML = resultMessage;

        // Show or hide Upgrade button
        if (score < 100) {
            upgradeBtn.style.display = 'flex';
        } else {
            upgradeBtn.style.display = 'none';
        }

        // Show result div
        atsResult.classList.add('active');
        
        // Scroll to result
        setTimeout(() => {
            atsResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    });
}
// ===== DESTINATION GUIDE TABS LOGIC =====
const destTabBtns = document.querySelectorAll('.dest-tab-btn');
const destPanels = document.querySelectorAll('.dest-panel');

if (destTabBtns.length > 0 && destPanels.length > 0) {
    destTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetCountry = btn.getAttribute('data-country');
            
            // Remove active class from all buttons and panels
            destTabBtns.forEach(b => b.classList.remove('active'));
            destPanels.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked button and corresponding panel
            btn.classList.add('active');
            const targetPanel = document.getElementById(targetCountry);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}
// ===== BEFORE & AFTER CV SLIDER LOGIC =====
const baSlider = document.getElementById('baSlider');
const baBefore = document.getElementById('baBefore');
const baHandle = document.getElementById('baHandle');

if (baSlider && baBefore && baHandle) {
    let isDragging = false;

    // Function to set the slider position
    function setSliderPosition(clientX) {
        const rect = baSlider.getBoundingClientRect();
        let x = clientX - rect.left;
        
        // Prevent dragging outside the container
        if (x < 0) x = 0;
        if (x > rect.width) x = rect.width;
        
        // Calculate percentage
        const percent = (x / rect.width) * 100;
        
        // Update clip path and handle position
        baBefore.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
        baHandle.style.left = `${percent}%`;
    }

    // Mouse Events
    baSlider.addEventListener('mousedown', (e) => {
        isDragging = true;
        setSliderPosition(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
        if (isDragging) {
            setSliderPosition(e.clientX);
        }
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch Events (For Mobile)
    baSlider.addEventListener('touchstart', (e) => {
        isDragging = true;
        setSliderPosition(e.touches[0].clientX);
    }, { passive: true });

    baSlider.addEventListener('touchmove', (e) => {
        if (isDragging) {
            setSliderPosition(e.touches[0].clientX);
        }
    }, { passive: true });

    baSlider.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Initialize position
    setSliderPosition(baSlider.getBoundingClientRect().width / 2);
}
// =========================================
// ===== INSTANT QUOTE ESTIMATOR LOGIC =====
// =========================================

const categorySelect = document.getElementById('categorySelect');
const serviceSelect = document.getElementById('serviceSelect');
const urgencySelect = document.getElementById('urgencySelect');

const estServiceType = document.getElementById('estServiceType');
const estDeliveryMethod = document.getElementById('estDeliveryMethod');
const estBaseFee = document.getElementById('estBaseFee');
const estTotalFee = document.getElementById('estTotalFee');
const estDeliveryTime = document.getElementById('estDeliveryTime');
const quoteWatsappBtn = document.getElementById('quoteWatsappBtn');

// Database of Services, Prices, and Base Times (in hours)
const pricingDatabase = {
    "cv_career": [
        { name: "Student / Fresh Graduate CV", price: 999, time: 48 },
        { name: "Professional / Experienced CV", price: 1999, time: 48 },
        { name: "International CV (UK, Canada, etc.)", price: 2500, time: 72 },
        { name: "Job-Specific Cover Letter", price: 700, time: 24 },
        { name: "CV Review & Formatting", price: 500, time: 24 }
    ],
    "europass": [
        { name: "Europass CV", price: 1500, time: 36 },
        { name: "Europass Cover Letter", price: 1000, time: 36 },
        { name: "Europass Document Review", price: 500, time: 12 }
    ],
    "study_visa": [
        { name: "Statement of Purpose (SOP)", price: 3500, time: 72 },
        { name: "Genuine Student (GS) Statement", price: 3500, time: 72 },
        { name: "Study Plan / Motivation Letter", price: 2500, time: 48 },
        { name: "Visa Cover Letter", price: 1500, time: 24 }
    ],
    "govt_public": [
        { name: "Passport Online Application", price: 500, time: 6 },
        { name: "PAN Registration", price: 500, time: 6 },
        { name: "Police Report Application", price: 500, time: 12 },
        { name: "Labour Permit Application", price: 1000, time: 24 }
    ],
    "lokssewa": [
        { name: "Federal Lok Sewa Application", price: 500, time: 12 },
        { name: "Province Lok Sewa Application", price: 500, time: 12 },
        { name: "Nepal Police / APF Application", price: 500, time: 12 },
        { name: "Teacher Service Commission", price: 500, time: 12 }
    ],
    "korea_eps": [
        { name: "EPS-TOPIK Online Application", price: 1000, time: 12 },
        { name: "EPS Form Preparation", price: 700, time: 24 }
    ],
    "travel": [
        { name: "Flight Booking Assistance", price: 300, time: 6 },
        { name: "Hotel Booking Assistance", price: 300, time: 6 },
        { name: "Travel Insurance Support", price: 300, time: 6 },
        { name: "VFS Appointment Booking", price: 700, time: 24 }
    ],
    "other": [
        { name: "Custom Document Preparation", price: 0, time: 0 } // Custom pricing
    ]
};

// Function to populate Step 2 based on Step 1
function populateServices() {
    const selectedCategory = categorySelect.value;
    const services = pricingDatabase[selectedCategory];
    
    // Clear existing options
    serviceSelect.innerHTML = '';
    
    // Populate new options
    services.forEach(service => {
        const option = document.createElement('option');
        option.value = service.name;
        option.textContent = service.name;
        serviceSelect.appendChild(option);
    });
    
    // Calculate initial quote
    calculateQuote();
}

// Function to calculate and update the estimate panel
function calculateQuote() {
    if (!categorySelect || !serviceSelect || !urgencySelect) return;

    // Get Selected Service Data
    const selectedServiceName = serviceSelect.value;
    const categoryData = pricingDatabase[categorySelect.value];
    const serviceData = categoryData.find(s => s.name === selectedServiceName);

    // Get Urgency Data
    const selectedUrgencyOption = urgencySelect.options[urgencySelect.selectedIndex];
    const multiplier = parseFloat(selectedUrgencyOption.getAttribute('data-multiplier'));
    const timeMod = parseInt(selectedUrgencyOption.getAttribute('data-time-mod'));
    const urgencyName = urgencySelect.value.charAt(0).toUpperCase() + urgencySelect.value.slice(1) + " Delivery";

    // Calculate Totals
    let basePrice = serviceData.price;
    let finalPrice = Math.round(basePrice * multiplier);
    
    let baseTime = serviceData.time;
    let finalTime = baseTime + timeMod;
    if (finalTime < 6) finalTime = 6; // Minimum 6 hours

    // Format Time String
    let timeString = finalTime === 0 ? "Custom" : `${finalTime} Hours`;

    // Update UI - Right Panel
    estServiceType.innerText = selectedServiceName;
    estDeliveryMethod.innerText = urgencyName;
    
    // Handle Custom Pricing (if price is 0)
    if (basePrice === 0) {
        estBaseFee.innerText = "Custom Quote";
        estTotalFee.innerText = "Custom Quote";
        quoteWatsappBtn.innerText = "Request Custom Quote";
        quoteWatsappBtn.href = `https://wa.me/9779862989407?text=Hello%2C%20I%20need%20a%20custom%20quote%20for%3A%20${encodeURIComponent(selectedServiceName)}`;
    } else {
        estBaseFee.innerText = `NPR ${basePrice.toLocaleString()}`;
        estTotalFee.innerText = `NPR ${finalPrice.toLocaleString()}`;
        quoteWatsappBtn.innerText = "Continue on WhatsApp";
        quoteWatsappBtn.href = `https://wa.me/9779862989407?text=Hello%2C%20I%20need%20${encodeURIComponent(selectedServiceName)}%20(${encodeURIComponent(urgencyName)}).%20Estimated%20Total%3A%20NPR%20${finalPrice}.%20Estimated%20Delivery%3A%20${timeString}.`;
    }

    estDeliveryTime.innerText = timeString;
}

// Event Listeners
if (categorySelect) {
    categorySelect.addEventListener('change', populateServices);
}
if (serviceSelect) {
    serviceSelect.addEventListener('change', calculateQuote);
}
if (urgencySelect) {
    urgencySelect.addEventListener('change', calculateQuote);
}

// Initialize on Page Load
if (categorySelect) {
    populateServices();
}

// Run on load and whenever selections change
if (docTypeSelect && urgencySelect) {
    calculateQuote(); // Initialize on page load
    docTypeSelect.addEventListener('change', calculateQuote);
    urgencySelect.addEventListener('change', calculateQuote);
}
// ===== CV BULLET POINT ENHANCER LOGIC =====
const weakText = document.getElementById('weakText');
const enhanceBtn = document.getElementById('enhanceBtn');
const enhancedOutput = document.getElementById('enhancedOutput');
const copyBtn = document.getElementById('copyBtn');
const getProBtn = document.getElementById('getProBtn');

// Dictionary of weak words/phrases -> strong professional words
const professionalDictionary = [
    { weak: "responsible for", strong: "Spearheaded" },
    { weak: "helped", strong: "Facilitated" },
    { weak: "did", strong: "Executed" },
    { weak: "made", strong: "Engineered" },
    { weak: "worked on", strong: "Orchestrated" },
    { weak: "used", strong: "Leveraged" },
    { weak: "customers", strong: "key stakeholders" },
    { weak: "problems", strong: "complex challenges" },
    { weak: "sales", strong: "revenue growth initiatives" },
    { weak: "team", strong: "cross-functional unit" },
    { weak: "good", strong: "exceptional" },
    { weak: "fast", strong: "agile" },
    { weak: "managed", strong: "Directed" },
    { weak: "told", strong: "Communicated strategic vision to" },
    { weak: "given", strong: "Tasked with" }
];

// Dynamic professional suffixes to add impact
const impactSuffixes = [
    "resulting in enhanced operational efficiency.",
    "driving measurable success and alignment with organizational goals.",
    "ensuring 100% compliance and stakeholder satisfaction.",
    "which significantly improved overall performance metrics.",
    "delivering high-quality results within strict deadlines."
];

if (enhanceBtn) {
    enhanceBtn.addEventListener('click', () => {
        let text = weakText.value.trim();
        
        if (text.length < 5) {
            alert("Please enter a valid sentence to enhance.");
            return;
        }

        // Convert to lowercase for matching, but keep original for replacement logic
        let lowerText = text.toLowerCase();
        
        // 1. Replace weak words with strong words
        professionalDictionary.forEach(item => {
            // Create a regex to replace whole words, case-insensitive
            const regex = new RegExp(`\\b${item.weak}\\b`, 'gi');
            text = text.replace(regex, item.strong);
        });

        // 2. Capitalize the first letter of the sentence
        text = text.charAt(0).toUpperCase() + text.slice(1);

        // 3. Remove trailing spaces and basic punctuation to add our suffix
        text = text.replace(/[.\s]+$/, "");

        // 4. Add a professional impact suffix randomly
        const randomSuffix = impactSuffixes[Math.floor(Math.random() * impactSuffixes.length)];
        
        // 5. Finalize the text
        const finalText = `${text} ${randomSuffix}`;

        // 6. Display the result with animation
        enhancedOutput.innerHTML = `<p class="result-text">${finalText}</p>`;
        
        // 7. Show the "Get Pro Help" button and Copy button
        if (getProBtn) getProBtn.style.display = 'flex';
        copyBtn.style.display = 'block';

        // 8. Store text for copying
        copyBtn.setAttribute('data-text', finalText);
    });
}

// Copy to Clipboard Logic
if (copyBtn) {
    copyBtn.addEventListener('click', () => {
        const textToCopy = copyBtn.getAttribute('data-text');
        navigator.clipboard.writeText(textToCopy).then(() => {
            copyBtn.innerText = 'Copied!';
            copyBtn.classList.add('copied');
            
            setTimeout(() => {
                copyBtn.innerText = 'Copy Text';
                copyBtn.classList.remove('copied');
            }, 2000);
        });
    });
}
// =========================================
// ===== AI AUTOMATION CHATBOT LOGIC =====
// =========================================

const aiChatToggle = document.getElementById('aiChatToggle');
const aiChatWindow = document.getElementById('aiChatWindow');
const aiChatClose = document.getElementById('aiChatClose');
const aiChatBody = document.getElementById('aiChatBody');
const aiUserInput = document.getElementById('aiUserInput');
const aiSendBtn = document.getElementById('aiSendBtn');
const aiQuickReplies = document.getElementById('aiQuickReplies');

// Toggle Chat Window
if (aiChatToggle) {
    aiChatToggle.addEventListener('click', () => {
        aiChatWindow.classList.add('active');
        document.querySelector('.ai-notification-dot').style.display = 'none';
        // Auto-scroll to bottom
        setTimeout(() => {
            aiChatBody.scrollTop = aiChatBody.scrollHeight;
        }, 100);
    });
}

if (aiChatClose) {
    aiChatClose.addEventListener('click', () => {
        aiChatWindow.classList.remove('active');
    });
}

// AI Knowledge Base
const aiKnowledgeBase = [
    {
        keywords: ['hi', 'hello', 'hey', 'namaste', 'greetings'],
        response: "Namaste! 🙏 Welcome to CV & Cover Letter Nepal. I am your AI assistant. I can help you with information about our services, pricing, process, and policies. What can I help you with today?",
        quickReplies: ['Services', 'Pricing', 'How It Works', 'Refund Policy']
    },
    {
        keywords: ['service', 'services', 'what do you do', 'help with'],
        response: "We provide professional document preparation and online application assistance:\n\n1. CV & Career Documents (ATS-friendly, International, Student)\n2. Europass Services\n3. Study & Visa Documents (SOP, GS, Motivation Letter)\n4. Government & Public Services (Passport, PAN, National ID, Police Report, Labour Permit)\n5. Korea & EPS Services\n6. Travel & Booking Assistance (Flights, Hotels, Insurance)\n7. Lok Sewa & Govt Job Applications\n\nWhich category would you like to know more about?",
        quickReplies: ['CV Pricing', 'SOP Pricing', 'Govt Services', 'Contact Human']
    },
    {
        keywords: ['price', 'pricing', 'cost', 'fee', 'charge', 'how much'],
        response: "Our pricing depends on the document type, complexity, and urgency. Standard packages start at Rs. 999 for Student CVs, Rs. 1,999 for Professional CVs, and Rs. 4,999 for Study Abroad (SOP/Cover Letter). Government and travel bookings have service fees plus actual portal costs. Would you like a custom quote via WhatsApp?",
        quickReplies: ['Get a Quote', 'Payment Process', 'Refund Policy']
    },
    {
        keywords: ['payment', 'pay', 'advance', 'installment', 'how to pay'],
        response: "Our standard payment structure is:\n\n1. 50% advance payment to begin work.\n2. Remaining 50% after review and before final delivery.\n\nThird-party fees (government, airlines, etc.) must be paid in full before submission. We accept bank transfers and digital wallets (eSewa/Khalti). Instructions are sent privately via WhatsApp after quotation confirmation. We NEVER ask for your bank PIN or OTP.",
        quickReplies: ['How It Works', 'Refund Policy', 'Contact Human']
    },
    {
        keywords: ['process', 'how it works', 'steps', 'start'],
        response: "Here is our simple 8-step process:\n\n1. Choose your required service.\n2. Request a quotation.\n3. Review and confirm details.\n4. Pay the 50% advance.\n5. Share information & documents.\n6. We prepare the document.\n7. Review draft & pay remaining 50%.\n8. Final delivery!\n\nWould you like to start step 1?",
        quickReplies: ['Get a Quote', 'What documents needed?', 'Contact Human']
    },
    {
        keywords: ['refund', 'cancel', 'money back', 'return'],
        response: "Cancellations before work begins may be refunded after deducting non-recoverable third-party costs. Once work has substantially begun or been delivered, the service is generally non-refundable as it is personalized work. However, if we make a clear error, we will correct it free of charge. External rejections (visas, jobs) do not qualify for refunds.",
        quickReplies: ['Revisions', 'Contact Human', 'Services']
    },
    {
        keywords: ['revision', 'edit', 'change', 'correct'],
        response: "Document-writing services include up to 2 free reasonable revisions requested within 7 calendar days of the initial draft delivery. Changes requested after 7 days, or major changes requiring a completely new document, may require an updated quotation.",
        quickReplies: ['Refund Policy', 'Payment Process', 'Services']
    },
    {
        keywords: ['sop', 'study', 'visa', 'abroad', 'student', 'gs', 'genuine student'],
        response: "For Study & Visa applications, we prepare Statements of Purpose (SOP), Genuine Student (GS) statements, Motivation Letters, and Study Plans. All documents are based on your genuine academic background. Prices start at Rs. 4,999. We do not guarantee visa approval, but we ensure professional presentation.",
        quickReplies: ['CV Pricing', 'Payment Process', 'Contact Human']
    },
    {
        keywords: ['passport', 'pan', 'national id', 'driving licence', 'police report', 'labour', 'government'],
        response: "We assist with online government forms including Passport, PAN, National ID, Driving Licence, Police Report, and Labour Permit applications. You provide the genuine information, and we assist with form filling and submission on your behalf when portals are open. Service fee is separate from government portal fees.",
        quickReplies: ['How to Pay', 'Refund Policy', 'Services']
    },
    {
        keywords: ['ats', 'ats friendly', 'ats score', 'track'],
        response: "Yes, all our CVs are designed to be ATS-friendly (Applicant Tracking System). We use proper formatting and keyword optimization to ensure your CV passes through software filters. However, no CV can guarantee a 100% ATS score as systems vary by employer.",
        quickReplies: ['CV Pricing', 'Services', 'Contact Human']
    },
    {
        keywords: ['contact', 'human', 'whatsapp', 'email', 'talk to someone'],
        response: "You can reach a human team member directly here:\n\nWhatsApp: +977 9862989407\nEmail: cvandcoverletternepal@gmail.com\n\nClick the WhatsApp button below to start chatting instantly!",
        quickReplies: ['Services', 'Pricing']
    },
    {
        keywords: ['guarantee', 'job', 'visa approval', 'pass', 'selection'],
        response: "We provide professional document preparation only. We do NOT guarantee employment, interviews, visa approval, or government selection. These decisions are made independently by employers, embassies, and authorities. Payment is for the document preparation service, not a guaranteed outcome.",
        quickReplies: ['Refund Policy', 'Services', 'Contact Human']
    },
    {
        keywords: ['time', 'delivery', 'how long', 'fast', 'urgent'],
        response: "Standard delivery for CVs is 24-48 hours. SOPs and complex documents may take 2-3 days. Government forms are processed same-day if submitted before 2 PM. Urgent delivery (within 24h) is available for an additional fee.",
        quickReplies: ['Pricing', 'How It Works', 'Revisions']
    }
];

// Fallback Response
const fallbackResponse = "I'm sorry, I didn't quite catch that. I can provide information about our services, pricing, 8-step process, payment structure, and policies. Could you try rephrasing, or select one of the options below?";
const fallbackReplies = ['Services', 'Pricing', 'Contact Human'];

// Function to append message
function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('ai-message', sender);
    
    // Handle line breaks
    messageDiv.style.whiteSpace = 'pre-line';
    messageDiv.innerText = text;
    
    aiChatBody.appendChild(messageDiv);
    aiChatBody.scrollTop = aiChatBody.scrollHeight;
}

// Function to show typing indicator
function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('ai-typing');
    typingDiv.id = 'aiTypingIndicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    aiChatBody.appendChild(typingDiv);
    aiChatBody.scrollTop = aiChatBody.scrollHeight;
}

// Function to hide typing indicator
function hideTyping() {
    const typing = document.getElementById('aiTypingIndicator');
    if (typing) typing.remove();
}

// Function to process user input and get AI response
function getAiResponse(userText) {
    const lowerText = userText.toLowerCase();
    let bestMatch = null;

    for (let item of aiKnowledgeBase) {
        for (let keyword of item.keywords) {
            if (lowerText.includes(keyword)) {
                bestMatch = item;
                break;
            }
        }
        if (bestMatch) break;
    }

    return bestMatch || { response: fallbackResponse, quickReplies: fallbackReplies };
}

// Function to render quick replies
function renderQuickReplies(replies) {
    aiQuickReplies.innerHTML = '';
    replies.forEach(reply => {
        const btn = document.createElement('button');
        btn.classList.add('ai-quick-btn');
        btn.innerText = reply;
        btn.addEventListener('click', () => handleUserMessage(reply));
        aiQuickReplies.appendChild(btn);
    });
}

// Main function to handle user message
function handleUserMessage(text) {
    if (!text.trim()) return;
    
    // Append User Message
    appendMessage(text, 'user');
    aiUserInput.value = '';
    aiQuickReplies.innerHTML = ''; // Clear quick replies while "typing"
    
    // Show Typing Indicator
    showTyping();
    
    // Simulate thinking delay (1.5 seconds)
    setTimeout(() => {
        hideTyping();
        const responseObj = getAiResponse(text);
        appendMessage(responseObj.response, 'bot');
        renderQuickReplies(responseObj.quickReplies);
    }, 1200);
}

// Event Listeners for input
if (aiSendBtn) {
    aiSendBtn.addEventListener('click', () => {
        const text = aiUserInput.value;
        handleUserMessage(text);
    });
}

if (aiUserInput) {
    aiUserInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const text = aiUserInput.value;
            handleUserMessage(text);
        }
    });
}

// Initialize Chatbot Greeting
window.addEventListener('load', () => {
    if (aiChatBody) {
        setTimeout(() => {
            appendMessage("Namaste! 🙏 I am the AI Assistant for CV & Cover Letter Nepal. How can I help you today?", "bot");
            renderQuickReplies(['Services', 'Pricing', 'How It Works', 'Contact Human']);
        }, 500);
    }
});