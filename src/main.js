document.addEventListener('DOMContentLoaded', () => {

  // =================================================
  // КОНСТАНТЫ
  // =================================================
  const headerToggle = document.getElementById('header-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');

  // =================================================
  // 1. COOKIE POPUP ЛОГИКА
  // =================================================
  const cookiePopup = document.getElementById('cookie-popup');
  const cookieAcceptBtn = document.getElementById('cookie-accept');
  const cookieName = 'tronix_cookie_accepted';

  /**
   * Показывает Cookie Popup, если пользователь еще не принимал политику.
   * Запускается с небольшой задержкой для лучшего UX.
   */
  const showCookiePopup = () => {
      if (cookiePopup && localStorage.getItem(cookieName) !== 'true') {
          setTimeout(() => {
              cookiePopup.classList.add('cookie-popup--visible');
          }, 1000);
      }
  };

  /**
   * Скрывает Cookie Popup и сохраняет выбор пользователя в localStorage.
   */
  const hideCookiePopup = () => {
      if (cookiePopup) {
          cookiePopup.classList.remove('cookie-popup--visible');
          localStorage.setItem(cookieName, 'true');
      }
  };

  // Привязываем обработчик к кнопке "Принять"
  if (cookieAcceptBtn) {
      cookieAcceptBtn.addEventListener('click', hideCookiePopup);
  }

  // Запускаем показ попапа
  showCookiePopup();


  // =================================================
  // 2. ЛОГИКА МЕНЮ (HEADER TOGGLE)
  // =================================================

  /**
   * Скрывает мобильное меню и деактивирует иконку-бургер.
   */
  const closeMenu = () => {
      if (navMenu) navMenu.style.display = 'none';
      if (headerToggle) headerToggle.classList.remove('is-active');
  };

  if (headerToggle && navMenu) {
      // Переключение меню
      headerToggle.addEventListener('click', () => {
          const isActive = headerToggle.classList.toggle('is-active');
          navMenu.style.display = isActive ? 'flex' : 'none';
      });

      // Закрытие меню при клике на любой элемент навигации
      navLinks.forEach(link => {
          link.addEventListener('click', closeMenu);
      });

      // Корректное отображение меню при изменении размера экрана (mobile <-> desktop)
      window.addEventListener('resize', () => {
           if (window.innerWidth >= 768) {
              // На десктопе меню всегда должно быть видно
              navMenu.style.display = 'block';
              headerToggle.classList.remove('is-active');
          } else {
               // На мобильных скрываем меню, если оно не активно
               if (!headerToggle.classList.contains('is-active')) {
                   navMenu.style.display = 'none';
               }
          }
      });

      // Инициализация отображения навигации при загрузке (для десктопов)
      if (window.innerWidth >= 768) {
          navMenu.style.display = 'block';
      }
  }


  // =================================================
  // 3. AOS (ANIMATE ON SCROLL) ИНИЦИАЛИЗАЦИЯ
  // =================================================

  // Инициализация библиотеки AOS (если она подключена)
  if (typeof AOS !== 'undefined') {
      AOS.init({
          duration: 1000,
          easing: 'ease-in-out',
          once: true,
          mirror: false
      });
  }


  // =================================================
  // 4. ЛОГИКА КОНТАКТНОЙ ФОРМЫ
  // =================================================

  const contactForm = document.getElementById('contact-form');
  const formMessageSuccess = document.getElementById('form-message-success');
  const formMessageError = document.getElementById('form-message-error');

  /**
   * Выполняет простую клиентскую валидацию полей формы.
   */
  const validateForm = () => {
      let isValid = true;

      // Получаем значения полей
      const name = document.getElementById('name')?.value.trim() || '';
      const email = document.getElementById('email')?.value.trim() || '';
      const message = document.getElementById('message')?.value.trim() || '';
      const agreement = document.getElementById('agreement')?.checked || false;

      // Вспомогательная функция для установки ошибок
      const setError = (id, msg) => {
          const element = document.getElementById(id);
          if (element) element.textContent = msg;
          if (msg) isValid = false;
      };

      // Валидация имени
      setError('name-error', name.length < 2 ? 'Введите корректное имя.' : '');

      // Валидация email
      setError('email-error', !/^\S+@\S+\.\S+$/.test(email) ? 'Введите корректный email.' : '');

      // Валидация сообщения
      setError('message-error', message.length < 10 ? 'Сообщение должно быть длиннее 10 символов.' : '');

      // Валидация согласия
      setError('agreement-error', !agreement ? 'Требуется согласие на обработку.' : '');

      // Валидацию капчи здесь пропускаем, так как она обычно серверная

      return isValid;
  };


  if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
          e.preventDefault();

          // Сбрасываем предыдущие сообщения
          if (formMessageSuccess) formMessageSuccess.style.display = 'none';
          if (formMessageError) formMessageError.style.display = 'none';
          if (formMessageError) formMessageError.textContent = '';


          if (validateForm()) {

              // --- ИМИТАЦИЯ ОТПРАВКИ ФОРМЫ ---
              console.log('Форма успешно отправлена (имитация).');

              // Показываем сообщение об успехе и сбрасываем форму
              if (formMessageSuccess) {
                  formMessageSuccess.style.display = 'block';
                  contactForm.reset();
              }

              // В реальном приложении здесь должен быть Fetch API или AJAX запрос:
              /*
              fetch('/api/contact', {
                  method: 'POST',
                  body: new FormData(contactForm)
              })
              .then(response => {
                  if (response.ok) {
                      // Успех
                  } else {
                      // Ошибка
                  }
              })
              .catch(error => {
                  // Ошибка сети или другая
              });
              */

          } else {
              console.log('Форма содержит ошибки валидации.');
              if (formMessageError) {
                  formMessageError.textContent = 'Пожалуйста, исправьте ошибки в форме.';
                  formMessageError.style.display = 'block';
              }
          }
      });
  }

  // =================================================
  // 5. ЛОГИКА ОЦЕНКИ ЗНАНИЙ (QUIZ) - СТРУКТУРА-ЗАГЛУШКА
  // =================================================

  // Оставляем структуру для будущего развития, даже если CSS секции исключен.
  const quizContainer = document.getElementById('quiz-container');
  const quizStartBtn = document.getElementById('quiz-start-btn');

  if (quizContainer) {
      console.log('Quiz container found. Logic is deferred/placeholder.');

      const questions = [
          // { text: "Вопрос 1...", options: ["A", "B", "C"], correct: "A" }
      ];

      const startQuiz = () => {
          console.log('Starting quiz...');
          // ... Здесь будет логика отображения вопросов и отслеживания ответов ...
      };

      if (quizStartBtn) {
          // quizStartBtn.addEventListener('click', startQuiz);
      }
  }

}); // Конец DOMContentLoaded