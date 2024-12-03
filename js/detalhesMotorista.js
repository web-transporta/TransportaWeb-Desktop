import { getMotorista } from "./funcoes.js";  // Importando a função getMotorista

document.addEventListener('DOMContentLoaded', async () => {
    // Extrai o ID do motorista da URL
    const params = new URLSearchParams(window.location.search);
    const motoristaId = params.get('id');


    if (!id) {
        alert('ID do motorista não encontrado!');
        return;
    }

    try {
        // Usando a função getMotorista para buscar os dados do motorista
        const motorista = await getMotorista(id); // Chama a função importada

        if (!motorista) {
            throw new Error('Motorista não encontrado!');
        }

        // Atualiza os dados do motorista na interface
        document.querySelector('#motoristaFoto').src = motorista.foto_url || '';
        document.querySelector('#motoristaNome').textContent = motorista.nome || 'Nome não disponível';
        document.querySelector('#motoristaTelefone').textContent = `Telefone: ${motorista.telefone || 'N/A'}`;
        document.querySelector('#motoristaEmail').textContent = `E-mail: ${motorista.email || 'N/A'}`;
    } catch (error) {
        console.error('Erro ao carregar os detalhes do motorista:', error);
        alert('Erro ao carregar os detalhes do motorista. Tente novamente.');
    }
});
