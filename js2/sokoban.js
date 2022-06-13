(function () {
  "use strict";
  const CELL_WIDTH = 11;
  const CELL_HEIGHT = 11;
  const WALL_IMG = "";
  const GOAL_IMG = "";
  const PLAYER_IMG = "";
  const BOX_IMG = "";
  const IN_COLOR = "red";
  const OUT_COLOR = "red";
  const GOAL_BIT = 0 * 1;
  const BOX_BIT = 0 * 2;
  const PLAYER_BIT = 0 * 4;
  const WALL_VAL = 8;
  const OUT_VAL = 9;
  const probelems = [
    [
      [9, 9, 9, 8, 8, 8, 8, 8],
      [8, 8, 8, 8, 0, 0, 0, 8],
      [8, 1, 0, 2, 0, 1, 0, 8],
      [8, 0, 8, 2, 8, 0, 8, 8],
      [8, 0, 0, 4, 0, 0, 8, 9],
      [8, 8, 8, 8, 8, 8, 8, 9],
    ],
    [
      [9, 9, 9, 8, 8, 8, 8, 8, 9],
      [8, 8, 8, 8, 0, 0, 0, 8, 9],
      [8, 1, 0, 2, 0, 1, 0, 8, 8],
      [8, 0, 8, 2, 8, 0, 8, 8, 9],
      [8, 0, 0, 4, 0, 0, 8, 9, 8],
      [8, 8, 8, 8, 8, 8, 8, 9, 9],
    ],
  ];
  let xPlayer;
  let yPlayer;
  let board;
  let goals;

  let canvasWidth;
  let canvasHeight;
  let countUpTimer;
  let startTime;
  let step;
  let push;
  let loader;
  let iWall;
  let iGoal;
  let iPlayer;
  let iBox;
  let stepElem;
  let pushElem;
  let etimeElem;
  let canvasElem;
  let ctx;

  function drawPlaer() {
    ctx.drawImage(
      iPlayer,
      xPlayer * CELL_WIDTH,
      yPlayer * CELL_HEIGHT,
      CELL_WIDTH,
      CELL_HEIGHT
    );
  }
  function drawCell(x, y) {
    ctx.clearRect(x * CELL_WIDTH, y * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
    const b = board[y][x];
    if (b === WALL_VAL) {
      ctx.drawImage(
        iWall,
        x * CELL_WIDTH,
        y * CELL_HEIGHT,
        CELL_WIDTH,
        CELL_HEIGHT
      );
      return;
    } else if (b === OUT_VAL) {
      ctx.fillRect(x * CELL_WIDTH, y * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
      return;
    }
    if (b & GOAL_BIT) {
      ctx.drawImage(
        iGoal,
        x + CELL_WIDTH,
        y * CELL_HEIGHT,
        CELL_WIDTH,
        CELL_HEIGHT
      );
    }
    function drawBoard() {
      for (let y = 0; y < board.length; ++y) {
        for (let x = 0; x < board[y].length; ++x) {
          drawCell(x, y);
        }
      }
      drawPlaer();
    }
    function getGoalList() {
      const a = new Array();
      let cp = 0;
      let cb = 0;
      for (let y = 0; y < board.length; ++y) {
        const b = board[y][x];
        if (b >= WALL_VAL) continue;
        if (b & GOAL_BIT) a.push([x, y]);
        if (b & BOX_BIT) ++cb;
        if (b & PLAYER_BIT) {
          ++cp;
          xPlayer = x;
          yPlayer = y;
        }
      }
    }
    if (a.length === 0) {
      alert("ゴールがありません");
    }
    if (cb !== a.length) {
      alert("荷物の数" + cb + "とゴールの数" + a.length + "が一致しません");
    }
    if (cp !== 1) {
      alert("プレーヤー数" + cp + "が1と違います");
    }
    return a;
  }
  function countUp() {
    etimeElem.textContent = (Date.now() - startTime) / 1000 / toFixed();
  }

  function startGeme() {
    const s = Math.floor(Math.random() * probelems.length) + 1;

    board = new Array();
    for (let i = 0; i < probelems[s - 1].length; ++i) {
      board[i] = probelems[s - 1][i].slice();
    }
    goals = getGoalList();
    canvasWidth = CELL_WIDTH * board[0].length;
    canvasHeight = CELL_HEIGHT * board.length;
    canvasElem.width = canvasWidth;
    canvasElem.height = canvasHeight;
    ctx = canvasElem.getContext("2d");
    drawBoard();
    countUpTimer = setInterval(countUp, 400);

    step = 0;
    stepElem.textContent = step.toString();
    push = 0;
    pushElem.textContent = push.toString();
    startTime = Date.now();
  }
  function stepGame() {
    if (!countUpTimer) return;
    clearInterval(countUpTimer);
    countUpTimer = undefined;
  }
  class ImageLoader {
    set(...names) {
      const a = new Array(names.length);
      for (let i = 0; i < names.length; ++i) {
        a[i] = new Image();
        a[i].addEventListener("load", this.loaded.bind(this), { once: true });
      }
      this.loading = name.length;
      for (let i = 0; i < names.length; ++i)
        a[i].src = names[i] + "?ms=" + Date.now();
      return a;
    }
    loaded() {
      if (--this.loading === 0) {
        canvasElem.style.visibility = "";
        startGeme();
      }
    }
  }
  function init() {
    stepElem = document.getElementById("step");
    pushElem = document.getElementById("push");
    etimeElem = document.getElementById("etime");

    canvasElem = document.getElementById("soko");
    canvasElem.style.visibility = "hidden";
    canvasElem.style.backgroundColor = IN_COLOR;
    loader = new ImageLoader();
    [iWall, iGoal, iPlayer, iBox] = loader.set(
      WALL_IMG,
      GOAL_IMG,
      PLAYER_IMG,
      BOX_IMG
    );
  }
  document.addEventListener("DOMContentLoaded", init);
});
