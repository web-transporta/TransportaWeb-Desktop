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
const foto_url = document.getElementById('img');
const email = document.getElementById('email');
const emailError = document.getElementById('emailError'); // Elemento para a mensagem de erro do email
const senha = document.getElementById('senha');
const senhaError = document.getElementById('senhaError'); // Elemento para a mensagem de erro da senha
const button = document.getElementById('next2');
    
// Verificar se todos os elementos foram encontrados
if (!numero_telefone || !foto_url || !email || !senha || !button) {
    console.error('Um ou mais elementos não foram encontrados no DOM.');
} else {
    const validarNumeroTelefone = (numero) => {
        return /^[0-9]{11}$/.test(numero) || /^\d{2}-\d{5}-\d{4}$/.test(numero);
    };

    const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validarSenha = (senha) => {
        const regex = /^(?=.*[A-Z]).{8,}$/; // Mínimo de 8 caracteres e pelo menos 1 maiúsculo
        return regex.test(senha);
    };

    button.addEventListener('click', async (event) => {
        event.preventDefault();

        const numero_telefoneInput = numero_telefone.value;
        const imgInput = foto_url.value;
        const emailInput = email.value;
        const senhaInput = senha.value;

        console.log('numero_telefone:', numero_telefoneInput);
        console.log('foto_url:', imgInput);
        console.log('email:', emailInput);
        console.log('senha:', senhaInput);

        numeroError.style.display = 'none';
        numeroError.textContent = '';
        emailError.style.display = 'none';
        emailError.textContent = '';
        senhaError.style.display = 'none';
        senhaError.textContent = '';

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

        cadastro1.numero_telefone = numero_telefoneInput;
        cadastro1.foto_url = imgInput;
        cadastro1.email = emailInput;
        cadastro1.senha = senhaInput;

        console.log(cadastro1);

        try {
            // Mostra o alerta de carregamento
            Swal.fire({
                title: 'Cadastrando...',
                text: 'Por favor, aguarde.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const sucesso = await postEmpresas(cadastro1);

            // Fecha o alerta de carregamento
            Swal.close();

            if (sucesso) {
                Swal.fire('Sucesso', 'Empresa cadastrada com sucesso!', 'success')
                    .then(() => {
                        window.location.href = '../html/paginaHome.html';
                    });
            } else {
                Swal.fire('Erro', 'Falha ao cadastrar a empresa, tente novamente.', 'error');
            }
        } catch (error) {
            Swal.close();
            Swal.fire('Erro', 'Erro ao tentar cadastrar a empresa. Verifique sua conexão.', 'error');
            console.error('Erro ao tentar cadastrar a empresa:', error);
        }
    });
}
