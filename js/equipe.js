import { getMotoristasEmEquipes, getEmpresa, getMotoristas } from './funcoes.js'; // Certifique-se de ter essas funções implementadas corretamente.

// Função para obter as avaliações dos motoristas
async function getMotoristasAvaliacoes(cpf) {
    try {
        const response = await fetch('https://crud-03-09.onrender.com/v1/transportaweb/motorista_avaliacoes');
        if (response.ok) {
            const data = await response.json();
            // Encontre a avaliação do motorista com base no CPF
            const avaliacao = data.motoristas_avaliacoes.find(avaliacao => avaliacao.id_motorista === cpf);
            return avaliacao ? avaliacao.id_avaliacao : 0; // Se houver avaliação, retorna a quantidade de estrelas, caso contrário, retorna 0
        } else {
            console.error("Erro ao obter avaliações:", response.statusText);
            return 0; // Retorna 0 estrelas caso a requisição falhe
        }
    } catch (error) {
        console.error("Erro de rede ao obter avaliações:", error);
        return 0; // Retorna 0 estrelas em caso de erro
    }
}

async function renderMotoristaCards() {
    const id = localStorage.getItem('userId');
    if (!id) {
        console.error('ID do usuário não encontrado no localStorage.');
        return;
    }

    const cardContainer = document.getElementById('card-container');

    if (!cardContainer) {
        console.error('Elemento card-container não encontrado!');
        return;
    }

    try {
        // Buscar os motoristas da equipe
        const motoristasEquipe = await getMotoristasEmEquipes(id);

        // Buscar todos os motoristas para obter informações completas (email, etc)
        const todosMotoristas = await getMotoristas();

        cardContainer.innerHTML = ''; // Limpa os cards anteriores.

        for (const motoristaEquipe of motoristasEquipe) {
            // Encontrar o motorista completo com base no CPF
            const motoristaCompleto = todosMotoristas.find(motorista => motorista.cpf === motoristaEquipe.cpf);

            if (motoristaCompleto) {
                const card = document.createElement('div');
                card.classList.add('driver-card');

                // Pega a avaliação do motorista
                const numEstrelas = await getMotoristasAvaliacoes(motoristaEquipe.cpf);

                // Gera as estrelas, cinzas se não houver avaliação
                const estrelas = '★'.repeat(numEstrelas) + '☆'.repeat(5 - numEstrelas); // 5 estrelas no total, preencher com cinzas se necessário.

                card.innerHTML = `
                    <div class="profile-image" style="background-image: url(${motoristaEquipe.foto_url || 'default-image-url.jpg'});"></div>
                    <div class="card-content">
                        <div class="header">
                            <h2>${motoristaEquipe.nome_motorista}</h2>
                            <a href="./detalhesMotorista.html?cpf=${motoristaEquipe.cpf}" class="view-profile">Visualizar Perfil</a>
                        </div>
                        <div class="stars">
                            ${estrelas}
                        </div>
                        <div class="contact-info">
                            <div class="info-icons">
                                <img src="../css/img/email.png" alt="email" height="20px">
                                <p><strong>Email:</strong> ${motoristaCompleto.email}</p>
                            </div>
                            <div class="info-icons">
                                <img src="../css/img/telefone.png" alt="telefone" height="20px">
                                <p><strong>Telefone:</strong> ${motoristaEquipe.telefone}</p>
                            </div>
                        </div>
                        <div class="actions">
                            <button class="remove" data-id="${motoristaCompleto.id}">Retirar da equipe</button>
                            <button class="request" data-cpf="${motoristaEquipe.cpf}">Solicitar Corrida</button>
                        </div>
                    </div>
                `;

                cardContainer.appendChild(card);
            }
        }

        // Adiciona o evento de click para o botão "Retirar da equipe"
        const removeButtons = document.querySelectorAll('.remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                const idMotorista = event.target.getAttribute('data-id');
                const idEmpresa = localStorage.getItem('userId');

                if (idMotorista && idEmpresa) {
                    await retirarMotoristaDaEquipe(idMotorista, idEmpresa); // Usar o ID do motorista para deletar
                } else {
                    alert('Dados incompletos para retirar motorista da equipe.');
                }
            });
        });

    } catch (error) {
        console.error('Erro ao renderizar os motoristas:', error);
    }
}

// Função para retirar o motorista da equipe
async function retirarMotoristaDaEquipe(idMotorista, idEmpresa) {
    try {
        const response = await fetch('https://crud-03-09.onrender.com/v1/transportaweb/deleteequipe', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_motorista: idMotorista,  // Usando o ID aqui para deletar
                id_empresa: idEmpresa
            })
        });

        const result = await response.json();

        if (result.status) {
            alert('Motorista retirado da equipe com sucesso!');
            renderMotoristaCards(); // Recarrega a lista de motoristas após a remoção
        } else {
            alert(`Erro: ${result.message}`);
        }

    } catch (error) {
        console.error('Erro ao remover motorista da equipe:', error);
        alert('Ocorreu um erro ao tentar retirar o motorista da equipe.');
    }
}

async function carregarEmpresa() {
    const id = localStorage.getItem('userId');
    if (!id) {
        alert('ID da empresa não encontrado. Por favor, faça login novamente.');
        window.location.href = '/html/login.html'; 
        return;
    }

    try {
        // Buscar dados da empresa
        const empresas = await getEmpresa(id);
        if (!empresas || empresas.length === 0) {
            alert('Empresa não encontrada!');
            return;
        }

        // Atualizar informações da empresa no cabeçalho
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
            document.getElementById('foto-url').src = '/path/to/default-image.jpg';
        }

        // Carregar motoristas
        await renderMotoristaCards();

    } catch (error) {
        console.error('Erro ao carregar dados da empresa:', error);
        alert('Erro ao carregar dados da empresa: ' + error.message);
    }
}

document.addEventListener('DOMContentLoaded', carregarEmpresa);
