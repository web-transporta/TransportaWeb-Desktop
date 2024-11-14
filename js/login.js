document.addEventListener('DOMContentLoaded', () => {
    const empresa = document.getElementById('empresa');
    const funcionario = document.getElementById('funcionario');
    const userName = document.getElementById('email');
    const password = document.getElementById('senha');
    const loginButton = document.getElementById('signin');

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

    const validarLogin = async () => {
        const email = userName.value.trim();
        const senha = password.value.trim();

        if (email === '' || senha === '') {
            Swal.fire({
                icon: 'warning',
                title: 'Atenção',
                text: 'Os campos são obrigatórios!',
                confirmButtonColor: '#3085d6'
            });
            return;
        }

        let url;
        if (empresa.checked) {
            url = 'https://crud-03-09.onrender.com/v1/transportaweb/empresas';
        } else if (funcionario.checked) {
            url = 'https://crud-03-09.onrender.com/v1/transportaweb/motoristas';
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Atenção',
                text: 'Você deve selecionar uma opção entre motorista e empresa para fazer login!',
                confirmButtonColor: '#3085d6'
            });
            return;
        }

        try {
            Swal.fire({
                title: 'Aguarde...',
                text: 'Verificando suas credenciais',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Erro ao buscar as informações');
            }

            const data = await response.json();
            const usuarios = data.empresas || data.motoristas || [];

            if (usuarios.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Atenção',
                    text: 'Nenhum usuário encontrado.',
                    confirmButtonColor: '#3085d6'
                });
                return;
            }

            let validaUser = false;
            usuarios.forEach(usuario => {
                if (usuario.email === email && usuario.senha === senha) {
                    validaUser = true;
                    Swal.fire({
                        icon: 'success',
                        title: 'Login efetuado',
                        text: 'Login realizado com sucesso!',
                        confirmButtonColor: '#3085d6'
                    }).then(() => {
                        localStorage.setItem('id', usuario.id);
                        window.location.href = '/html/paginaHome.html';
                    });
                }
            });

            if (!validaUser) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Usuário não cadastrado no banco de dados',
                    confirmButtonColor: '#d33'
                });
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Erro ao tentar realizar login: ' + error.message,
                confirmButtonColor: '#d33'
            });
        }
    };

    loginButton.addEventListener('click', validarLogin);
});
