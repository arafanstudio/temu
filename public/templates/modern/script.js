// Modern Template JavaScript

// RSVP functionality
function submitRSVP(status) {
    const messageEl = document.getElementById('rsvp-message');
    
    // Show loading state
    messageEl.style.display = 'block';
    messageEl.className = 'rsvp-message';
    messageEl.innerHTML = 'Menyimpan konfirmasi...';
    
    // Simulate API call (replace with actual implementation)
    setTimeout(() => {
        if (status === 'attending') {
            messageEl.className = 'rsvp-message success';
            messageEl.innerHTML = '✓ Terima kasih! Konfirmasi kehadiran Anda telah tersimpan.';
        } else {
            messageEl.className = 'rsvp-message success';
            messageEl.innerHTML = '✓ Terima kasih atas konfirmasinya. Semoga bisa bertemu di lain waktu.';
        }
        
        // Disable buttons after submission
        const buttons = document.querySelectorAll('.rsvp-btn');
        buttons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.6';
            btn.style.cursor = 'not-allowed';
        });
    }, 1000);
}

// Add to calendar functionality
function addToCalendar() {
    // Extract event data from the page
    const groomName = '{{groom_name}}';
    const brideName = '{{bride_name}}';
    const eventDate = '{{event_date}}';
    const eventTime = '{{event_time}}';
    const eventLocation = '{{event_location}}';
    const eventAddress = '{{event_address}}';
    
    // Create calendar event
    const title = `Pernikahan ${groomName} & ${brideName}`;
    const details = `Acara pernikahan ${groomName} dan ${brideName}`;
    const location = `${eventLocation}, ${eventAddress}`;
    
    // Format date for calendar (YYYYMMDD)
    const calendarDate = eventDate.replace(/-/g, '');
    const calendarTime = eventTime.replace(':', '') + '00';
    
    // Google Calendar URL
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${calendarDate}T${calendarTime}/${calendarDate}T${calendarTime}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    
    // Open in new window
    window.open(googleCalendarUrl, '_blank');
}

// Open in maps functionality
function openMaps() {
    const eventLocation = '{{event_location}}';
    const eventAddress = '{{event_address}}';
    const fullAddress = `${eventLocation}, ${eventAddress}`;
    
    // Google Maps URL
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
    
    // Open in new window
    window.open(mapsUrl, '_blank');
}

// Copy link functionality
function copyLink() {
    const currentUrl = window.location.href;
    
    // Try to use the modern clipboard API
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(currentUrl).then(() => {
            showCopyMessage('Link berhasil disalin!');
        }).catch(() => {
            fallbackCopyTextToClipboard(currentUrl);
        });
    } else {
        // Fallback for older browsers
        fallbackCopyTextToClipboard(currentUrl);
    }
}

// Fallback copy function for older browsers
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopyMessage('Link berhasil disalin!');
        } else {
            showCopyMessage('Gagal menyalin link');
        }
    } catch (err) {
        showCopyMessage('Gagal menyalin link');
    }
    
    document.body.removeChild(textArea);
}

// Show copy message
function showCopyMessage(message) {
    // Create temporary message element
    const messageEl = document.createElement('div');
    messageEl.textContent = message;
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        font-weight: 500;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#copy-animation-styles')) {
        const style = document.createElement('style');
        style.id = 'copy-animation-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(messageEl);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageEl.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 300);
    }, 3000);
}

// Smooth scrolling for internal links
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add entrance animations
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
    
    // Observe sections for animation
    const sections = document.querySelectorAll('.event-details, .rsvp-section, .actions-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// Handle responsive navigation
window.addEventListener('resize', function() {
    // Handle any responsive adjustments if needed
    console.log('Window resized');
});

// Prevent form submission on Enter key for RSVP buttons
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.classList.contains('rsvp-btn')) {
        e.preventDefault();
        e.target.click();
    }
});

