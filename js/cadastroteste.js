document.addEventListener('DOMContentLoaded', function () {
    console.log('JavaScript carregado');

    const nome = document.getElementById('nome');
    const nomeError = document.getElementById('nomeError');
    const razaoSocial = document.getElementById('razaoSocial');
    const cep = document.getElementById('cep');
    const cepError = document.getElementById('cepError');
    const cnpj = document.getElementById('cnpj');
    const cnpjError = document.getElementById('cnpjError');
    const nextButton = document.getElementById('next');
    const formStep1 = document.getElementById('formStep1');
    const formStep2 = document.getElementById('formStep2');

    const numero_telefone = document.getElementById('numero_telefone');
    const numeroError = document.getElementById('numeroError');
    const foto_url = document.getElementById('img');
    const email = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const senha = document.getElementById('senha');
    const senhaError = document.getElementById('senhaError');
    const nextButton2 = document.getElementById('next2');

    // Validação das etapas
    const validarNome = (nome) => /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(nome);
    const validarCEP = (cep) => /^\d{5}-\d{3}$/.test(cep);
    const validarCNPJ = (cnpj) => /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(cnpj);
    const validarNumeroTelefone = (numero) => /^[0-9]{11}$/.test(numero);
    const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validarSenha = (senha) => /^(?=.*[A-Z]).{8,}$/.test(senha);

    nextButton.addEventListener('click', (event) => {
        event.preventDefault();

        const nomeInput = nome.value;
        const razaoInput = razaoSocial.value;
        const cepInput = cep.value;
        const cnpjInput = cnpj.value;

        nomeError.style.display = 'none';
        cepError.style.display = 'none';
        cnpjError.style.display = 'none';

        if (!nomeInput || !razaoInput || !cepInput || !cnpjInput) {
            console.error('Todos os campos são obrigatórios.');
            return;
        }

        if (!validarNome(nomeInput)) {
            nomeError.textContent = 'Nome inválido. Deve conter apenas letras e espaços.';
            nomeError.style.display = 'block';
            return;
        }

        if (!validarCEP(cepInput)) {
            cepError.textContent = 'CEP inválido. Use o formato "00000-000".';
            cepError.style.display = 'block';
            return;
        }

        if (!validarCNPJ(cnpjInput)) {
            cnpjError.textContent = 'CNPJ inválido. Use o formato "00.000.000/0001-00".';
            cnpjError.style.display = 'block';
            return;
        }

        const cadastro1 = {
            nome: nomeInput,
            razaoSocial: razaoInput,
            cep: cepInput,
            cnpj: cnpjInput
        };

        localStorage.setItem('cadastro1', JSON.stringify(cadastro1));

        formStep1.style.display = 'none';
        formStep2.style.display = 'block';
    });

    nextButton2.addEventListener('click', (event) => {
        event.preventDefault();

        const numero_telefoneInput = numero_telefone.value;
        const foto_urlInput = foto_url.value;
        const emailInput = email.value;
        const senhaInput = senha.value;

        numeroError.style.display = 'none';
        emailError.style.display = 'none';
        senhaError.style.display = 'none';

        if (!numero_telefoneInput || !foto_urlInput || !emailInput || !senhaInput) {
            console.error('Todos os campos são obrigatórios.');
            return;
        }

        if (!validarNumeroTelefone(numero_telefoneInput)) {
            numeroError.textContent = 'Telefone inválido. Use o formato "00000000000" ou "00-00000-0000".';
            numeroError.style.display = 'block';
            return;
        }

        if (!validarEmail(emailInput)) {
            emailError.textContent = 'Email inválido. Deve conter "@" e um domínio.';
            emailError.style.display = 'block';
            return;
        }

        if (!validarSenha(senhaInput)) {
            senhaError.textContent = 'Senha inválida. Deve ter no mínimo 8 caracteres e 1 maiúsculo.';
            senhaError.style.display = 'block';
            return;
        }

        const cadastro1 = JSON.parse(localStorage.getItem('cadastro1'));
        cadastro1.numero_telefone = numero_telefoneInput;
        cadastro1.foto_url = foto_urlInput;
        cadastro1.email = emailInput;
        cadastro1.senha = senhaInput;

        try {
            Swal.fire({
                title: 'Cadastrando...',
                text: 'Por favor, aguarde.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // Simulação de envio de dados
            const sucesso = true;  // Substitua com seu método real de envio

            if (sucesso) {
                Swal.fire('Sucesso', 'Empresa cadastrada com sucesso!', 'success').then(() => {
                    window.location.href = '../html/paginaHome.html';
                });
            } else {
                Swal.fire('Erro', 'Falha ao cadastrar a empresa, tente novamente.', 'error');
            }
        } catch (error) {
            Swal.fire('Erro', 'Erro ao tentar cadastrar a empresa. Verifique sua conexão.', 'error');
            console.error(error);
        }
    });
});
