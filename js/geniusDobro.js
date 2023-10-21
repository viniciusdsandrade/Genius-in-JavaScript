class GeniusDobroGame {
    constructor() {
        // Inicialização das variáveis e elementos do jogo
        this.colors = [
            'orange',
            'red',
            'purple',
            'blue',
            'darkgreen',
            'green',
            'pink',
            'yellow'
        ]; // Cores disponíveis no jogo
        this.computerSequence = []; // Sequência gerada pelo computador
        this.playerSequence = []; // Sequência inserida pelo jogador
        this.round = 0; // Número da rodada atual
        this.playerTurn = false; // Indica se é a vez do jogador
        this.timer = 500; // Tempo entre os flashes das cores
        this.roundDisplay = document.querySelector('.contador-de-rounds'); // Elemento de exibição do número da rodada
        this.buttons = {
            orange: document.getElementById('orange'),
            red: document.getElementById('red'),
            purple: document.getElementById('purple'),
            blue: document.getElementById('blue'),
            darkgreen: document.getElementById('darkgreen'),
            green: document.getElementById('green'),
            pink: document.getElementById('pink'),
            yellow: document.getElementById('yellow'),
            center: document.getElementById('btn-center'),
            colored: Array.from(document.getElementsByClassName('btn')), // Array de botões coloridos
        }; // Elementos dos botões coloridos e do botão central
        this.sounds = {
            red: new Audio('som/red.mp3'),
            blue: new Audio('som/blue.mp3'),
            yellow: new Audio('som/yellow.mp3'),
            green: new Audio('som/green.mp3'),
            darkgreen: new Audio('som/darkgreen.mp3'),
            orange: new Audio('som/orange.mp3'),
            pink: new Audio('som/pink.mp3'),
            purple: new Audio('som/purple.mp3'),
            error: new Audio('som/error2.mp3'),
            start: new Audio('som/start.mp3')
        }; // Sons do jogo
        this.initializeGame(); // Inicializa o jogo
    }

    // Método para inicializar o jogo
    initializeGame() {
        this.addEventListeners(); // Adiciona os ouvintes de eventos
        this.resetGame(); // Reinicia o jogo
    }

    // Adiciona ouvinte de eventos para o botão central (iniciar o jogo) e para os botões coloridos
    addEventListeners() {
        this.buttons.center.addEventListener('click', () => this.startGame());
        for (const color of this.colors) {
            this.buttons[color].addEventListener('click', () => this.checkPlayerInput(color));
        }
    }

    // Inicia o jogo quando o botão central é clicado
    startGame() {
        if (!this.computerSequence.length) {
            this.sounds.start.play().then(r => r); //Toca o som de início do jogo
            this.buttons.center.textContent = "GENIUS"; // Altera o texto do botão central
            this.buttons.center.style.cursor = "default"; // Desativa o cursor do botão central
            this.buttons.colored.forEach(button => this.dark(button)); // Escurece todos os botões coloridos
            this.playRound(); // Inicia a primeira rodada
        }
    }

    // Inicia uma rodada do jogo
    playRound() {
        this.computerSequence.push(this.colors[Math.floor(Math.random() * this.colors.length)]); // Gera uma cor aleatória e a adiciona à sequência do computador
        this.showSequence(); // Exibe a sequência de cores gerada
        this.round++; // Incrementa o número da rodada
        this.roundDisplay.textContent = `ROUND ${this.round}`; // Atualiza o elemento de exibição da rodada
    }

    // Método para exibir a sequência gerada pelo computador
    showSequence() {
        let i = 0; // Índice da cor atual da sequência
        const interval = setInterval(() => {  // Configura um intervalo de tempo para mostrar as cores da sequência
            if (i === this.computerSequence.length) { // Verifica se todas as cores da sequência já foram exibidas
                clearInterval(interval); // Limpa o intervalo quando todas as cores foram exibidas
                setTimeout(() => { // Aguarda um pequeno intervalo antes de permitir que o jogador clique nos botões
                    this.buttons.colored.forEach(button => this.canPress(button)); // Permite que o jogador clique nos botões
                    this.playerTurn = true; // É a vez do jogador
                }, i * this.timer);
                return; // Encerra a função
            }

            const color = this.computerSequence[i]; // Obtém a cor atual

            setTimeout(() => { // Aguarda um intervalo de tempo antes de "iluminar" a cor atual
                this.illuminateColor(color); // "Ilumina" a cor atual
            }, i * this.timer);
            i++;
        }, this.timer);
    }

    // Verifica a entrada do jogador e compara com a sequência gerada pelo computador
    checkPlayerInput(color) {
        if (!this.playerTurn) return; // Se não for a vez do jogador, não faz nada
        this.playerSequence.push(color); // Adiciona a cor clicada pelo jogador à sequência do jogador
        const index = this.playerSequence.length - 1; // Obtém o índice da cor atual
        if (this.playerSequence[index] !== this.computerSequence[index]) { // Verifica se o jogador errou a sequência
            this.gameOver(); // O jogador errou, fim de jogo
            return; // Encerra o método
        }
        this.illuminateColor(color); // "Ilumina" o botão clicado pelo jogador
        if (this.playerSequence.length === this.computerSequence.length) { // Verifica se o jogador completou a sequência atual
            this.playerTurn = false; // A vez do jogador acabou
            this.playerSequence = []; // Limpa a sequência inserida pelo jogador
            setTimeout(() => { // Aguarda um pequeno intervalo antes de impedir que o jogador clique nos botões
                this.buttons.colored.forEach(button => this.cannotPress(button)); // Impede que o jogador clique nos botões
                this.playRound(); // Inicia a próxima rodada
            }, this.timer);
        }
    }

    // Método para iluminar um botão com a cor especificada
    illuminateColor(color) {
        let buttonToIlluminate = this.buttons[color]; // Obtém o elemento do botão correspondente à cor
        this.sounds[color].play(); // Toca o som no índice color da array sounds (som correspondente a cor)
        this.light(buttonToIlluminate); // Chama o método para tornar o botão claro
        setTimeout(() => {
            this.dark(buttonToIlluminate); // Aguarda um período de tempo (this.timer) e, em seguida, escurece o botão novamente
        }, this.timer);
    }

    // Método para tornar um botão claro
    light(element) {
        element.style.setProperty("--opacity", "100%"); // Define a propriedade CSS "--opacity" do elemento como "100%" para iluminar o botão
    }

    // Método para tornar um botão escuro
    dark(element) {
        element.style.setProperty("--opacity", "65%"); // Define a propriedade CSS "--opacity" do elemento como "65%" para escurecer o botão
    }

    // Método para permitir que um botão seja clicado
    canPress(element) {
        element.style.cursor = "pointer"; // Define o cursor do elemento como "pointer" para indicar que ele pode ser clicado
    }

    // Método para impedir que um botão seja clicado
    cannotPress(element) {
        element.style.cursor = "default"; // Define o cursor do elemento como "default" para indicar que ele não pode ser clicado
    }

    // Método para lidar com o fim do jogo
    gameOver() {
        this.sounds.error.play().then(r => r); // Toca o som de erro
        alert(`Fim de jogo! Sua pontuação: ${this.round - 1}`); // Exibe um alerta com a pontuação do jogador (número de rounds concluídos)
        this.resetGame(); // Reinicia o jogo
    }

    // Método para reiniciar o jogo
    resetGame() {
        this.computerSequence = []; // Limpa a sequência gerada pelo computador
        this.playerSequence = []; // Limpa a sequência inserida pelo jogador
        this.round = 0; // Reseta o número da rodada
        this.roundDisplay.textContent = "ROUND 0"; // Reseta o contador de rounds no elemento de exibição
        this.buttons.center.textContent = "JOGAR"; // Restaura o texto do botão central para "JOGAR"
        this.buttons.colored.forEach(button => this.cannotPress(button)); // Impede que o jogador clique nos botões coloridos
        this.canPress(this.buttons.center); // Permite que o botão central seja clicado
        this.buttons.colored.forEach(button => this.light(button)); // Ilumina todos os botões coloridos
        this.playerTurn = false; // Define que não é a vez do jogador (inicialmente)
    }
}

window.GeniusDobroGame = GeniusDobroGame; // Coloca a classe no escopo global