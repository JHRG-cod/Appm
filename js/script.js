// Caminho do áudio do alerta
const ALERT_SOUND_PATH = './sons/alerta.mp3'; 

// Inicia a lógica quando o conteúdo for carregado
document.addEventListener('DOMContentLoaded', () => {
    atualizarStatus(); // Atualiza os status existentes
    configurarBotoes(); // Configura os botões de chamada e limpeza
    window.addEventListener('storage', atualizarStatus); // Sincroniza alterações entre abas
});

// Configura os botões dinamicamente
function configurarBotoes() {
    const cores = ['azul', 'vermelho', 'verde', 'amarelo'];
    cores.forEach(cor => {
        const botaoChamar = document.getElementById(`botao-chamar-${cor}`);
        if (botaoChamar) {
            botaoChamar.addEventListener('click', () => chamarGarcom(cor));
        }
    });
    const botaoLimpar = document.getElementById('botao-limpar-todos');
    if (botaoLimpar) {
        botaoLimpar.addEventListener('click', limparTodosStatus);
    }
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
    alert(`Garçom chamado para a cor ${cor}`);
    tocarSom();
    atualizarStatus();

    // Limpa o status após 2 minutos, mantendo apenas um temporizador ativo por cor
    if (!window.statusTimers) {
        window.statusTimers = {};
    }
    clearTimeout(window.statusTimers[cor]);
    window.statusTimers[cor] = setTimeout(() => limparStatus(cor), 120000);
}

// Limpa o status de uma cor específica
function limparStatus(cor) {
    localStorage.setItem(`status-${cor}`, 'Não Solicitado atendimento no local');
    atualizarStatus();
}

// Limpa todos os status e atualiza a interface
function limparTodosStatus() {
    const cores = ['azul', 'vermelho', 'verde', 'amarelo'];
    cores.forEach(cor => limparStatus(cor));
}

// Atualiza os status na página
function atualizarStatus() {
    const cores = ['azul', 'vermelho', 'verde', 'amarelo'];
    cores.forEach(cor => {
        const status = localStorage.getItem(`status-${cor}`) || 'Não Solicitado atendimento no local';
        const statusElement = document.getElementById(`status-${cor}`);
        if (statusElement) {
            statusElement.textContent = status;
        }
    });
}
