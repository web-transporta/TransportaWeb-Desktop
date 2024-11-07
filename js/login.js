'use strict';

const empresa = document.getElementById('empresa');
const funcionario = document.getElementById('funcionario');
const userName = document.getElementById('email');
const password = document.getElementById('senha');
const loginButton = document.getElementById('signin');


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

const validarLogin = async () => {
    const email = userName.value.trim();
    const senha = password.value.trim();

    if (email === '' || senha === '') {
        alert('Os campos são obrigatórios!');
        return;
    }

    let url;
    let userType;
    if (empresa.checked) {
        url = 'https://crud-03-09.onrender.com/v1/transportaweb/empresas';
        userType = 'empresa';
    } else if (funcionario.checked) {
        url = 'https://crud-03-09.onrender.com/v1/transportaweb/motoristas';
        userType = 'funcionario';
    } else {
        alert('Selecione uma opção entre motorista e empresa para fazer login!');
        return;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        const usuarios = data.empresas || data.motoristas || [];

        let validaUser = false;

        usuarios.forEach(usuario => {
            if (usuario.email === email && usuario.senha === senha) {
                localStorage.setItem('userId', usuario.id);
                localStorage.setItem("myName", usuario.nome);
                localStorage.setItem("profileImageUrl", usuario.foto_url);
                localStorage.setItem('userType', userType);

                validaUser = true;
                alert('Login efetuado com sucesso!');
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

loginButton.addEventListener('click', validarLogin);
