document.addEventListener('DOMContentLoaded', () => {

    // --- AUTENTICAÇÃO SIMPLES ---
    const correctPassword = 'ifpr2025';
    function authenticate() {
        const password = prompt("Por favor, digite a senha de administrador:");
        if (password === correctPassword) {
            document.getElementById('auth-overlay').classList.add('hidden');
            document.getElementById('main-content').classList.remove('hidden');
        } else {
            alert("Senha incorreta!");
            authenticate();
        }
    }
    
    // --- CONFIGURAÇÃO DO FIREBASE ---
    const firebaseConfig = {
        apiKey: "AIzaSyDO0fRKNyl0XJEYBQ_YbECjLZiytDzCxKE",
		authDomain: "mural-digital-ifpruv.firebaseapp.com",
		databaseURL: "https://mural-digital-ifpruv-default-rtdb.firebaseio.com",
		projectId: "mural-digital-ifpruv",
		storageBucket: "mural-digital-ifpruv.firebasestorage.app",
		messagingSenderId: "680161081263",
		appId: "1:680161081263:web:2bf3ccd850e9336b9d215a"
    };

    // --- INICIALIZAÇÃO DO FIREBASE ---
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
    const dbRef = database.ref('muralDigital');

    // --- SELEÇÃO DOS ELEMENTOS DO DOM ---
    const avisosLista = document.getElementById('avisos-lista');
    const avisoForm = document.getElementById('aviso-form');
    const eventosLista = document.getElementById('eventos-lista');
    const eventoForm = document.getElementById('evento-form');
	const imageForm = document.getElementById('image-form');
    const imageUrlInput = document.getElementById('image-url');
    const imageActiveCheckbox = document.getElementById('image-active');
    
    // --- RENDERIZAÇÃO ---
    function render(data) {document.addEventListener('DOMContentLoaded', () => {

    // --- AUTENTICAÇÃO SIMPLES ---
    const correctPassword = 'ifpr2025';
    function authenticate() {
        const password = prompt("Por favor, digite a senha de administrador:");
        if (password === correctPassword) {
            document.getElementById('auth-overlay').classList.add('hidden');
            document.getElementById('main-content').classList.remove('hidden');
        } else {
            alert("Senha incorreta!");
            authenticate();
        }
    }
    
    // --- CONFIGURAÇÃO DO FIREBASE ---
    const firebaseConfig = {
        apiKey: "AIzaSyCWEhKwyhe9GSB9PdloHm6sk5doE3XDzg4",
		authDomain: "mapa-de-portas-sw.firebaseapp.com",
		databaseURL: "https://mapa-de-portas-sw-default-rtdb.firebaseio.com",
		projectId: "mapa-de-portas-sw",
		storageBucket: "mapa-de-portas-sw.appspot.com",
		messagingSenderId: "95019148222",
		appId: "1:95019148222:web:0669dac2e3046df7770fef"
    };

    // --- INICIALIZAÇÃO DO FIREBASE ---
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
    const dbRef = database.ref('muralDigital');

    // --- SELEÇÃO DOS ELEMENTOS DO DOM ---
    const avisosLista = document.getElementById('avisos-lista');
    const avisoForm = document.getElementById('aviso-form');
    const eventosLista = document.getElementById('eventos-lista');
    const eventoForm = document.getElementById('evento-form');
    const imageUrlInput = document.getElementById('image-url');
    const imageActiveCheckbox = document.getElementById('image-active');
    
    // --- RENDERIZAÇÃO ---
    function render(data = {}) {
        const avisos = data.avisos || {};
        const eventos = data.eventos || {};
        const imagem = data.imagem || { url: '', ativo: false };

        // Renderiza Avisos
        avisosLista.innerHTML = '';
        for (const id in avisos) {
            const aviso = avisos[id];
            avisosLista.innerHTML += `
                <div class="item-lista">
                    <div><strong>${aviso.titulo}</strong><br>${aviso.texto}</div>
                    <div class="item-botoes">
                        <button class="edit-btn" data-type="avisos" data-id="${id}">Editar</button>
                        <button class="delete-btn" data-type="avisos" data-id="${id}">Excluir</button>
                    </div>
                </div>`;
        }
        
        // Renderiza Eventos
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

        // Renderiza o estado atual do controle de imagem
        imageUrlInput.value = imagem.url;
        imageActiveCheckbox.checked = imagem.ativo;
    }

    // --- ESCUTA DE DADOS DO FIREBASE ---
    dbRef.on('value', snapshot => {
        render(snapshot.val());
    });

    // --- MANIPULAÇÃO DE FORMULÁRIOS ---
    avisoForm.addEventListener('submit', e => {
        e.preventDefault();
        const id = avisoForm.querySelector('#aviso-id').value;
        const aviso = {
            titulo: avisoForm.querySelector('#aviso-titulo').value,
            texto: avisoForm.querySelector('#aviso-texto').value
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

    // Listeners para o formulário de imagem
    imageUrlInput.addEventListener('change', (e) => {
        database.ref('muralDigital/imagem/url').set(e.target.value);
    });
    imageActiveCheckbox.addEventListener('change', (e) => {
        database.ref('muralDigital/imagem/ativo').set(e.target.checked);
    });

    // --- BOTÕES DE EDITAR/EXCLUIR ---
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
                } else if (type === 'eventos') {
                    eventoForm.querySelector('#evento-id').value = id;
                    eventoForm.querySelector('#evento-data').value = item.data;
                    eventoForm.querySelector('#evento-descricao').value = item.descricao;
                }
            });
        }
    });

    // --- INICIALIZAÇÃO ---
    authenticate();
});
        const avisos = data.avisos || {};
        const eventos = data.eventos || {};

        avisosLista.innerHTML = '';
        for (const id in avisos) {
            const aviso = avisos[id];
            avisosLista.innerHTML += `
                <div class="item-lista">
                    <div><strong>${aviso.titulo}</strong><br>${aviso.texto}</div>
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
    }

    // --- ESCUTA DE DADOS DO FIREBASE ---
    dbRef.on('value', snapshot => {
        render(snapshot.val() || {});
    });

    // --- MANIPULAÇÃO DE FORMULÁRIOS ---
    avisoForm.addEventListener('submit', e => {
        e.preventDefault();
        const id = avisoForm.querySelector('#aviso-id').value;
        const aviso = {
            titulo: avisoForm.querySelector('#aviso-titulo').value,
            texto: avisoForm.querySelector('#aviso-texto').value
        };

        if (id) { // Editando um aviso existente
            database.ref(`muralDigital/avisos/${id}`).update(aviso);
        } else { // Adicionando um novo aviso
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

        if (id) { // Editando
            database.ref(`muralDigital/eventos/${id}`).update(evento);
        } else { // Adicionando
            database.ref('muralDigital/eventos').push(evento);
        }
        eventoForm.reset();
        eventoForm.querySelector('#evento-id').value = '';
    });

    // --- BOTÕES DE EDITAR/EXCLUIR ---
    document.body.addEventListener('click', e => {
        const { type, id } = e.target.dataset;

        if (e.target.classList.contains('delete-btn')) {
            if (confirm('Tem certeza que deseja excluir este item?')) {
                // Comando direto para remover o item no Firebase
                database.ref(`muralDigital/${type}/${id}`).remove();
            }
        }

        if (e.target.classList.contains('edit-btn')) {
            database.ref(`muralDigital/${type}/${id}`).once('value', snapshot => {
                const item = snapshot.val();
                if (type === 'avisos') {
                    avisoForm.querySelector('#aviso-id').value = id;
                    avisoForm.querySelector('#aviso-titulo').value = item.titulo;
                    avisoForm.querySelector('#aviso-texto').value = item.texto;
                } else if (type === 'eventos') {
                    eventoForm.querySelector('#evento-id').value = id;
                    eventoForm.querySelector('#evento-data').value = item.data;
                    eventoForm.querySelector('#evento-descricao').value = item.descricao;
                }
            });
        }
    });

    // --- INICIALIZAÇÃO ---
    authenticate();
});