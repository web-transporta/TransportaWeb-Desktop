import { getMotoristas, getMotoristaNome } from "./funcoes.js"; // Adicione a função para remover motorista

/****************************************
        CARDS DE MOTORISTAS
*****************************************/
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
    removeButton.textContent = 'Remover da Equipe';
    removeButton.onclick = async () => {
        const confirmed = await Swal.fire({
            title: 'Você tem certeza?',
            text: `Deseja remover o motorista ${motorista.nome}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, remover!',
            cancelButtonText: 'Não, cancelar'
        });

        if (confirmed.isConfirmed) {
            try {
                await removerMotoristaAPI(motorista.id); // Chame a função para remover o motorista na API
                await Swal.fire({
                    title: 'Removido!',
                    text: `Motorista ${motorista.nome} removido com sucesso.`,
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                await mostrarMotoristas(); // Atualiza a lista de motoristas
            } catch (error) {
                console.error('Erro ao remover motorista:', error);
                await Swal.fire({
                    title: 'Erro!',
                    text: 'Não foi possível remover o motorista. Tente novamente.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    };

    // Organizar o conteúdo e o botão em um contêiner flexível
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    buttonContainer.appendChild(removeButton);

    cardContent.append(imageContainer, nomeMotorista, cpfMotorista, telefoneMotorista, buttonContainer);
    cardContainer.append(cardContent);

    return cardContainer;
};

// Função para mostrar motoristas
async function mostrarMotoristas() {
    const containerCards = document.getElementById('container-cards'); 
    containerCards.innerHTML = ''; // Limpa o container antes de adicionar novos cards

    const loadingSpinner = document.createElement('div');
    loadingSpinner.className = 'loading-spinner'; // Crie uma classe CSS para estilizar o indicador de carregamento
    loadingSpinner.textContent = 'Carregando motoristas...';
    containerCards.appendChild(loadingSpinner); // Exibe o indicador de carregamento

    try {
        const motoristas = await getMotoristas(); 
        console.log("Motoristas carregados:", motoristas); // Verifique os motoristas carregados
        motoristas.forEach(motorista => {
            const card = criarCardMotorista(motorista);
            console.log("Card criado:", card); // Verifique se o card é criado
            containerCards.appendChild(card); 
        });
    } catch (error) {
        console.error('Erro ao carregar motoristas:', error);
    } finally {
        containerCards.removeChild(loadingSpinner); // Remove o indicador de carregamento
    }
}

// Função para buscar motorista por nome
async function pesquisarMotorista(nome) {
    const containerCards = document.getElementById('container-cards');
    containerCards.innerHTML = ''; // Limpa o container

    const loadingSpinner = document.createElement('div');
    loadingSpinner.className = 'loading-spinner'; // Crie uma classe CSS para estilizar o indicador de carregamento
    loadingSpinner.textContent = 'Pesquisando motoristas...';
    containerCards.appendChild(loadingSpinner); // Exibe o indicador de carregamento

    try {
        const resultado = await getMotoristaNome(nome);
        console.log("Resultado da pesquisa:", resultado); // Log da resposta

        // Verifique se o resultado é um array e se não está vazio
        const motoristas = Array.isArray(resultado) && resultado.length > 0 ? resultado : []; // Altere aqui

        if (motoristas.length > 0) {
            // Exibe todos os motoristas encontrados
            motoristas.forEach(motorista => {
                const card = criarCardMotorista(motorista); // Cria o card
                containerCards.appendChild(card); // Adiciona o card ao contêiner
            });
        } else {
            await Swal.fire({
                title: 'Nenhum motorista encontrado',
                text: 'Verifique o nome do motorista e tente novamente.',
                icon: 'info',
                confirmButtonText: 'OK',
            });
        }
    } catch (error) {
        console.error('Erro ao obter motoristas:', error);
    } finally {
        containerCards.removeChild(loadingSpinner); // Remove o indicador de carregamento
    }
}


// Event listener para a pesquisa
document.addEventListener('DOMContentLoaded', async () => {
    const pesquisaInput = document.getElementById('pesquisa'); 
    console.log("Elemento de pesquisa encontrado:", pesquisaInput); 

    if (pesquisaInput) {
        let pesquisaTimeout;

        pesquisaInput.addEventListener('input', () => {
            clearTimeout(pesquisaTimeout);
            pesquisaTimeout = setTimeout(async () => {
                const nome = pesquisaInput.value.trim();
                console.log("Nome pesquisado:", nome); // Log do nome pesquisado
                if (nome.length > 0) {
                    await pesquisarMotorista(nome); // Chama a função de pesquisa
                } else {
                    await mostrarMotoristas(); // Se o campo estiver vazio, mostra todos os motoristas
                }
            }, 300); 
        });
    }

    // Chame a função para mostrar motoristas ao carregar a página
    await mostrarMotoristas(); // Adicione 'await' aqui para garantir que os motoristas sejam mostrados
});
