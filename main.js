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
    const announcementTitle = document.querySelector('.announcement-title');
    const announcementBodyViewport = document.querySelector('.announcement-body-viewport');
    const announcementBodyText = document.querySelector('.announcement-body-text');
    const imagePanel = document.querySelector('.image-panel');
    const featuredImage = document.getElementById('featured-image');
    const eventsContentElement = document.querySelector('.events-content');

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
            showDefaultMessage();
            return 20000;
        }

        imagePanel.classList.add('hidden');
        announcementPanel.classList.remove('hidden');

        const aviso = avisosValidos[avisoAtualIdx];
        
        announcementPanel.classList.add('fade-out');
        
        setTimeout(() => {
            announcementTitle.textContent = aviso.titulo;
            announcementBodyText.textContent = aviso.texto;
            announcementPanel.classList.toggle('urgent', aviso.urgente);

            // --- LÓGICA DO TELEPROMPTER CORRIGIDA ---
            announcementBodyText.classList.remove('is-scrolling');

            // Usamos requestAnimationFrame para garantir que a medição ocorra após a renderização
            requestAnimationFrame(() => {
                const isOverflowing = announcementBodyText.scrollHeight > announcementBodyViewport.clientHeight;

                if (isOverflowing) {
                    const scrollHeight = announcementBodyText.scrollHeight;
                    const duration = scrollHeight / 40; // Velocidade de 40 pixels/segundo
                    document.documentElement.style.setProperty('--teleprompter-duration', `${duration}s`);
                    announcementBodyText.classList.add('is-scrolling');
                }
            });
            // --- FIM DA CORREÇÃO ---

            announcementPanel.classList.remove('fade-out');
        }, 500);

        avisoAtualIdx = (avisoAtualIdx + 1) % avisosValidos.length;
        return 20000;
    }
    
    function showDefaultMessage() {
        imagePanel.classList.add('hidden');
        announcementPanel.classList.remove('hidden');
        announcementTitle.textContent = "Bem-vindos ao Painel Digital!";
        announcementBodyText.textContent = "Não há novos avisos no momento.";
        announcementBodyText.classList.remove('is-scrolling');
    }

    async function showImageSlideshow() {
        if (imagensValidas.length === 0) return 0;

        announcementPanel.classList.add('hidden');
        imagePanel.classList.remove('hidden');
        
        let totalSlideshowTime = 0;
        for (const imagem of imagensValidas) {
            totalSlideshowTime += imagem.duration * 1000;
        }

        return new Promise(resolve => {
            let currentImageIdx = 0;
            function nextImage() {
                if (currentImageIdx >= imagensValidas.length) {
                    resolve(totalSlideshowTime);
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
        const avisoDuration = showAnnouncement();
        mainContentInterval = setTimeout(async () => {
            const slideshowDuration = await showImageSlideshow();
            mainContentInterval = setTimeout(runContentLoop, slideshowDuration);
        }, avisoDuration);
    }
    
    function listenForData() {
        dbRef.on('value', (snapshot) => {
            const data = snapshot.val() || {};
            
            const eventos = data.eventos ? Object.values(data.eventos) : [];
            eventsContentElement.innerHTML = '';

            if (eventos.length > 0) {
                eventos.forEach(evento => {
                    const eventSpan = document.createElement('span');
                    eventSpan.classList.add('event-item');
                    eventSpan.innerHTML = `<strong>${evento.data}</strong> - <span>${evento.descricao}</span>`;
                    eventsContentElement.appendChild(eventSpan);
                });

                const animationDuration = Math.max(15, eventos.length * 5);
                eventsContentElement.style.animationDuration = `${animationDuration}s`;
            } else {
                eventsContentElement.innerHTML = '<span class="event-item">Nenhum evento próximo.</span>';
                eventsContentElement.style.animationDuration = '0s';
            }
            
            const hoje = new Date().toISOString().split('T')[0];
            avisosValidos = data.avisos ? Object.values(data.avisos).filter(aviso => {
                return (!aviso.inicio || aviso.inicio <= hoje) && (!aviso.fim || aviso.fim >= hoje);
            }).sort((a, b) => (b.urgente === true) - (a.urgente === true)) : [];

            imagensValidas = data.imagens ? Object.values(data.imagens) : [];

            runContentLoop();
        });
    }

    // --- INICIALIZAÇÃO ---
    updateClock();
    setInterval(updateClock, 1000);
    listenForData();
});