(function () {
  "use strict";
  const CELL_WIDTH = 40;
  const CELL_HEIGHT = 40;
  const WALL_IMG = "block.png";
  const GOAL_IMG = "goal.png";
  const PLAYER_IMG = "index.png";
  const BOX_IMG = "box.png";
  const IN_COLOR = "aquamarine";
  const OUT_COLOR = "whitesmoke";

  const A_UP = 0;
  const A_RIGHT = 1;
  const A_DOWN = 2;
  const A_LEFT = 3;
  const actions = {
    ArrowLeft: A_LEFT,
    ArrowRight: A_RIGHT,
    ArrowUp: A_UP,
    ArrowDown: A_DOWN,
  };
  const GOAL_BIT = 0x01;
  const BOX_BIT = 0x02;
  const PLAYER_BIT = 0x04;
  const WALL_VAL = 8;
  const OUT_VAL = 9;
  const problems = [
    [
      [9, 9, 9, 8, 8, 8, 8, 8],
      [8, 8, 8, 8, 0, 0, 0, 8],
      [8, 1, 0, 2, 1, 0, 0, 8],
      [8, 0, 8, 2, 8, 0, 8, 8],
      [8, 0, 0, 4, 0, 0, 8, 9],
      [8, 8, 8, 8, 8, 8, 8, 9],
    ],
    [
      [9, 8, 8, 8, 8, 8, 8, 8, 9],
      [9, 8, 0, 4, 1, 1, 1, 8, 9],
      [9, 8, 0, 0, 0, 8, 8, 8, 8],
      [8, 8, 8, 2, 0, 0, 0, 0, 8],
      [8, 0, 0, 0, 8, 2, 8, 0, 8],
      [8, 0, 2, 0, 8, 0, 0, 0, 8],
      [8, 0, 0, 0, 8, 8, 8, 8, 8],
      [8, 8, 8, 8, 8, 9, 9, 9, 9],
    ],
    [
      [8, 8, 8, 8, 8, 8, 8],
      [8, 0, 0, 8, 0, 0, 8],
      [8, 0, 2, 0, 2, 0, 8],
      [8, 0, 1, 8, 1, 0, 8],
      [8, 0, 0, 1, 2, 4, 8],
      [8, 0, 1, 8, 1, 0, 8],
      [8, 0, 2, 0, 2, 0, 8],
      [8, 0, 0, 8, 0, 0, 8],
      [8, 8, 8, 8, 8, 8, 8],
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
  let moves;
  let probSelectElem;
  let undoButtonElem;
  let resetButtonElem;
  function onKeyDown(e) {
    e.preventDefault();
    e.stopPropagation();
    doAction(actions[e.code]);
  }
  function doAction(action) {
    if (action == null) return;
    let xp = xPlayer;
    let yp = yPlayer;
    let xb = xp;
    let yb = yp;
    switch (action) {
      case A_LEFT:
        --xp;
        xb = xp - 1;
        break;
      case A_RIGHT:
        ++xp;
        xb = xp + 1;
        break;
      case A_UP:
        --yp;
        yb = yp - 1;
        break;
      case A_DOWN:
        ++yp;
        yb = yp + 1;
        break;
      default:
        return;
    }
    if (board[yp][xp] >= WALL_VAL) return;
    if (!(board[yp][xp] & BOX_BIT)) {
      board[yPlayer][xPlayer] &= ~PLAYER_BIT;
      drawCell(xPlayer, yPlayer);
      board[yp][xp] |= PLAYER_BIT;
      xPlayer = xp;
      yPlayer = yp;
      drawPlaer();
      moves.push({ action: action, push: false });
      ++step;
      stepElem.textContent = step.toString();
    } else if (board[yb][xb] < WALL_VAL && !(board[yb][xb] & BOX_BIT)) {
      board[yp][xp] &= ~BOX_BIT;
      board[yb][xb] |= BOX_BIT;
      drawCell(xp, yp);
      drawCell(xb, yb);
      board[yPlayer][xPlayer] &= ~PLAYER_BIT;
      drawCell(xPlayer, yPlayer);
      board[yp][xp] |= PLAYER_BIT;
      xPlayer = xp;
      yPlayer = yp;
      drawPlaer();
      moves.push({ action: action, push: true });
      ++step;
      stepElem.textContent = step.toString();
      ++push;

      pushElem.textContent = push.toString();
      if (isGoal()) {
        stopGame();
        setTimeout(() => {
          alert("CLEAR");
        }, 300);
      }
    }
  }
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
        x * CELL_WIDTH,
        y * CELL_HEIGHT,
        CELL_WIDTH,
        CELL_HEIGHT
      );
    }
    if (b & BOX_BIT) {
      ctx.drawImage(
        iBox,
        x * CELL_WIDTH,
        y * CELL_HEIGHT,
        CELL_WIDTH,
        CELL_HEIGHT
      );
    }
  }
  function drawBoard() {
    for (let y = 0; y < board.length; ++y) {
      for (let x = 0; x < board[y].length; ++x) {
        drawCell(x, y);
      }
    }
    drawPlaer();
  }

  function isGoal() {
    return goals.every((g) => board[g[1]][g[0]] & BOX_BIT);
  }
  function getGoalList() {
    const a = new Array();
    let cp = 0;
    let cb = 0;
    for (let y = 0; y < board.length; ++y) {
      for (let x = 0; x < board[y].length; ++x) {
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
      alert("�S�[��������܂���");
    }
    if (cb !== a.length) {
      alert("�ו��̐�" + cb + "�ƃS�[���̐�" + a.length + "����v���܂���");
    }
    if (cp !== 1) {
      alert("�v���[���[��" + cp + "1�ƈႢ�܂�");
    }
    return a;
  }

  function countUp() {
    etimeElem.textContent = ((Date.now() - startTime) / 1000).toFixed();
  }

  function startGame() {
    const s = parseInt(probSelectElem.value);

    board = new Array();
    for (let i = 0; i < problems[s - 1].length; ++i) {
      board[i] = problems[s - 1][i].slice();
    }
    goals = getGoalList();
    canvasWidth = CELL_WIDTH * board[0].length;
    canvasHeight = CELL_HEIGHT * board.length;
    canvasElem.width = canvasWidth;
    canvasElem.height = canvasHeight;
    ctx = canvasElem.getContext("2d");
    ctx.fillStyle = OUT_COLOR;
    drawBoard();

    moves = new Array();

    countUpTimer = setInterval(countUp, 400);

    step = 0;
    stepElem.textContent = step.toString();
    push = 0;
    pushElem.textContent = push.toString();
    startTime = Date.now();
    document.body.addEventListener("keydown", onKeyDown, true);
    undoButtonElem.disabled = false;
  }
  function stopGame() {
    if (!countUpTimer) return;
    clearInterval(countUpTimer);
    countUpTimer = undefined;
    document.body.removeEventListener("keydown", onkeydown, true);
    undoButtonElem.disabled = true;
  }

  function undoMove() {
    const m = moves.pop();
    if (!m) return;
    let xp = xPlayer;
    let yp = yPlayer;
    let xb = xp;
    let yb = yp;
    switch (m.action) {
      case A_LEFT:
        xb = xp - 1;
        ++xp;
        break;
      case A_RIGHT:
        xb = xp + 1;
        --xp;
        break;
      case A_UP:
        yb = yp - 1;
        ++yp;
        break;
      case A_DOWN:
        yb = yp + 1;
        --yp;
        break;
    }
    board[yPlayer][xPlayer] &= ~PLAYER_BIT;
    board[yp][xp] |= PLAYER_BIT;
    if (m.push) {
      board[yb][xb] &= ~BOX_BIT;
      drawCell(xb, yb);
      board[yPlayer][xPlayer] |= BOX_BIT;
      --push;
      pushElem.textContent = push.toString();
    }
    drawCell(xPlayer, yPlayer);
    xPlayer = xp;
    yPlayer = xp;
    drawPlaer();
    --step;
    stepElem.textContent = step.toString();
  }
  class ImageLoader {
    set(...names) {
      const a = new Array(names.length);
      for (let i = 0; i < names.length; ++i) {
        a[i] = new Image();
        a[i].addEventListener("load", this.loaded.bind(this), { once: true });
      }
      this.loading = names.length;
      for (let i = 0; i < names.length; ++i)
        a[i].src = names[i] + "?ms=" + Date.now();
      return a;
    }
    loaded() {
      if (--this.loading === 0) {
        canvasElem.style.visibility = "";
        startGame();
      }
    }
  }
  function init() {
    stepElem = document.getElementById("step");
    pushElem = document.getElementById("push");
    etimeElem = document.getElementById("etime");

    probSelectElem = document.getElementById("probSelect");
    undoButtonElem = document.getElementById("undoButton");
    resetButtonElem = document.getElementById("resetButton");

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
    for (let i = 1; i <= problems.length; ++i) {
      const o = document.createElement("option");
      o.value = i.toString();
      o.textContent = i.toString();
      if (i === 1) o.selected = true;
      probSelectElem.appendChild(o);
    }
    probSelectElem.addEventListener("change", () => {
      stopGame();
      startGame();
    });
    undoButtonElem.addEventListener("click", () => {
      undoMove();
    });
    resetButtonElem.addEventListener("click", () => {
      stopGame();
      startGame();
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();
