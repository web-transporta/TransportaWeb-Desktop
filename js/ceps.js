document.addEventListener('DOMContentLoaded', () => {
    const cepInput = document.getElementById('cep');
    const ruaInput = document.getElementById('rua');
    const bairroInput = document.getElementById('bairro');
    const cidadeInput = document.getElementById('cidade');
    const estadoInput = document.getElementById('estado');
    const paisInput = document.getElementById('pais');

    paisInput.value = "Brasil";

    // Função para limpar os campos de endereço
    const limparCampos = () => {
        ruaInput.value = '';
        bairroInput.value = '';
        cidadeInput.value = '';
        estadoInput.value = '';
    };

    // Evento para buscar o CEP quando Enter é pressionado
    cepInput.addEventListener('keypress', async (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const cep = cepInput.value.replace(/\D/g, '');

            if (cep.length === 8) {
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
                        return;
                    }

                    ruaInput.value = data.logradouro || '';
                    bairroInput.value = data.bairro || '';
                    cidadeInput.value = data.localidade || '';
                    estadoInput.value = data.uf || '';

                    Swal.fire('Sucesso', 'Informações do CEP carregadas!', 'success');
                } catch (error) {
                    Swal.fire('Erro', 'Erro ao buscar o CEP. Verifique a conexão ou o CEP informado.', 'error');
                }
            } else {
                Swal.fire('Atenção', 'Por favor, insira um CEP válido com 8 dígitos.', 'warning');
            }
        }
    });

    // Evento para limpar os campos quando o CEP está vazio
    cepInput.addEventListener('input', () => {
        if (cepInput.value.trim() === '') {
            limparCampos();
        }
    });
});
