import { getViagens, postViagem, getVeiculos, getPartida, getDestino, getMotoristas, getViagemByNome, getMotorista, getViagem, getPartidaById, getDestinoById, getVeiculoById, getCarga,getCargas, getEmpresa,getEmpresas, getEmpresaViagens } from "./funcoes.js";

window.addEventListener('DOMContentLoaded', async () => {
    const id = localStorage.getItem('id'); // Recupera o ID da empresa do localStorage

    if (!id) {
        alert('ID da empresa não encontrado. Por favor, faça login novamente.');
        window.location.href = '/html/login.html'; // Redireciona para a página de login se o ID não estiver presente
        return;
    }

    try {
        const empresas = await getEmpresa(id); // `empresas` é o array retornado
        console.log('Dados da empresa:', empresas); // Inspeciona a estrutura do objeto

        // Verifica se o array contém ao menos um item e acessa o nome
        if (empresas.length > 0 && empresas[0].nome) {
            document.getElementById('empresaNome').textContent = `-${empresas[0].nome}!`;
        } else {
            console.warn('Estrutura inesperada ou nome ausente:', empresas);
            document.getElementById('empresaNome').textContent = 'Empresa não encontrada';
        }

    } catch (error) {
        console.error('Erro ao buscar a empresa:', error);
        alert('Erro ao carregar dados da empresa: ' + error.message);
    }
});


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
    const idCargaSelect = document.getElementById('id_carga');


    verificarElementos([openModalBtn, modalBackground, closeModalBtn, modalForm, idVeiculoSelect, idPartidaSelect, idDestinoSelect, idMotoristaSelect, idCargaSelect]);

    try {
        const [caminhoes, partidas, destinos, motoristas, cargas] = await Promise.all([
            getVeiculos(),
            getPartida(),
            getDestino(),
            getMotoristas(),
            getCargas()
        ]);

        preencherSelect(caminhoes, idVeiculoSelect, "modelo");
        preencherSelect(partidas, idPartidaSelect, "cep");
        preencherSelect(destinos, idDestinoSelect, "cep");
        preencherSelectMotoristas(motoristas, idMotoristaSelect);
        preencherSelectCargas(cargas, idCargaSelect);

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
            id_tipo_carga: idCargaSelect?.value || ''
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
        MODAL DE DETALHES DA VIAGEMa
    **********************/
    const modalDetalhes = document.getElementById('modalDetalhes');
    const closeModalDetalhes = document.getElementById('closeModalDetalhes');
    async function mostrarDetalhesViagem(id_viagem) {
        try {
            // Requisição para buscar os detalhes da viagem pelo id_viagem
            const viagemArray = await getViagemByNome(id_viagem);
            
            // A resposta é um array, então vamos pegar o primeiro item
            const viagem = viagemArray && viagemArray[0];
    
            if (!viagem) {
                throw new Error('Viagem não encontrada');
            }
    
            // Requisições para obter detalhes de partida, destino, motorista e veículo
            const partidaResponse = await getPartidaById(viagem.id_partida);
            const destinoResponse = await getDestinoById(viagem.id_destino);
            const motoristaResponse = await getMotorista(viagem.id_motorista);
            const veiculoResponse = await getVeiculoById(viagem.id_veiculo);
            const cargaResponse = await getCarga(viagem.id_tipo_carga);

    
            // Garantir que a estrutura da resposta seja a esperada
            const partida = partidaResponse && partidaResponse[0]; // Acessando o primeiro item
            const destino = destinoResponse && destinoResponse[0]; // Acessando o primeiro item
            const motorista = motoristaResponse && motoristaResponse[0]; // Acessando o primeiro item
            const veiculo = veiculoResponse && veiculoResponse[0]; // Acessando o primeiro item
            const carga = cargaResponse && cargaResponse[0]; // Acessando o primeiro item
    
            // Preencher os dados no modal de detalhes
            const detalhesViagem = document.getElementById('detalhesViagem');
            detalhesViagem.innerHTML = `
                <p><strong>ID Viagem:</strong> ${viagem.id_viagem}</p>
                <p><strong>Remetente:</strong> ${viagem.remetente}</p>
                <p><strong>Destinatário:</strong> ${viagem.destinatario}</p>
                <p><strong>Data de Partida:</strong> ${new Date(viagem.dia_partida).toLocaleDateString()}</p>
                <p><strong>Horário de Partida:</strong> ${new Date(viagem.horario_partida).toLocaleTimeString()}</p>
                <p><strong>Status Entregue:</strong> ${viagem.status_entregue ? 'Entregue' : 'Não Entregue'}</p>
                <p><strong>Partida (CEP):</strong> ${partida && partida.cep ? partida.cep : 'Não encontrado'}</p>
                <p><strong>Destino (CEP):</strong> ${destino && destino.cep ? destino.cep : 'Não encontrado'}</p>
                <p><strong>Motorista:</strong> ${motorista && motorista.nome ? motorista.nome : 'Não encontrado'}</p>
                <p><strong>Veículo:</strong> ${veiculo && veiculo.modelo ? veiculo.modelo : 'Não encontrado'}</p>
                <p><strong>Carga:</strong> ${carga && carga.descricao ? carga.descricao : 'Não encontrado'}</p>

            `;
    
            // Exibe o modal
            modalDetalhes.style.display = 'flex'; // Torna o modal visível
    
        } catch (error) {
            console.error("Erro ao carregar a viagem:", error);
            Swal.fire({
                title: 'Erro!',
                text: 'Não foi possível carregar os detalhes da viagem. Tente novamente.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    }
    
    // Fechar o modal de detalhes
    closeModalDetalhes.onclick = () => {
        modalDetalhes.style.display = 'none'; // Esconde o modal
    };

    window.onclick = (event) => {
        if (event.target === modalDetalhes) {
            modalDetalhes.style.display = 'none'; // Fecha o modal se clicar fora
        }
    };

    /*********************
        CARDS DE VIAGENS
    **********************/
        const criarContainer = (viagem) => {
            const referenciar = document.createElement('button');
            referenciar.className = '';
            // Passa o id_viagem ao clicar no card
            referenciar.onclick = () => mostrarDetalhesViagem(viagem.id_viagem); // Passando o id_viagem para a função
        
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

        const id = localStorage.getItem('id');
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
            const viagens = await getEmpresaViagens(id);
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
     /*********************
        PESQUISA DE VIAGEM
    **********************/
        async function pesquisarViagem(id_viagem) {
            const containerCards = document.getElementById('container-cards');
            containerCards.innerHTML = ''; // Limpa o container
    
            const loadingSpinner = document.createElement('div');
            loadingSpinner.className = 'loading-message'; // Classe CSS para estilizar a mensagem de carregamento
            loadingSpinner.textContent = 'Pesquisando viagens...';
    
            // Estilizando a mensagem de carregamento
            loadingSpinner.style.position = 'absolute';
            loadingSpinner.style.top = '50%';
            loadingSpinner.style.left = '50%';
            loadingSpinner.style.transform = 'translate(-50%, -50%)';
            loadingSpinner.style.fontSize = '18px'; // Tamanho da fonte
            loadingSpinner.style.color = '#333'; // Cor do texto
            loadingSpinner.style.zIndex = '1000'; // Certifique-se de que fique acima de outros elementos
    
            containerCards.appendChild(loadingSpinner); // Exibe a mensagem de carregamento
    
            try {
                const resultado = await getViagemByNome(id_viagem); // Chama a função para buscar viagens pelo ID
                console.log("Resultado da pesquisa:", resultado); // Log da resposta
    
                const viagens = Array.isArray(resultado) && resultado.length > 0 ? resultado : []; // Altera aqui
    
                if (viagens.length > 0) {
                    viagens.forEach(viagem => {
                        const card = criarContainer(viagem);
                        containerCards.appendChild(card);
                    });
                } else {
                    await Swal.fire({
                        title: 'Nenhuma viagem encontrada',
                        text: 'Verifique o ID da viagem e tente novamente.',
                        icon: 'info',
                        confirmButtonText: 'OK',
                    });
                }
            } catch (error) {
                console.error('Erro ao obter viagens:', error);
                await Swal.fire({
                    title: 'Erro ao buscar viagens',
                    text: 'Ocorreu um erro ao buscar as viagens. Tente novamente mais tarde.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            } finally {
                containerCards.removeChild(loadingSpinner); // Remove o indicador de carregamento
            }
        }
    
        // Event listener para a pesquisa
        const pesquisaInput = document.getElementById('pesquisa');
        console.log("Elemento de pesquisa encontrado:", pesquisaInput);
    
        if (pesquisaInput) {
            let pesquisaTimeout;
    
            pesquisaInput.addEventListener('input', () => {
                clearTimeout(pesquisaTimeout);
                pesquisaTimeout = setTimeout(async () => {
                    const id_viagem = pesquisaInput.value.trim();
                    console.log("ID da viagem pesquisado:", id_viagem); // Log do ID pesquisado
    
                    if (id_viagem === '') {
                        // Se o input estiver vazio, recarregue todas as viagens
                        await mostrarContainer();
                    } else {
                        await pesquisarViagem(id_viagem); // Chama a função de pesquisa
                    }
                }, 300); 
            });
        }
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
function preencherSelectCargas(cargas, selectElement) {
    cargas.forEach(carga => {
        const option = document.createElement('option');
        option.value = carga.id_tipo_carga;
        option.textContent = carga.descricao;
        selectElement.appendChild(option);
    });
}



// Lista global de IDs dos campos que podem ser editados
const camposEdicao = [
    'id_viagem', 'dia_partida', 'horario_partida', 'dia_chegada',
    'remetente', 'destinatario', 'status_entregue',
    'id_partida', 'id_destino', 'id_motorista', 'id_veiculo', 'id_tipo_carga'
];

// Função para habilitar edição
function habilitarEdicao() {
    camposEdicao.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            campo.disabled = false; // Habilita o campo para edição
        }
    });

    // Atualiza o botão de "Editar" para "Salvar" ao habilitar edição
    const botaoEditar = document.getElementById('botaoEditar');
    if (botaoEditar) {
        botaoEditar.textContent = 'Salvar';
        botaoEditar.onclick = salvarEdicao; // Altera função do botão para salvar a edição
    }
}

// Função para salvar alterações feitas no modal
async function salvarEdicao() {
    // Obter dados dos campos atualizados para salvar as alterações
    const viagemEditada = {
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
        id_tipo_carga: document.getElementById('id_tipo_carga')?.value || ''
    };

    // Enviar os dados para o backend (adapte para a função de atualização que você usa)
    try {
        const response = await postViagem(viagemEditada); // Substitua postViagem por uma função de atualização, se houver
        if (response.status === 200) {
            Swal.fire({
                title: 'Sucesso!',
                text: 'As alterações foram salvas.',
                icon: 'success',
                confirmButtonText: 'OK',
            });
        } else {
            throw new Error('Erro ao salvar a edição.');
        }
    } catch (error) {
        Swal.fire({
            title: 'Erro!',
            text: 'Ocorreu um erro ao salvar as alterações. Tente novamente.',
            icon: 'error',
            confirmButtonText: 'OK',
        });
    }

    // Desativa a edição após salvar e restaura o botão de "Salvar" para "Editar"
    camposEdicao.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            campo.disabled = true; // Desabilita o campo novamente
        }
    });
    const botaoEditar = document.getElementById('editarViagemBtn');
    if (botaoEditar) {
        botaoEditar.textContent = 'Editar';
        botaoEditar.onclick = habilitarEdicao; // Restaura função original de "Editar"
    }
}

// Certifique-se de que o botão de edição no modal de detalhes tenha o ID "botaoEditar"
document.getElementById('editarViagemBtn').onclick = habilitarEdicao;
