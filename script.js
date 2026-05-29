// =================================================================
// 1. ESTADO DO JOGO (VARIÁVEIS DE CONTROLE)
// =================================================================
let dia = 1;
let saudePlanta = 100;      // 0 a 100%
let nivelPragas = 10;       // 0 a 100%
let impactoAmbiental = 0;   // 0 a 100% (quanto menor, mais sustentável)
let orcamento = 1000;       // Moeda do jogo para tomar ações

// =================================================================
// 2. CONTROLE DO LOOP DO SIMULADOR (PASSO A PASSO)
// =================================================================

// Função que avança o tempo e atualiza a lógica biológica
function atualizarSimulador() {
    dia++;
    
    // Lógica Natural: As pragas crescem um pouco a cada dia se não controladas
    nivelPragas += Math.floor(Math.random() * 5) + 2; 

    // Lógica Biológica: Pragas em excesso atacam a planta e reduzem sua saúde
    if (nivelPragas > 30) {
        let dano = Math.floor((nivelPragas - 30) * 0.5);
        saudePlanta -= dano;
    }

    // Limites de segurança para as variáveis (entre 0 e 100)
    nivelPragas = Math.max(0, Math.min(100, nivelPragas));
    saudePlanta = Math.max(0, Math.min(100, saudePlanta));
    impactoAmbiental = Math.max(0, Math.min(100, impactoAmbiental));

    // Atualiza os dados na tela do usuário
    atualizarInterface();

    // Verifica se o jogo acabou (Vitória ou Derrota)
    verificarFimDeJogo();
}

// =================================================================
// 3. AÇÕES DO JOGADOR (BOTÕES)
// =================================================================

/**
 * AÇÃO A: Aplicar Defensivo Químico convencional
 * Elimina pragas rápido, mas gera alto impacto ambiental e custo médio.
 */
function aplicarDefensivoQuimico() {
    if (orcamento >= 150) {
        orcamento -= 150;
        nivelPragas -= 50;       // Elimina muitas pragas
        impactoAmbiental += 25;  // Alto impacto negativo no solo/água
        
        acionarAnimacaoQuimico();
        alert("Defensivo químico aplicado! Pragas reduzidas, mas o solo sofreu impacto.");
        atualizarSimulador();
    } else {
        alert("Orçamento insuficiente para defensivos químicos!");
    }
}

function acionarAnimacaoQuimico() {
    const spray = document.getElementById("spray-effect");
    spray.innerHTML = "";

    const particulas = 16;
    for (let i = 0; i < particulas; i++) {
        const particula = document.createElement("span");
        particula.className = "spray-particle";

        const startX = 78 + Math.random() * 15;
        const startY = 14 + Math.random() * 12;
        particula.style.left = `${startX}%`;
        particula.style.top = `${startY}%`;

        const dx = -120 - Math.random() * 80;
        const dy = 40 + Math.random() * 80;
        particula.style.setProperty("--dx", `${dx}px`);
        particula.style.setProperty("--dy", `${dy}px`);
        particula.style.width = `${6 + Math.random() * 6}px`;
        particula.style.height = `${6 + Math.random() * 6}px`;
        particula.style.animationDuration = `${0.7 + Math.random() * 0.5}s`;
        particula.style.animationDelay = `${Math.random() * 0.1}s`;

        spray.appendChild(particula);
    }

    spray.classList.add("active");
    setTimeout(() => {
        spray.classList.remove("active");
        spray.innerHTML = "";
    }, 1000);
}

/**
 * AÇÃO B: Manejo Integrado / Controle Biológico (Sustentável)
 * Reduz pragas de forma gradual, limpa o meio ambiente e tem custo moderado.
 */
function aplicarControleBiologico() {
    if (orcamento >= 200) {
        orcamento -= 200;
        nivelPragas -= 25;       // Controle moderado e natural
        impactoAmbiental -= 10;  // Ajuda a recuperar o equilíbrio do ecossistema
        saudePlanta += 5;        // Fortalece a planta indiretamente
        
        alert("Predadores naturais soltos! O ecossistema agradece e entra em equilíbrio.");
        atualizarSimulador();
    } else {
        alert("Orçamento insuficiente para manejo sustentável!");
    }
}

/**
 * AÇÃO C: Esperar e Monitorar
 * Não gasta dinheiro, mas permite acompanhar a evolução natural.
 */
function passarDia() {
    atualizarSimulador();
}

// =================================================================
// 4. ATUALIZAÇÃO DA INTERFACE (HTML)
// =================================================================
function atualizarInterface() {
    // Vincula as variáveis do JavaScript aos IDs de texto do seu HTML
    document.getElementById("txt-dia").innerText = dia;
    document.getElementById("txt-saude").innerText = saudePlanta + "%";
    document.getElementById("txt-pragas").innerText = nivelPragas + "%";
    document.getElementById("txt-ambiente").innerText = impactoAmbiental + "%";
    document.getElementById("txt-orcamento").innerText = "$" + orcamento;

    // Crescimento visual da planta ao longo dos dias
    const planta = document.querySelector(".planta");
    const crescimentoBase = 1 + (dia - 1) * 0.05;
    const penalidadeSaude = saudePlanta < 50 ? 0.85 : 1;
    const escalaPlanta = Math.min(2, crescimentoBase * penalidadeSaude);
    planta.style.transform = `scale(${escalaPlanta.toFixed(2)})`;

    // Animação de glitter quando a planta já está em desenvolvimento
    const estaDesenvolvida = dia >= 6;
    planta.classList.toggle("glitter", estaDesenvolvida);

    // Desenvolvimento da planta: muda o emoji ao longo do tempo
    let emojiPlanta = "🌱";
    if (dia >= 14) {
        emojiPlanta = "🌸";
    } else if (dia >= 10) {
        emojiPlanta = "🌼";
    } else if (dia >= 6) {
        emojiPlanta = "🌿";
    }
    planta.innerText = emojiPlanta;

    // Lógica visual básica: Muda a cor do texto dependendo da gravidade
    const txtAmbiente = document.getElementById("txt-ambiente");
    const badge = document.getElementById("badge-estado");
    if (impactoAmbiental > 50) {
        txtAmbiente.style.color = "red";
        badge.innerText = "Alerta ambiental";
        badge.style.backgroundColor = "#d32f2f";
    } else {
        txtAmbiente.style.color = "green";
        badge.innerText = "Saudável";
        badge.style.backgroundColor = "var(--verde-principal)";
    }
}

// =================================================================
// 5. REGRAS DE VITÓRIA E DERROTA (O FEEDBACK DO CONCURSO)
// =================================================================
function verificarFimDeJogo() {
    // Derrota 1: Excesso de poluição destrói o ecossistema
    if (impactoAmbiental >= 90) {
        alert("Fim de Jogo! O excesso de defensivos químicos contaminou o solo e os lençóis freáticos. O ecossistema colapsou.");
        reiniciarSimulador();
    }
    // Derrota 2: Pragas destroem a plantação
    else if (saudePlanta <= 0) {
        alert("Fim de Jogo! As pragas devoraram toda a lavoura porque faltou manejo adequado.");
        reiniciarSimulador();
    }
    // Vitória por Equilíbrio: Chegar ao dia 15 com parâmetros sustentáveis
    else if (dia >= 15 && saudePlanta >= 70 && impactoAmbiental <= 40) {
        alert("Parabéns! Você alcançou o Equilíbrio Perfeito! Agro forte e futuro sustentável garantidos.");
        reiniciarSimulador();
    }
}

// Reseta o jogo para as configurações iniciais
function reiniciarSimulador() {
    dia = 1;
    saudePlanta = 100;
    nivelPragas = 10;
    impactoAmbiental = 0;
    orcamento = 1000;
    atualizarInterface();
}

// Garante que a tela comece com os valores certos assim que carregar o site
window.onload = atualizarInterface;