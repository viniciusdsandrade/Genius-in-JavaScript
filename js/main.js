
// Iniciando variáveis globais
const colors = ['red', 'blue', 'yellow', 'green'];
let computerSequence = [];
let playerSequence = [];
let round = 0;
let playerTurn = false;
let timer = 500;

// Selecionando os elementos html e atribuindo-os para variáveis
const roundDisplay = document.querySelector('.contador-de-rounds');
const buttons = {
    red: document.getElementById('red'),
    blue: document.getElementById('blue'),
    yellow: document.getElementById('yellow'),
    green: document.getElementById('green'),
    center: document.getElementById('btn-center'),
    colored: Array.from(document.getElementsByClassName('btn')),
};

//Função que inicializa o jogo e começa um round
function playRound() {
    computerSequence.push(colors[Math.floor(Math.random() * 4)]);
    showSequence();
    round++;
    roundDisplay.textContent = `ROUND ${round}`;
}

//Função que mostra a sequência de botões a ser apertados e caso ja tenha mostrado todos, habilita para começar a rodada do player
function showSequence() {
    let i = 0;
    const interval = setInterval(() => {
        if (i === computerSequence.length) {
            clearInterval(interval);

            setTimeout(() => {
                buttons.colored.forEach(canPress);
                playerTurn = true;
            }, i * timer);

            return;
        }
        const color = computerSequence[i];
        setTimeout(() => {
            illuminateColor(color);
        }, i * timer);
        i++;
    }, timer);
}

//Funções que fazem a animação de piscar o botão 
function illuminateColor(color) {
    let buttonToIlluminate = document.getElementById(`${color}`);

    light(buttonToIlluminate);

    setTimeout(() => {
        dark(buttonToIlluminate);
    }, timer);
}

function light(element) {
    element.style.setProperty("--opacity", "100%");
}

function dark(element) {
    element.style.setProperty("--opacity", "65%");
}

//Funções para trocar o cursor dependendo do contexto
function canPress(element) {
    element.style.cursor = "pointer";
}

function cannotPress(element) {
    element.style.cursor = "default";
}

//Função que checa uma jogada do jogador, se estiver correta, o jogo prossegue, se estiver errada ela termina o jogo
function checkPlayerInput(color) {
    if (!playerTurn) return;

    playerSequence.push(color);

    const index = playerSequence.length - 1;
    if (playerSequence[index] !== computerSequence[index]) {
        gameOver();
        return;
    }

    illuminateColor(color);

    if (playerSequence.length === computerSequence.length) {
        playerTurn = false;
        playerSequence = [];

        setTimeout(() => {
            buttons.colored.forEach(cannotPress);
            playRound();
        }, timer);
    }
}

//Função de final de jogo
function gameOver() {
    alert(`Fim de jogo! Sua pontuação: ${round-1}`);
    resetGame();
}

//Função que reseta o jogo para as configurações iniciais
function resetGame() {
    computerSequence = [];
    playerSequence = [];
    round = 0;
    roundDisplay.textContent = "ROUND 0";
    buttons.center.textContent = "JOGAR";
    buttons.colored.forEach(cannotPress);
    canPress(buttons.center);
    buttons.colored.forEach(light);
    playerTurn = false;
}

//Eventos que são acionados ao clicar com o mouse em algum dos botões do jogo, unicamente usados durante o jogo
buttons.red.addEventListener('click', () => checkPlayerInput('red'));
buttons.blue.addEventListener('click', () => checkPlayerInput('blue'));
buttons.yellow.addEventListener('click', () => checkPlayerInput('yellow'));
buttons.green.addEventListener('click', () => checkPlayerInput('green'));

//Evento que é acionado ao clicar em "Jogar" no centro da tela para iniciar o jogo
buttons.center.addEventListener('click', () => {
    if (!computerSequence.length) {
        buttons.center.textContent = "GENIUS";
        cannotPress(buttons.center);
        buttons.colored.forEach(dark);
        playRound();
    }
});