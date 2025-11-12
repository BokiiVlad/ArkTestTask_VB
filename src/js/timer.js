function initTimer({ hoursSelector, minutesSelector, secondsSelector, expiredSelector, startMinutes }) {
  let time = startMinutes * 60;
  let intr;

  function tick() {
    time -= 1;
    let mins = Math.floor(time / 60);
    let secs = time % 60;

    mins = mins >= 10 ? mins : "0" + mins;
    secs = secs >= 10 ? secs : "0" + secs;

    const hElem = document.querySelector(hoursSelector);
    const mElem = document.querySelector(minutesSelector);
    const sElem = document.querySelector(secondsSelector);

    if (hElem) hElem.textContent = "00";
    if (mElem) mElem.textContent = mins;
    if (sElem) sElem.textContent = secs;

    if (time <= 0) {
      clearInterval(intr);
      const expiredElem = document.querySelector(expiredSelector);
      if (expiredElem) expiredElem.style.display = "block";
    }
  }

  intr = setInterval(tick, 1000);
}
export default initTimer