const log = console.log.bind(console);
function $(selector) {
  return document.querySelector(selector);
}
function Board(width = 80, height = 25) {
  const o = {
    x: 0,
    y: 100,
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
function Game(board) {
  const canvas = $('#canvas');
  const boardPainter = canvas.getContext('2d');
  const ballPainter = canvas.getContext('2d');
  boardPainter.fillRect(board.x, board.y, board.width, board.height);
  const keysAction = {};
  const keysDown = {};
  function addKeyAction(key, cb) {
    keysAction[key] = cb;
  }
  function update() {
    boardPainter.clearRect(0, 0, 300, 400);
    boardPainter.fillRect(board.x, board.y, board.width, board.height);
  }
  return {
    addKeyAction,
    keysAction,
    keysDown,
    update,
  }
}
let timer = [];
function main() {
  const board = Board();
  const game = Game(board);
  game.addKeyAction('ArrowLeft', board.moveLeft);
  game.addKeyAction('ArrowRight', board.moveRight);

  document.addEventListener('keydown', (e) => {
    log('keydown')
    if (timer.length < 10) {
      const t = setInterval(() => {
        const key = e.key;
        game.keysDown[key] = true;
        if (game.keysAction[key]) {
          game.keysAction[key]();
          game.update();
        }
      }, 1000 / 30);
      timer.push(t);
    }
  });
  document.addEventListener('keyup', (e) => {
    log('keyup');
    log(timer.length)
    timer.forEach(t => clearInterval(t));
    timer = [];
    game.keysDown[e.key] = false;
  });
}
main();