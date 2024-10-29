import { getMotoristas } from "./funcoes.js";

/*********************
        CARDS DE MOTORISTAS
**********************/
const criarCardMotorista = (motorista) => {
    const cardContainer = document.createElement('div');
    cardContainer.className = 'motorista-card';

    const cardContent = document.createElement('div');
    cardContent.className = 'motorista-info';

    const imageContainer = document.createElement('div');
    imageContainer.className = 'motorista-image';
    const image = document.createElement('img');
    image.src = motorista.foto_url || '../css/img/default.png'; // Imagem padrão se não houver
    image.alt = `Foto de ${motorista.nome}`;
    image.className = 'motorista-image-img';
    imageContainer.appendChild(image);

    const nomeMotorista = document.createElement('h2');
    nomeMotorista.className = 'motorista-nome';
    nomeMotorista.textContent = motorista.nome;

    const cpfMotorista = document.createElement('p');
    cpfMotorista.className = 'motorista-cpf';
    cpfMotorista.textContent = `CPF: ${motorista.cpf}`;

    const telefoneMotorista = document.createElement('p');
    telefoneMotorista.className = 'motorista-telefone';
    telefoneMotorista.textContent = `Telefone: ${motorista.telefone}`;

    // Criar o botão de remover
    const removeButton = document.createElement('button');
    removeButton.className = 'remove-button';
    removeButton.textContent = 'Remover da Empresa';
    removeButton.onclick = () => {
        // Lógica para remover o motorista
        console.log(`Motorista ${motorista.nome} removido!`);
    };

    // Organizar o conteúdo e o botão em um contêiner flexível
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    buttonContainer.appendChild(removeButton);

    cardContent.append(imageContainer, nomeMotorista, cpfMotorista, telefoneMotorista, buttonContainer);
    cardContainer.append(cardContent);

    return cardContainer;
};



async function mostrarMotoristas() {
    const containerCards = document.getElementById('container-cards'); // Certifique-se de que este ID está correto
    containerCards.innerHTML = ''; // Limpa o container antes de adicionar novos cards

    try {
        const motoristas = await getMotoristas(); // Supondo que você tenha essa função para buscar motoristas
        motoristas.forEach(motorista => {
            const card = criarCardMotorista(motorista);
            containerCards.appendChild(card); // Adiciona o card ao container
        });
    } catch (error) {
        console.error('Erro ao carregar motoristas:', error);
    }
}

// Chame a função quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', mostrarMotoristas);
