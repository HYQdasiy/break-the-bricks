const log = console.log.bind(console);
function $(selector) {
  return document.querySelector(selector);
}
function Board(width = 150, height = 10) {
  const o = {
    x: 0,
    y: 390,
    width,
    height,
    step: 10,
  };
  o.moveLeft = () => {
    o.x -= o.step;
    if (o.x < 0) o.x = 0;
  }
  o.moveRight = () => {
    o.x += o.step;
    if (o.x + o.width > 300) o.x = 300 - o.width;
  }
  return o;
}
function Ball() {
  const o = {
    x: 100,
    y: 200,
    width: 50,
    height: 25,
    stepX: 5,
    stepY: 5,
    fired: false,
    alive: true,
  };
  o.move = function () {
    if (o.x <= 0 || o.x + o.width >= 300) o.reboundX();
    o.x -= o.stepX;
    if (o.y <= 0 || o.y + o.height >= 400) o.reboundY();
    o.y -= o.stepY;
  }
  o.reboundX = function () {
    o.stepX *= -1;
  }
  o.reboundY = function () {
    o.stepY *= -1;
  }
  o.fire = function () {
    o.fired = true;
  }
  return o;
}
function Game(board, ball) {
  const canvas = $('#canvas');
  const boardPainter = canvas.getContext('2d');
   ballPainter = canvas.getContext('2d');
  boardPainter.fillRect(board.x, board.y, board.width, board.height);
  ballPainter.fillRect(ball.x, ball.y, ball.width, ball.height);
  const keysAction = {};
  const keysDown = {};
  function addKeyAction(key, cb) {
    keysAction[key] = cb;
  }
  function update() {

    log('移动后重画球的四个参数', ball.x, ball.y, ball.width, ball.height);
    // ballPainter.fillRect(ball.x, ball.y, ball.width, ball.height);
  }
  function collided(board, ball) {
    if (ball.x >= board.x && ball.x <= board.x + board.width && ball.y + ball.height > board.y ||
      ball.x + ball.width >= board.x && ball.x + ball.width <= board.x + board.width && ball.y + ball.height > board.y){
      log('collied');
      return true;
    }
    return false;
  }
  function onkeydown(key) {
    if (keysAction[key]) {
      keysAction[key]();
      update();
    }
  }
  function start() {
    ball.fire();
    setInterval(() => {
      boardPainter.clearRect(0, 0, 300, 400);
      boardPainter.fillRect(board.x, board.y, board.width, board.height);
      if (collided(board, ball)) ball.reboundY();
      // collided(board, ball)
      ball.move();
      ballPainter.fillRect(ball.x, ball.y, ball.width, ball.height);
    }, 1000 / 30);
  }
  return {
    onkeydown,
    addKeyAction,
    keysAction,
    keysDown,
    update,
    start,
  }
}
let timer = [];
function main() {
  const board = Board();
   ball = Ball();
  const game = Game(board, ball);
  game.addKeyAction('ArrowLeft', board.moveLeft);
  game.addKeyAction('ArrowRight', board.moveRight);
  game.addKeyAction('f', game.start);

  document.addEventListener('keydown', (e) => {
    log('keydown')
    log(e.key)
    game.onkeydown(e.key);
  });
  // document.addEventListener('keyup', (e) => {
  //   log('keyup');
  //   game.onkeyup(e.key);
  // });
}
main();