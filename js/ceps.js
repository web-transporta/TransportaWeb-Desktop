import { getPartida, insertPartida } from "./funcoes.js";
document.addEventListener('DOMContentLoaded', async () => {
    const cepSelect = document.getElementById('selectCep');
    const ruaInput = document.getElementById('rua');
    const bairroInput = document.getElementById('bairro');
    const cidadeInput = document.getElementById('cidade');
    const estadoInput = document.getElementById('estado');
    const paisInput = document.getElementById('pais');
    const modalCep = document.getElementById('modalCep');
    const btnAdicionarCep = document.getElementById('adicionarCep');
    const novoCepInput = document.getElementById('novoCep');
    const salvarCepBtn = document.getElementById('salvarCep');

    paisInput.value = "Brasil";

    // Função para limpar os campos de endereço
    const limparCampos = () => {
        ruaInput.value = '';
        bairroInput.value = '';
        cidadeInput.value = '';
        estadoInput.value = '';
    };

    // Função para preencher o select com os CEPs retornados do banco
    const preencherSelectCeps = async () => {
        try {
            const empresas = await getPartida(); // Chamando a função que retorna o JSON com os CEPs
            console.log("Empresas recebidas:", empresas);

            if (empresas && empresas.length > 0) {
                // Limpando opções existentes antes de adicionar novas
                cepSelect.innerHTML = '<option value="">Selecione um CEP</option>';

                empresas.forEach(empresa => {
                    // Verificando se a empresa tem o campo cep
                    if (empresa.cep) {
                        const option = document.createElement('option');
                        option.value = empresa.cep; // Valor do CEP
                        option.textContent = empresa.cep; // Texto visível no <select>
                        cepSelect.appendChild(option);
                    }
                });

                console.log("Select preenchido corretamente");
            } else {
                Swal.fire('Erro', 'Nenhum CEP encontrado.', 'error');
            }
        } catch (error) {
            Swal.fire('Erro', 'Erro ao carregar os CEPs. Verifique a conexão com o banco.', 'error');
            console.error('Erro ao preencher select:', error);
        }
    };

    // Função para buscar informações de endereço com base no CEP
    const buscarEnderecoPorCep = async (cep) => {
        if (cep.length === 8 || cep.length === 9) { // Aceitar CEPs com 8 ou 9 caracteres
            Swal.fire({
                title: 'Carregando...',
                html: 'Buscando informações...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                if (!response.ok) throw new Error('CEP não encontrado');

                const data = await response.json();
                if (data.erro) {
                    Swal.fire('Erro', 'CEP não encontrado.', 'error');
                    limparCampos();
                    return;
                }

                ruaInput.value = data.logradouro || '';
                bairroInput.value = data.bairro || '';
                cidadeInput.value = data.localidade || '';
                estadoInput.value = data.uf || '';

                Swal.fire('Sucesso', 'Informações do CEP carregadas!', 'success');
            } catch (error) {
                Swal.fire('Erro', 'Erro ao buscar o CEP. Verifique a conexão ou o CEP informado.', 'error');
                limparCampos();
            }
        } else {
            Swal.fire('Atenção', 'Por favor, insira um CEP válido com 8 ou 9 caracteres, incluindo o traço.', 'warning');
        }
    };

    // Preencher o select quando a página for carregada
    await preencherSelectCeps();

    // Evento para buscar o CEP selecionado no <select>
    cepSelect.addEventListener('change', (event) => {
        const cep = event.target.value.replace(/\D/g, ''); // Garantir que o CEP tenha apenas números
        if (cep) {
            buscarEnderecoPorCep(cep); // Busca as informações do CEP no ViaCEP
        } else {
            limparCampos(); // Limpa os campos se o CEP for vazio
        }
    });

    // Evento para buscar o CEP digitado no input
    const cepInput = document.querySelector('input[name="cep"]');
    cepInput.addEventListener('input', (event) => {
        const cep = event.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
        if (cep.length === 8 || cep.length === 9) {
            buscarEnderecoPorCep(cep); // Chama a função para buscar o endereço
        } else {
            limparCampos(); // Limpa os campos se o CEP não tiver 8 ou 9 caracteres
        }
    });

    // Função para abrir o modal de adicionar novo CEP
    btnAdicionarCep.addEventListener('click', (e) => {
        e.preventDefault(); // Impede o envio do formulário
        modalCep.style.display = 'block'; // Abre o modal
    });

    // Função para fechar o modal
    const fecharModal = () => {
        modalCep.style.display = 'none';
        novoCepInput.value = ''; // Limpa o input do novo CEP
    };

    // Evento para fechar o modal ao clicar no X
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
        closeModal.addEventListener('click', fecharModal);
    }

    // Função para salvar o novo CEP, permitindo o formato com traço
    salvarCepBtn.addEventListener('click', async () => {
        const novoCep = novoCepInput.value.trim(); // Mantém o traço no CEP
        if (novoCep.length === 9 || novoCep.length === 8) { // Verifica se o CEP tem 8 ou 9 caracteres
            try {
                // Envia somente o CEP
                const success = await insertPartida({ cep: novoCep }); // Envia apenas o CEP
                if (success) {
                    Swal.fire('Sucesso', 'Novo CEP adicionado com sucesso!', 'success');
                    modalCep.style.display = 'none'; // Fecha o modal
                    preencherSelectCeps(); // Atualiza o select com o novo CEP
                }
            } catch (error) {
                Swal.fire('Erro', 'Erro ao adicionar o CEP. Tente novamente.', 'error');
            }
        } else {
            Swal.fire('Atenção', 'Por favor, insira um CEP válido com 8 ou 9 caracteres, incluindo o traço.', 'warning');
        }
    });

    // Evento para limpar o input ao focar no select
    cepSelect.addEventListener('focus', () => {
        cepInput.value = ''; // Limpa o input ao focar no select
    });

    // Evento para limpar o select ao focar no input
    cepInput.addEventListener('focus', () => {
        cepSelect.value = ''; // Limpa o select ao focar no input
    });
});
