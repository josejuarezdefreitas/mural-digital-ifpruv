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

    // --- INICIALIZAÇÃO DO FIREBASE ---
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
    const dbRef = database.ref('muralDigital');

    // --- ELEMENTOS DO DOM ---
    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');
    const announcementPanel = document.querySelector('.announcement-panel');
    const imagePanel = document.querySelector('.image-panel');
    const featuredImage = document.getElementById('featured-image');
    const eventsListElement = document.querySelector('.events-widget ul');
    
    let avisosValidos = [];
    let imagensValidas = [];
    let avisoAtualIdx = 0;
    let mainContentInterval;

    function updateClock() {
        const now = new Date();
        const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('pt-BR', optionsDate);
        timeElement.textContent = now.toLocaleTimeString('pt-BR');
    }

    function showAnnouncement() {
        if (avisosValidos.length === 0) {
            // Se não houver avisos, mostra a mensagem padrão e passa para o próximo item (slideshow)
            showDefaultMessage();
            return 20000; // Duração padrão
        }

        imagePanel.classList.add('hidden');
        announcementPanel.classList.remove('hidden');

        const aviso = avisosValidos[avisoAtualIdx];
        const announcementTitle = document.querySelector('.announcement-title');
        const announcementBodyText = document.querySelector('.announcement-body-text');
        
        announcementPanel.classList.add('fade-out');
        
        setTimeout(() => {
            announcementTitle.textContent = aviso.titulo;
            announcementBodyText.textContent = aviso.texto;
            announcementPanel.classList.toggle('urgent', aviso.urgente);
            // Lógica do teleprompter... (omitida para brevidade)
            announcementPanel.classList.remove('fade-out');
        }, 500);

        avisoAtualIdx = (avisoAtualIdx + 1) % avisosValidos.length;
        return 20000; // Duração de 20s para cada aviso
    }
    
    function showDefaultMessage() {
        imagePanel.classList.add('hidden');
        announcementPanel.classList.remove('hidden');
        document.querySelector('.announcement-title').textContent = "Bem-vindos ao Painel Digital!";
        document.querySelector('.announcement-body-text').textContent = "Não há novos avisos no momento.";
    }

    async function showImageSlideshow() {
        if (imagensValidas.length === 0) return 0; // Se não houver imagens, pula esta etapa

        announcementPanel.classList.add('hidden');
        imagePanel.classList.remove('hidden');
        
        let totalSlideshowTime = 0;

        for (const imagem of imagensValidas) {
            totalSlideshowTime += imagem.duration * 1000;
        }

        // Usamos uma Promise para esperar o slideshow terminar
        return new Promise(resolve => {
            let currentImageIdx = 0;
            
            function nextImage() {
                if (currentImageIdx >= imagensValidas.length) {
                    resolve(totalSlideshowTime); // Resolvido ao final do slideshow
                    return;
                }
                const imagem = imagensValidas[currentImageIdx];
                featuredImage.src = imagem.url;
                currentImageIdx++;
                setTimeout(nextImage, imagem.duration * 1000);
            }
            
            nextImage();
        });
    }

    async function runContentLoop() {
        if (mainContentInterval) clearTimeout(mainContentInterval);

        // Primeiro, exibe um aviso
        const avisoDuration = showAnnouncement();

        // Agenda a próxima etapa (slideshow) para depois que o aviso terminar
        mainContentInterval = setTimeout(async () => {
            // Em seguida, exibe o slideshow completo
            const slideshowDuration = await showImageSlideshow();

            // Agenda o reinício do loop (próximo aviso) para depois que o slideshow terminar
            mainContentInterval = setTimeout(runContentLoop, slideshowDuration);
        }, avisoDuration);
    }
    
    function listenForData() {
        dbRef.on('value', (snapshot) => {
            const data = snapshot.val() || {};
            
            // Atualiza eventos (sem alteração na lógica)
            const eventos = data.eventos ? Object.values(data.eventos) : [];
            eventsListElement.innerHTML = '';
            eventos.slice(0, 5).forEach(evento => {
                eventsListElement.innerHTML += `<li><strong>${evento.data}</strong> - <span>${evento.descricao}</span></li>`;
            });
            
            // Atualiza listas de avisos e imagens
            const hoje = new Date().toISOString().split('T')[0];
            avisosValidos = data.avisos ? Object.values(data.avisos).filter(aviso => {
                return (!aviso.inicio || aviso.inicio <= hoje) && (!aviso.fim || aviso.fim >= hoje);
            }).sort((a, b) => (b.urgente === true) - (a.urgente === true)) : [];

            imagensValidas = data.imagens ? Object.values(data.imagens) : [];

            // Reinicia o loop de conteúdo com os dados atualizados
            runContentLoop();
        });
    }

    // --- INICIALIZAÇÃO ---
    updateClock();
    setInterval(updateClock, 1000);
    listenForData();
});