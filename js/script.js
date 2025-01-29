// Caminho do áudio do alerta
const ALERT_SOUND_PATH = './sons/alerta.mp3';

// Lista de todas as cores e suas variações
const cores = [
    'azul', 'azul-claro', 'azul-escuro',
    'vermelho', 'vermelho-claro', 'vermelho-escuro',
    'verde', 'verde-claro', 'verde-escuro',
    'amarelo', 'amarelo-claro', 'amarelo-escuro'
];

document.addEventListener('DOMContentLoaded', () => {
    atualizarStatus();
    configurarBotoes();
    window.addEventListener('storage', atualizarTodosStatus);
});

function configurarBotoes() {
    cores.forEach(cor => {
        const botaoChamar = document.querySelector(`#botao-chamar-${cor}`);
        if (botaoChamar) {
            console.log(`Botão configurado: #botao-chamar-${cor}`);
            botaoChamar.addEventListener('click', () => chamarGarcom(cor));
        } else {
            console.warn(`Botão não encontrado: #botao-chamar-${cor}`);
        }
    });
}

// Toca som de alerta
function tocarSom() {
    const som = new Audio(ALERT_SOUND_PATH);
    som.play().catch(error => console.error('Erro ao tocar som:', error));
}

// Chama o garçom e agenda a limpeza após 2 minutos
function chamarGarcom(cor) {
    const statusKey = `status-${cor}`;
    localStorage.setItem(statusKey, `Solicitado o atendimento`);
    alert(`Garçom chamado para ${cor}`);
    tocarSom(); // Reproduz o som de alarme imediatamente
    atualizarStatus();

    // Limpa o status automaticamente após 2 minutos
    if (!window.statusTimers) {
        window.statusTimers = {};
    }
    clearTimeout(window.statusTimers[cor]); // Evita múltiplos timers
    window.statusTimers[cor] = setTimeout(() => limparStatus(cor), 120000); // Limpa após 2 minutos
}

// Limpa o status de uma cor específica
function limparStatus(cor) {
    localStorage.setItem(`status-${cor}`, 'Não Solicitado Atendimento');
    atualizarStatus();
}

// Atualiza os status na página com base no localStorage
function atualizarStatus() {
    cores.forEach(cor => {
        const status = localStorage.getItem(`status-${cor}`) || 'Não Solicitado Atendimento';
        const statusElement = document.getElementById(`status-${cor}`);
        if (statusElement) {
            statusElement.textContent = status;

            // Adiciona destaque visual para status ativos
            const quadrante = document.querySelector(`.quadrante.${cor}`);
            if (quadrante) {
                if (status.includes('Solicitado o atendimento')) {
                    quadrante.classList.add('destaque');
                } else {
                    quadrante.classList.remove('destaque');
                }
            } else {
                console.warn(`Quadrante não encontrado: .quadrante.${cor}`);
            }
        } else {
            console.warn(`Elemento de status não encontrado: #status-${cor}`);
        }
    });
}

// Sincroniza todos os status quando qualquer mudança ocorre no localStorage
function atualizarTodosStatus(event) {
    if (cores.some(cor => event.key === `status-${cor}`)) {
        atualizarStatus(); // Atualiza a interface
        if (event.newValue && event.newValue.includes('Solicitado o atendimento')) {
            tocarSom(); // Reproduz som apenas para chamadas ativas
        }
    }
}
