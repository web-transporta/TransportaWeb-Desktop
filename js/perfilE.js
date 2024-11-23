import { editPerfilEmpresa, getEmpresa } from "./funcoes.js"; // Ajuste o caminho conforme necessário

document.addEventListener("DOMContentLoaded", () => {
    // Seleciona os campos do formulário corretamente
    const nomeInput = document.getElementById("nome");
    const emailInput = document.getElementById("email");
    const telefoneInput = document.getElementById("numero_telefone");
    const cnpjInput = document.getElementById("cnpj");
    const razaoSocialInput = document.getElementById("razaoSocial");
    const fotoUrlImg = document.getElementById("foto_url"); // Referência à tag <img>

    // Obtém o ID da empresa do localStorage
    const empresaId = localStorage.getItem("userId");

    if (!empresaId) {
        console.error("ID da empresa não encontrado no localStorage.");
        return; // Interrompe a execução se o ID não estiver disponível
    }

    // Função para buscar e preencher os dados do perfil
    const carregarPerfil = async () => {
        try {
            console.log("ID da empresa:", empresaId);

            // Chama a função getEmpresa passando o ID da empresa
            const data = await getEmpresa(empresaId);

            console.log("Resposta da API:", data);

            // Verifica se os dados retornados são válidos
            if (Array.isArray(data) && data.length > 0) {
                const perfil = data[0]; // Acessa o primeiro objeto da lista

                // Verifica os dados antes de preenchê-los
                console.log("Dados da empresa:", perfil);

                // Preenche os campos do formulário com os dados obtidos
                if (nomeInput) {
                    nomeInput.value = perfil.nome || "";
                    console.log("Nome atribuído ao campo:", perfil.nome || "");
                }
                if (emailInput) {
                    emailInput.value = perfil.email || "";
                    console.log("Email atribuído ao campo:", perfil.email || "");
                }
                if (telefoneInput) {
                    telefoneInput.value = perfil.numero_telefone || "";
                    console.log("Telefone atribuído ao campo:", perfil.numero_telefone || "");
                }
                if (cnpjInput) {
                    cnpjInput.value = perfil.cnpj || "";
                    console.log("CNPJ atribuído ao campo:", perfil.cnpj || "");
                }
                if (razaoSocialInput) {
                    razaoSocialInput.value = perfil.razaoSocial || "";
                    console.log("Razão Social atribuída ao campo:", perfil.razaoSocial || "");
                }

                // Preenche a imagem com a URL da foto de perfil
                if (fotoUrlImg && perfil.foto_url) {
                    fotoUrlImg.src = perfil.foto_url; // Atribui a URL da foto ao atributo src da imagem
                    console.log("Foto de perfil atribuída:", perfil.foto_url);
                }

            } else {
                console.error("Nenhum dado encontrado para o ID:", empresaId);
            }
        } catch (error) {
            console.error("Erro ao carregar os dados do perfil:", error);
        }
    };

    // Chama a função para carregar os dados assim que a página carrega
    carregarPerfil();
});

document.addEventListener("DOMContentLoaded", () => {
    const botaoEditar = document.querySelector('.botaoEditar');
    const botaoSalvar = document.createElement('button'); // Cria o botão de salvar
    botaoSalvar.textContent = 'Salvar perfil';
    botaoSalvar.style.display = 'none'; // Inicialmente invisível
    const containerBotoes = document.querySelector('.botoes');

    const camposEdicao = ['nome', 'email', 'numero_telefone', 'cnpj', 'razaoSocial'];

      // Obtém o ID da empresa do localStorage
      const empresaId = localStorage.getItem("userId");
    // Função para habilitar a edição dos campos
    function habilitarEdicao() {
        camposEdicao.forEach(campoId => {
            const campo = document.getElementById(campoId);
            if (campo) {
                campo.disabled = false; // Habilita o campo para edição
            }
        });
        botaoEditar.style.display = 'none'; // Oculta o botão de editar
        containerBotoes.appendChild(botaoSalvar); // Adiciona o botão de salvar
        botaoSalvar.style.display = 'inline-block'; // Exibe o botão de salvar
    }

    async function salvarPerfil() {
        const perfil = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            numero_telefone: document.getElementById('numero_telefone').value,
            cnpj: document.getElementById('cnpj').value,
            razaoSocial: document.getElementById('razaoSocial').value
        };
   
        // Validação de campos obrigatórios
        for (let campo in perfil) {
            if (!perfil[campo]) {
                Swal.fire({
                    title: 'Erro!',
                    text: `O campo ${campo} é obrigatório e não foi preenchido corretamente.`,
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
                return; // Interrompe a execução caso algum campo esteja vazio
            }
        }
   
        console.log('Perfil a ser salvo:', perfil); // Log de verificação
   
        try {
            const response = await editPerfilEmpresa(empresaId, perfil); // Passa o ID e perfil
            console.log('Resposta do backend:', response); // Log da resposta
   
            if (response.status === 200) {
                Swal.fire({
                    title: 'Perfil atualizado com sucesso!',
                    text: 'Suas alterações foram salvas.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
            } else {
                throw new Error('Erro ao atualizar perfil');
            }
        } catch (error) {
            console.error('Erro ao salvar perfil:', error); // Log detalhado do erro
            Swal.fire({
                title: 'Erro!',
                text: `Ocorreu um erro ao salvar as alterações. Detalhes: ${error.message}`,
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
   
        // Desabilitar campos e ocultar o botão de salvar
        camposEdicao.forEach(campoId => {
            const campo = document.getElementById(campoId);
            if (campo) {
                campo.disabled = true;
            }
        });
        botaoSalvar.style.display = 'none';
        botaoEditar.style.display = 'inline-block';
    }
    // Função para trocar a foto do perfil
    function trocarFoto() {
        const foto_url = document.createElement('input');
        foto_url.type = 'file';
        foto_url.accept = 'image/*';
        foto_url.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const imgUrl = URL.createObjectURL(file);
                const foto_url = document.getElementById('foto_url');
                foto_url.src = imgUrl;
                console.log('Foto de perfil trocada.');
            }
        });
        foto_url.click(); // Abre a caixa de seleção de arquivo
    }

    // Função para remover a foto de perfil
    function removerFoto() {
        const foto_url = document.getElementById('foto_url');
        foto_url.src = ''; // Limpa a foto
        console.log('Foto de perfil removida.');
    }

    // Função para excluir o perfil
    function excluirPerfil() {
        if (confirm("Tem certeza que deseja excluir seu perfil?")) {
            // Aqui você pode enviar uma solicitação ao backend para excluir o perfil
            console.log("Perfil excluído com sucesso.");
            alert("Seu perfil foi excluído.");
        }
    }

    // Adicionar eventos aos botões
    botaoEditar.addEventListener('click', (e) => {
        e.preventDefault();
        habilitarEdicao(); // Habilita a edição
    });

    botaoSalvar.addEventListener('click', (e) => {
        e.preventDefault();
        salvarPerfil(); // Salva as edições
    });

    const botaoTrocarFoto = document.querySelector('.trocar-foto');
    if (botaoTrocarFoto) {
        botaoTrocarFoto.addEventListener('click', trocarFoto);
    }

    const botaoRemoverFoto = document.querySelector('.remover');
    if (botaoRemoverFoto) {
        botaoRemoverFoto.addEventListener('click', removerFoto);
    }

    const botaoExcluirPerfil = document.querySelector('.botaoExcluir');
    if (botaoExcluirPerfil) {
        botaoExcluirPerfil.addEventListener('click', (e) => {
            e.preventDefault();
            excluirPerfil(); // Exclui o perfil
        });
    }
});
