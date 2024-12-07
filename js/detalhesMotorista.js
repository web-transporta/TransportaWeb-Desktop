import { getMotorista, getEmpresa } from "./funcoes.js";  // Importando a função getMotorista

window.addEventListener('DOMContentLoaded', async () => {
    const id = localStorage.getItem('userId'); 

    if (!id) {
        alert('ID da empresa não encontrado. Por favor, faça login novamente.');
        window.location.href = '/html/login.html'; 
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
