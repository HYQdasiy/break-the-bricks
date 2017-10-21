const log = console.log.bind(console);
function $(selector) {
  return document.querySelector(selector);
}
function Board(width = 150, height = 10, speed = 10) {
  this.x = 0;
  this.y = 390;
  this.width = width;
  this.height = height;
  this.speed = speed;
}
Board.prototype.moveLeft = function() {
  this.x -= this.speed;
  if (this.x < 0) this.x = 0;
};
Board.prototype.moveRight = function() {
  this.x += this.speed;
  if (this.x + this.width > 300) this.x = 300 - this.width;
}
function Ball() {
  const o = {
    x: 100,
    y: 300,
    width: 50,
    height: 25,
    stepX: 3,
    stepY: 3,
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
function Brick(x, y) {
  this.x = x;
  this.y = y;
  this.alive = true;
  this.width = 50;
  this.height = 25;
}
function Draw(painter) {
  return function(element) {
    if (Array.isArray(element)) {
      element.forEach(e => e.alive ? painter.fillRect(e.x, e.y, e.width, e.height) : null);
    } else {
      painter.fillRect(element.x, element.y, element.width, element.height);  
    }
  }
}
function Game(board, ball, bricks) {
  const canvas = $('#canvas');
  const painter = canvas.getContext('2d');
  const draw = Draw(painter);
  draw(board);
  draw(ball);
  draw(bricks)
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
  function ballHitBrick(ball, brick) {
    if (!brick.alive) return 0;
    const ballLeftTop = [ball.x, ball.y]
    const ballRightTop = [ball.x + ball.width, ball.y];
    const ballLeftBottom = [ball.x, ball.y + ball.height];
    const ballRightBottom = [ball.x + ball.width, ball.y + ball.height];
    const tmpArr = [ballLeftTop, ballRightTop, ballLeftBottom, ballRightBottom];
    // if (ball.x > brick.x && ball.x< brick.x + brick.width || ball.x + ball.width > brick.x && ball.x + ball.width < brick.x + brick.width) {
    //   if (ball.y >= brick.y && ball.y <= brick.y + brick.height || ball.y + ball.height >= brick.y && ball.y + ball.height <= brick.y + brick.height) {
    //     // 上下相撞
    //     log(1)
    //     return 1;
    //   }
    // }
    // if (ball.y > brick.y && ball.y < brick.y + brick.height || ball.y + ball.height > brick.y && ball.y + ball.height < brick.y + brick.height) {
    //   if (ball.x > brick.x && ball.x< brick.x + brick.width || ball.x + ball.width > brick.x && ball.x + ball.width < brick.x + brick.width) {
    //     // 左右相撞
    //     log(2)
    //     return 2;
    //   }
    // }
    const index = tmpArr.findIndex(([x, y]) => {
      return x > brick.x && x < brick.x + brick.width && y > brick.y && y < brick.y + brick.height;
    });
    if (index === -1) return 0;
    if (index === 1 || index === 3) {
      if (tmpArr[index][0] - brick.x > tmpArr[index][1] - brick.y) return 1;
      return 2;
    } else {
      if (brick.x + brick.width - tmpArr[index][0] > brick.y + brick.height - tmpArr[index[1]]) return 1;
      return 2;
    }
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
      bricks.forEach((b) => {
        const hitSituation = ballHitBrick(ball,b);
        if (hitSituation === 1) {
          b.alive = false;
          ball.reboundY();
        } else if (hitSituation === 2) {
          b.alive = false;
          ball.reboundX();
        }
      })
      draw(bricks);
      ball.move();
      draw(ball);
    }, 1000 / 50);
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
  const board = new Board();
  const ball = Ball();
  const bricks = [];
  for (let i = 0;i < 3; i++) {
    bricks.push(new Brick(i * 100, 100));
  }
  for (let i = 0;i < 3; i++) {
    bricks.push(new Brick(i * 100, 200));
  }
  const game = Game(board, ball, bricks);
  game.addKeyAction('ArrowLeft', board.moveLeft.bind(board));
  game.addKeyAction('ArrowRight', board.moveRight.bind(board));
  game.addKeyAction('f', game.start);

  document.addEventListener('keydown', (e) => {
    game.onkeydown(e.key);
  });
}
main();