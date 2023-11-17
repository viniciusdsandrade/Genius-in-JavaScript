class GeniusInfinityGame {
    constructor() {
        // Inicialização das variáveis e elementos do jogo
        this.colors = [
            'red',
            'blue',
            'yellow',
            'green'
        ]; // Cores disponíveis no jogo
        this.computerSequence = []; // Sequência gerada pelo computador
        this.playerSequence = []; // Sequência inserida pelo jogador
        this.round = 0; // Número da rodada atual
        this.playerTurn = false; // Indica se é a vez do jogador
        this.timer = 800; // Tempo entre os flashes das cores
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
        this.initializeGame("infinity"); // Inicializa o jogo
    }

    // Método para inicializar o jogo
    initializeGame() {
        this.addEventListeners(); // Adiciona os ouvintes de eventos
        this.resetGame(); // Reinicia o jogo
        this.showTopScores(); // Exibe os recordes iniciais
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

    // Método para verificar a entrada do jogador e compara com a sequência gerada pelo computador
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
    
    // Função para salvar a pontuação atual no armazenamento local após o fim de um jogo
    saveScore(score) {
        if (score > 0) {
            const key = `geniusScores_infinity`; // ou `geniusScores_dobro` para a outra classe
            const scores = JSON.parse(localStorage.getItem(key)) || [];
    
            // Verifica se a pontuação é maior do que a pontuação mais baixa no registro
            if (scores.length === 0 || score > scores[scores.length - 1]) {
                scores.push(score);
                scores.sort((a, b) => b - a); // Classifica as pontuações em ordem decrescente
                localStorage.setItem(key, JSON.stringify(scores));
                this.showTopScores(); // Atualiza a exibição dos recordes
            }
        }
    }
    
    // Função para exibir os recordes
    showTopScores() {
        const key = `geniusScores_infinity`; // ou `geniusScores_dobro` para a outra classe
        const scores = JSON.parse(localStorage.getItem(key)) || [];
        const filteredScores = scores.filter(score => score > 0);
        const topScores = filteredScores.slice(0, 3);
    
        const hitsElement = document.querySelector('.hits');
    
        if (topScores.length > 0) {
            const hitsText = topScores.map(score => `${score} hits`).join('<br>');
            hitsElement.innerHTML = hitsText;
        } else {
            hitsElement.textContent = 'Nenhum recorde ainda';
        }
    }

    // Método para lidar com o fim do jogo
    gameOver() {
        this.sounds.error.play().then(r => r); // Toca o som do erro
        const score = this.round - 1;
        alert(`Fim de jogo! Sua pontuação: ${score}`); // Exibe um alerta com a pontuação do jogador (número de rounds concluídos)
        this.saveScore(score); // Salva a pontuação atual
        this.resetGame(); // Reinicia o jogo
    }

    // Método para reiniciar o jogo. Limpa todas as variáveis do jogo
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

window.GeniusInfinityGame = GeniusInfinityGame; // Coloca a classe no escopo global