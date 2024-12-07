import { getViagens, postViagem, getVeiculos, getPartida, getDestino, getMotoristas, getViagemByNome, editPerfilEmpresa, getMotorista, getViagem, getPartidaById, getDestinoById, getVeiculoById, getCarga,getCargas, getEmpresa,getEmpresas, getEmpresaViagens, putViagem } from "./funcoes.js";

window.addEventListener('DOMContentLoaded', async () => {
   const id = localStorage.getItem('userId'); // Recupera o ID da empresa do localStorage

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
           document.getElementById('empresaNome').textContent = `${empresas[0].nome}!`;

           // Verifica se existe uma URL de imagem e se a chave 'foto_url' está presente
           if (empresas[0].foto_url) {
               const empresaImagem = document.getElementById('foto-url');
               if (empresaImagem) { // Verifica se o elemento realmente existe
                   empresaImagem.src = empresas[0].foto_url; // Define o src da imagem com a URL retornada
                   empresaImagem.alt = empresas[0].nome; // Define o texto alternativo da imagem
               } else {
                   console.error('Elemento de imagem não encontrado.');
               }
           } else {
               console.warn('Imagem não encontrada para a empresa:', empresas[0]);
               document.getElementById('empresaImagem').src = '/path/to/default-image.jpg'; // Caminho da imagem padrão
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
    
        // Recupera o ID da empresa do localStorage
        const idEmpresa = localStorage.getItem('userId');
        console.log(idEmpresa);
        // Se o ID da empresa não estiver no localStorage, exibe um erro
        if (!idEmpresa) {
            Swal.fire({
                title: 'Erro!',
                text: 'ID da empresa não encontrado no localStorage.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }
    
        // Verifica se o motorista foi selecionado corretamente
        const id_motorista = idMotoristaSelect?.value || null;
        if (!id_motorista) {
            Swal.fire({
                title: 'Erro!',
                text: 'Por favor, selecione um motorista.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }
    
        // Prepara os dados da nova viagem, incluindo o id_empresa
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
            id_motorista: id_motorista, // Garantindo que o valor do motorista seja válido
            id_veiculo: idVeiculoSelect?.value || '',
            id_tipo_carga: idCargaSelect?.value || '',
            id_empresa: idEmpresa // Adiciona o ID da empresa ao objeto novaViagem
        };
        console.log(novaViagem);
    
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

   async function mostrarDetalhesViagem(id_viagem) {
       try {
           // Requisição para buscar os detalhes da viagem pelo id_viagem
           const resposta = await getViagemByNome(id_viagem);
           console.log('Resposta da API:', resposta);
           
           if (!resposta || resposta.length === 0) {
               throw new Error('Viagem não encontrada');
           }
   
           const viagem = resposta[0];  // Acessar o primeiro item do array
           
           // Verificar se o ID da viagem está correto
           console.log('ID da viagem:', viagem.id_viagem);
           
           // Função para formatar a data para o formato yyyy-MM-dd
           function formatarDataParaDateInput(data) {

               const [ano, mes, dia] = data.split('T')[0].split('-');
               return `${ano}-${mes}-${dia}`;
           }
   
           // Preencher os dados no modal de detalhes
           const detalhesViagem = document.getElementById('detalhesViagem');
           detalhesViagem.innerHTML = `
               <p><strong>ID Viagem:</strong> <input type="text" id="id_viagem" value="${viagem.id_viagem}" disabled></p>
               <p><strong>Remetente:</strong> <input type="text" id="remetente" value="${viagem.remetente}" disabled></p>
               <p><strong>Destinatário:</strong> <input type="text" id="destinatario" value="${viagem.destinatario}" disabled></p>
               <p><strong>Data de Partida:</strong> <input type="date" id="dia_partida" value="${formatarDataParaDateInput(viagem.dia_partida)}" disabled></p>
               <p><strong>Horário de Partida:</strong> <input type="time" id="horario_partida" value="${new Date(viagem.horario_partida).toISOString().substr(11, 5)}" disabled></p>
               <p><strong>Status Entregue:</strong> <input type="checkbox" id="status_entregue" ${viagem.status_entregue ? 'checked' : ''} disabled></p>
               <p><strong>Partida (CEP):</strong> ${viagem.partida_cep || 'Não encontrado'}</p>
               <p><strong>Destino (CEP):</strong> ${viagem.destino_cep || 'Não encontrado'}</p>
               <p><strong>Motorista:</strong> ${viagem.motorista_nome || 'Freelancer'}</p>
               <p><strong>Veículo:</strong> ${viagem.veiculo_modelo || 'Não encontrado'}</p>
               <p><strong>Carga:</strong> ${viagem.tipo_carga_nome || 'Não encontrado'}</p>
           `;
   
           // Exibe o modal
           modalDetalhes.style.display = 'flex';
   
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
       modalDetalhes.style.display = 'none';
   };
   
   window.onclick = (event) => {
       if (event.target === modalDetalhes) {
           modalDetalhes.style.display = 'none';
       }
   };
   
/*********************
   FUNÇÕES DE EDIÇÃO E EXCLUSÃO
*********************/
/*********************
   FUNÇÕES DE EDIÇÃO E EXCLUSÃO
*********************/

// Lista global de IDs dos campos que podem ser editados
const camposEdicao = [
   'id_viagem', 'dia_partida', 'horario_partida', 'dia_chegada',
   'remetente', 'destinatario', 'status_entregue',
   'id_partida', 'id_destino', 'id_motorista', 'id_veiculo', 'id_carga'
];

// Função para habilitar edição de um campo específico ao ser clicado
function habilitarCampoEdicao(campoId) {
   const campo = document.getElementById(campoId);
   if (campo) {
       campo.disabled = false; // Habilita o campo para edição
       console.log(`Campo ${campoId} habilitado para edição.`);
   } else {
       console.log(`Campo não encontrado: ${campoId}`);
   }
}

// Função para habilitar edição dos campos quando clicar no botão "Editar"
function habilitarEdicao() {
   console.log("Função habilitarEdicao chamada");

   camposEdicao.forEach(campoId => {
       const campo = document.getElementById(campoId);
       if (campo) {
           console.log(`Habilitando o campo: ${campoId}`);
           campo.disabled = false; // Habilita o campo para edição
       } else {
           console.log(`Campo não encontrado: ${campoId}`);
       }
   });

   // Atualiza o botão de "Editar" para "Salvar" ao habilitar edição
   const botaoEditar = document.getElementById('editarViagemBtn');
   if (botaoEditar) {
       console.log("Botão Editar alterado para Salvar");
       botaoEditar.textContent = 'Salvar';
       botaoEditar.onclick = salvarEdicao; // Altera função do botão para salvar a edição
   }
}

// Função para salvar as edições feitas
async function salvarEdicao() {
   const idViagem = document.getElementById('id_viagem')?.value || '';

   // Verificar se o ID da viagem está correto
   if (!idViagem) {
       Swal.fire({
           title: 'Erro!',
           text: 'ID da viagem não encontrado ou inválido.',
           icon: 'error',
           confirmButtonText: 'OK',
       });
       console.error('ID da viagem não encontrado ou inválido');
       return;
   }

   // Log para depuração
   console.log('ID da viagem para salvar:', idViagem);

   const viagemEditada = {
       id_viagem: idViagem,
       dia_partida: document.getElementById('dia_partida')?.value || '',
       horario_partida: document.getElementById('horario_partida')?.value || '',
       dia_chegada: document.getElementById('dia_chegada')?.value || '',
       remetente: document.getElementById('remetente')?.value || '',
       destinatario: document.getElementById('destinatario')?.value || '',
       status_entregue: document.getElementById('status_entregue')?.checked || false,
       id_partida: document.getElementById('id_partida')?.value || '',
       id_destino: document.getElementById('id_destino')?.value || '',
       id_motorista: document.getElementById('id_motorista')?.value || '',
       id_veiculo: document.getElementById('id_veiculo')?.value || '',
       id_carga: document.getElementById('id_carga')?.value || ''
   };

   // Verificação de dados antes de enviar
   console.log('Dados da viagem editada:', viagemEditada);

   // Enviar os dados para o backend
   try {
       const response = await putViagem(viagemEditada); // Chama a função de PUT para salvar a viagem editada
       if (response.status === 200) {
           Swal.fire({
               title: 'Sucesso!',
               text: 'As alterações foram salvas.',
               icon: 'success',
               confirmButtonText: 'OK',
           });
           console.log('Viagem editada com sucesso!');
       } else {
           throw new Error('Erro ao salvar a edição.');
       }
   } catch (error) {
       console.error('Erro ao salvar edição:', error);
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
       botaoEditar.onclick = habilitarEdicao; // Restaura a função original de "Editar"
   }
}

// Adicionando listeners para habilitar edição nos campos ao clicar
camposEdicao.forEach(campoId => {
   const campo = document.getElementById(campoId);
   if (campo) {
       campo.addEventListener('click', () => habilitarCampoEdicao(campoId));
   }
});

// Certifique-se de que o botão de edição no modal de detalhes tenha o ID "editarViagemBtn"
document.getElementById('editarViagemBtn').onclick = habilitarEdicao;


/* Função de Excluir Viagem (Caso necessário)
async function excluirViagem(idViagem) {
   try {
       const response = await excluirViagem(idViagem); // Substitua deleteViagem pela função de exclusão que você usa
       if (response.status === 200) {
           Swal.fire({
               title: 'Sucesso!',
               text: 'Viagem excluída com sucesso.',
               icon: 'success',
               confirmButtonText: 'OK',
           });
           // Fechar o modal ou redirecionar para outra página, se necessário
           modalDetalhes.style.display = 'none';
       } else {
           throw new Error('Erro ao excluir a viagem.');
       }
   } catch (error) {
       Swal.fire({
           title: 'Erro!',
           text: 'Não foi possível excluir a viagem. Tente novamente.',
           icon: 'error',
           confirmButtonText: 'OK',
       });
   }
}
excluirViagem() */

   /*********************
       CARDS DE VIAGENS
   **********************/
       const criarContainer = (viagem) => {
           const referenciar = document.createElement('button');
           referenciar.className = 'botao';
           // Passa o id_viagem ao clicar no card
           referenciar.onclick = () => mostrarDetalhesViagem(viagem.id_viagem); // Passando o id_viagem para a função
       
           const container = document.createElement('div');
           container.className = 'trip-card';
           const cardContent = document.createElement('div');
           cardContent.className = 'trip-info';
       
           const id_viagem = document.createElement('h1');
           id_viagem.className = 'trip-title';
           id_viagem.textContent = "# " + viagem.id_viagem;
       
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

           const data_chegada = new Date(viagem.dia_chegada);
           const formattedDate2 = data_chegada.toISOString().split('T')[0];
           const data_chegada_paragraph = document.createElement('p');
           data_chegada_paragraph.className = 'trip-data';
           data_chegada_paragraph.textContent = `Data: ${formattedDate2 || 'N/A'}`;

       
           cardContent.append(id_viagem, remetente, destinatario, data_partida_paragraph, data_chegada_paragraph);
       
           const imageContainer = document.createElement('div');
           imageContainer.className = 'trip-image';
           const image = document.createElement('img');
           image.src = viagem.image || '../css/img/caixaV.png';
           image.alt = 'Imagem do caminhão';
           image.className = 'trip-image-img';
           imageContainer.appendChild(image);
       
           container.append(cardContent, imageContainer);
           referenciar.appendChild(container);
           return referenciar;
       };
       

   async function mostrarContainer() {

       const id = localStorage.getItem('userId');
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
       option.value = motorista.id;
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


// // Lista global de IDs dos campos que podem ser editados
// const camposEdicao = [
//     'id_viagem', 'dia_partida', 'horario_partida', 'dia_chegada',
//     'remetente', 'destinatario', 'status_entregue',
//     'id_partida', 'id_destino', 'id_motorista', 'id_veiculo', 'id_carga'
// ];

// // Função para habilitar edição
// function habilitarEdicao() {
//     camposEdicao.forEach(campoId => {
//         const campo = document.getElementById(campoId);
//         if (campo) {
//             campo.disabled = false; // Habilita o campo para edição
//         }
//     });

//     // Atualiza o botão de "Editar" para "Salvar" ao habilitar edição
//     const botaoEditar = document.getElementById('editarViagemBtn');
//     if (botaoEditar) {
//         botaoEditar.textContent = 'Salvar';
//         botaoEditar.onclick = salvarEdicao; // Altera função do botão para salvar a edição
//     }
// }

// // Função para salvar alterações feitas no modal
// async function salvarEdicao() {
//     // Obter dados dos campos atualizados para salvar as alterações
//     const viagemEditada = {
//         id_viagem: document.getElementById('id_viagem')?.value || '',
//         dia_partida: document.getElementById('dia_partida')?.value || '',
//         horario_partida: document.getElementById('horario_partida')?.value || '',
//         dia_chegada: document.getElementById('dia_chegada')?.value || '',
//         remetente: document.getElementById('remetente')?.value || '',
//         destinatario: document.getElementById('destinatario')?.value || '',
//         status_entregue: document.getElementById('status_entregue')?.value || '',
//         id_partida: document.getElementById('id_partida')?.value || '',
//         id_destino: document.getElementById('id_destino')?.value || '',
//         id_motorista: document.getElementById('id_motorista')?.value || null,
//         id_veiculo: document.getElementById('id_veiculo')?.value || '',
//         id_carga: document.getElementById('id_carga')?.value || ''
//     };

//     // Enviar os dados para o backend (adapte para a função de atualização que você usa)
//     try {
//         const response = await postViagem(viagemEditada); // Substitua postViagem por uma função de atualização, se houver
//         if (response.status === 200) {
//             Swal.fire({
//                 title: 'Sucesso!',
//                 text: 'As alterações foram salvas.',
//                 icon: 'success',
//                 confirmButtonText: 'OK',
//             });
//         } else {
//             throw new Error('Erro ao salvar a edição.');
//         }
//     } catch (error) {
//         Swal.fire({
//             title: 'Erro!',
//             text: 'Ocorreu um erro ao salvar as alterações. Tente novamente.',
//             icon: 'error',
//             confirmButtonText: 'OK',
//         });
//     }

//     // Desativa a edição após salvar e restaura o botão de "Salvar" para "Editar"
//     camposEdicao.forEach(campoId => {
//         const campo = document.getElementById(campoId);
//         if (campo) {
//             campo.disabled = true; // Desabilita o campo novamente
//         }
//     });

//     const botaoEditar = document.getElementById('editarViagemBtn');
//     if (botaoEditar) {
//         botaoEditar.textContent = 'Editar';
//         botaoEditar.onclick = habilitarEdicao; // Restaura função original de "Editar"
//     }
// }

// // Certifique-se de que o botão de edição no modal de detalhes tenha o ID "editarViagemBtn"
// document.getElementById('editarViagemBtn').onclick = habilitarEdicao;