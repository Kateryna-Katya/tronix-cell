document.addEventListener('DOMContentLoaded', () => {

    // =================================================
    // КОНСТАНТЫ
    // =================================================
    const headerToggle = document.getElementById('nav-toggle'); 
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    const cookiePopup = document.getElementById('cookie-popup');
    const cookieAcceptBtn = document.getElementById('cookie-accept');
    const cookieName = 'tronix_cookie_accepted';

    // ... (Прочие константы для форм) ...
    const quizForm = document.getElementById('quiz-form');
    const contactForm = document.getElementById('contact-form');
    const submitContactBtn = document.getElementById('submit-btn');
    const successMessage = document.getElementById('success-message');
    let correctCaptchaAnswer = 0; 


    // =================================================
    // 1. COOKIE POPUP ЛОГИКА
    // =================================================
    
    const showCookiePopup = () => {
        if (cookiePopup && localStorage.getItem(cookieName) !== 'true') {
            setTimeout(() => {
                cookiePopup.classList.add('cookie-popup--visible');
            }, 1000); 
        }
    };

    const hideCookiePopup = () => {
        if (cookiePopup) {
            cookiePopup.classList.remove('cookie-popup--visible');
            localStorage.setItem(cookieName, 'true');
        }
    };

    if (cookieAcceptBtn) {
        cookieAcceptBtn.addEventListener('click', hideCookiePopup);
    }
    showCookiePopup();


    // =================================================
    // 2. ЛОГИКА МЕНЮ (HEADER TOGGLE) - ИСПРАВЛЕНО!
    // =================================================

    const toggleMenu = () => {
        if (!headerToggle || !navMenu) return; 
        
        const isActive = headerToggle.classList.toggle('is-active');

        if (isActive) {
            navMenu.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        } else {
            navMenu.style.display = 'none';
            document.body.style.overflow = ''; 
        }
    };

    if (headerToggle && navMenu) {
        headerToggle.addEventListener('click', toggleMenu);

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Закрываем меню, только если оно открыто и мы на мобильном разрешении
                if (window.innerWidth < 768 && headerToggle.classList.contains('is-active')) {
                    toggleMenu(); 
                }
            });
        });
        
        // ВНИМАНИЕ: УДАЛЕН КОНФЛИКТУЮЩИЙ КОД resize И ПРОВЕРКИ window.innerWidth.
        // Теперь видимость меню полностью управляется CSS медиа-запросами.
    }


    // =================================================
    // 3. AOS (ANIMATE ON SCROLL) ИНИЦИАЛИЗАЦИЯ
    // =================================================

    if (typeof AOS !== 'undefined') {
        AOS.init({
            once: true, 
            duration: 1000, 
        });
    }

    
    // =================================================
    // 4. ЛОГИКА ОЦЕНКИ ЗНАНИЙ (QUIZ) - СТРУКТУРА-ЗАГЛУШКА
    // ... (Код Quiz пропущен) ...
    
    // =================================================
    // 5. ЛОГИКА ФОРМЫ КОНТАКТОВ (#contact-form)
    // ... (Код Contact Form пропущен) ...

    const generateCaptcha = () => {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 5) + 1;
        const questionElement = document.getElementById('captcha-question');

        correctCaptchaAnswer = num1 + num2;
        if (questionElement) {
             questionElement.textContent = `${num1} + ${num2} = ?`;
        }
    };

    const validateForm = () => {
        // [ ... ВЕСЬ КОД ВАЛИДАЦИИ ... ]
        let isValid = true;
        
        const setError = (elementId, message) => {
            const errorElement = document.getElementById(elementId + '-error');
            if (errorElement) {
                errorElement.textContent = message;
            }
            if (message) isValid = false;
        };

        const nameInput = document.getElementById('name');
        if (nameInput && nameInput.value.trim().length < 2) {
            setError('name', 'Имя должно содержать минимум 2 символа.');
        } else {
            setError('name', '');
        }

        const emailInput = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput && !emailRegex.test(emailInput.value.trim())) {
            setError('email', 'Введите корректный Email адрес.');
        } else {
            setError('email', '');
        }

        const phoneInput = document.getElementById('phone');
        const letterRegex = /[a-zA-Zа-яА-Я]/; 
        
        if (phoneInput && phoneInput.value.trim() !== '') {
             if (letterRegex.test(phoneInput.value.trim())) {
                setError('phone', 'Поле может содержать только цифры и специальные символы.');
            } else {
                setError('phone', '');
            }
        } else {
             setError('phone', '');
        }

        const captchaInput = document.getElementById('captcha');
        if (captchaInput) {
            if (parseInt(captchaInput.value.trim()) !== correctCaptchaAnswer) {
                setError('captcha', 'Неверный ответ. Попробуйте снова.');
                generateCaptcha(); 
                captchaInput.value = '';
            } else {
                setError('captcha', '');
            }
        }
        
        const agreementCheckbox = document.getElementById('agreement');
        if (agreementCheckbox && !agreementCheckbox.checked) {
            setError('agreement', 'Необходимо согласиться с обработкой данных.');
        } else {
            setError('agreement', '');
        }

        return isValid;
    };


    if (contactForm) {
        generateCaptcha(); 

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            successMessage.style.display = 'none';

            if (!validateForm()) {
                return;
            }
            
            const originalText = submitContactBtn.textContent;
            submitContactBtn.textContent = 'Отправка...';
            submitContactBtn.disabled = true;

            setTimeout(() => {
                successMessage.textContent = '✅ Заявка успешно отправлена! Эксперт свяжется с вами в ближайшее время.';
                successMessage.classList.add('form__message--success');
                successMessage.style.display = 'block';
                
                contactForm.reset();
                generateCaptcha(); 

                setTimeout(() => {
                    submitContactBtn.textContent = originalText;
                    submitContactBtn.disabled = false;
                    successMessage.style.display = 'none';
                }, 4000); 

            }, 1500); 
        });
    }


    // =================================================
    // 6. ИНИЦИАЛИЗАЦИЯ LUCIDE ICONS
    // =================================================

    const initializeLucideIcons = () => {
        if (typeof lucide !== 'undefined') {
            try {
                lucide.createIcons();
            } catch (error) {
                console.error("Lucide Icons failed to create icons:", error);
            }
        }
    };
    
    initializeLucideIcons();

});