import { getMotoristas, getMotoristaNome, getEmpresa, getMotoristasEquipe, getMotoristasSemEquipe, postEquipe } from "./funcoes.js";

// Garantir que o código só seja executado depois que o DOM estiver totalmente carregado
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const id = localStorage.getItem('userId');
        if (!id) {
            alert('ID da empresa não encontrado. Por favor, faça login novamente.');
            window.location.href = '/html/login.html'; 
            return;
        }

        // Buscar dados da empresa
        const empresas = await getEmpresa(id);
        if (!empresas || empresas.length === 0) {
            alert('Empresa não encontrada!');
            return;
        }

        // Atualizar informações da empresa na interface
        const empresa = empresas[0];
        console.log('Dados da empresa:', empresa);
        document.getElementById('empresaNome').textContent = `${empresa.nome}!`;

        if (empresa.foto_url) {
            const empresaImagem = document.getElementById('foto-url');
            if (empresaImagem) {
                empresaImagem.src = empresa.foto_url;
                empresaImagem.alt = empresa.nome;
            } else {
                console.error('Elemento de imagem não encontrado.');
            }
        } else {
            console.warn('Imagem não encontrada para a empresa:', empresa);
            document.getElementById('empresaImagem').src = '/path/to/default-image.jpg';
        }

        // Carregar motoristas ao carregar a página
        await carregarMotoristas(id);

    } catch (error) {
        console.error('Erro ao carregar dados da empresa:', error);
        alert('Erro ao carregar dados da empresa: ' + error.message);
    }
});

// Função para adicionar o motorista à equipe
const adicionarMotoristaEquipe = async (motoristaId) => {
    try {
        const empresaId = localStorage.getItem('userId');
        if (!empresaId) {
            alert('ID da empresa não encontrado. Por favor, faça login novamente.');
            window.location.href = '/html/login.html'; 
            return;
        }

        console.log(motoristaId, empresaId)

        // Cria o objeto para enviar na requisição POST
        const dadosEquipe = {
            id_motorista: motoristaId,
            id_empresa: empresaId
        };

        // Verificar se os campos obrigatórios estão presentes
        if (!dadosEquipe.id_motorsta || !dadosEquipe.id_empresa) {
            alert('Campos obrigatórios não preenchidos.');
            return;
        }

        // Chama a função postEquipe do arquivo funcoes.js
        const resultado = await postEquipe(dadosEquipe);

        if (resultado.ok) {
            alert('Motorista adicionado à equipe com sucesso!');
            carregarMotoristas(empresaId); // Atualiza a lista de motoristas
        } else {
            alert('Erro ao adicionar motorista à equipe.');
        }
    } catch (error) {
        console.error('Erro ao adicionar motorista à equipe:', error);
        alert('Erro ao adicionar motorista à equipe: ' + error.message);
    }
};

// Função para criar os cards dos motoristas
const criarCardMotorista = (motorista) => {
    const cardContainer = document.createElement('div');
    cardContainer.className = 'motorista-card';

    // Adiciona o ID do motorista como um atributo data-id no card
    cardContainer.setAttribute('data-id', motorista.id);

    const cardContent = document.createElement('div');
    cardContent.className = 'motorista-info';

    const imageContainer = document.createElement('div');
    imageContainer.className = 'motorista-image';
    const image = document.createElement('img');
    image.src = motorista.foto_url || '../css/img/default.png';
    image.alt = `Foto de ${motorista.nome || motorista.nome_motorista}`;
    image.className = 'motorista-image-img';
    imageContainer.appendChild(image);

    const nomeMotorista = document.createElement('h2');
    nomeMotorista.className = 'motorista-nome';
    nomeMotorista.textContent = motorista.nome || motorista.nome_motorista;

    const cpfMotorista = document.createElement('p');
    cpfMotorista.className = 'motorista-email';
    cpfMotorista.textContent = ` ${motorista.email || 'N/A'}`;

    const telefoneMotorista = document.createElement('p');
    telefoneMotorista.className = 'motorista-telefone';
    telefoneMotorista.textContent = motorista.telefone || 'Telefone não disponível';

    cardContent.append(imageContainer, nomeMotorista, cpfMotorista, telefoneMotorista);

    // Botão para abrir os detalhes do motorista
    const botaoDetalhes = document.createElement('button');
    botaoDetalhes.className = 'botao-detalhes';
    botaoDetalhes.textContent = 'Ver Detalhes';
    // Adiciona evento para o clique no card
    cardContainer.addEventListener('click', () => {
        const motoristaId = cardContainer.getAttribute('data-id'); // Pega o ID do motorista do atributo data-id
        window.location.href = `detalhesMotorista.html?id=${motoristaId}`; // Redireciona para a página de detalhes com o ID
    });

    // Botão para adicionar à equipe
    const botaoAdicionarEquipe = document.createElement('button');
    botaoAdicionarEquipe.className = 'botao-adicionar-equipe';
    botaoAdicionarEquipe.textContent = 'Adicionar à Equipe';
    // Evento para quando o botão for clicado
    botaoAdicionarEquipe.addEventListener('click', (event) => {
        event.stopPropagation(); // Impede que o clique também ative o evento de clique no card
        const motoristaId = cardContainer.getAttribute('data-id');
        adicionarMotoristaEquipe(motoristaId); // Chama a função para adicionar o motorista à equipe
    });
    cardContent.appendChild(botaoDetalhes);
    cardContent.appendChild(botaoAdicionarEquipe);

    cardContainer.append(cardContent);

    return cardContainer;
};

// Função para carregar motoristas
const carregarMotoristas = async (id) => {
    const containerCards = document.getElementById('container-cards');
    if (!containerCards) {
        console.error('Elemento container-cards não encontrado!');
        return;
    }

    containerCards.innerHTML = ''; // Limpa o container antes de adicionar novos cards

    const loadingSpinner = document.createElement('div');
    loadingSpinner.className = 'loading-spinner';
    loadingSpinner.textContent = 'Carregando motoristas...';
    containerCards.appendChild(loadingSpinner);

    try {
        // Buscar motoristas sem equipe
        const motoristas = await getMotoristasSemEquipe(id);

        if (!motoristas || motoristas.length === 0) {
            containerCards.innerHTML = '<p>Nenhum motorista sem equipe encontrado.</p>';
            return;
        }

        console.log('Motoristas sem equipe carregados:', motoristas);
        motoristas.forEach(motorista => {
            const card = criarCardMotorista(motorista);
            containerCards.appendChild(card);
        });
    } catch (error) {
        console.error('Erro ao carregar motoristas:', error);
        containerCards.innerHTML = '<p>Erro ao carregar motoristas. Tente novamente mais tarde.</p>';
    } finally {
        if (loadingSpinner.parentNode) {
            loadingSpinner.parentNode.removeChild(loadingSpinner); // Remove o loading spinner corretamente
        }
    }
};

// Chamada para carregar motoristas ao carregar a página
window.addEventListener('DOMContentLoaded', async () => {
    const empresaId = localStorage.getItem('userId');
    if (empresaId) {
        await carregarMotoristas(empresaId);
    }
});
