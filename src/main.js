document.addEventListener('DOMContentLoaded', () => {

  // =================================================
  // 1. КОНСТАНТЫ И ИНИЦИАЛИЗАЦИЯ
  // =================================================

  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');
  const quizForm = document.getElementById('quiz-form');
  const contactForm = document.getElementById('contact-form');
  const submitContactBtn = document.getElementById('submit-btn');
  const successMessage = document.getElementById('success-message');

  let correctCaptchaAnswer = 0;

  // =================================================
  // 2. ЛОГИКА МОБИЛЬНОГО МЕНЮ (HEADER)
  // =================================================

  const toggleMenu = () => {
      navToggle.classList.toggle('is-active');
      // ... (логика меню) ...
      if (navMenu.style.display === 'flex') {
          navMenu.style.display = 'none';
          document.body.style.overflow = '';
      } else {
          navMenu.style.display = 'flex';
          document.body.style.overflow = 'hidden';
      }
  };

  if (navToggle && navMenu) {
      navToggle.addEventListener('click', toggleMenu);

      navLinks.forEach(link => {
          link.addEventListener('click', () => {
              if (window.innerWidth < 768 && navToggle.classList.contains('is-active')) {
                  toggleMenu();
              }
          });
      });

      window.addEventListener('resize', () => {
          if (window.innerWidth >= 768) {
              navMenu.style.display = 'block';
              document.body.style.overflow = '';
          } else {
               if (!navToggle.classList.contains('is-active')) {
                  navMenu.style.display = 'none';
              }
          }
      });
  }

  // =================================================
  // 3. AOS АНИМАЦИЯ (Инициализация)
  // =================================================

  if (typeof AOS !== 'undefined') {
      AOS.init({
          once: true,
          duration: 1000,
      });
  }

  // =================================================
  // 4. ЛОГИКА ОЦЕНКИ ЗНАНИЙ (QUIZ)
  // =================================================

  if (quizForm) {
      quizForm.addEventListener('submit', (e) => {
          e.preventDefault();

          const submitBtn = quizForm.querySelector('.quiz__submit-btn');
          const originalText = submitBtn.textContent;

          const allQuestions = quizForm.querySelectorAll('.quiz-question');
          let answeredCount = 0;
          allQuestions.forEach(q => {
              if (q.querySelector('input:checked')) {
                  answeredCount++;
              }
          });

          if (answeredCount < allQuestions.length) {
              alert('Пожалуйста, ответьте на все вопросы перед отправкой!');
              return;
          }

          submitBtn.textContent = 'Отправка результатов...';
          submitBtn.disabled = true;

          setTimeout(() => {
              submitBtn.textContent = '✅ Результат отправлен! Ожидайте email.';

              setTimeout(() => {
                  submitBtn.textContent = originalText;
                  submitBtn.disabled = false;
              }, 3000);

          }, 1500);
      });
  }


  // =================================================
  // 5. ЛОГИКА ФОРМЫ КОНТАКТОВ (#contact-form)
  // =================================================

  /**
   * Генерирует и отображает математический пример (Капча).
   */
  const generateCaptcha = () => {
      const num1 = Math.floor(Math.random() * 10) + 1;
      const num2 = Math.floor(Math.random() * 5) + 1;
      const questionElement = document.getElementById('captcha-question');

      correctCaptchaAnswer = num1 + num2;
      if (questionElement) {
           questionElement.textContent = `${num1} + ${num2} = ?`;
      }
  };

  /**
   * Валидация всех полей формы.
   * @returns {boolean} True, если форма валидна.
   */
  const validateForm = () => {
      let isValid = true;

      const setError = (elementId, message) => {
          const errorElement = document.getElementById(elementId + '-error');
          if (errorElement) {
              errorElement.textContent = message;
          }
          if (message) isValid = false;
      };

      // --- 1. ИМЯ ---
      const nameInput = document.getElementById('name');
      if (nameInput && nameInput.value.trim().length < 2) {
          setError('name', 'Имя должно содержать минимум 2 символа.');
      } else {
          setError('name', '');
      }

      // --- 2. EMAIL ---
      const emailInput = document.getElementById('email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInput && !emailRegex.test(emailInput.value.trim())) {
          setError('email', 'Введите корректный Email адрес.');
      } else {
          setError('email', '');
      }

      // --- 3. ТЕЛЕФОН (НОВАЯ ВАЛИДАЦИЯ) ---
      const phoneInput = document.getElementById('phone');
      // Регулярное выражение, которое ищет ЛЮБУЮ букву (как кириллицу, так и латиницу)
      const letterRegex = /[a-zA-Zа-яА-Я]/;

      if (phoneInput && phoneInput.value.trim() !== '') {
           if (letterRegex.test(phoneInput.value.trim())) {
              setError('phone', 'Поле может содержать только цифры, скобки, пробелы и символы + -.');
          } else {
              setError('phone', '');
          }
      } else {
           setError('phone', ''); // Сбрасываем ошибку, если поле пустое и не обязательное
      }

      // --- 4. КАПЧА ---
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

      // --- 5. СОГЛАСИЕ ---
      const agreementCheckbox = document.getElementById('agreement');
      if (agreementCheckbox && !agreementCheckbox.checked) {
          setError('agreement', 'Необходимо согласиться с обработкой данных.');
      } else {
          setError('agreement', '');
      }

      return isValid;
  };


  // --- ОБРАБОТЧИК ОТПРАВКИ КОНТАКТОВ ---
  if (contactForm) {
      generateCaptcha();

      contactForm.addEventListener('submit', (e) => {
          e.preventDefault();

          successMessage.style.display = 'none';

          if (!validateForm()) {
              console.log('Form validation failed.');
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

  if (typeof lucide !== 'undefined') {
      lucide.createIcons();
  }
});