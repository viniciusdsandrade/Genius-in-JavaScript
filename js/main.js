class GeniusGame {
    constructor() {
        // Inicialização das variáveis e elementos do jogo
        this.colors = ['red', 'blue', 'yellow', 'green']; // Cores disponíveis no jogo
        this.computerSequence = []; // Sequência gerada pelo computador
        this.playerSequence = []; // Sequência inserida pelo jogador
        this.round = 0; // Número da rodada atual
        this.playerTurn = false; // Indica se é a vez do jogador
        this.timer = 500; // Tempo entre os flashes das cores
        this.roundDisplay = document.querySelector('.contador-de-rounds'); // Elemento de exibição do número da rodada
        this.buttons = {
            red: document.getElementById('red'),
            blue: document.getElementById('blue'),
            yellow: document.getElementById('yellow'),
            green: document.getElementById('green'),
            center: document.getElementById('btn-center'), // Botão central de início de jogo
            colored: Array.from(document.getElementsByClassName('btn')), // Array de botões coloridos
        };
        // Inicializa o jogo
        this.initializeGame();
    }

    initializeGame() {
        // Adiciona os ouvintes de eventos para os botões e reinicia o jogo
        this.addEventListeners();
        this.resetGame();
    }

    addEventListeners() {
        // Adiciona ouvinte de eventos para o botão central (iniciar o jogo) e para os botões coloridos
        this.buttons.center.addEventListener('click', () => this.startGame());
        for (const color of this.colors) {
            this.buttons[color].addEventListener('click', () => this.checkPlayerInput(color));
        }
    }

    startGame() {
        // Inicia o jogo quando o botão central é clicado
        if (!this.computerSequence.length) {
            this.buttons.center.textContent = "GENIUS"; // Altera o texto do botão central
            this.buttons.center.style.cursor = "default"; // Desativa o cursor do botão central
            this.buttons.colored.forEach(button => this.dark(button)); // Escurece todos os botões coloridos
            this.playRound(); // Inicia a primeira rodada
        }
    }

    playRound() {
        // Inicia uma rodada do jogo
        this.computerSequence.push(this.colors[Math.floor(Math.random() * this.colors.length)]); // Gera uma cor aleatória e a adiciona à sequência do computador
        this.showSequence(); // Exibe a sequência de cores gerada
        this.round++; // Incrementa o número da rodada
        this.roundDisplay.textContent = `ROUND ${this.round}`; // Atualiza o elemento de exibição da rodada
    }

    showSequence() {
        // Mostra a sequência gerada pelo computador para o jogador
        let i = 0;
        // Configura um intervalo de tempo para mostrar as cores da sequência
        const interval = setInterval(() => {
            // Verifica se todas as cores da sequência já foram exibidas
            if (i === this.computerSequence.length) {
                clearInterval(interval); // Limpa o intervalo quando todas as cores foram exibidas
                // Aguarda um pequeno intervalo antes de permitir que o jogador clique nos botões
                setTimeout(() => {
                    this.buttons.colored.forEach(button => this.canPress(button)); // Permite que o jogador clique nos botões
                    this.playerTurn = true; // É a vez do jogador
                }, i * this.timer);
                return;
            }
            const color = this.computerSequence[i];
            // Aguarda um intervalo de tempo antes de "iluminar" a cor atual
            setTimeout(() => {
                this.illuminateColor(color); // "Ilumina" a cor atual
            }, i * this.timer);
            i++;
        }, this.timer);
    }

    checkPlayerInput(color) {
        // Verifica a entrada do jogador e compara com a sequência gerada pelo computador
        if (!this.playerTurn) return; // Se não for a vez do jogador, não faz nada
        this.playerSequence.push(color);
        const index = this.playerSequence.length - 1;
        // Verifica se o jogador errou a sequência
        if (this.playerSequence[index] !== this.computerSequence[index]) {
            this.gameOver(); // O jogador errou, fim de jogo
            return;
        }
        this.illuminateColor(color); // "Ilumina" o botão clicado pelo jogador
        // Verifica se o jogador completou a sequência atual
        if (this.playerSequence.length === this.computerSequence.length) {
            this.playerTurn = false; // A vez do jogador acabou
            this.playerSequence = [];
            // Aguarda um pequeno intervalo antes de impedir que o jogador clique nos botões
            setTimeout(() => {
                this.buttons.colored.forEach(button => this.cannotPress(button)); // Impede que o jogador clique nos botões
                this.playRound(); // Inicia a próxima rodada
            }, this.timer);
        }
    }


    // Método para iluminar um botão com a cor especificada
    illuminateColor(color) {
        // Obtém o elemento do botão correspondente à cor
        let buttonToIlluminate = this.buttons[color];
        // Chama o método para tornar o botão claro
        this.light(buttonToIlluminate);
        // Aguarda um período de tempo (this.timer) e, em seguida, escurece o botão novamente
        setTimeout(() => {
            this.dark(buttonToIlluminate);
        }, this.timer);
    }

    // Método para tornar um botão claro
    light(element) {
        // Define a propriedade CSS "--opacity" do elemento como "100%" para iluminar o botão
        element.style.setProperty("--opacity", "100%");
    }

    // Método para tornar um botão escuro
    dark(element) {
        // Define a propriedade CSS "--opacity" do elemento como "65%" para escurecer o botão
        element.style.setProperty("--opacity", "65%");
    }

    // Método para permitir que um botão seja clicado
    canPress(element) {
        // Define o cursor do elemento como "pointer" para indicar que ele pode ser clicado
        element.style.cursor = "pointer";
    }

    // Método para impedir que um botão seja clicado
    cannotPress(element) {
        // Define o cursor do elemento como "default" para indicar que ele não pode ser clicado
        element.style.cursor = "default";
    }

    // Método para lidar com o fim do jogo
    gameOver() {
        // Exibe um alerta com a pontuação do jogador (número de rounds concluídos)
        alert(`Fim de jogo! Sua pontuação: ${this.round - 1}`);
        // Reinicia o jogo
        this.resetGame();
    }

    // Método para reiniciar o jogo
    resetGame() {
        // Limpa todas as variáveis do jogo
        this.computerSequence = [];
        this.playerSequence = [];
        this.round = 0;
        // Reseta o contador de rounds no elemento de exibição
        this.roundDisplay.textContent = "ROUND 0";
        // Restaura o texto do botão central para "JOGAR"
        this.buttons.center.textContent = "JOGAR";
        // Impede que o jogador clique nos botões coloridos
        this.buttons.colored.forEach(button => this.cannotPress(button));
        // Permite que o botão central seja clicado
        this.canPress(this.buttons.center);
        // Ilumina todos os botões coloridos
        this.buttons.colored.forEach(button => this.light(button));
        // Define que não é a vez do jogador (inicialmente)
        this.playerTurn = false;
    }
}

// Cria uma instância do jogo Genius
const geniusGame = new GeniusGame();