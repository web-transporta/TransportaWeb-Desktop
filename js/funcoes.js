export async function postEmpresas(insert) {
    try {
        // Faz a requisição para a API
        const response = await fetch('https://crud-03-09.onrender.com/v1/transportaweb/insertempresa', {
            method: 'POST',
            body: JSON.stringify(insert),
            headers: { 'Content-Type': 'application/json' }
        });

        // Verifica o status da resposta
        console.log('Status da resposta:', response.status);

        // Se a resposta for bem-sucedida (status 2xx)
        if (response.ok) {
            const data = await response.json();
            console.log('Resposta da API:', data);
            return true; // Sucesso
        } else {
            console.error('Erro da API:', await response.text());  // Mostra a mensagem de erro da API
            alert(await response.text())
            return false;  // Falha
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        return false;  // Falha em caso de erro na requisição
    }
}

export async function postMotorista(insert) {
    try {
        // Faz a requisição para a API
        const response = await fetch('https://crud-03-09.onrender.com/v1/transportaweb/insertmotorista', {
            method: 'POST',
            body: JSON.stringify(insert),
            headers: { 'Content-Type': 'application/json' }
        });

        // Verifica o status da resposta
        console.log('Status da resposta:', response.status);

        // Se a resposta for bem-sucedida (status 2xx)
        if (response.ok) {
            const data = await response.json();
            console.log('Resposta da API:', data);
            return true; // Sucesso
        } else {
            console.error('Erro da API:', await response.text());  // Mostra a mensagem de erro da API
            return false;  // Falha
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        return false;  // Falha em caso de erro na requisição
    }
}

export async function getViagens() {
    const url = `https://crud-03-09.onrender.com/v1/transportaweb/viagens`; 
    const response = await fetch(url);
    
    if (!response.ok) {
        console.error('Erro ao buscar viagens:', response.statusText);
        return []; // Retorna um array vazio em caso de falha
    }

    const data = await response.json();
    console.log('Dados recebidos da API:', data); // Verifique o que a API retorna
    return data.viagens; // Verifique se 'viagens' é realmente a chave que contém os dados
}

export async function getMotoristasSemEquipe() {
    const url = `https://crud-03-09.onrender.com/v1/transportaweb/motoristasfree`; 
    const response = await fetch(url);
    
    if (!response.ok) {
        console.error('Erro ao buscar viagens:', response.statusText);
        return []; // Retorna um array vazio em caso de falha
    }

    const data = await response.json();
    console.log('Dados recebidos da API:', data); // Verifique o que a API retorna
    return data.motoristas; // Verifique se 'viagens' é realmente a chave que contém os dados
}

export async function getViagem(id) {
    const url = `https://crud-03-09.onrender.com/v1/transportaweb/viagem/${id}`
    console.log(url);
    const response = await fetch(url)
    const data = await response.json()
    return data.viagem[0]
}

export async function getViagemEmpresa(id) {
    const url = `https://crud-03-09.onrender.com/v1/transportaweb/empresaviagem/${id}`
    console.log(url);
    const response = await fetch(url)
    const data = await response.json()
    return data.empresa_viagem
}



export async function postViagem(insert) {
    try {
        // Faz a requisição para a API
        const response = await fetch('https://crud-03-09.onrender.com/v1/transportaweb/newviagem', {
            method: 'POST',
            body: JSON.stringify(insert),
            headers: { 'Content-Type': 'application/json' }
        });

        // Verifica o status da resposta
        console.log('Status da resposta:', response.status);

        // Se a resposta for bem-sucedida (status 2xx)
        if (response.ok) {
            const data = await response.json();
            console.log('Resposta da API:', data);
            return response; // Retorna a resposta completa em vez de apenas um booleano
        } else {
            const errorMessage = await response.text();
            console.error('Erro da API:', errorMessage); // Mostra a mensagem de erro da API
            throw new Error(`Erro da API: ${errorMessage}`); // Lança um erro para ser capturado no catch
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error; // Re-lança o erro para tratamento no código chamador
    }
}
export async function putViagem(insert) {
    try {
        // Faz a requisição para a API
        const response = await fetch(`https://crud-03-09.onrender.com/v1/transportaweb/editviagem/${id}`, {
            method: 'PUT',
            body: JSON.stringify(insert),
            headers: { 'Content-Type': 'application/json' }
        });

        // Verifica o status da resposta
        console.log('Status da resposta:', response.status);

        // Se a resposta for bem-sucedida (status 2xx)
        if (response.ok) {
            const data = await response.json();
            console.log('Resposta da API:', data);
            return response; // Retorna a resposta completa em vez de apenas um booleano
        } else {
            const errorMessage = await response.text();
            console.error('Erro da API:', errorMessage); // Mostra a mensagem de erro da API
            throw new Error(`Erro da API: ${errorMessage}`); // Lança um erro para ser capturado no catch
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error; // Re-lança o erro para tratamento no código chamador
    }
}


export async function getMotorista(id) {
    const url = `https://crud-03-09.onrender.com/v1/transportaweb/motorista/${id}` 
    const response = await fetch(url)
    const data = await response.json()
    return data.motorista    
}
export async function getEmpresas() {
    try {
        const response = await fetch(`https://crud-03-09.onrender.com/v1/transportaweb/empresas`);
        if (response.ok) {
            const data = await response.json();
            return data.empresas || []; // Retorna o array de caminhões ou um array vazio
        } else {
            console.error("Erro ao obter caminhões:", response.statusText);
            return [];
        }
    } catch (error) {
        console.error("Erro de rede ao obter caminhões:", error);
        return []; // Retorna um array vazio em caso de erro
    }
}
export async function getEmpresa(id) {
    const url = `https://crud-03-09.onrender.com/v1/transportaweb/empresa/${id}` 
    const response = await fetch(url)
    const data = await response.json()
    return data.empresa    
}

export async function getVeiculos() {
    try {
        const response = await fetch(`https://crud-03-09.onrender.com/v1/transportaweb/veiculos`);
        if (response.ok) {
            const data = await response.json();
            return data.veiculos || []; // Retorna o array de caminhões ou um array vazio
        } else {
            console.error("Erro ao obter caminhões:", response.statusText);
            return [];
        }
    } catch (error) {
        console.error("Erro de rede ao obter caminhões:", error);
        return []; // Retorna um array vazio em caso de erro
    }
}
export async function getVeiculoById(id) {
    const url = `https://crud-03-09.onrender.com/v1/transportaweb/veiculo/${id}` 
    const response = await fetch(url)
    const data = await response.json()
    return data.motorista    
}
export async function getPartida() {
    try {
        const response = await fetch(`https://crud-03-09.onrender.com/v1/transportaweb/partidas`);
        if (response.ok) {
            const data = await response.json();
            return data.empresas || []; // Retorna o array de caminhões ou um array vazio
        } else {
            console.error("Erro ao obter caminhões:", response.statusText);
            return [];
        }
    } catch (error) {
        console.error("Erro de rede ao obter caminhões:", error);
        return []; // Retorna um array vazio em caso de erro
    }
}
export async function getPartidaById(id) {
    const url = `https://crud-03-09.onrender.com/v1/transportaweb/partida/${id}` 
    const response = await fetch(url)
    const data = await response.json()
    return data.partida    
}
export async function getDestinoById(id) {
    const url = `https://crud-03-09.onrender.com/v1/transportaweb/destino/${id}` 
    const response = await fetch(url)
    const data = await response.json()
    return data.partida    
}
export async function getDestino() {
    try {
        const response = await fetch(`https://crud-03-09.onrender.com/v1/transportaweb/destinos`);
        if (response.ok) {
            const data = await response.json();
            return data.empresas || []; // Retorna o array de caminhões ou um array vazio
        } else {
            console.error("Erro ao obter caminhões:", response.statusText);
            return [];
        }
    } catch (error) {
        console.error("Erro de rede ao obter caminhões:", error);
        return []; // Retorna um array vazio em caso de erro
    }
}
export async function getMotoristas() {
    try {
        const response = await fetch(`https://crud-03-09.onrender.com/v1/transportaweb/motoristas`);
        if (response.ok) {
            const data = await response.json();
            return data.motoristas || []; // Retorna o array de caminhões ou um array vazio
        } else {
            console.error("Erro ao obter caminhões:", response.statusText);
            return [];
        }
    } catch (error) {
        console.error("Erro de rede ao obter caminhões:", error);
        return []; // Retorna um array vazio em caso de erro
    }
}
export async function getViagemByNome(id_viagem) {
    try {
        const response = await fetch(`https://crud-03-09.onrender.com/v1/transportaweb/viagens/filtro?id_viagem=${encodeURIComponent(id_viagem)}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar a viagem: ${response.statusText}`);
        }
        
        const data = await response.json(); // Pega o JSON completo
        return data.viagem || []; // Retorna apenas o array 'viagem' ou um array vazio caso não exista
    } catch (error) {
        console.error("Erro ao obter viagens:", error);
        throw error; // Rejoga o erro para ser capturado onde a função é chamada
    }
}
export async function getMotoristaNome(nome) {
    try {
        const response = await fetch(`https://crud-03-09.onrender.com/v1/transportaweb/motoristas/filtro?nome=${encodeURIComponent(nome)}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar o motorista: ${response.statusText}`);
        }

        const data = await response.json(); // Pega o JSON completo
        return data.motorista || []; // Retorna apenas o array 'motorista' ou um array vazio caso não exista
    } catch (error) {
        console.error("Erro ao obter motoristas:", error);
        throw error; // Rejoga o erro para ser capturado onde a função é chamada
    }
}
export async function deleteViagem(id) {
    const url = `https://crud-03-09.onrender.com/v1/transportaweb/viagem/${id}`; 
    try {
        const response = await fetch(url, {
            method: 'DELETE' // Método DELETE para excluir a viagem
        });

        if (!response.ok) {
            throw new Error(`Erro ao excluir a viagem: ${response.statusText}`);
        }

        const data = await response.json();
        return data; // Retorna a resposta do servidor após a exclusão
    } catch (error) {
        console.error("Erro ao excluir a viagem:", error); // Log do erro
        throw error; // Lança o erro para ser tratado na chamada da função
    }
}

export async function getCargas() {
    try {
        const response = await fetch(`https://crud-03-09.onrender.com/v1/transportaweb/cargas`);
        if (response.ok) {
            const data = await response.json();
            return data.empresas || []; // Retorna o array de caminhões ou um array vazio
        } else {
            console.error("Erro ao obter cargas:", response.statusText);
            return [];
        }
    } catch (error) {
        console.error("Erro de rede ao obter cargas:", error);
        return []; // Retorna um array vazio em caso de erro
    }
}
export async function getCarga(id) {
    const url = `https://crud-03-09.onrender.com/v1/transportaweb/carga/${id}` 
    const response = await fetch(url)
    const data = await response.json()
    return data.partida    
}
export async function getEmpresaViagens(id) {
    const url = `https://crud-03-09.onrender.com/v1/transportaweb/empresaviagem/${id}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data.empresa_viagem; // Retorna o array ou objeto esperado
    } catch (error) {
        console.error('Erro ao buscar viagens:', error);
        throw error; // Relança o erro para tratamento externo
    }
}

export async function getMotoristasEquipe(id) {
    const url = `https://crud-03-09.onrender.com/v1/transportaweb/motoristaequipe/${id}` 
    const response = await fetch(url)
    const data = await response.json()
    return data.equipe    
}
export async function editPerfilEmpresa(id, dadosAtualizados) {
    const url = `https://crud-03-09.onrender.com/v1/transportaweb/empresa/${id}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosAtualizados), // Envia os dados atualizados do motorista
        });

        if (!response.ok) {
            const errorDetails = await response.json(); // Obtém detalhes do erro
            throw new Error(`Erro ao atualizar o perfil da empresa: ${errorDetails.message || response.statusText}`);
        }

        return await response.json(); // Retorna a resposta do backend
    } catch (error) {
        console.error('Erro no backend:', error);
        throw new Error('Erro ao atualizar o perfil da empresa.');
    }
}

export async function postVeiculo(insert) {
    try {
        // Faz a requisição para a API
        const response = await fetch('https://crud-03-09.onrender.com/v1/transportaweb/newveiculo', {
            method: 'POST',
            body: JSON.stringify(insert),
            headers: { 'Content-Type': 'application/json' }
        });

        // Verifica o status da resposta
        console.log('Status da resposta:', response.status);

        // Se a resposta for bem-sucedida (status 2xx)
        if (response.ok) {
            const data = await response.json();
            console.log('Resposta da API:', data);
            return true; // Sucesso
        } else {
            console.error('Erro da API:', await response.text());  // Mostra a mensagem de erro da API
            return false;  // Falha
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        return false;  // Falha em caso de erro na requisição
    }
}

