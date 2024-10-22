import { postEmpresas } from "./funcoes.js";

const cadastro1 = JSON.parse(localStorage.getItem('cadastro1'));

if (cadastro1) {
    console.log(cadastro1); // Verifique se os dados foram recuperados corretamente
} else {
    console.error('Nenhum dado encontrado no localStorage.');
}

// Certifique-se de que os elementos estão sendo acessados corretamente antes de usar os valores
const numero_telefone = document.getElementById('numero_telefone');
const numeroError = document.getElementById('numeroError'); // Elemento para a mensagem de erro do telefone
const img_perfil = document.getElementById('img_perfil');
const email = document.getElementById('email');
const emailError = document.getElementById('emailError'); // Elemento para a mensagem de erro do email
const senha = document.getElementById('senha');
const senhaError = document.getElementById('senhaError'); // Elemento para a mensagem de erro da senha
const button = document.getElementById('next2');

// Verificar se todos os elementos foram encontrados
if (!numero_telefone || !img_perfil || !email || !senha || !button) {
    console.error('Um ou mais elementos não foram encontrados no DOM.');
} else {
    // Função para validar número de telefone
    const validarNumeroTelefone = (numero) => {
        return /^[0-9]{11}$/.test(numero) || /^\d{2}-\d{5}-\d{4}$/.test(numero);
    };

    // Função para validar email
    const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Função para validar senha
    const validarSenha = (senha) => {
        const regex = /^(?=.*[A-Z]).{8,}$/; // Mínimo de 8 caracteres e pelo menos 1 maiúsculo
        return regex.test(senha);
    };

    button.addEventListener('click', async (event) => {
        event.preventDefault();

        // Coleta os valores dos inputs **após** o evento de clique
        const numero_telefoneInput = numero_telefone.value;
        const imgInput = img_perfil.value;
        const emailInput = email.value;
        const senhaInput = senha.value;

        console.log('numero_telefone:', numero_telefoneInput);
        console.log('img_perfil:', imgInput);
        console.log('email:', emailInput);
        console.log('senha:', senhaInput);

        // Limpar mensagens de erro anteriores
        numeroError.style.display = 'none';
        numeroError.textContent = '';
        emailError.style.display = 'none';
        emailError.textContent = '';
        senhaError.style.display = 'none';
        senhaError.textContent = '';

        // Validação dos campos
        if (!numero_telefoneInput || !imgInput || !emailInput || !senhaInput) {
            console.error('Todos os campos são obrigatórios.');
            return;
        }

        if (!validarNumeroTelefone(numero_telefoneInput)) {
            numeroError.textContent = 'Erro. Use: "00000000000" ou "00-00000-0000".';
            numeroError.style.display = 'block'; // Exibe a mensagem de erro
            return;
        }

        if (!validarEmail(emailInput)) {
            emailError.textContent = 'Email inválido. Deve conter "@" e um domínio.';
            emailError.style.display = 'block'; // Exibe a mensagem de erro
            return;
        }

        if (!validarSenha(senhaInput)) {
            senhaError.textContent = 'A senha deve ter no mínimo 8 caracteres e pelo menos 1 maiúsculo.';
            senhaError.style.display = 'block'; // Exibe a mensagem de erro
            return;
        }

        // Atualiza o objeto cadastro1 com os novos dados
        cadastro1.numero_telefone = numero_telefoneInput;
        cadastro1.img_perfil = imgInput;
        cadastro1.email = emailInput;
        cadastro1.senha = senhaInput;

        console.log(cadastro1);

        try {
            // Tenta enviar os dados
            const sucesso = await postEmpresas(cadastro1);
            if (sucesso) {
                alert("Cadastrado com sucesso!");
                console.log('Empresa cadastrada com sucesso!');
                window.location.href = '../html/cadastro-empresa2.html';
            } else {
                alert("Falha ao cadastrar a empresa, tente novamente.");
                console.error('Falha ao cadastrar a empresa. Por favor, tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao tentar cadastrar a empresa:', error);
        }
    });
}
