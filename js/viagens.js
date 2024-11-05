import { getViagens, postViagem, getVeiculos, getPartida, getDestino, getMotoristas, getViagemByNome } from "./funcoes.js";

/*********************
        MODAL
**********************/
document.addEventListener("DOMContentLoaded", async () => {
    const openModalBtn = document.getElementById('openModal');
    const modalBackground = document.getElementById('modalBackground');
    const closeModalBtn = document.getElementById('closeModal');
    const modalForm = document.querySelector('.modal-form');
    const idVeiculoSelect = document.getElementById('id_veiculo');
    const idPartidaSelect = document.getElementById('id_partida');
    const idDestinoSelect = document.getElementById('id_destino');
    const idMotoristaSelect = document.getElementById('id_motorista');

    verificarElementos([openModalBtn, modalBackground, closeModalBtn, modalForm, idVeiculoSelect, idPartidaSelect, idDestinoSelect, idMotoristaSelect]);

    try {
        const [caminhoes, partidas, destinos, motoristas] = await Promise.all([
            getVeiculos(),
            getPartida(),
            getDestino(),
            getMotoristas()
        ]);

        preencherSelect(caminhoes, idVeiculoSelect, "modelo");
        preencherSelect(partidas, idPartidaSelect, "cep"); 
        preencherSelect(destinos, idDestinoSelect, "cep"); 
        preencherSelectMotoristas(motoristas, idMotoristaSelect);
        
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }

    if (openModalBtn && modalBackground && closeModalBtn && modalForm) {
        openModalBtn.addEventListener('click', () => {
            modalForm.reset();
            modalBackground.style.display = 'flex';
        });

        closeModalBtn.addEventListener('click', () => {
            modalBackground.style.display = 'none';
            modalForm.reset();
        });

        modalBackground.addEventListener('click', (e) => {
            if (e.target === modalBackground) {
                modalBackground.style.display = 'none';
                modalForm.reset();
            }
        });

        modalForm.addEventListener('submit', criarViagem);
    }

    async function criarViagem(event) {
        event.preventDefault();

        const novaViagem = {
            id_viagem: document.getElementById('id_viagem')?.value || '',
            dia_partida: document.getElementById('dia_partida')?.value || '',
            horario_partida: document.getElementById('horario_partida')?.value || '',
            dia_chegada: document.getElementById('dia_chegada')?.value || '',
            remetente: document.getElementById('remetente')?.value || '',
            destinatario: document.getElementById('destinatario')?.value || '',
            status_entregue: document.getElementById('status_entregue')?.value || '',
            id_partida: idPartidaSelect?.value || '',
            id_destino: idDestinoSelect?.value || '',
            id_motorista: idMotoristaSelect?.value || null, 
            id_veiculo: idVeiculoSelect?.value || '',
        };

        modalBackground.style.display = 'none';

        const loadingAlert = Swal.fire({
            title: 'Carregando...',
            text: 'Aguarde enquanto processamos sua solicitação.',
            icon: 'info',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });

        try {
            const response = await postViagem(novaViagem);
            await loadingAlert.close();

            if (response.status === 200) {
                await Swal.fire({
                    title: 'Sucesso!',
                    text: 'Viagem criada com sucesso!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                mostrarContainer();
            } else {
                throw new Error('Erro ao criar a viagem.');
            }
        } catch (error) {
            await loadingAlert.close();
            await Swal.fire({
                title: 'Erro!',
                text: 'Ocorreu um erro ao criar a viagem. Tente novamente.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    }

    function verificarElementos(elementos) {
        elementos.forEach((elemento, index) => {
            if (!elemento) {
                console.error(`Elemento não encontrado. Índice: ${index}`);
            }
        });
    }

    /*********************
        MODAL DE DETALHES DA VIAGEM
    **********************/
    const modalDetalhes = document.getElementById('modalDetalhes');
    const closeModalDetalhes = document.getElementById('closeModalDetalhes');

    // Função para exibir detalhes da viagem no modal
    const mostrarDetalhesViagem = (viagem) => {
        const detalhesViagem = document.getElementById('detalhesViagem');
        detalhesViagem.innerHTML = `
            <p><strong>ID Viagem:</strong> ${viagem.id_viagem}</p>
            <p><strong>Remetente:</strong> ${viagem.remetente}</p>
            <p><strong>Destinatário:</strong> ${viagem.destinatario}</p>
            <p><strong>Data de Partida:</strong> ${new Date(viagem.dia_partida).toLocaleDateString()}</p>
            <p><strong>Horário de Partida:</strong> ${viagem.horario_partida}</p>
            <p><strong>Status Entregue:</strong> ${viagem.status_entregue}</p>
            <p><strong>ID Partida:</strong> ${viagem.id_partida}</p>
            <p><strong>ID Destino:</strong> ${viagem.id_destino}</p>
            <p><strong>ID Motorista:</strong> ${viagem.id_motorista}</p>
            <p><strong>ID Veículo:</strong> ${viagem.id_veiculo}</p>
        `;
        modalDetalhes.style.display = 'block'; // Exibe o modal
    };

    // Fechar o modal de detalhes
    closeModalDetalhes.onclick = () => {
        modalDetalhes.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modalDetalhes) {
            modalDetalhes.style.display = 'none';
        }
    };

    /*********************
        CARDS DE VIAGENS
    **********************/
    const criarContainer = (viagem) => {
        const referenciar = document.createElement('button');
        referenciar.className = '';
        referenciar.onclick = () => mostrarDetalhesViagem(viagem); // Adiciona o evento de clique

        const container = document.createElement('div');
        container.className = 'trip-card';
        const cardContent = document.createElement('div');
        cardContent.className = 'trip-info';

        const id_viagem = document.createElement('h1');
        id_viagem.className = 'trip-title';
        id_viagem.textContent = viagem.id_viagem;

        const remetente = document.createElement('p');
        remetente.className = 'trip-remetente';
        remetente.textContent = `Remetente: ${viagem.remetente}`;

        const destinatario = document.createElement('p');
        destinatario.className = 'trip-destinatario';
        destinatario.textContent = `Destinatário: ${viagem.destinatario}`;

        const data_partida = new Date(viagem.dia_partida);
        const formattedDate = data_partida.toISOString().split('T')[0];
        const data_partida_paragraph = document.createElement('p');
        data_partida_paragraph.className = 'trip-data';
        data_partida_paragraph.textContent = `Data: ${formattedDate || 'N/A'}`;

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
    };

    async function mostrarContainer() {
        const containerCards = document.getElementById('container-cards');
        containerCards.innerHTML = ''; // Limpa o container
    
        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'loading-message'; // Classe CSS para estilizar a mensagem de carregamento
        loadingMessage.textContent = 'Carregando viagens...';
    
        // Estilizando a mensagem de carregamento
        loadingMessage.style.position = 'absolute';
        loadingMessage.style.top = '50%';
        loadingMessage.style.left = '50%';
        loadingMessage.style.transform = 'translate(-50%, -50%)';
        loadingMessage.style.fontSize = '18px'; // Tamanho da fonte
        loadingMessage.style.color = '#333'; // Cor do texto
        loadingMessage.style.zIndex = '1000'; // Certifique-se de que fique acima de outros elementos
    
        containerCards.appendChild(loadingMessage); // Exibe a mensagem de carregamento
    
        try {
            const viagens = await getViagens();
            containerCards.removeChild(loadingMessage); // Remove a mensagem de carregamento
    
            viagens.forEach(viagem => {
                const card = criarContainer(viagem);
                containerCards.appendChild(card);
            });
        } catch (error) {
            console.error("Erro ao carregar viagens:", error);
            containerCards.removeChild(loadingMessage); // Remove a mensagem de carregamento em caso de erro
            const errorMessage = document.createElement('div');
            errorMessage.textContent = 'Erro ao carregar as viagens. Tente novamente.';
            containerCards.appendChild(errorMessage);
        }
    }

    // Chame a função para carregar as viagens ao iniciar
    mostrarContainer();
});

function preencherSelect(transportes, selectElement, valueField) {
    transportes.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id || item[valueField];
        option.textContent = item[valueField];
        selectElement.appendChild(option);
    });
}

function preencherSelectMotoristas(motoristas, selectElement) {
    motoristas.forEach(motorista => {
        const option = document.createElement('option');
        option.value = motorista.id_motorista;
        option.textContent = motorista.nome;
        selectElement.appendChild(option);
    });
}
