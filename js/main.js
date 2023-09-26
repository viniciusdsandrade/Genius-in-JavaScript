const colors = ['red', 'blue', 'yellow', 'green'];
let computerSequence = [];
let playerSequence = [];
let round = 0;
let playerTurn = false;

const roundDisplay = document.querySelector('.contador-de-rounds');
const buttons = {
    red: document.getElementById('red'),
    blue: document.getElementById('blue'),
    yellow: document.getElementById('yellow'),
    green: document.getElementById('green'),
    center: document.getElementById('btn-center'),
};

function playRound() {
    computerSequence.push(colors[Math.floor(Math.random() * 4)]);
    showSequence();
    round++;
    roundDisplay.textContent = `ROUND ${round}`;
    playerTurn = true;
}

function showSequence() {
    let i = 0;
    const interval = setInterval(() => {
        if (i === computerSequence.length) {
            clearInterval(interval);
            playerTurn = true;
            return;
        }
        const color = computerSequence[i];
        setTimeout(() => {
            illuminateColor(color);
        }, i * 1000);
        i++;
    }, 1000);
}

function illuminateColor(color) {
    buttons[color].classList.remove('btn-grey');
    buttons[color].classList.add(`btn-${color}`);
    setTimeout(() => {
        buttons[color].classList.add('btn-grey');
        buttons[color].classList.remove(`btn-${color}`);
    }, 1000);
}

function checkPlayerInput(color) {
    if (!playerTurn) return;

    playerSequence.push(color);
    illuminateColor(color);

    const index = playerSequence.length - 1;
    if (playerSequence[index] !== computerSequence[index]) {
        gameOver();
        return;
    }

    if (playerSequence.length === computerSequence.length) {
        playerTurn = false;
        playerSequence = [];
        setTimeout(() => {
            playRound();
        }, 1000);
    }
}

function gameOver() {
    alert(`Fim de jogo! Sua pontuação: ${round}`);
    resetGame();
}

function resetGame() {
    computerSequence = [];
    playerSequence = [];
    round = 0;
    roundDisplay.textContent = 'ROUND 0';
    playerTurn = false;
}

buttons.red.addEventListener('click', () => checkPlayerInput('red'));
buttons.blue.addEventListener('click', () => checkPlayerInput('blue'));
buttons.yellow.addEventListener('click', () => checkPlayerInput('yellow'));
buttons.green.addEventListener('click', () => checkPlayerInput('green'));

buttons.center.addEventListener('click', () => {
    if (!computerSequence.length) {
      playRound();
    }
});
  