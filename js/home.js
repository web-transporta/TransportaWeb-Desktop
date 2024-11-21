'use strict';

import { getEmpresa } from "./funcoes.js";

window.addEventListener('DOMContentLoaded', async () => {
    const id = localStorage.getItem('id'); // Recupera o ID da empresa do localStorage

    if (!id) {
        alert('ID da empresa não encontrado. Por favor, faça login novamente.');
        window.location.href = '/html/login.html'; // Redireciona para a página de login se o ID não estiver presente
        return;
    }

    try {
        const empresas = await getEmpresa(id); // `empresas` é o array retornado
        console.log('Dados da empresa:', empresas); // Inspeciona a estrutura do objeto

        // Verifica se o array contém ao menos um item e acessa o nome
        if (empresas.length > 0 && empresas[0].nome) {
            document.getElementById('empresaNome').textContent = `${empresas[0].nome}!`;

            // Verifica se existe uma URL de imagem e se a chave 'foto_url' está presente
            if (empresas[0].foto_url) {
                const empresaImagem = document.getElementById('foto-url');
                if (empresaImagem) { // Verifica se o elemento realmente existe
                    empresaImagem.src = empresas[0].foto_url; // Define o src da imagem com a URL retornada
                    empresaImagem.alt = empresas[0].nome; // Define o texto alternativo da imagem
                } else {
                    console.error('Elemento de imagem não encontrado.');
                }
            } else {
                console.warn('Imagem não encontrada para a empresa:', empresas[0]);
                document.getElementById('empresaImagem').src = '/path/to/default-image.jpg'; // Caminho da imagem padrão
            }
        } else {
            console.warn('Estrutura inesperada ou nome ausente:', empresas);
            document.getElementById('empresaNome').textContent = 'Empresa não encontrada';
        }

    } catch (error) {
        console.error('Erro ao buscar a empresa:', error);
        alert('Erro ao carregar dados da empresa: ' + error.message);
    }
});
// Captura os elementos do botão de alerta e do modal
const alertButton = document.getElementById('alertButton');
const alertModal = document.getElementById('alertModal');  // Modal renomeado
const closeModal = document.getElementById('closeModal');  // Fechar o modal

// Função para abrir o modal ao clicar no botão de alerta
alertButton.onclick = function() {
    alertModal.style.display = "block"; // Exibe o modal
}

// Função para fechar o modal ao clicar no botão de fechar (X)
closeModal.onclick = function() {
    alertModal.style.display = "none"; // Oculta o modal
}

// Fecha o modal se o usuário clicar fora da área de conteúdo do modal
window.onclick = function(event) {
    if (event.target == alertModal) {
        alertModal.style.display = "none"; // Oculta o modal
    }
}
