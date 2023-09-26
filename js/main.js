
// Iniciando variáveis globais
const colors = ['red', 'blue', 'yellow', 'green'];
let computerSequence = [];
let playerSequence = [];
let round = 0;
let playerTurn = false;

// Selecionando os elementos html e atribuindo-os para variáveis
const roundDisplay = document.querySelector('.contador-de-rounds');
const buttons = {
    red: document.getElementById('red'),
    blue: document.getElementById('blue'),
    yellow: document.getElementById('yellow'),
    green: document.getElementById('green'),
    center: document.getElementById('btn-center'),
};

//Função que inicializa o jogo e começa um round
function playRound() {
    computerSequence.push(colors[Math.floor(Math.random() * 4)]);
    showSequence();
    round++;
    roundDisplay.textContent = `ROUND ${round}`;
    playerTurn = true;
}

//Função que mostra a sequência de botões a ser apertados e caso ja tenha mostrado todos, habilita para começar a rodada do player
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

//Função que faz a animação de iluminar/colorir/piscar o botão 
function illuminateColor(color) {
    buttons[color].classList.remove('btn-grey');
    buttons[color].classList.add(`btn-${color}`);
    setTimeout(() => {
        buttons[color].classList.add('btn-grey');
        buttons[color].classList.remove(`btn-${color}`);
    }, 1000);
}


//Função que checa uma jogada do jogador, se estiver correta, o jogo processegue, se estiver errada ela termina o jogo
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

//Função de final de jogo
function gameOver() {
    alert(`Fim de jogo! Sua pontuação: ${round}`);
    resetGame();
}

//Função que reseta o jogo para as configurações iniciais
function resetGame() {
    computerSequence = [];
    playerSequence = [];
    round = 0;
    roundDisplay.textContent = 'ROUND 0';
    playerTurn = false;
}

//Eventos que são acionados ao clicar com o mouse em algum dos botões do jogo, unicamente usados durante o jogo
buttons.red.addEventListener('click', () => checkPlayerInput('red'));
buttons.blue.addEventListener('click', () => checkPlayerInput('blue'));
buttons.yellow.addEventListener('click', () => checkPlayerInput('yellow'));
buttons.green.addEventListener('click', () => checkPlayerInput('green'));

//Evento que é acionado ao clicar em "Genius" no centro da tela para iniciar o jogo
buttons.center.addEventListener('click', () => {
    if (!computerSequence.length) {
      playRound();
    }
});