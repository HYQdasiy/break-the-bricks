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
function Draw(painter) {
  return function(element) {
    painter.fillRect(element.x, element.y, element.width, element.height);  
  }
}
function Game(board, ball) {
  const canvas = $('#canvas');
  const painter = canvas.getContext('2d');
  const draw = Draw(painter);
  draw(board);
  draw(ball);
  const keysAction = {};
  const keysDown = {};
  function addKeyAction(key, cb) {
    keysAction[key] = cb;
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
    }
  }
  function start() {
    ball.fire();
    setInterval(() => {
      // 这里是整个画布清除，一开始尝试着单独清除球，但是总有边框没清除掉，不止为什么
      painter.clearRect(0, 0, 300, 400);
      draw(board);
      if (collided(board, ball)) ball.reboundY();
      ball.move();
      draw(ball);
    }, 1000 / 30);
  }
  return {
    onkeydown,
    addKeyAction,
    keysAction,
    keysDown,
    start,
  }
}
function main() {
  const board = Board();
  const ball = Ball();
  const game = Game(board, ball);
  game.addKeyAction('ArrowLeft', board.moveLeft);
  game.addKeyAction('ArrowRight', board.moveRight);
  game.addKeyAction('f', game.start);

  document.addEventListener('keydown', (e) => {
    game.onkeydown(e.key);
  });
}
main();