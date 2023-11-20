// Declaração de variáveis referentes ao HTML
const head = document.querySelector('head');
const body = document.querySelector('body');
const root = document.getElementById('root');

// Declaração de objetos referentes aos modos de jogo
const modos = {
    infinity: {
        nome: 'infinity',
        button: document.getElementById('infinity-botao'),
        css: `<link class="infinity" rel="stylesheet" href="css/geniusInfinity.css">`,
        conteudo: `
        <div class="infinity group-btn">
            <button id="red" class="btn"></button>
            <button id="blue" class="btn"></button>
            <button id="yellow" class="btn"></button>
            <button id="green" class="btn"></button>
            <button id="btn-center">JOGAR</button>
        </div>
        `,
    },

  pvp: {
        nome: 'pvp',
        button: document.getElementById('pvp-botao'),
        css: `<link class="infinity" rel="stylesheet" href="css/geniusInfinity.css">`,
        conteudo: `
        <div class="infinity group-btn">
        <button id="red" class="btn"></button>
        <button id="blue" class="btn"></button>
        <button id="yellow" class="btn"></button>
        <button id="green" class="btn"></button>
        <button id="btn-center">JOGAR</button>
    </div>
    `
    },

    dobro: {
        nome: 'dobro',
        button: document.getElementById('dobro-botao'),
        css: `<link class="dobro" rel="stylesheet" href="css/geniusDobro.css">`,
        conteudo: `
        <div class="dobro group-btn">
            <button id="orange" class="btn"></button>
            <button id="red" class="btn"></button>
            <button id="purple" class="btn"></button>
            <button id="blue" class="btn"></button>
            <button id="darkgreen" class="btn"></button>
            <button id="green" class="btn"></button>
            <button id="pink" class="btn"></button>
            <button id="yellow" class="btn"></button>
            <button id="btn-center">JOGAR</button>
            <div class="borda"></div>
            <div class="borda horizontal"></div>
            <div class="borda diagonal1"></div>
            <div class="borda diagonal2"></div>
        </div>
        `,
    },
}

// Variável para indicar qual o modo de jogo atual
let modoAtual = 'aviso-escolha-modo';

// Laço para declarar o que fazer quando o botão do modo de jogo específico é apertado
for(let modo in modos) {
    modos[modo].button.addEventListener('input', () => {
        let m = modos[modo];

        apagarModoPassado(modoAtual); // Limpar o modo anterior

        head.insertAdjacentHTML('afterbegin', m.css);
        root.insertAdjacentHTML('afterbegin', m.conteudo); // Inserir o modo novo

        let nomeMaiusculo = m.nome[0].toUpperCase() + m.nome.slice(1);
        let nomeClasse = `Genius${nomeMaiusculo}Game`;

        let script = criarTagScript(nomeMaiusculo);
        body.append(script); // Inserir o script do modo novo
        script.onload = () => new window[nomeClasse](); // Acionar uma instância do modo novo

        modoAtual = m.nome;
    });
}

// Função para apagar o modo de jogo passado, dando espaço ao atual
function apagarModoPassado(modo) {
    let aux = Array.from(document.getElementsByClassName(modo));
    for(let i = 0; i < aux.length; i++) aux[i].remove();
}

// Função para criar uma tag <script> do respectivo modo de jogo
function criarTagScript(nome) {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `js/genius${nome}.js`;
    script.classList.add(`${nome}`);
    return script;
}


//Código para o botão ajuda para a tela de selecionar o modo.
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
