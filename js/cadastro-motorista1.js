document.addEventListener('DOMContentLoaded', function() {
    console.log('JavaScript carregado'); // Verifica se o script está carregado

    const nome = document.getElementById('nome');
    const nomeError = document.getElementById('nomeError'); // Elemento para a mensagem de erro do nome
    const data_nascimento = document.getElementById('data');
    const cpf = document.getElementById('cpf');
    const cpfError = document.getElementById('cpfError'); // Elemento da mensagem de erro do CPF
    const telefone = document.getElementById('telefone');
    const telefoneError = document.getElementById('telefoneError'); // Elemento da mensagem de erro do telefone
    const button = document.getElementById('next');

    console.log('nome:', nome); // Verifica se o elemento foi encontrado
    console.log('cpf:', cpf);
    console.log('telefone:', telefone);
    console.log('data_nascimento:', data_nascimento);
    console.log('button:', button);

    if (!nome || !cpf || !telefone || !data_nascimento || !button) {
        console.error('Um ou mais elementos não foram encontrados.');
        return;
    }

    // Função para validar o nome (somente letras)
    function validarNome(nome) {
        const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/; // Permite apenas letras (acentuadas ou não) e espaços
        return regex.test(nome);
    }

    // Função para validar CPF
    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, ''); // Remove caracteres que não sejam dígitos
        if (cpf.length !== 11) return false;

        let soma = 0;
        let resto;

        // Validação do primeiro dígito
        for (let i = 1; i <= 9; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;

        soma = 0;
        // Validação do segundo dígito
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(10, 11))) return false;

        return true;
    }

    // Função para validar telefone
    function validarTelefone(telefone) {
        const regex = /^\(?\d{2}\)?[\s-]?\d{4,5}[-]?\d{4}$/; // Formatos aceitos: (XX) XXXX-XXXX ou (XX) XXXXX-XXXX
        return regex.test(telefone);
    }

    button.addEventListener('click', (event) => {
        event.preventDefault();  // Impede o comportamento padrão do formulário

        const nomeInput = nome.value;
        const cpfInput = cpf.value;
        const telefoneInput = telefone.value;
        const dataInput = data_nascimento.value;

        // Limpar mensagens de erro anteriores
        nomeError.style.display = 'none';
        nomeError.textContent = '';
        cpfError.style.display = 'none';
        cpfError.textContent = '';
        telefoneError.style.display = 'none';
        telefoneError.textContent = '';

        // Validação dos campos
        if (!nomeInput || !cpfInput || !telefoneInput || !dataInput) {
            console.error('Todos os campos são obrigatórios.');
            return;
        }

        // Validação do nome
        if (!validarNome(nomeInput)) {
            nomeError.textContent = 'Nome inválido. Deve conter apenas letras e espaços.';
            nomeError.style.display = 'block';  // Exibe a mensagem de erro
            return;
        }

        // Validação do CPF
        if (!validarCPF(cpfInput)) {
            cpfError.textContent = 'CPF inválido, deve conter 11 caracteres. Insira novamente com pontos(.), hífens(-) ou somente números.';
            cpfError.style.display = 'block';  // Exibe a mensagem de erro
            return;
        }

        // Validação do telefone
        if (!validarTelefone(telefoneInput)) {
            telefoneError.textContent = 'Telefone inválido. Formato aceito: (XX) XXXX-XXXX ou (XX) XXXXX-XXXX';
            telefoneError.style.display = 'block';  // Exibe a mensagem de erro
            return;
        }

        const insert = {
            nome: nomeInput,
            telefone: telefoneInput,
            cpf: cpfInput,
            data_nascimento: dataInput,
        };

        localStorage.setItem('cadastromotorista1', JSON.stringify(insert));
        window.location.href = '../html/cadastro-motorista2.html';
    });
});
