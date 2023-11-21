//se primeira tentativa sucesso e segunda falha, da certo
//se primeira tentativa falha, da erro, nao toca segunda tentativa
class GeniusPvpGame {
    constructor() {
        // Inicialização das variáveis e elementos do jogo
        this.colors = [
            'red',
            'blue',
            'yellow',
            'green'
        ]; // Cores disponíveis no jogo
        this.computerSequence = []; // Sequência gerada pelo computador
        this.playerSequence1 = []; // Sequência inserida pelo jogador 1
        this.playerSequence2 = []; // Sequência inserida pelo jogador 2
        this.whichPlayer = 1; // Indica se é a vez do jogador 1 ou 2
        this.round = 0; // Número da rodada atual
        this.playerTurn = false; // Indica se é a vez do jogador
        this.timer = 800; // Tempo entre os flashes das cores
        this.attempts = 2; // Número de tentativas do jogador
        this.roundDisplay = document.querySelector('.contador-de-rounds'); // Elemento de exibição do número da rodada
        this.buttons = {
            red: document.getElementById('red'),
            blue: document.getElementById('blue'),
            yellow: document.getElementById('yellow'),
            green: document.getElementById('green'),
            center: document.getElementById('btn-center'), // Botão central de início de jogo
            colored: Array.from(document.getElementsByClassName('btn')), // Array de botões coloridos
        }; // Elementos dos botões coloridos
        this.sounds = {
            red: new Audio('som/red.mp3'),
            blue: new Audio('som/blue.mp3'),
            yellow: new Audio('som/yellow.mp3'),
            green: new Audio('som/green.mp3'),
            start: new Audio('som/start.mp3'),
            error: new Audio('som/error2.mp3')
        }; // Sons do jogo

        const hitsElement = document.querySelector('.hits');
        hitsElement.textContent = '---'; // Esvaziar a tabela de recordes para o modo PVP

        this.initializeGame();  // Inicializa o jogo
    }

    // Método para inicializar o jogo
    initializeGame() {
        this.addEventListeners(); // Adiciona os ouvintes de eventos
        this.resetGame(); // Reinicia o jogo
    }

    // Método para adicionar os ouvintes de eventos
    addEventListeners() {
        this.buttons.center.addEventListener('click', () => this.startGame()); // Adiciona ouvinte de eventos para o botão central (iniciar o jogo)
        for (const color of this.colors) { // Adiciona ouvinte de eventos para os botões coloridos
            this.buttons[color].addEventListener('click', () => this.checkPlayerInput(color));
        }
    }

    // Método para iniciar o jogo
    startGame() {
        if (!this.computerSequence.length) {
            this.sounds.start.play().then(r => r); // Toca o som de início do jogo
            this.buttons.center.textContent = "GENIUS"; // Altera o texto do botão central
            this.buttons.center.style.cursor = "default"; // Desativa o cursor do botão central
            this.buttons.colored.forEach(button => this.dark(button)); // Escurece todos os botões coloridos
            this.playRound(); // Inicia a primeira rodada
        }
    }

    // Método para iniciar uma rodada do jogo
    playRound() {
        this.computerSequence.push(this.colors[Math.floor(Math.random() * this.colors.length)]); // Gera uma cor aleatória e a adiciona à sequência do computador
        this.showSequence(); // Exibe a sequência de cores gerada
        this.round++; // Incrementa o número da rodada
        this.roundDisplay.textContent = `ROUND ${this.round}`; // Atualiza o elemento de exibição da rodada
    }

    // Método para exibir a sequência gerada pelo computador
    showSequence() {
        let i = 0; // Variável para controlar o índice da cor atual
        const interval = setInterval(() => { // Configura um intervalo de tempo para mostrar as cores da sequência
            if (i === this.computerSequence.length) { // Verifica se todas as cores da sequência já foram exibidas
                clearInterval(interval); // Limpa o intervalo quando todas as cores foram exibidas
                setTimeout(() => { // Aguarda um pequeno intervalo antes de permitir que o jogador clique nos botões
                    this.buttons.colored.forEach(button => this.canPress(button)); // Permite que o jogador clique nos botões
                    this.playerTurn = true; // É a vez do jogador
                }, i * this.timer);
                return;
            }
            const color = this.computerSequence[i]; // Obtém a cor atual
            setTimeout(() => { // Aguarda um intervalo de tempo antes de "iluminar" a cor atual
                this.illuminateColor(color); // "Ilumina" a cor atual
            }, i * this.timer);
            i++;
        }, this.timer);
    }

    checkPlayerInput(color) {
        if (!this.playerTurn) return;

        // Apenas se for a vez do jogador 1
        if(this.whichPlayer === 1) {
            this.playerSequence1.push(color);
            const index = this.playerSequence1.length - 1;

            // Caso o jogador 1 erre
            if (this.playerSequence1[index] !== this.computerSequence[index]) {
                this.whichPlayer = 2; // Passar a vez pro jogador 2
                alert('Jogador 1 errou. Vez do jogador 2.');
                this.playerSequence1.pop(); // Tirar o último elemento na sequência do jogador 1, porque foi um erro
                return; // Encerrar a função
            }

            this.illuminateColor(color);

            // Caso o jogador 1 acerte tudo
            if (this.playerSequence1.length === this.computerSequence.length) {
                this.whichPlayer = 2; // Passar a vez pro jogador 2
                alert('Jogador 1 acertou. Vez do jogador 2.');
                return; // Encerrar a função
            }
        }

        // Apenas se for a vez do jogador 2
        if(this.whichPlayer === 2) {
            this.playerSequence2.push(color);
            const index = this.playerSequence2.length - 1;

            // Caso o jogador 2 erre
            if (this.playerSequence2[index] !== this.computerSequence[index]) {
                this.playerSequence2.pop(); // Tirar o último elemento na sequência do jogador 2, porque foi um erro

                // Ver qual dos jogadores tem a sequência maior para definir o vencedor
                if(this.playerSequence1.length > this.playerSequence2.length) alert('Jogador 1 ganhou.');
                else if(this.playerSequence1.length === this.playerSequence2.length) alert('Empate.');
                else alert('Jogador 2 ganhou.');

                this.gameOver(); // Resetar o jogo
                return; // Encerrar a função
            }

            this.illuminateColor(color);

            // Caso o jogador 2 acerte tudo
            if (this.playerSequence2.length === this.computerSequence.length) {
                this.whichPlayer = 1; // Passar a vez pro jogador 1

                // Se a sequência do jogador 2 for maior que a do 1, é porque ele venceu
                // Caso contrário, é porque ambos acertaram tudo e podem ir para o próximo round
                if(this.playerSequence1.length < this.playerSequence2.length)
                {
                    alert('Jogador 2 ganhou.');
                    this.gameOver(); // Resetar o jogo
                    return; // Encerrar a função
                }
                
                // Preparação do próximo round
                this.playerTurn = false;
                this.playerSequence1 = [];
                this.playerSequence2 = [];
                setTimeout(() => {
                    this.buttons.colored.forEach(button => this.cannotPress(button));
                    this.playRound();
                }, this.timer);
            }
        }
    }
    
    // Método para iluminar um botão com a cor especificada
    illuminateColor(color) {
        let buttonToIlluminate = this.buttons[color]; // Obtém o elemento do botão correspondente à cor
        this.sounds[color].play(); // Tocar o som correspondente à cor
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
        this.resetGame(); // Reinicia o jogo
    }

    // Método para reiniciar o jogo. Limpa todas as variáveis do jogo
    resetGame() {
        this.computerSequence = []; // Limpa a sequência gerada pelo computador
        this.playerSequence1 = []; // Limpa a sequência inserida pelo jogador 1
        this.playerSequence2 = []; // Limpa a sequência inserida pelo jogador 2
        this.whichPlayer = 1; // Volta a vez para o jogador 1
        this.round = 0; // Reseta o número da rodada
        this.roundDisplay.textContent = "ROUND 0"; // Reseta o contador de rounds no elemento de exibição
        this.buttons.center.textContent = "JOGAR"; // Restaura o texto do botão central para "JOGAR"
        this.buttons.colored.forEach(button => this.cannotPress(button)); // Impede que o jogador clique nos botões coloridos
        this.canPress(this.buttons.center); // Permite que o botão central seja clicado
        this.buttons.colored.forEach(button => this.light(button)); // Ilumina todos os botões coloridos
        this.playerTurn = false; // Define que não é a vez do jogador (inicialmente)
    }

    ajuda(){
        document.querySelector("#ajuda").addEventListener("click", () => {
            // Seleciona o overlay
            const overlay = document.querySelector("#overlay");
            // Condicional para mostrar o overlay caso ele esteja invisível e vice-versa
            if (overlay.style.display == "block") {
                this.overlay.style.display = "none";
            } else {
                this.overlay.style.display = "block";
                }
            }
        )
    }
}

window.GeniusPvpGame = GeniusPvpGame; // Coloca a classe no escopo global