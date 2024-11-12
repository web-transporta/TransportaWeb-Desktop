'use strict';

const empresa = document.getElementById('empresa');
const funcionario = document.getElementById('funcionario');

// Alterna seleção entre 'empresa' e 'funcionario'
empresa.addEventListener('change', function() {
    if (empresa.checked) {
        funcionario.checked = false;
    }
});

funcionario.addEventListener('change', function() {
    if (funcionario.checked) {
        empresa.checked = false;
    }
});

const userName = document.getElementById('email');
const password = document.getElementById('senha');
const loginButton = document.getElementById('signin');

const validarLogin = async () => {
    const email = userName.value.trim();
    const senha = password.value.trim();

    if (email === '' || senha === '') {
        alert('Os campos são obrigatórios!');
        return;
    }

    // Determina a URL com base na seleção do usuário
    let url;
    if (empresa.checked) {
        url = 'https://crud-03-09.onrender.com/v1/transportaweb/empresas';
    } else if (funcionario.checked) {
        url = 'https://crud-03-09.onrender.com/v1/transportaweb/motoristas';
    } else {
        alert('Você deve selecionar uma opção entre motorista e empresa para fazer login!');
        return;
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Erro ao buscar as informações');
        }

        const data = await response.json();
        console.log('Dados retornados:', data);

        const usuarios = data.empresas || data.motoristas || [];
        console.log('Usuários:', usuarios);

        if (usuarios.length === 0) {
            alert('Nenhum usuário encontrado.');
            return;
        }

        let validaUser = false;
        usuarios.forEach(usuario => {
            console.log(`Verificando usuário: ${usuario.nome} com senha: ${usuario.senha}`);
            if (usuario.email === email && usuario.senha === senha) {
                validaUser = true;
                alert('Login efetuado com sucesso!');
                
                // Armazena o id do usuário no localStorage
                localStorage.setItem('id', usuario.id);

                // Redireciona para a página inicial
                window.location.href = '/html/paginaHome.html';
            }
        });

        if (!validaUser) {
            alert('Usuário não cadastrado no banco de dados');
        }

    } catch (error) {
        console.error('Erro no login:', error);
        alert('Erro ao tentar realizar login: ' + error.message);
    }
};

// Adiciona o evento de clique ao botão de login
loginButton.addEventListener('click', validarLogin);
