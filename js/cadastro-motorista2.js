import { postMotorista } from "./funcoes.js";

const cadastromotorista1 = JSON.parse(localStorage.getItem('cadastromotorista1'));

if (cadastromotorista1) {
    console.log(cadastromotorista1); // Verifique se os dados foram recuperados corretamente
} else {
    console.error('Nenhum dado encontrado no localStorage.');
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('JavaScript carregado');
    const foto_url = document.getElementById('foto_url');
    const fotoError = document.getElementById('fotoError'); // Elemento da mensagem de erro da foto
    const email = document.getElementById('email');
    const emailError = document.getElementById('emailError'); // Elemento da mensagem de erro do e-mail
    const senha = document.getElementById('senha');
    const senhaError = document.getElementById('senhaError'); // Elemento da mensagem de erro da senha
    const cnh = document.getElementById('cnh');
    const cnhError = document.getElementById('cnhError'); // Elemento da mensagem de erro da CNH
    const button = document.getElementById('next');

    console.log('foto_url:', foto_url);
    console.log('email:', email);
    console.log('senha:', senha);
    console.log('cnh:', cnh);
    console.log('button:', button);

    if (!foto_url || !email || !senha || !cnh || !button) {
        console.error('Um ou mais elementos não foram encontrados.');
        return;
    }

    // Função para validar CNH
    function validarCNH(cnh) {
        const regex = /^\d{11}$/; // Valida CNH com 11 dígitos
        return regex.test(cnh);
    }

    // Função para validar e-mail
    function validarEmail(email) {
        if (email.length >= 5 && email.includes('@')) {
            return true;
        }
        return false;
    }

    // Função para validar a senha
    function validarSenha(senha) {
        const temMaiuscula = /[A-Z]/.test(senha); // Verifica se há pelo menos uma letra maiúscula
        if (senha.length >= 8 && temMaiuscula) {
            return true;
        }
        return false;
    }

    button.addEventListener('click', async (event) => {
        event.preventDefault();  // Impede o comportamento padrão do formulário

        const foto_urlInput = foto_url.value;
        const emailInput = email.value;
        const senhaInput = senha.value;
        const cnhInput = cnh.value;

        // Limpar mensagens de erro anteriores
        fotoError.style.display = 'none';
        fotoError.textContent = '';
        emailError.style.display = 'none';
        emailError.textContent = '';
        senhaError.style.display = 'none';
        senhaError.textContent = '';
        cnhError.style.display = 'none';
        cnhError.textContent = '';

        // Validação dos campos
        if (!foto_urlInput || !emailInput || !senhaInput || !cnhInput) {
            console.error('Todos os campos são obrigatórios.');
            return;
        }

        // Validação da foto
        if (!foto_urlInput) {
            fotoError.textContent = 'URL da foto é obrigatória.';
            fotoError.style.display = 'block';  // Exibe a mensagem de erro
            return;
        }

        // Validação da CNH
        if (!validarCNH(cnhInput)) {
            cnhError.textContent = 'CNH inválida. Deve conter 11 dígitos.';
            cnhError.style.display = 'block';  // Exibe a mensagem de erro
            return;
        }

        cadastromotorista1.foto_url = foto_urlInput;
        cadastromotorista1.email = emailInput;
        cadastromotorista1.senha = senhaInput;
        cadastromotorista1.cnh = cnhInput;

        try {
            // Tenta enviar os dados
            const sucesso = await postMotorista(cadastromotorista1);
            if (sucesso) {
                alert("Cadastro efetuado com sucesso!");
                console.log('Cadastro efetuado com sucesso!');
                window.location.href = '';
            } else {
                alert("Falha ao cadastrar o motorista. Por favor, tente novamente.");
                console.error('Falha ao cadastrar o motorista. Por favor, tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao tentar cadastrar o motorista:', error);
        }
    });
});
