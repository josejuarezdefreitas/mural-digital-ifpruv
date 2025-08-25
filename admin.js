document.addEventListener('DOMContentLoaded', () => {
    
    // --- CONFIGURAÇÃO DO FIREBASE ---
    const firebaseConfig = {
        apiKey: "AIzaSyD3nRSYKpSyCuxb22LjArnunZFN0CEsM_o",
        authDomain: "painel-digital-ifpruv.firebaseapp.com",
        databaseURL: "https://painel-digital-ifpruv-default-rtdb.firebaseio.com",
        projectId: "painel-digital-ifpruv",
        storageBucket: "painel-digital-ifpruv.firebasestorage.app",
        messagingSenderId: "1047124757154",
        appId: "1:1047124757154:web:60d6b122cc2f3ce18565fb"
    };

    // --- INICIALIZAÇÃO DOS SERVIÇOS DO FIREBASE ---
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const database = firebase.database();
    
    // --- SELEÇÃO DOS ELEMENTOS DO DOM ---
    const loginContainer = document.getElementById('login-container');
    const mainContent = document.getElementById('main-content');
    const loginForm = document.getElementById('login-form');
    const logoutButton = document.getElementById('logout-button');
    const avisoForm = document.getElementById('aviso-form');
    const eventoForm = document.getElementById('evento-form');
    // NOVOS ELEMENTOS PARA IMAGENS
    const imageForm = document.getElementById('image-form');
    const imagesLista = document.getElementById('images-lista');

    let dbRef;

    // --- LÓGICA DE AUTENTICAÇÃO ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const loginError = document.getElementById('login-error');
        loginError.textContent = '';

        auth.signInWithEmailAndPassword(email, password)
            .catch((error) => {
                loginError.textContent = "E-mail ou senha incorretos.";
            });
    });

    logoutButton.addEventListener('click', () => {
        auth.signOut();
    });

    auth.onAuthStateChanged((user) => {
        if (user) {
            loginContainer.classList.add('hidden');
            mainContent.classList.remove('hidden');
            initAdminPanel();
        } else {
            mainContent.classList.add('hidden');
            loginContainer.classList.remove('hidden');
            if (dbRef) dbRef.off();
        }
    });

    // --- FUNÇÕES DO PAINEL DE ADMINISTRAÇÃO ---
    function initAdminPanel() {
        dbRef = database.ref('muralDigital');
        
        function render(data = {}) {
            const avisos = data.avisos || {};
            const eventos = data.eventos || {};
            const imagens = data.imagens || {}; // Alterado para 'imagens'

            // Renderiza Avisos (sem alteração)
            const avisosLista = document.getElementById('avisos-lista');
            avisosLista.innerHTML = '';
            for (const id in avisos) {
                const aviso = avisos[id];
                const start = aviso.inicio ? `Início: ${aviso.inicio.split('-').reverse().join('/')}` : '';
                const end = aviso.fim ? `Fim: ${aviso.fim.split('-').reverse().join('/')}` : '';
                const urgent = aviso.urgente ? '<span class="urgent">URGENTE</span>' : '';
                avisosLista.innerHTML += `<div class="item-lista">...</div>`; // Conteúdo omitido para brevidade
            }
            
            // Renderiza Eventos (sem alteração)
            const eventosLista = document.getElementById('eventos-lista');
            eventosLista.innerHTML = '';
            for (const id in eventos) {
                const evento = eventos[id];
                eventosLista.innerHTML += `<div class="item-lista">...</div>`; // Conteúdo omitido para brevidade
            }

            // NOVA RENDERIZAÇÃO PARA IMAGENS
            imagesLista.innerHTML = '';
            for (const id in imagens) {
                const imagem = imagens[id];
                imagesLista.innerHTML += `
                    <div class="item-lista image-item">
                        <img src="${imagem.url}" alt="Miniatura">
                        <div class="info">
                            <span>${imagem.url}</span>
                            <small>Duração: ${imagem.duration}s</small>
                        </div>
                        <div class="item-botoes">
                            <button class="delete-btn" data-type="imagens" data-id="${id}">Excluir</button>
                        </div>
                    </div>`;
            }
        }

        dbRef.on('value', snapshot => {
            render(snapshot.val() || {});
        });
    }

    // --- MANIPULAÇÃO DE FORMULÁRIOS ---
    avisoForm.addEventListener('submit', e => { /* ... sem alterações ... */ });
    eventoForm.addEventListener('submit', e => { /* ... sem alterações ... */ });

    // NOVO HANDLER PARA O FORMULÁRIO DE IMAGEM
    imageForm.addEventListener('submit', e => {
        e.preventDefault();
        const imagem = {
            url: document.getElementById('image-url').value,
            duration: parseInt(document.getElementById('image-duration').value) || 10
        };
        database.ref('muralDigital/imagens').push(imagem);
        imageForm.reset();
    });

    // --- BOTÕES DE EDITAR/EXCLUIR (com pequena adição) ---
    document.body.addEventListener('click', e => {
        const target = e.target;
        if (target.classList.contains('delete-btn')) {
            const { type, id } = target.dataset;
            if (confirm('Tem certeza que deseja excluir este item?')) {
                // O 'type' agora pode ser 'avisos', 'eventos' ou 'imagens'
                database.ref(`muralDigital/${type}/${id}`).remove();
            }
        }
        if (target.classList.contains('edit-btn')) {
            // Lógica de edição (sem alterações)
        }
    });
});