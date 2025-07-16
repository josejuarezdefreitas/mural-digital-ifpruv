document.addEventListener('DOMContentLoaded', () => {

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

    // --- ELEMENTOS DO DOM ---
    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');
    const announcementPanel = document.querySelector('.announcement-panel');
    const announcementTitle = document.querySelector('.announcement-title');
    const announcementBody = document.querySelector('.announcement-body');
    const imagePanel = document.querySelector('.image-panel');
    const featuredImage = document.getElementById('featured-image');
    const eventsListElement = document.querySelector('.events-widget ul');

    // --- LÓGICA DE ATUALIZAÇÃO DA INTERFACE ---

    function updateClock() {
        const now = new Date();
        const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('pt-BR', optionsDate);
        timeElement.textContent = now.toLocaleTimeString('pt-BR');
    }

    // Seção do clima foi removida, pois agora usamos um widget <iframe> no HTML.

    let avisoAtual = 0;
    let avisoInterval;
    function setupAnnouncements(avisosObj = {}) {
        imagePanel.classList.add('hidden');
        announcementPanel.classList.remove('hidden');

        const avisos = avisosObj ? Object.values(avisosObj) : [];

        if (avisos.length === 0) {
            announcementTitle.textContent = "Bem-vindos ao Painel Digital!";
            announcementBody.textContent = "Não há novos avisos no momento.";
            if (avisoInterval) clearInterval(avisoInterval);
            return;
        };

        if (avisoInterval) clearInterval(avisoInterval);

        const showNextAviso = () => {
            if (avisos.length === 0) return;
            announcementPanel.classList.add('fade-out');
            setTimeout(() => {
                const aviso = avisos[avisoAtual];
                announcementTitle.textContent = aviso.titulo;
                announcementBody.textContent = aviso.texto;
                announcementPanel.classList.remove('fade-out');
                avisoAtual = (avisoAtual + 1) % avisos.length;
            }, 500);
        }

        showNextAviso();
        avisoInterval = setInterval(showNextAviso, 15000);
    }

    function showFeaturedImage(imagemData) {
        if (avisoInterval) clearInterval(avisoInterval);
        announcementPanel.classList.add('hidden');
        imagePanel.classList.remove('hidden');
        featuredImage.src = imagemData.url;
    }

    function updateEvents(eventosObj = {}) {
        const eventos = eventosObj ? Object.values(eventosObj) : [];
        eventsListElement.innerHTML = '';
        if (eventos.length === 0) {
             eventsListElement.innerHTML = '<li>Nenhum evento próximo.</li>';
             return;
        }
        eventos.slice(0, 3).forEach(evento => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${evento.data}</strong> - ${evento.descricao}`;
            eventsListElement.appendChild(li);
        });
    }

    function listenForData() {
        dbRef.on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                if (data.imagem && data.imagem.ativo) {
                    showFeaturedImage(data.imagem);
                } else {
                    setupAnnouncements(data.avisos);
                }
                updateEvents(data.eventos);
            } else {
                setupAnnouncements();
                updateEvents();
            }
        });
    }

    // --- INICIALIZAÇÃO ---
    updateClock();
    setInterval(updateClock, 1000);

    listenForData();
});