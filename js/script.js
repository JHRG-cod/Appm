// Caminho do áudio do alerta
const ALERT_SOUND_PATH = './sons/alerta.mp3';

document.addEventListener('DOMContentLoaded', () => {
    atualizarStatus(); // Atualiza a interface ao carregar a página
    configurarBotoes(); // Configura os botões de chamada
    window.addEventListener('storage', atualizarTodosStatus); // Sincroniza mudanças do localStorage em tempo real
});

// Configura os botões dinamicamente para chamar o garçom
function configurarBotoes() {
    const cores = ['azul', 'vermelho', 'verde', 'amarelo'];
    cores.forEach(cor => {
        const botaoChamar = document.querySelector(`#botao-chamar-${cor}`);
        if (botaoChamar) {
            botaoChamar.addEventListener('click', () => chamarGarcom(cor));
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
    localStorage.setItem(statusKey, `Solicitado o atendimento para a área ${cor}`);
    alert(`Garçom chamado para a área ${cor}`);
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

// Limpa todos os status e atualiza a interface
function limparTodosStatus() {
    const cores = ['azul', 'vermelho', 'verde', 'amarelo'];
    cores.forEach(cor => limparStatus(cor));
}

// Atualiza os status na página com base no localStorage
function atualizarStatus() {
    const cores = ['azul', 'vermelho', 'verde', 'amarelo'];
    cores.forEach(cor => {
        const status = localStorage.getItem(`status-${cor}`) || 'Não Solicitado Atendimento';
        const statusElement = document.getElementById(`status-${cor}`);
        if (statusElement) {
            statusElement.textContent = status;

            // Adiciona destaque visual para status ativos
            const quadrante = document.querySelector(`.quadrante.${cor}`);
            if (status.includes('Solicitado o atendimento')) {
                quadrante.classList.add('destaque');
            } else {
                quadrante.classList.remove('destaque');
            }
        }
    });
}

// Sincroniza todos os status quando qualquer mudança ocorre no localStorage
function atualizarTodosStatus(event) {
    const cores = ['azul', 'vermelho', 'verde', 'amarelo'];
    if (cores.some(cor => event.key === `status-${cor}`)) {
        atualizarStatus(); // Atualiza a interface
        if (event.newValue.includes('Solicitado o atendimento')) {
            tocarSom(); // Reproduz som apenas para chamadas ativas
        }
    }
}
