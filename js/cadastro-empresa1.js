document.addEventListener('DOMContentLoaded', function() {
    console.log('JavaScript carregado'); // Verifica se o script está carregado

    const nome = document.getElementById('nome');
    const nomeError = document.getElementById('nomeError'); // Elemento para a mensagem de erro do nome
    const razaoSocial = document.getElementById('razaoSocial');
    const cep = document.getElementById('cep');
    const cepError = document.getElementById('cepError'); // Elemento para a mensagem de erro do CEP
    const cnpj = document.getElementById('cnpj');
    const cnpjError = document.getElementById('cnpjError'); // Elemento para a mensagem de erro do CNPJ
    const button = document.getElementById('next');

    console.log('nome:', nome); // Verifica se o elemento foi encontrado
    console.log('razaoSocial:', razaoSocial);
    console.log('cep:', cep);
    console.log('cnpj:', cnpj);
    console.log('button:', button);

    if (!nome || !razaoSocial || !cep || !cnpj || !button) {
        console.error('Um ou mais elementos não foram encontrados.');
        return;
    }

    // Função para validar o nome (somente letras)
    function validarNome(nome) {
        const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/; // Permite apenas letras (acentuadas ou não) e espaços
        return regex.test(nome);
    }

    // Função para validar o CEP
    function validarCEP(cep) {
        const regex = /^\d{5}-\d{3}$/; // Formato 00000-000
        return regex.test(cep);
    }

    // Função para validar o CNPJ
    function validarCNPJ(cnpj) {
        const regex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/; // Formato 00.000.000/0001-00
        return regex.test(cnpj);
    }

    button.addEventListener('click', (event) => {
        event.preventDefault();  // Impede o comportamento padrão do formulário

        const nomeInput = nome.value;
        const razaoInput = razaoSocial.value;
        const cepInput = cep.value;
        const cnpjInput = cnpj.value;

        // Limpar mensagens de erro anteriores
        nomeError.style.display = 'none';
        nomeError.textContent = '';
        cepError.style.display = 'none';
        cepError.textContent = '';
        cnpjError.style.display = 'none';
        cnpjError.textContent = '';

        // Validação dos campos
        if (!nomeInput || !razaoInput || !cepInput || !cnpjInput) {
            console.error('Todos os campos são obrigatórios.');
            return;
        }

        // Validação do nome
        if (!validarNome(nomeInput)) {
            nomeError.textContent = 'Nome inválido. Deve conter apenas letras e espaços.';
            nomeError.style.display = 'block';  // Exibe a mensagem de erro
            return;
        }

        // Validação do CEP
        if (!validarCEP(cepInput)) {
            cepError.textContent = 'CEP inválido. Use o formato "00000-000".';
            cepError.style.display = 'block';  // Exibe a mensagem de erro
            return;
        }

        // Validação do CNPJ
        if (!validarCNPJ(cnpjInput)) {
            cnpjError.textContent = 'CNPJ inválido. Use o formato "00.000.000/0001-00".';
            cnpjError.style.display = 'block';  // Exibe a mensagem de erro
            return;
        }

        const insert = {
            nome: nomeInput,
            razaoSocial: razaoInput,
            cep: cepInput,
            cnpj: cnpjInput,
        };

        localStorage.setItem('cadastro1', JSON.stringify(insert));
        window.location.href = '../html/cadastro-empresa2.html';
    });
});
