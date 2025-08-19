# Painel Digital Informativo - IFPR Campus União da Vitória

![Capa do Projeto](uniao-da-vitoria-capa.jpg)

## 📖 Sobre o Projeto

Este projeto é um painel digital dinâmico desenvolvido para o **Instituto Federal do Paraná (IFPR) - Campus União da Vitória**. O objetivo é centralizar e exibir informações importantes para alunos, professores e visitantes de forma clara e automatizada em telas e monitores pelo campus.

O sistema é dividido em duas partes principais:
1.  **O Painel de Exibição (`index.html`):** A tela principal que mostra os avisos, eventos e outras informações em tempo real.
2.  **O Painel de Controle (`admin.html`):** Uma área administrativa protegida por login para gerenciar todo o conteúdo exibido no painel principal.

O projeto foi publicado utilizando **GitHub Pages** e utiliza o **Firebase** como backend para armazenamento e gerenciamento de dados em tempo real.

---

## 🚀 Acesso

Você pode acessar o painel e a área administrativa pelos links abaixo:

* **Painel Principal:** `https://SEU-USUARIO.github.io/painel-digital-ifpr/`
* **Painel de Controle:** `https://SEU-USUARIO.github.io/painel-digital-ifpr/admin.html`

> **Nota:** Substitua `SEU-USUARIO` pelo seu nome de usuário do GitHub.

---

## ✨ Funcionalidades

### Painel de Exibição
* **Avisos Dinâmicos:** Exibe uma lista de avisos em rotação, com transições suaves.
* **Prioridade de Avisos:** Avisos marcados como "Urgente" possuem destaque visual e são exibidos primeiro.
* **Agendamento de Conteúdo:** Avisos podem ser programados para aparecer e desaparecer em datas específicas.
* **Widget de Eventos:** Mostra uma lista dos próximos eventos agendados.
* **Widget de Clima:** Exibe a previsão do tempo atual para a cidade.
* **Relógio e Data:** Informações de data e hora sempre visíveis.
* **Exibição de Mídia:** Capacidade de substituir os avisos por uma imagem de destaque.
* **Teleprompter:** Textos de avisos muito longos rolam verticalmente para garantir a leitura completa.

### Painel de Controle
* **Autenticação Segura:** Acesso protegido pelo sistema de autenticação (E-mail e Senha) do Firebase.
* **Gerenciamento de Avisos (CRUD):**
    * Criar, editar e excluir avisos.
    * Definir um título e um corpo de texto.
    * Marcar avisos como "Urgentes".
    * Agendar datas de início e fim para a exibição de um aviso.
* **Gerenciamento de Eventos (CRUD):**
    * Criar, editar e excluir eventos com data e descrição.
* **Controle de Imagem de Destaque:**
    * Definir uma URL de imagem para ser exibida.
    * Ativar ou desativar a exibição da imagem, que sobrepõe os avisos.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:**
    * HTML5
    * CSS3 (Grid Layout, Animações)
    * JavaScript (ES6+)
* **Backend & Banco de Dados:**
    * **Firebase Realtime Database:** Para armazenamento e sincronização de dados em tempo real.
    * **Firebase Authentication:** Para a segurança do painel administrativo.
* **Hospedagem e Deploy:**
    * **GitHub Pages:** Para a publicação e hospedagem gratuita do site.
    * **Git:** Para o controle de versão.

---

## ⚙️ Como Executar o Projeto Localmente

1.  Clone o repositório:
    ```bash
    git clone [https://github.com/SEU-USUARIO/painel-digital-ifpr.git](https://github.com/SEU-USUARIO/painel-digital-ifpr.git)
    ```
2.  Navegue até a pasta do projeto:
    ```bash
    cd painel-digital-ifpr
    ```
3.  Abra o arquivo `index.html` em seu navegador para ver o painel principal.
4.  Abra o arquivo `admin.html` para acessar o painel de controle (requer as credenciais criadas no Firebase).

---

## 🔄 Publicação e Atualizações

O deploy deste projeto é automatizado via **GitHub Pages**. Qualquer alteração enviada (`push`) para a branch `main` será publicada automaticamente.

Para facilitar o processo de atualização, foi criado o script `update.bat`. Para usá-lo:
1.  Faça as alterações desejadas nos arquivos.
2.  Execute o arquivo `update.bat` com um duplo-clique.
3.  Digite uma mensagem descrevendo as alterações e pressione Enter.
4.  O script enviará as atualizações para o GitHub, e o site será atualizado em alguns minutos.