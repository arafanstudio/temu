// Classic Template JavaScript

// RSVP functionality
function submitRSVP(status) {
    const messageEl = document.getElementById('rsvp-message');
    
    // Show loading state
    messageEl.style.display = 'block';
    messageEl.className = 'rsvp-message';
    messageEl.innerHTML = 'Menyimpan konfirmasi kehadiran...';
    
    // Simulate API call (replace with actual implementation)
    setTimeout(() => {
        if (status === 'attending') {
            messageEl.className = 'rsvp-message success';
            messageEl.innerHTML = '✓ Terima kasih! Konfirmasi kehadiran Anda telah tersimpan. Kami sangat menantikan kehadiran Anda.';
        } else {
            messageEl.className = 'rsvp-message success';
            messageEl.innerHTML = '✓ Terima kasih atas konfirmasinya. Semoga kita dapat bertemu di kesempatan yang lain.';
        }
        
        // Disable buttons after submission
        const buttons = document.querySelectorAll('.rsvp-btn');
        buttons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.6';
            btn.style.cursor = 'not-allowed';
        });
    }, 1500);
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
    const details = `Dengan penuh sukacita, kami mengundang Anda untuk hadir dalam acara pernikahan ${groomName} dan ${brideName}. Acara akan diselenggarakan di ${eventLocation}.`;
    const location = `${eventLocation}, ${eventAddress}`;
    
    // Format date for calendar (YYYYMMDD)
    const calendarDate = eventDate.replace(/-/g, '');
    const calendarTime = eventTime.replace(':', '') + '00';
    
    // Calculate end time (assume 3 hours duration)
    const startHour = parseInt(eventTime.split(':')[0]);
    const endHour = (startHour + 3) % 24;
    const endTime = endHour.toString().padStart(2, '0') + '0000';
    
    // Google Calendar URL
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${calendarDate}T${calendarTime}/${calendarDate}T${endTime}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    
    // Open in new window
    window.open(googleCalendarUrl, '_blank');
    
    // Show confirmation message
    showNotification('Event berhasil ditambahkan ke kalender!', 'success');
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
    
    // Show confirmation message
    showNotification('Membuka lokasi di Google Maps...', 'success');
}

// Copy link functionality
function copyLink() {
    const currentUrl = window.location.href;
    
    // Try to use the modern clipboard API
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(currentUrl).then(() => {
            showNotification('Link undangan berhasil disalin ke clipboard!', 'success');
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
    textArea.style.opacity = '0';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification('Link undangan berhasil disalin!', 'success');
        } else {
            showNotification('Gagal menyalin link undangan', 'error');
        }
    } catch (err) {
        showNotification('Gagal menyalin link undangan', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Show notification message
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 30px;
        right: 30px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        font-family: 'Lora', serif;
        max-width: 300px;
        animation: slideInRight 0.4s ease, slideOutRight 0.4s ease 3.6s;
    `;
    
    // Add animation keyframes if not exists
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 4000);
}

// Smooth scrolling and entrance animations
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Intersection Observer for entrance animations
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
    const animatedSections = document.querySelectorAll('.event-details, .rsvp-section, .actions-section, .footer');
    animatedSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(40px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
    
    // Animate detail items with stagger effect
    const detailItems = document.querySelectorAll('.detail-item');
    detailItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(item);
    });
    
    // Animate action buttons with stagger effect
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach((btn, index) => {
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(20px)';
        btn.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(btn);
    });
});

// Handle responsive behavior
window.addEventListener('resize', function() {
    // Adjust any responsive elements if needed
    const heroHeight = window.innerHeight;
    const hero = document.querySelector('.hero');
    if (hero && heroHeight < 600) {
        hero.style.minHeight = '600px';
    }
});

// Prevent form submission on Enter key for buttons
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && (e.target.classList.contains('rsvp-btn') || e.target.classList.contains('action-btn'))) {
        e.preventDefault();
        e.target.click();
    }
});

// Add hover effects for ornaments
document.addEventListener('DOMContentLoaded', function() {
    const ornaments = document.querySelectorAll('.ornament-svg, .divider-svg');
    ornaments.forEach(ornament => {
        ornament.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        ornament.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

