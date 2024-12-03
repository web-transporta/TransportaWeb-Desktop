import { getMotorista } from "./funcoes.js";  // Importando a função getMotorista

document.addEventListener('DOMContentLoaded', async () => {
    // Extrai o ID do motorista da URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id'); // ID do motorista

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
        document.querySelector('#motoristaTelefone').innerHTML = `<strong>Telefone:</strong> ${motorista.telefone || 'N/A'}`;
        document.querySelector('#motoristaEmail').innerHTML = `<strong>E-mail:</strong> ${motorista.email || 'N/A'}`;
        document.querySelector('#motoristaCpf').innerHTML = `<strong>CPF:</strong> ${motorista.cpf || 'N/A'}`;
        document.querySelector('#motoristaCnh').innerHTML = `<strong>CNH:</strong> ${motorista.cnh || 'N/A'}`;
        document.querySelector('#motoristaDataNascimento').innerHTML = `<strong>Data de Nascimento:</strong> ${new Date(motorista.data_nascimento).toLocaleDateString() || 'N/A'}`;

        // Verificando disponibilidade do motorista
        const disponibilidadeStatus = motorista.disponibilidade_status === 1 ? 'Disponível' : 'Indisponível';
        document.querySelector('#motoristaDisponibilidade').innerHTML = `<strong>Disponibilidade:</strong> ${disponibilidadeStatus}`;

        

    } catch (error) {
        console.error('Erro ao carregar os detalhes do motorista:', error);
        alert('Erro ao carregar os detalhes do motorista. Tente novamente.');
    }
});
