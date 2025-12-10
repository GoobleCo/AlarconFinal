document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    initializeHeroPagination();
    initializeContactForm();
    initializeSmoothScrolling();
    initializeAnimations();
}

function initializeHeroPagination() {
    const dots = document.querySelectorAll('.hero-pagination .dot');
    const heroImages = [
        'https://tse3.mm.bing.net/th?id=OIP.oDlDp3jMGqjNdikZQhMcKwHaEr&pid=Api&P=0&h=180'
    ];
    
    let currentSlide = 0;
    const heroSection = document.querySelector('.hero');
    
    function changeSlide(index) {
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        
        heroSection.style.backgroundImage = `url('${heroImages[index]}')`;
        
        currentSlide = index;
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            changeSlide(index);
        });
    });
    
    setInterval(() => {
        currentSlide = (currentSlide + 1) % heroImages.length;
        changeSlide(currentSlide);
    }, 5000);
}

function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
        
        const today = new Date().toISOString().split('T')[0];
        const checkinInput = contactForm.querySelector('input[name="checkin"]');
        const checkoutInput = contactForm.querySelector('input[name="checkout"]');
        
        if (checkinInput && checkoutInput) {
            checkinInput.min = today;
            checkoutInput.min = today;
            
            checkinInput.addEventListener('change', function() {
                const checkinDate = new Date(this.value);
                checkinDate.setDate(checkinDate.getDate() + 1);
                checkoutInput.min = checkinDate.toISOString().split('T')[0];
            });
        }
    }
}

function handleFormSubmission(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const formObject = {};
    
    for (let [key, value] of formData.entries()) {
        formObject[key] = value;
    }
    
    if (validateFormData(formObject)) {
        const submitButton = event.target.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;
        
        setTimeout(() => {
            showSuccessMessage();
            event.target.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    }
}

function validateFormData(data) {
    const errors = [];
    
    if (!data.name.trim()) errors.push('El nombre es requerido');
    if (!data.email.trim()) errors.push('El email es requerido');
    if (!data.phone.trim()) errors.push('El teléfono es requerido');
    if (!data.checkin) errors.push('La fecha de ingreso es requerida');
    if (!data.checkout) errors.push('La fecha de salida es requerida');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
        errors.push('El formato del email no es válido');
    }
    
    if (data.checkin && data.checkout) {
        const checkinDate = new Date(data.checkin);
        const checkoutDate = new Date(data.checkout);
        
        if (checkoutDate <= checkinDate) {
            errors.push('La fecha de salida debe ser posterior a la fecha de ingreso');
        }
    }
    
    if (errors.length > 0) {
        showErrorMessage(errors.join('\n'));
        return false;
    }
    
    return true;
}

function showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #4CAF50;
            color: white;
            padding: 1rem 2rem;
            border-radius: 4px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        ">
            <strong>¡Consulta enviada exitosamente!</strong><br>
            Nos pondremos en contacto contigo pronto.
        </div>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 5000);
}

function showErrorMessage(errors) {
    const message = document.createElement('div');
    message.className = 'error-message';
    message.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #f44336;
            color: white;
            padding: 1rem 2rem;
            border-radius: 4px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            white-space: pre-line;
        ">
            <strong>Por favor corrige los siguientes errores:</strong><br>
            ${errors}
        </div>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 7000);
}

function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initializeAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeInUp {
            from {
                transform: translateY(30px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease-out;
        }
        
        .animate-on-scroll.animated {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    const animatedElements = document.querySelectorAll('.section-title, .cabin-card, .complex-text, .distances-card');
    animatedElements.forEach(el => el.classList.add('animate-on-scroll'));
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => observer.observe(el));
}

document.addEventListener('click', function(e) {
    if (e.target.matches('.cabin-card .btn-primary')) {
        const cabinName = e.target.closest('.cabin-card').querySelector('h3').textContent;
        handleCabinConsultation(cabinName);
    }
    
    if (e.target.matches('.cabin-card .btn-outline')) {
        const cabinName = e.target.closest('.cabin-card').querySelector('h3').textContent;
        showCabinDetails(cabinName);
    }
});

function handleCabinConsultation(cabinName) {
    const contactSection = document.querySelector('.contact-section');
    contactSection.scrollIntoView({ behavior: 'smooth' });
    
    setTimeout(() => {
        const messageTextarea = document.querySelector('textarea[name="message"]');
        if (messageTextarea) {
            messageTextarea.value = `Hola, estoy interesado en consultar sobre la disponibilidad de ${cabinName}. `;
            messageTextarea.focus();
        }
    }, 1000);
}

function showCabinDetails(cabinName) {
    alert(`Mostrando detalles de ${cabinName}. Esta funcionalidad se puede expandir con un modal o página dedicada.`);
}

function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

document.addEventListener('click', function(e) {
    if (e.target.matches('.btn') && !e.target.matches('button[type="submit"]')) {
        const button = e.target;
        const originalText = button.textContent;
        
        button.style.opacity = '0.7';
        button.style.pointerEvents = 'none';
        
        setTimeout(() => {
            button.style.opacity = '1';
            button.style.pointerEvents = 'auto';
        }, 300);
    }
});

console.log('Cabañas SOL website initialized successfully!');