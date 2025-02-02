/* const ALERT_SOUND_PATH = './sons/alerta.mp3';
const cores = [
    'azul', 'azul-claro', 'azul-escuro',
    'vermelho', 'vermelho-claro', 'vermelho-escuro',
    'verde', 'verde-claro', 'verde-escuro',
    'amarelo', 'amarelo-escuro', 'amarelo-claro'
];

class ToggleManager {
    constructor() {
        this.timers = {};
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.configurarEventos();
            this.atualizarTodosStatus();
        });

        // Sincroniza as mudanças entre abas
        window.addEventListener('storage', (event) => {
            if (event.key.startsWith('status-')) {
                const cor = event.key.replace('status-', '');
                this.atualizarInterface(cor);
                if (event.newValue === 'Solicitado o atendimento') {
                    this.tocarSom(cor);
                }
            }
        });
    }

    configurarEventos() {
        // Configurar toggles
        cores.forEach(cor => {
            const toggle = document.getElementById(`toggle-${cor}`);
            if (toggle) {
                toggle.addEventListener('click', () => this.alternarStatus(cor));
            }
        });

        // Configurar botões de limpeza
        document.querySelectorAll('.btn-limpar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cor = e.target.dataset.cor;
                this.limparStatus(cor);
            });
        });
    }

    alternarStatus(cor) {
        const statusAtual = localStorage.getItem(`status-${cor}`) || 'Não Solicitado Atendimento';
        const novoStatus = statusAtual === 'Não Solicitado Atendimento' 
            ? 'Solicitado o atendimento' 
            : 'Não Solicitado Atendimento';

        localStorage.setItem(`status-${cor}`, novoStatus);
        this.atualizarInterface(cor);

        if (novoStatus === 'Solicitado o atendimento') {
            this.tocarSom(cor);
            this.agendarReset(cor);
        } else {
            this.cancelarReset(cor);
        }
    }

    atualizarInterface(cor) {
        const status = localStorage.getItem(`status-${cor}`) || 'Não Solicitado Atendimento';
        
        // Atualizar toggle (se existir)
        const toggle = document.getElementById(`toggle-${cor}`);
        if (toggle) {
            toggle.classList.toggle('active', status === 'Solicitado o atendimento');
            toggle.querySelector('.toggle-text').textContent = 
                status === 'Solicitado o atendimento' ? 'Aguarde Garçom' : 'Chamar Garçom';
        }

        // Atualizar status.html
        const elementoStatus = document.getElementById(`status-${cor}`);
        if (elementoStatus) {
            elementoStatus.textContent = status;
            const quadrante = document.querySelector(`.quadrante.${cor}`);
            if (quadrante) {
                quadrante.classList.toggle('destaque', status === 'Solicitado o atendimento');
            }
        }
    }

    limparStatus(cor) {
        localStorage.setItem(`status-${cor}`, 'Não Solicitado Atendimento');
        this.atualizarInterface(cor);
        this.cancelarReset(cor);
    }

    limparTodosStatus() {
        cores.forEach(cor => {
            localStorage.setItem(`status-${cor}`, 'Não Solicitado Atendimento');
            this.atualizarInterface(cor);
            this.cancelarReset(cor);
        });
    }

    agendarReset(cor) {
        this.cancelarReset(cor);
        this.timers[cor] = setTimeout(() => this.limparStatus(cor), 120000);
    }

    cancelarReset(cor) {
        if (this.timers[cor]) {
            clearTimeout(this.timers[cor]);
            delete this.timers[cor];
        }
    }

    tocarSom(cor) {
        const tipoCor = cor.split('-')[0];
        const audio = document.getElementById(`som-${tipoCor}`) || new Audio(ALERT_SOUND_PATH);
        audio.play().catch(error => console.error('Erro ao reproduzir som:', error));
    }
}

const gerenciador = new ToggleManager();

// Funções globais para acesso via HTML
window.limparStatus = (cor) => gerenciador.limparStatus(cor);
window.limparTodosStatus = () => gerenciador.limparTodosStatus(); */
// script.js (Atualizado para Firebase Firestore)


// script.js
import { db } from '../firebase.js';
import { doc, setDoc, onSnapshot, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const ALERT_SOUND_PATH = './sons/alerta.mp3';
const cores = [
    'azul', 'azul-claro', 'azul-escuro',
    'vermelho', 'vermelho-claro', 'vermelho-escuro',
    'verde', 'verde-claro', 'verde-escuro',
    'amarelo', 'amarelo-escuro', 'amarelo-claro'
];

class ToggleManager {
    constructor() {
        this.timers = {};
        this.unsubscribe = null;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.configurarEventos();
            this.iniciarEscutaFirestore();
        });
    }

    iniciarEscutaFirestore() {
        const docRef = doc(db, "chamados", "status");
        this.unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                cores.forEach(cor => {
                    const status = data[cor] || 'Não Solicitado Atendimento';
                    this.atualizarInterface(cor, status);
                });
            }
        });
    }

    configurarEventos() {
        cores.forEach(cor => {
            const toggle = document.getElementById(`toggle-${cor}`);
            if (toggle) {
                toggle.addEventListener('click', () => this.alternarStatus(cor));
            }
        });

        document.querySelectorAll('.btn-limpar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cor = e.target.dataset.cor;
                this.limparStatus(cor);
            });
        });
    }

    async alternarStatus(cor) {
        const docRef = doc(db, "chamados", "status");
        const docSnap = await getDoc(docRef);
        let data = docSnap.exists() ? docSnap.data() : {};

        // Garante que todas as cores existam no documento
        cores.forEach(c => {
            if (!data[c]) data[c] = 'Não Solicitado Atendimento';
        });

        const novoStatus = data[cor] === 'Solicitado o atendimento' 
            ? 'Não Solicitado Atendimento' 
            : 'Solicitado o atendimento';

        await setDoc(docRef, { ...data, [cor]: novoStatus });

        if (novoStatus === 'Solicitado o atendimento') {
            this.tocarSom(cor);
            this.agendarReset(cor);
        } else {
            this.cancelarReset(cor);
        }
    }

    atualizarInterface(cor, status) {
        const toggle = document.getElementById(`toggle-${cor}`);
        if (toggle) {
            toggle.classList.toggle('active', status === 'Solicitado o atendimento');
            toggle.querySelector('.toggle-text').textContent = 
                status === 'Solicitado o atendimento' ? 'Aguarde Garçom' : 'Chamar Garçom';
        }

        const elementoStatus = document.getElementById(`status-${cor}`);
        if (elementoStatus) {
            elementoStatus.textContent = status;
            const quadrante = document.querySelector(`.quadrante.${cor}`);
            if (quadrante) {
                quadrante.classList.toggle('destaque', status === 'Solicitado o atendimento');
            }
        }
    }

    async limparStatus(cor) {
        const docRef = doc(db, "chamados", "status");
        await setDoc(docRef, { [cor]: 'Não Solicitado Atendimento' }, { merge: true });
        this.cancelarReset(cor);
    }

    async limparTodosStatus() {
        const docRef = doc(db, "chamados", "status");
        const resetData = {};
        cores.forEach(cor => resetData[cor] = 'Não Solicitado Atendimento');
        await setDoc(docRef, resetData, { merge: true });
        cores.forEach(cor => this.cancelarReset(cor));
    }

    agendarReset(cor) {
        this.cancelarReset(cor);
        this.timers[cor] = setTimeout(() => this.limparStatus(cor), 120000);
    }

    cancelarReset(cor) {
        if (this.timers[cor]) {
            clearTimeout(this.timers[cor]);
            delete this.timers[cor];
        }
    }

    tocarSom(cor) {
        const tipoCor = cor.split('-')[0];
        const audio = document.getElementById(`som-${tipoCor}`) || new Audio(ALERT_SOUND_PATH);
        audio.play().catch(error => console.error('Erro ao reproduzir som:', error));
    }
}

const gerenciador = new ToggleManager();

window.limparStatus = (cor) => gerenciador.limparStatus(cor);
window.limparTodosStatus = () => gerenciador.limparTodosStatus();