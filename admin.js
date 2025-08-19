document.addEventListener('DOMContentLoaded', () => {
    
    // --- CONFIGURAÇÃO DO FIREBASE ---
    

    // --- INICIALIZAÇÃO DOS SERVIÇOS DO FIREBASE ---
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const database = firebase.database();
    
    // --- SELEÇÃO DOS ELEMENTOS DO DOM ---
    const loginContainer = document.getElementById('login-container');
    const mainContent = document.getElementById('main-content');
    const loginForm = document.getElementById('login-form');
    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    const loginError = document.getElementById('login-error');
    const logoutButton = document.getElementById('logout-button');

    // Elementos do painel de controle
    const avisosLista = document.getElementById('avisos-lista');
    const avisoForm = document.getElementById('aviso-form');
    const eventosLista = document.getElementById('eventos-lista');
    const eventoForm = document.getElementById('evento-form');
    const imageUrlInput = document.getElementById('image-url');
    const imageActiveCheckbox = document.getElementById('image-active');

    let dbRef; // Referência do banco de dados (será definida após o login)

    // --- LÓGICA DE AUTENTICAÇÃO ---

    // Lida com o envio do formulário de login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;
        loginError.textContent = ''; // Limpa erros antigos

        auth.signInWithEmailAndPassword(email, password)
            .catch((error) => {
                console.error("Erro de autenticação:", error);
                loginError.textContent = "E-mail ou senha incorretos.";
            });
    });

    // Lida com o clique no botão de sair
    logoutButton.addEventListener('click', () => {
        auth.signOut();
    });

    // Observador do estado de autenticação (a mágica acontece aqui)
    auth.onAuthStateChanged((user) => {
        if (user) {
            // Usuário está logado
            loginContainer.classList.add('hidden');
            mainContent.classList.remove('hidden');
            initAdminPanel(); // Inicia o painel de administração
        } else {
            // Usuário está deslogado
            mainContent.classList.add('hidden');
            loginContainer.classList.remove('hidden');
            if (dbRef) dbRef.off(); // Para de ouvir os dados do banco
        }
    });

    // --- FUNÇÕES DO PAINEL DE ADMINISTRAÇÃO ---

    function initAdminPanel() {
        dbRef = database.ref('muralDigital');
        
        // --- RENDERIZAÇÃO ---
        function render(data = {}) {
            const avisos = data.avisos || {};
            const eventos = data.eventos || {};
            const imagem = data.imagem || { url: '', ativo: false };

            avisosLista.innerHTML = '';
            for (const id in avisos) {
                const aviso = avisos[id];
                const start = aviso.inicio ? `Início: ${aviso.inicio.split('-').reverse().join('/')}` : '';
                const end = aviso.fim ? `Fim: ${aviso.fim.split('-').reverse().join('/')}` : '';
                const urgent = aviso.urgente ? '<span class="urgent">URGENTE</span>' : '';
                
                avisosLista.innerHTML += `
                    <div class="item-lista">
                        <div class="info">
                            <strong>${aviso.titulo}</strong><br>${aviso.texto}
                            <span>${urgent} ${start} ${end}</span>
                        </div>
                        <div class="item-botoes">
                            <button class="edit-btn" data-type="avisos" data-id="${id}">Editar</button>
                            <button class="delete-btn" data-type="avisos" data-id="${id}">Excluir</button>
                        </div>
                    </div>`;
            }
            
            eventosLista.innerHTML = '';
            for (const id in eventos) {
                const evento = eventos[id];
                eventosLista.innerHTML += `
                    <div class="item-lista">
                        <div><strong>${evento.data}</strong> - ${evento.descricao}</div>
                        <div class="item-botoes">
                            <button class="edit-btn" data-type="eventos" data-id="${id}">Editar</button>
                            <button class="delete-btn" data-type="eventos" data-id="${id}">Excluir</button>
                        </div>
                    </div>`;
            }

            imageUrlInput.value = imagem.url || '';
            imageActiveCheckbox.checked = imagem.ativo || false;
        }

        // --- ESCUTA DE DADOS DO FIREBASE ---
        dbRef.on('value', snapshot => {
            render(snapshot.val() || {});
        });
    }

    // --- MANIPULAÇÃO DE FORMULÁRIOS (não muda) ---
    avisoForm.addEventListener('submit', e => {
        e.preventDefault();
        const id = avisoForm.querySelector('#aviso-id').value;
        const aviso = {
            titulo: avisoForm.querySelector('#aviso-titulo').value,
            texto: avisoForm.querySelector('#aviso-texto').value,
            inicio: avisoForm.querySelector('#aviso-inicio').value,
            fim: avisoForm.querySelector('#aviso-fim').value,
            urgente: avisoForm.querySelector('#aviso-urgente').checked
        };
        if (id) {
            database.ref(`muralDigital/avisos/${id}`).update(aviso);
        } else {
            database.ref('muralDigital/avisos').push(aviso);
        }
        avisoForm.reset();
        avisoForm.querySelector('#aviso-id').value = '';
    });
    
    eventoForm.addEventListener('submit', e => {
        e.preventDefault();
        const id = eventoForm.querySelector('#evento-id').value;
        const evento = {
            data: eventoForm.querySelector('#evento-data').value,
            descricao: eventoForm.querySelector('#evento-descricao').value
        };
        if (id) {
            database.ref(`muralDigital/eventos/${id}`).update(evento);
        } else {
            database.ref('muralDigital/eventos').push(evento);
        }
        eventoForm.reset();
        eventoForm.querySelector('#evento-id').value = '';
    });

    imageUrlInput.addEventListener('change', (e) => database.ref('muralDigital/imagem/url').set(e.target.value));
    imageActiveCheckbox.addEventListener('change', (e) => database.ref('muralDigital/imagem/ativo').set(e.target.checked));

    // --- BOTÕES DE EDITAR/EXCLUIR (não muda) ---
    document.body.addEventListener('click', e => {
        if (e.target.classList.contains('delete-btn')) {
            const { type, id } = e.target.dataset;
            if (confirm('Tem certeza que deseja excluir este item?')) {
                database.ref(`muralDigital/${type}/${id}`).remove();
            }
        }
        if (e.target.classList.contains('edit-btn')) {
            const { type, id } = e.target.dataset;
            dbRef.child(type).child(id).once('value', snapshot => {
                const item = snapshot.val();
                if (type === 'avisos') {
                    avisoForm.querySelector('#aviso-id').value = id;
                    avisoForm.querySelector('#aviso-titulo').value = item.titulo;
                    avisoForm.querySelector('#aviso-texto').value = item.texto;
                    avisoForm.querySelector('#aviso-inicio').value = item.inicio || '';
                    avisoForm.querySelector('#aviso-fim').value = item.fim || '';
                    avisoForm.querySelector('#aviso-urgente').checked = item.urgente || false;
                } else if (type === 'eventos') {
                    eventoForm.querySelector('#evento-id').value = id;
                    eventoForm.querySelector('#evento-data').value = item.data;
                    eventoForm.querySelector('#evento-descricao').value = item.descricao;
                }
            });
        }
    });
});