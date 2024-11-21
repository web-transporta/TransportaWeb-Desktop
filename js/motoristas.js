import { getMotoristas, getMotoristaNome, getEmpresa, getMotoristasEquipe, getMotoristasSemEquipe } from "./funcoes.js"; 

window.addEventListener('DOMContentLoaded', async () => {
    const id = localStorage.getItem('userId');

    if (!id) {
        alert('ID da empresa não encontrado. Por favor, faça login novamente.');
        window.location.href = '/html/login.html'; 
        return;
    }

    try {
        const empresas = await getEmpresa(id); 
        console.log('Dados da empresa:', empresas);

        if (empresas.length > 0 && empresas[0].nome) {
            document.getElementById('empresaNome').textContent = `${empresas[0].nome}!`;

            if (empresas[0].foto_url) {
                const empresaImagem = document.getElementById('foto-url');
                if (empresaImagem) {
                    empresaImagem.src = empresas[0].foto_url;
                    empresaImagem.alt = empresas[0].nome;
                } else {
                    console.error('Elemento de imagem não encontrado.');
                }
            } else {
                console.warn('Imagem não encontrada para a empresa:', empresas[0]);
                document.getElementById('empresaImagem').src = '/path/to/default-image.jpg';
            }
        } else {
            console.warn('Estrutura inesperada ou nome ausente:', empresas);
            document.getElementById('empresaNome').textContent = 'Empresa não encontrada';
        }

    } catch (error) {
        console.error('Erro ao buscar a empresa:', error);
        alert('Erro ao carregar dados da empresa: ' + error.message);
    }
});

// Função para criar os cards dos motoristas
const criarCardMotorista = (motorista) => {
    const cardContainer = document.createElement('div');
    cardContainer.className = 'motorista-card';

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
    nomeMotorista.textContent = motorista.nome || motorista.nome_motorista; // Trata ambas as opções

    const cpfMotorista = document.createElement('p');
    cpfMotorista.className = 'motorista-cpf';
    cpfMotorista.textContent = `CPF: ${motorista.cpf}`;

    const telefoneMotorista = document.createElement('p');
    telefoneMotorista.className = 'motorista-telefone';
    telefoneMotorista.textContent = `Telefone: ${motorista.telefone}`;

    cardContent.append(imageContainer, nomeMotorista, cpfMotorista, telefoneMotorista);
    cardContainer.append(cardContent);

    return cardContainer;
};

// Função para carregar motoristas com base no estado do botão
const carregarMotoristas = async () => {
    const containerCards = document.getElementById('container-cards');
    containerCards.innerHTML = ''; // Limpa o container antes de adicionar novos cards

    const loadingSpinner = document.createElement('div');
    loadingSpinner.className = 'loading-spinner';
    loadingSpinner.textContent = 'Carregando motoristas...';
    containerCards.appendChild(loadingSpinner);

    try {
        let motoristas;

        // Verifica o estado do botão (esquerda ou direita)
        if (toggleBtn.classList.contains('left')) {
            console.log('Carregando motoristas da equipe...');
            motoristas = await getMotoristasSemEquipe();
        } else {
            console.log('Carregando todos os motoristas...');
            motoristas = await getMotoristasEquipe(id);


        }

        console.log('Motoristas carregados:', motoristas);

        motoristas.forEach(motorista => {
            const card = criarCardMotorista(motorista);
            containerCards.appendChild(card);
        });
    } catch (error) {
        console.error('Erro ao carregar motoristas:', error);
    } finally {
        containerCards.removeChild(loadingSpinner);
    }
};

// Configuração do botão toggle
const toggleBtn = document.querySelector('.toggle-btn');

toggleBtn.addEventListener('click', async () => {
    toggleBtn.classList.toggle('left');
    toggleBtn.classList.toggle('right');

    await carregarMotoristas(); 
});

// Carregar motoristas ao carregar a página
document.addEventListener('DOMContentLoaded', async () => {
    await carregarMotoristas(); 
});
