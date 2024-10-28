import { getViagens, postViagem, getVeiculos, getPartida, getDestino, getMotoristas } from "./funcoes.js";

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
        preencherSelect(partidas, idPartidaSelect, "cep"); // Assumindo que `cep` representa o local de partida
        preencherSelect(destinos, idDestinoSelect, "cep"); // Assumindo que `cep` representa o local de destino
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
            id_motorista: idMotoristaSelect?.value || null, // Permite valor null para motorista
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
        CARDS DE VIAGENS
    **********************/
    const criarContainer = (viagem) => {
        const referenciar = document.createElement('button');
        referenciar.className = '';

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
        containerCards.innerHTML = '';

        try {
            const viagens = await getViagens();
            viagens.forEach(viagem => {
                const card = criarContainer(viagem);
                containerCards.appendChild(card);
            });
        } catch (error) {
            console.error('Erro ao carregar viagens:', error);
        }
    }

    mostrarContainer();

    // Função para preencher os selects de veículos, partidas e destinos
    function preencherSelect(lista, selectElement, displayProperty) {
        lista.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item[displayProperty];
            selectElement.appendChild(option);
        });
    }

    // Função específica para preencher o select de motoristas com opção "Nenhum motorista"
    function preencherSelectMotoristas(motoristas, selectElement) {
        const noMotoristaOption = document.createElement('option');
        noMotoristaOption.value = null;
        noMotoristaOption.textContent = "Nenhum motorista";
        selectElement.appendChild(noMotoristaOption);

        motoristas.forEach(motorista => {
            const option = document.createElement('option');
            option.value = motorista.id;
            option.textContent = motorista.nome; // Assumindo que `nome` é a propriedade desejada
            selectElement.appendChild(option);
        });
    }
});
