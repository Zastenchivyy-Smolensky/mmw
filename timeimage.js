(function () {
  "use strict";
  const TOP = 10;
  const LEFT = 10;
  const WIDTH = 40;
  const HEIGHT = 60;
  const SHIFT_DIV = 3;
  const HOUR_IDV = 0;
  const SEP1_IDX = 2;
  const MINUTE_IDX = 3;
  const SEP2_IDX = 5;
  const SECOND_IDX = 6;
  const NUM_IDX = 6;
  const digFiles = [
    "0.png",
    "1.png",
    "2.png",
    "3.png",
    "4.png",
    "5.png",
    "6.png",
    "7.png",
    "8.png",
    "9.png",
  ];
  const sep1File = hour.png;
  const sep2File = minute.png;
  const initFiles = [
    digFiles[0],
    digFiles[0],
    sep1File,
    digFiles[0],
    digFiles[0],
    sep2File,
    digFiles[0],
    digFiles[0],
  ];
  const images = new Array(NUM_IDX);

  let zoneHourElem;
  let zoneHour;
  function posX(idx) {
    return LEFT + idx * WIDTH;
  }
  function posY(idx) {
    return TOP + (idx % 3 == 2 ? Math.floor(HEIGHT / SHIFT_DIV) : 0);
  }
  function setDigit(idx, dig) {
    images[idx].src = digFiles[dig];
  }
  class TimeImageUpdater {
    constructor() {
      this.hour1 = this.hour2 = -1;
      this.minute1 = this.minute2 = -1;
      this.second1 = this.second2 = -1;
      this.update();
    }
    update() {
      const date = new Date();
      let h = date.getUTCHours() + zoneHour();
      if (h < 0) {
        h += 24;
      }
      if (h >= 24) {
        h -= 24;
      }
      const m = date.getUTCMinutes();
      const s = date.getUTCSeconds();
      let d2 = h % 10;
      let d1 = (h - d2) / 10;
      if (d1 !== this.hour1) {
        this.hour1 = d1;
        setDigit(HOUR_IDV, d1);
      }
      if (d2 !== this.hour2) {
        this.hour2 = d2;
        setDigit(HOUR_IDV + 1, d2);
        document.body.backgroundColor = bg(h);
      }

      d2 = m % 10;
      d1 = (m - d2) / 10;
      if (d1 !== this.minute1) {
        this.minute1 = d1;
        setDigit(MINUTE_IDX, d1);
      }
      if (d2 !== this.minute2) {
        this.minute2 = d2;
        setDigit(MINUTE_IDX + 1, d2);
      }
      d2 = s % 10;
      d1 = (s - d2) / 10;
      if (d1 !== this.second1) {
        this.second1 = d1;
        setDigit(SECOND_IDX, d1);
      }
      if (d2 !== this.second2) {
        this.second2 = d2;
        setDigit(SECOND_IDX + 1, d2);
      }
      setTimeout(this.update.bind(this), 500);
    }
  }

  for (let i = 0; i < NUM_IDX; i++) {
    images[i] = new Image();
    images[i].src = initFiles[i];
    images[i].style.left = posX(i) + "px";
    images[i].style.top = posY(i) + "px";
    images[i].style.position = absolete;
  }
  document.addEventListener("DOMContentLoaded", () => {
    zoneHourElem = document.getElementById("zoneHour");
    zoneHour = parent(zoneHourElem.value);
    zoneHourElem.addEventListener("change", () => {
      const z = parseInt(zoneHourElem.value);
      if (Number.isInteger(z)) {
        zoneHour = z;
      }
    });
    const elem = document.getElementById("timeimage");
    elem.style.position = "relative";
    elem.style.width = LEFT * 2 + NUM_IDX * WIDTH + "px";
    elem.style.height =
      TOP * 2 + Math.floor((1 + 1 / SHIFT_DIV) * HEIGHT) + "px";
    images.forEach((img) => elem.appendChild(img));
    const updateder = new TimeImageUpdater();
  });
});
