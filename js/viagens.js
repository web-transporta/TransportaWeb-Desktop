import { getViagens, postViagem } from "./funcoes.js";

const openModalBtn = document.getElementById('openModal');
const modalBackground = document.getElementById('modalBackground');
const closeModalBtn = document.getElementById('closeModal');
const modalForm = document.querySelector('.modal-form'); // Seleciona o formulário dentro do modal

if (openModalBtn && modalBackground && closeModalBtn) {
    // Exibir o modal
    openModalBtn.addEventListener('click', () => {
        modalBackground.style.display = 'flex';
    });

    // Fechar o modal
    closeModalBtn.addEventListener('click', () => {
        modalBackground.style.display = 'none';
    });

    // Fechar o modal ao clicar fora da área do modal
    modalBackground.addEventListener('click', (e) => {
        if (e.target === modalBackground) {
            modalBackground.style.display = 'none';
        }
    });
} else {
    console.error('Um dos elementos do modal não foi encontrado no DOM.');
}

// Função para criar o container da viagem
const criarContainer = (viagem) => {
    const referenciar = document.createElement('button');
    referenciar.className = 'w-full flex items-center justify-center';
    referenciar.addEventListener('click', () => {
        localStorage.setItem('servicoId', viagem.id);
        window.location.href = '';
    });

    const container = document.createElement('div');
    container.className = '';

    const card = document.createElement('div');
    card.className = '';

    const id_viagem = document.createElement('h1');
    id_viagem.className = '';
    id_viagem.textContent = viagem.id_viagem;

    const remetente = document.createElement('p');
    remetente.className = '';
    remetente.textContent = viagem.remetente;

    const destinatario = document.createElement('p');
    destinatario.className = '';
    destinatario.textContent = viagem.destinatario;

    referenciar.appendChild(container);
    container.replaceChildren(card);
    card.replaceChildren(id_viagem, remetente, destinatario);

    card.addEventListener('click', () => {
        localStorage.setItem('viagemId', viagem.id);
    });

    return referenciar;
}

// Função para mostrar as viagens
async function mostrarContainer() {
    const containerCards = document.getElementById('container-cards');
    const viagens = await getViagens();

    viagens.forEach(viagem => {
        const card = criarContainer(viagem);
        containerCards.appendChild(card);
    });
}

async function criarViagem(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Coleta os dados do formulário
    const id_viagem = document.getElementById('id_viagem').value;
    const dia_partida = document.getElementById('dia_partida').value;
    const horario_partida = document.getElementById('horario_partida').value;
    const dia_chegada = document.getElementById('dia_chegada').value;
    const remetente = document.getElementById('remetente').value;
    const destinatario = document.getElementById('destinatario').value;
    const status_entregue = document.getElementById('status_entregue').value;
    const id_partida = document.getElementById('id_partida').value;
    const id_destino = document.getElementById('id_destino').value;
    const id_motorista = document.getElementById('id_motorista').value; // Opcional
    const id_veiculo = document.getElementById('id_veiculo').value; // ID do caminhão digitado

    const novaViagem = {
        id_viagem,
        dia_partida,
        horario_partida,
        dia_chegada,
        remetente,
        destinatario,
        status_entregue,
        id_partida,
        id_destino,
        id_motorista: id_motorista || null, // Se não houver motorista, envia null
        id_veiculo, // ID do caminhão digitado
    };
    console.log(novaViagem)

    try {
        const response = await postViagem(novaViagem); // Chame sua função postViagem
        // Agora você pode verificar o status da resposta
        if (response.status === 200) {
            // Fechar o modal
            modalBackground.style.display = 'none';

            // Mostrar um alerta de sucesso
            await Swal.fire({
                title: 'Sucesso!',
                text: 'Viagem criada com sucesso!',
                icon: 'success',
                confirmButtonText: 'OK',
                backdrop: true,
            });
        } else {
            throw new Error('Erro ao criar a viagem.');
        }
    } catch (error) {
        console.error('Erro ao criar viagem:', error);
        
        // Mostrar um alerta de erro estilizado
        await Swal.fire({
            title: 'Erro!',
            text: 'Ocorreu um erro ao criar a viagem. Tente novamente.',
            icon: 'error',
            confirmButtonText: 'OK',
            backdrop: true,
        });
    }
}
// Adiciona o evento de envio ao formulário
if (modalForm) {
    modalForm.addEventListener('submit', criarViagem);
}

// Chama a função para mostrar as viagens
mostrarContainer();
