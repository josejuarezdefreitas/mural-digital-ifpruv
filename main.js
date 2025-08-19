document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURAÇÃO DO FIREBASE (ATUALIZADA) ---
    

    // --- INICIALIZAÇÃO DO FIREBASE ---
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
    const dbRef = database.ref('muralDigital');

    // --- ELEMENTOS DO DOM ---
    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');
    const announcementPanel = document.querySelector('.announcement-panel');
    const announcementTitle = document.querySelector('.announcement-title');
    const announcementBodyViewport = document.querySelector('.announcement-body-viewport');
    const announcementBodyText = document.querySelector('.announcement-body-text');
    const progressBar = document.querySelector('.announcement-progress-bar');
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
        if (avisoInterval) clearInterval(avisoInterval);

        imagePanel.classList.add('hidden');
        announcementPanel.classList.remove('hidden');
        
        const hoje = new Date().toISOString().split('T')[0];
        
        const avisosValidos = Object.values(avisosObj)
            .filter(aviso => {
                if (aviso.inicio && aviso.inicio > hoje) {
                    return false;
                }
                if (aviso.fim && aviso.fim < hoje) {
                    return false;
                }
                return true;
            })
            .sort((a, b) => (b.urgente === true) - (a.urgente === true));

        if (avisosValidos.length === 0) {
            announcementTitle.textContent = "Bem-vindos ao Painel Digital!";
            announcementBodyText.textContent = "Não há novos avisos no momento.";
            announcementBodyText.classList.remove('is-scrolling');
            progressBar.classList.remove('is-running');
            return;
        }

        const showNextAviso = () => {
            if (avisosValidos.length === 0) return;
            announcementPanel.classList.add('fade-out');
            
            progressBar.classList.remove('is-running');
            
            setTimeout(() => {
                const aviso = avisosValidos[avisoAtual];
                announcementTitle.textContent = aviso.titulo;
                announcementBodyText.textContent = aviso.texto;
                
                announcementPanel.classList.toggle('urgent', aviso.urgente);
                
                announcementBodyText.classList.remove('is-scrolling');
                void announcementBodyText.offsetWidth;
                
                if (announcementBodyText.scrollHeight > announcementBodyViewport.clientHeight) {
                    const scrollHeight = announcementBodyText.scrollHeight;
                    const duration = scrollHeight / 25;
                    document.documentElement.style.setProperty('--teleprompter-duration', `${duration}s`);
                    announcementBodyText.classList.add('is-scrolling');
                }
                
                void progressBar.offsetWidth;
                progressBar.classList.add('is-running');

                announcementPanel.classList.remove('fade-out');
                avisoAtual = (avisoAtual + 1) % avisosValidos.length;
            }, 500);
        }

        showNextAviso();
        const announcementDurationSeconds = 20;
        document.documentElement.style.setProperty('--announcement-duration', `${announcementDurationSeconds}s`);
        avisoInterval = setInterval(showNextAviso, announcementDurationSeconds * 1000);
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
        eventos.slice(0, 5).forEach(evento => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${evento.data}</strong> - <span>${evento.descricao}</span>`;
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
                    setupAnnouncements(data.avisos || {});
                }
                updateEvents(data.eventos || {});
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