import { getViagens, postViagem } from "./funcoes.js";

/*********************
        MODAL
**********************/
document.addEventListener("DOMContentLoaded", () => {
    // Selecionando os elementos do modal
    const openModalBtn = document.getElementById('openModal');
    const modalBackground = document.getElementById('modalBackground');
    const closeModalBtn = document.getElementById('closeModal');
    const modalForm = document.querySelector('.modal-form');

    // Verificações para garantir que os elementos estão presentes e logar erros específicos
    verificarElementos([openModalBtn, modalBackground, closeModalBtn, modalForm]);

    // Adiciona eventos ao modal apenas se todos os elementos necessários estiverem presentes
    if (openModalBtn && modalBackground && closeModalBtn && modalForm) {
        // Evento para abrir o modal
        openModalBtn.addEventListener('click', () => {
            console.log('Botão de abrir modal clicado.');
            modalForm.reset(); // Limpa o formulário ao abrir o modal
            modalBackground.style.display = 'flex'; // Mostra o modal
            console.log('Modal exibido. Estado do display:', modalBackground.style.display);
        });

        // Evento para fechar o modal ao clicar no botão de fechar
        closeModalBtn.addEventListener('click', () => {
            console.log('Botão de fechar modal clicado.');
            modalBackground.style.display = 'none'; // Esconde o modal
            modalForm.reset(); // Reseta o formulário
            console.log('Estado do display após fechar:', modalBackground.style.display);
        });

        // Evento para fechar o modal ao clicar fora dele
        modalBackground.addEventListener('click', (e) => {
            if (e.target === modalBackground) {
                console.log('Clicou fora do modal, fechando...');
                modalBackground.style.display = 'none';
                modalForm.reset(); // Reseta o formulário
                console.log('Estado do display após fechar:', modalBackground.style.display);
            }
        });

        // Adiciona o evento de envio ao formulário
        modalForm.addEventListener('submit', criarViagem);
        console.log('Evento de envio do formulário adicionado.');
    }

    // Função para criar uma nova viagem
    async function criarViagem(event) {
        event.preventDefault(); // Previne o comportamento padrão do formulário

        // Coleta os valores dos campos do formulário
        const novaViagem = {
            id_viagem: document.getElementById('id_viagem')?.value || '',
            dia_partida: document.getElementById('dia_partida')?.value || '',
            horario_partida: document.getElementById('horario_partida')?.value || '',
            dia_chegada: document.getElementById('dia_chegada')?.value || '',
            remetente: document.getElementById('remetente')?.value || '',
            destinatario: document.getElementById('destinatario')?.value || '',
            status_entregue: document.getElementById('status_entregue')?.value || '',
            id_partida: document.getElementById('id_partida')?.value || '',
            id_destino: document.getElementById('id_destino')?.value || '',
            id_motorista: document.getElementById('id_motorista')?.value || null,
            id_veiculo: document.getElementById('id_veiculo')?.value || '',
        };

        // Fecha o modal antes de mostrar o alerta de carregamento
        modalBackground.style.display = 'none';
        console.log('Modal fechado após clicar em Salvar Viagem.');

        // Exibe o alerta de carregamento
        const loadingAlert = Swal.fire({
            title: 'Carregando...',
            text: 'Aguarde enquanto processamos sua solicitação.',
            icon: 'info',
            allowOutsideClick: false, // Impede o fechamento ao clicar fora
            didOpen: () => {
                Swal.showLoading(); // Mostra a animação de carregamento
            }
        });

        try {
            // Faz a requisição para criar a nova viagem
            const response = await postViagem(novaViagem);
            await loadingAlert.close(); // Fecha o alerta de carregamento
            if (response.status === 200) {
                console.log('Viagem criada com sucesso.');
                await Swal.fire({
                    title: 'Sucesso!',
                    text: 'Viagem criada com sucesso!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    backdrop: true,
                });
                mostrarContainer(); // Recarrega os cards após a criação da viagem
            } else {
                throw new Error('Erro ao criar a viagem.');
            }
        } catch (error) {
            // Fecha o alerta de carregamento se houver erro
            await loadingAlert.close();
            console.error('Erro ao criar viagem:', error);
            await Swal.fire({
                title: 'Erro!',
                text: 'Ocorreu um erro ao criar a viagem. Tente novamente.',
                icon: 'error',
                confirmButtonText: 'OK',
                backdrop: true,
            });
        }
    }

    // Função para verificar se todos os elementos do modal estão presentes
    function verificarElementos(elementos) {
        elementos.forEach((elemento, index) => {
            if (!elemento) {
                console.error(`Elemento não encontrado. Índice: ${index}`);
            }
        });
    }

    /*********************
        CARDS DE VIAGENS
    **********************/
    
    // Função para criar um card de viagem
    const criarContainer = (viagem) => {
        const referenciar = document.createElement('button');
        referenciar.className = ''; // Pode adicionar uma classe específica se necessário
        referenciar.addEventListener('click', () => {
            // Ação a ser realizada ao clicar no card, se necessário
        });

        const container = document.createElement('div');
        container.className = 'trip-card';
        const cardContent = document.createElement('div');
        cardContent.className = 'trip-info';

        // Criar os elementos de conteúdo do card
        const id_viagem = document.createElement('h1');
        id_viagem.className = 'trip-title';
        id_viagem.textContent = viagem.id_viagem;

        const remetente = document.createElement('p');
        remetente.className = 'trip-remetente';
        remetente.textContent = `Remetente: ${viagem.remetente}`;

        const destinatario = document.createElement('p');
        destinatario.className = 'trip-destinatario';
        destinatario.textContent = `Destinatário: ${viagem.destinatario}`;

        // Formatação da data de partida
        const data_partida = new Date(viagem.dia_partida);
        const formattedDate = data_partida.toISOString().split('T')[0];
        const data_partida_paragraph = document.createElement('p');
        data_partida_paragraph.className = 'trip-data';
        data_partida_paragraph.textContent = `Data: ${formattedDate || 'N/A'}`;

        // Adiciona os elementos de conteúdo ao card
        cardContent.append(id_viagem, remetente, destinatario, data_partida_paragraph);

        const imageContainer = document.createElement('div');
        imageContainer.className = 'trip-image';
        const image = document.createElement('img');
        image.src = viagem.image || '../css/img/caixa.png.png';
        image.alt = 'Imagem do caminhão';
        image.className = 'trip-image-img';
        imageContainer.appendChild(image);

        container.append(cardContent, imageContainer);
        referenciar.appendChild(container);
        return referenciar;
    }

    // Função para mostrar as viagens na tela
    async function mostrarContainer() {
        const containerCards = document.getElementById('container-cards');
        containerCards.innerHTML = ''; // Limpa os cards existentes
        console.log('Container limpo. Carregando viagens...');

        try {
            const viagens = await getViagens(); // Obtém as viagens
            viagens.forEach(viagem => {
                const card = criarContainer(viagem); // Cria um card para cada viagem
                containerCards.appendChild(card); // Adiciona o card ao container
            });
        } catch (error) {
            console.error('Erro ao carregar viagens:', error);
        }
    }

    // Chama a função para mostrar as viagens ao carregar a página
    mostrarContainer();
});
