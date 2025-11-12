import initTimer from './js/timer.js';

async function loadMain() {

  const container = document.getElementById('main-content');

  try {
    const res = await fetch('/partials/main.html');
    const html = await res.text();
    container.innerHTML = html;
    initTimer({
      hoursSelector: '[data-h]',
      minutesSelector: '[data-m]',
      secondsSelector: '[data-s]',
      expiredSelector: '[data-expired]',
      startMinutes: 20,
    });
  } catch (err) {
    console.error('Помилка завантаження partial', err);
    container.textContent = 'Помилка завантаження контенту.';
  }
}

loadMain();
