document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURAÇÃO DO FIREBASE --- (sem alteração aqui)
    const firebaseConfig = {
        apiKey: "AIzaSyDO0fRKNyl0XJEYBQ_YbECjLZiytDzCxKE",
		authDomain: "mural-digital-ifpruv.firebaseapp.com",
		databaseURL: "https://mural-digital-ifpruv-default-rtdb.firebaseio.com",
		projectId: "mural-digital-ifpruv",
		storageBucket: "mural-digital-ifpruv.firebasestorage.app",
		messagingSenderId: "680161081263",
		appId: "1:680161081263:web:2bf3ccd850e9336b9d215a"
    };

    // --- INICIALIZAÇÃO DO FIREBASE --- (sem alteração aqui)
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
    const dbRef = database.ref('muralDigital');

    // --- ELEMENTOS DO DOM ---
    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');
    const announcementPanel = document.querySelector('.announcement-panel');
    const announcementTitle = document.querySelector('.announcement-title');
    
    // INÍCIO DA MUDANÇA: Selecionar os novos elementos
    const announcementBodyViewport = document.querySelector('.announcement-body-viewport');
    const announcementBodyText = document.querySelector('.announcement-body-text'); 
    // FIM DA MUDANÇA

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

    let avisoAtual = 0;
    let avisoInterval;
    function setupAnnouncements(avisosObj = {}) {
        imagePanel.classList.add('hidden');
        announcementPanel.classList.remove('hidden');

        const avisos = avisosObj ? Object.values(avisosObj) : [];

        if (avisos.length === 0) {
            announcementTitle.textContent = "Bem-vindos ao Painel Digital!";
            // INÍCIO DA MUDANÇA
            announcementBodyText.textContent = "Não há novos avisos no momento.";
            announcementBodyText.classList.remove('is-scrolling'); // Garante que não haja rolagem
            // FIM DA MUDANÇA
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
                
                // --- LÓGICA DO TELEPROMPTER ---
                // 1. Remove a animação anterior para resetar
                announcementBodyText.classList.remove('is-scrolling');
                
                // 2. Define o novo texto
                announcementBodyText.textContent = aviso.texto;

                // 3. Força o navegador a reconhecer a remoção da classe antes de talvez readicioná-la
                void announcementBodyText.offsetWidth;

                // 4. Verifica se o texto é maior que a área visível
                if (announcementBodyText.scrollHeight > announcementBodyViewport.clientHeight) {
                    // Se for, adiciona a classe para iniciar a animação de rolagem
                    announcementBodyText.classList.add('is-scrolling');
                }
                // --- FIM DA LÓGICA DO TELEPROMPTER ---

                announcementPanel.classList.remove('fade-out');
                avisoAtual = (avisoAtual + 1) % avisos.length;
            }, 500);
        }

        showNextAviso();
        avisoInterval = setInterval(showNextAviso, 20000); // 1 segundos por aviso
    }

    // O restante do arquivo (funções showFeaturedImage, updateEvents, etc.) permanece igual...
    
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