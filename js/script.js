// Configurações globais
const ALERT_SOUND_PATH = './sons/alerta.mp3';
const cores = ['amarelo-claro']; // Adicione outras cores conforme necessário

class ToggleManager {
    constructor() {
        this.timers = {};
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
            this.atualizarTodosStatus();
        });
        
        window.addEventListener('storage', (event) => {
            if (event.key.startsWith('status-')) {
                this.atualizarStatusVisual(event.key.split('-')[1]);
            }
        });
    }

    setupEventListeners() {
        cores.forEach(cor => {
            const toggle = document.getElementById(`toggle-${cor}`);
            if (toggle) {
                toggle.addEventListener('click', () => this.toggleStatus(cor));
            }
        });
    }

    toggleStatus(cor) {
        const statusKey = `status-${cor}`;
        const currentStatus = localStorage.getItem(statusKey);
        const novoStatus = currentStatus === 'Chamando Garçom' ? 
            'Não Solicitado Atendimento' : 'Chamando Garçom';

        localStorage.setItem(statusKey, novoStatus);
        this.atualizarStatusVisual(cor);
        
        if (novoStatus === 'Chamando Garçom') {
            this.tocarSom();
            this.agendarReset(cor);
        } else {
            this.cancelarReset(cor);
        }
    }

    atualizarStatusVisual(cor) {
        const status = localStorage.getItem(`status-${cor}`) || 'Não Solicitado Atendimento';
        const toggle = document.getElementById(`toggle-${cor}`);
        
        if (toggle) {
            const textElement = toggle.querySelector('.toggle-text');
            const isActive = status === 'Chamando Garçom';
            
            toggle.classList.toggle('active', isActive);
            textElement.textContent = isActive ? 'Chamando Garçom' : 'Chamar Garçom';
        }
    }

    atualizarTodosStatus() {
        cores.forEach(cor => this.atualizarStatusVisual(cor));
    }

    agendarReset(cor) {
        this.cancelarReset(cor);
        this.timers[cor] = setTimeout(() => {
            localStorage.setItem(`status-${cor}`, 'Não Solicitado Atendimento');
            this.atualizarStatusVisual(cor);
        }, 120000);
    }

    cancelarReset(cor) {
        if (this.timers[cor]) {
            clearTimeout(this.timers[cor]);
            delete this.timers[cor];
        }
    }

    tocarSom() {
        const audio = new Audio(ALERT_SOUND_PATH);
        audio.play().catch(error => {
            console.error('Erro ao reproduzir som:', error);
        });
    }
}

// Inicializar o gerenciador
new ToggleManager();