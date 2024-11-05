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
    const modalDetalhesViagem = document.getElementById('modalDetalhesViagem');
    const modalTitulo = document.getElementById('modalTitulo');
    const modalRemetente = document.getElementById('modalRemetente');
    const modalDestinatario = document.getElementById('modalDestinatario');
    const modalDataPartida = document.getElementById('modalDataPartida');
    const modalDataChegada = document.getElementById('modalDataChegada');
    const modalHorarioPartida = document.getElementById('modalHorarioPartida');
    const modalStatusEntregue = document.getElementById('modalStatusEntregue');
    const modalMotorista = document.getElementById('modalMotorista');
    const modalVeiculo = document.getElementById('modalVeiculo');
    const editarViagemBtn = document.getElementById('editarViagemBtn');
    const excluirViagemBtn = document.getElementById('excluirViagemBtn');
    const fecharModalBtn = document.getElementById('fecharModalBtn');

    let viagemSelecionada = null;

    // Função para verificar a existência de elementos no DOM
    function verificarElementos(elementos) {
        elementos.forEach((elemento, index) => {
            if (!elemento) {
                console.error(`Elemento não encontrado. Índice: ${index}`);
            }
        });
    }

    // Verificando os elementos
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

        // Fechar o modal ao clicar fora do conteúdo (na área de fundo)
        modalBackground.addEventListener('click', (e) => {
            if (e.target === modalBackground) {
                modalBackground.style.display = 'none';
                modalForm.reset();
            }
        });

        modalForm.addEventListener('submit', criarViagem);
    }

    // Função para criar viagem
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

    // Função para mostrar os detalhes da viagem no modal
    function abrirModalDetalhes(viagem) {
        modalTitulo.textContent = `Viagem: ${viagem.id_viagem}`;
        modalRemetente.textContent = `Remetente: ${viagem.remetente}`;
        modalDestinatario.textContent = `Destinatário: ${viagem.destinatario}`;
        modalDataPartida.textContent = `Data de Partida: ${viagem.dia_partida}`;
        modalDataChegada.textContent = `Data de Chegada: ${viagem.dia_chegada}`;
        modalHorarioPartida.textContent = `Horário de Partida: ${viagem.horario_partida}`;
        modalStatusEntregue.textContent = `Status: ${viagem.status_entregue}`;
        modalMotorista.textContent = `Motorista: ${viagem.id_motorista}`;
        modalVeiculo.textContent = `Veículo: ${viagem.id_veiculo}`;

        viagemSelecionada = viagem;
        modalDetalhesViagem.style.display = 'flex';
    }

    // Fechar o modal de detalhes
    fecharModalBtn.addEventListener('click', () => {
        modalDetalhesViagem.style.display = 'none';
    });

    // Editar a viagem
    editarViagemBtn.addEventListener('click', async () => {
        if (viagemSelecionada) {
            alert('Editar Viagem: ' + viagemSelecionada.id_viagem);
            // Aqui você pode adicionar lógica para editar os dados da viagem (exibir um formulário de edição)
        }
    });

    // Excluir a viagem
    excluirViagemBtn.addEventListener('click', async () => {
        if (viagemSelecionada) {
            const confirmar = await Swal.fire({
                title: 'Tem certeza?',
                text: `Deseja excluir a viagem ${viagemSelecionada.id_viagem}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Excluir',
                cancelButtonText: 'Cancelar'
            });

            if (confirmar.isConfirmed) {
                try {
                    const response = await deleteViagem(viagemSelecionada.id_viagem);
                    if (response.status === 200) {
                        await Swal.fire({
                            title: 'Sucesso!',
                            text: 'Viagem excluída com sucesso!',
                            icon: 'success'
                        });
                        mostrarContainer(); // Atualiza a lista de viagens
                    }
                } catch (error) {
                    await Swal.fire({
                        title: 'Erro!',
                        text: 'Não foi possível excluir a viagem.',
                        icon: 'error'
                    });
                }
            }
        }
    });

    /*********************
        CARDS DE VIAGENS
    **********************/
    const criarContainer = (viagem) => {
        const referenciar = document.createElement('button');
        referenciar.className = 'trip-card';

        const container = document.createElement('div');
        container.className = 'trip-info';
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

        const imageContainer = document.createElement('div');
        imageContainer.className = 'trip-image';
        const image = document.createElement('img');
        image.src = viagem.image || '../css/img/caixa.png.png';
        image.alt = 'Imagem do caminhão';
        image.className = 'trip-image-img';

        container.append(id_viagem, remetente, destinatario, data_partida_paragraph, imageContainer);
        referenciar.appendChild(container);

        // Abrir modal com detalhes da viagem
        referenciar.addEventListener('click', () => {
            abrirModalDetalhes(viagem);
        });

        return referenciar;
    };

    /*********************
        EXIBIR VIAGENS
    **********************/
    async function mostrarContainer() {
        const containerCards = document.getElementById('container-cards');
        containerCards.innerHTML = ''; // Limpa o container

        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'loading-message'; 
        loadingMessage.textContent = 'Carregando viagens...';
        containerCards.appendChild(loadingMessage);

        const viagens = [
            {
                id_viagem: "12345",
                dia_partida: "2024-11-06",
                horario_partida: "08:00",
                dia_chegada: "2024-11-07",
                remetente: "Empresa A",
                destinatario: "Cliente X",
                status_entregue: "Em trânsito",
                id_partida: "1",
                id_destino: "2",
                id_motorista: "1", 
                id_veiculo: "3",
                image: "../css/img/caixa.png.png"
            },
            {
                id_viagem: "12345",
                dia_partida: "2024-11-06",
                horario_partida: "08:00",
                dia_chegada: "2024-11-07",
                remetente: "Empresa A",
                destinatario: "Cliente X",
                status_entregue: "Em trânsito",
                id_partida: "1",
                id_destino: "2",
                id_motorista: "1", 
                id_veiculo: "3",
                image: "../css/img/caixa.png.png"
            },
            {
                id_viagem: "12345",
                dia_partida: "2024-11-06",
                horario_partida: "08:00",
                dia_chegada: "2024-11-07",
                remetente: "Empresa A",
                destinatario: "Cliente X",
                status_entregue: "Em trânsito",
                id_partida: "1",
                id_destino: "2",
                id_motorista: "1", 
                id_veiculo: "3",
                image: "../css/img/caixa.png.png"
            }

        ];

        try {
            viagens.forEach(viagem => {
                const card = criarContainer(viagem);
                containerCards.appendChild(card);
            });
        } catch (error) {
            console.error('Erro ao carregar viagens:', error);
            await Swal.fire({
                title: 'Erro ao carregar viagens',
                text: 'Ocorreu um erro ao carregar as viagens. Tente novamente mais tarde.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        } finally {
            containerCards.removeChild(loadingMessage);
        }
    }

    await mostrarContainer(); // Exibe as viagens ao carregar
});
