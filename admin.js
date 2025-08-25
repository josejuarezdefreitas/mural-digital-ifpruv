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
    // ... resto do arquivo admin.js (sem alterações)
// O restante do arquivo admin.js permanece exatamente como está.
// ...
    const database = firebase.database();
    const loginContainer = document.getElementById('login-container');
    const mainContent = document.getElementById('main-content');
    const loginForm = document.getElementById('login-form');
    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    const loginError = document.getElementById('login-error');
    const logoutButton = document.getElementById('logout-button');
    const avisosLista = document.getElementById('avisos-lista');
    const avisoForm = document.getElementById('aviso-form');
    const eventosLista = document.getElementById('eventos-lista');
    const eventoForm = document.getElementById('evento-form');
    const imageUrlInput = document.getElementById('image-url');
    const imageActiveCheckbox = document.getElementById('image-active');
    let dbRef;
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;
        loginError.textContent = '';
        auth.signInWithEmailAndPassword(email, password)
            .catch((error) => {
                console.error("Erro de autenticação:", error);
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
    function initAdminPanel() {
        dbRef = database.ref('muralDigital');
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
        dbRef.on('value', snapshot => {
            render(snapshot.val() || {});
        });
    }
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