import { getEmpresa } from "./funcoes.js"; // Ajuste o caminho conforme necessário

document.addEventListener("DOMContentLoaded", () => {
    // Seleciona os campos do formulário corretamente
    const nomeInput = document.getElementById("nome");
    const emailInput = document.getElementById("email");
    const telefoneInput = document.getElementById("telefone");
    const cnpjInput = document.getElementById("cnpj");
    const razaoSocialInput = document.getElementById("razaoSocial");
    const fotoUrlImg = document.getElementById("foto_url"); // Referência à tag <img>

    // Obtém o ID da empresa do localStorage
    const empresaId = localStorage.getItem("id");

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
