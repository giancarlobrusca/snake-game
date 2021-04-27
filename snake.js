// Guardo el canvas en una constante
const canvas = document.getElementById("canvas");

// Guardo el gameBoard
const gameBoard = canvas.getContext("2d");

// Guardo en una constante el tamaño de cada cuadrado
// (o sea, de cada parte de la serpiente)
const SIZE = 20;

const snakeHead = {
  positionX: 0, // Posicion en eje X
  positionY: 0, // Posicion en eje Y
};
const snakeBody = [];

let food = null; // { positionX, positionY }

// Posición futura de la snakeHead
let futureX = 0;
let futureY = 0;

setInterval(main, 100); // 1000ms === 1s

// GAME LOOP o MAIN LOOP
function main() {
  update(); // Actualiza las variables del juego
  draw(); // Representa las nuevas variables
}

function update() {
  const isGameOver = checkSnakeCollision();

  if (isGameOver) {
    gameOver();
    return;
  }

  // Guardar la posición anterior de la snakeHead
  let previousX = snakeHead.positionX;
  let previousY = snakeHead.positionY;
  if (snakeBody.length) {
    previousX = snakeBody[snakeBody.length - 1].positionX;
    previousY = snakeBody[snakeBody.length - 1].positionY;
  } else {
    previousX = snakeHead.positionX;
    previousY = snakeHead.positionY;
  }

  // Hacer que el snakeBody siga a la snakeHead
  for (let i = snakeBody.length - 1; i >= 1; --i) {
    snakeBody[i].positionX = snakeBody[i - 1].positionX; // elemento 1 <- elemento 0
    snakeBody[i].positionY = snakeBody[i - 1].positionY;
  }

  if (snakeBody.length) {
    snakeBody[0].positionX = snakeHead.positionX;
    snakeBody[0].positionY = snakeHead.positionY;
  }

  // Actualizar las coordenadas de la snakeHead
  snakeHead.positionX += futureX;
  snakeHead.positionY += futureY;

  // Detectar si la serpiente consumió el alimento
  if (
    food &&
    snakeHead.positionX === food.positionX &&
    snakeHead.positionY === food.positionY
  ) {
    food = null;

    // Aumenta el tamaño de la serpiente
    increaseSnakeSize(previousX, previousY);
  }

  // Generar alimento en caso de que no exista
  if (!food) {
    food = getRandomFoodPosition();
  }
}

function getRandomFoodPosition() {
  let position;

  do {
    position = { positionX: getRandomX(), positionY: getRandomY() };
  } while (!checkFoodCollision(position));

  return position;
}

function checkFoodCollision(position) {
  // Comparar posición del alimento con el cuerpo de la serpiente
  for (let i = 0; i < snakeBody.length; i++) {
    if (
      position.positionX === snakeBody[i].positionX &&
      position.positionY === snakeBody[i].positionY
    ) {
      return false;
    }
  }

  // Comparar posición del alimento con la cabeza de la serpiente
  if (
    position.positionX === snakeHead.positionX &&
    position.positionY === snakeHead.positionY
  ) {
    return false;
  }

  return true;
}

function checkSnakeCollision() {
  // Si las coordenadas de snakeHead son === a las coordenadas del body
  for (let i = 0; i < snakeBody.length; i++) {
    if (
      snakeHead.positionX === snakeBody[i].positionX &&
      snakeHead.positionY === snakeBody[i].positionY
    ) {
      return true;
    }
  }

  // Si las coordenadas se salen de los límites
  const topCollision = snakeHead.positionY < 0;
  const bottomCollision = snakeHead.positionY > 440;
  const leftCollision = snakeHead.positionX < 0;
  const rightCollision = snakeHead.positionX > 380;

  if (topCollision || bottomCollision || leftCollision || rightCollision) {
    return true;
  }

  return false;
}

function gameOver() {
  alert("PERDISTE");

  // Reiniciar valores
  snakeHead.positionX = 0;
  snakeHead.positionY = 0;
  futureX = 0;
  futureY = 0;
  snakeBody.length = 0;
}

function increaseSnakeSize(previousX, previousY) {
  snakeBody.push({
    positionX: previousX,
    positionY: previousY,
  });
}

function getRandomX() {
  // 0, 20, 40, ...380
  // 1, 2, ..., 19          x20 (380 / 20 = 19)
  return Math.floor(Math.random() * 20) * 20;
}

function getRandomY() {
  // 0, 20, 40, ..., 440
  // 1, 2, ..., 22        x20 (440 / 20 = 22)
  return Math.floor(Math.random() * 22) * 20;
}

function draw() {
  // Dibujar el fondo negro
  gameBoard.fillStyle = "black";
  gameBoard.fillRect(0, 0, canvas.width, canvas.height);

  // Dibujar la snakeHead
  drawThing(snakeHead, "lime");

  // Dibujar el cuerpo de la serpiente
  snakeBody.forEach((element) => drawThing(element, "green"));

  // Dibujar el alimento
  drawThing(food, "red");
}

function drawThing(obj, color) {
  gameBoard.fillStyle = color;
  gameBoard.fillRect(obj.positionX, obj.positionY, SIZE, SIZE);
}

document.addEventListener("keydown", moveSnake);

function moveSnake(event) {
  //   if (event.key === "ArrowUp") {
  //     console.log("Move up");
  //   } else if (event.key === "ArrowDown") {
  //     console.log("Move down");
  //   } else if (event.key === "ArrowRight") {
  //     console.log("Move right");
  //   } else if (event.key === "ArrowLeft") {
  //     console.log("Move Left");
  //   }

  switch (event.key) {
    case "ArrowUp":
      console.log("Move up");
      if (futureY === 0) {
        futureX = 0;
        futureY -= SIZE;
      }
      break;
    case "ArrowDown":
      console.log("Move down");
      if (futureY === 0) {
        futureX = 0;
        futureY += SIZE;
      }
      break;
    case "ArrowRight":
      console.log("Move right");
      if (futureX === 0) {
        futureX += SIZE;
        futureY = 0;
      }
      break;
    case "ArrowLeft":
      console.log("Move left");
      if (futureX === 0) {
        futureX -= SIZE;
        futureY = 0;
      }
      break;
    default:
      console.log("Estas tocando otra tecla que no es una flecha");
  }
}
