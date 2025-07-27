// Template data (will be replaced by the template engine)
const templateData = {
    groom_name: '{{groom_name}}',
    bride_name: '{{bride_name}}',
    guest_name: '{{guest_name}}',
    event_date: '{{event_date}}',
    event_time: '{{event_time}}',
    event_location: '{{event_location}}',
    event_address: '{{event_address}}'
};

// RSVP functionality
let rsvpStatus = null;

function submitRSVP(status) {
    rsvpStatus = status;
    
    // Hide form and show success message
    document.getElementById('rsvp-form').style.display = 'none';
    document.getElementById('rsvp-success').style.display = 'block';
    
    // Update status text
    const statusText = status === 'attending' ? 'Akan Hadir' : 'Tidak Dapat Hadir';
    document.getElementById('rsvp-status').textContent = `Status: ${statusText}`;
    
    // Here you would typically send the RSVP to your backend
    console.log(`RSVP submitted: ${status} for guest ${templateData.guest_name}`);
    
    // You can add API call here
    // fetch('/api/rsvp', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //         guest_name: templateData.guest_name,
    //         status: status
    //     })
    // });
}

// Google Maps integration
function openMaps() {
    const address = encodeURIComponent(templateData.event_address);
    const mapsUrl = `https://maps.google.com/?q=${address}`;
    window.open(mapsUrl, '_blank');
}

// Google Calendar integration
function addToCalendar() {
    const startDate = new Date(`${templateData.event_date}T${templateData.event_time}:00`);
    const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000); // 4 hours later
    
    const formatDateForCalendar = (date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const eventTitle = encodeURIComponent(`Pernikahan ${templateData.groom_name} & ${templateData.bride_name}`);
    const eventDetails = encodeURIComponent(`Undangan pernikahan ${templateData.groom_name} & ${templateData.bride_name}`);
    const eventLocation = encodeURIComponent(templateData.event_address);
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${formatDateForCalendar(startDate)}/${formatDateForCalendar(endDate)}&details=${eventDetails}&location=${eventLocation}`;
    
    window.open(calendarUrl, '_blank');
}

// Copy link functionality
function copyLink() {
    const currentUrl = window.location.href;
    
    if (navigator.clipboard && window.isSecureContext) {
        // Use modern clipboard API
        navigator.clipboard.writeText(currentUrl).then(() => {
            showCopySuccess();
        }).catch(() => {
            fallbackCopyTextToClipboard(currentUrl);
        });
    } else {
        // Fallback for older browsers
        fallbackCopyTextToClipboard(currentUrl);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess();
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    
    document.body.removeChild(textArea);
}

function showCopySuccess() {
    const copyText = document.getElementById('copy-text');
    const originalText = copyText.textContent;
    
    copyText.textContent = 'Tersalin!';
    copyText.style.color = '#4CAF50';
    
    setTimeout(() => {
        copyText.textContent = originalText;
        copyText.style.color = '';
    }, 2000);
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Initialize animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.detail-card, .rsvp-card, .actions-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Parallax effect for floating hearts
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hearts = document.querySelectorAll('.heart');
    
    hearts.forEach((heart, index) => {
        const speed = 0.5 + (index * 0.1);
        heart.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add sparkle effect on hover for buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.rsvp-btn, .action-btn, .maps-btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            createSparkles(this);
        });
    });
});

function createSparkles(element) {
    const sparkleCount = 6;
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: #fff;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${rect.left + Math.random() * rect.width}px;
            top: ${rect.top + Math.random() * rect.height}px;
            animation: sparkleAnimation 0.6s ease-out forwards;
        `;
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 600);
    }
}

// Add sparkle animation CSS
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkleAnimation {
        0% {
            opacity: 1;
            transform: scale(0) rotate(0deg);
        }
        100% {
            opacity: 0;
            transform: scale(1) rotate(180deg);
        }
    }
`;
document.head.appendChild(sparkleStyle);

