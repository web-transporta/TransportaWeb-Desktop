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

    const url = `https://crud-03-09.onrender.com/v1/transportaweb/viagens` 
    const response = await fetch(url)
    const data = await response.json()
    return data.viagens    
}

export async function getViagem(id) {
    const url = `https://crud-03-09.onrender.com/v1/transportaweb/viagem/${id}`
    console.log(url);
    const response = await fetch(url)
    const data = await response.json()
    return data.viagem[0]
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


export async function getMotorista(id) {
    const url = `https://crud-03-09.onrender.com/v1/transportaweb/motoristas/${id}` 
    const response = await fetch(url)
    const data = await response.json()
    return data.motorista    
}
export async function getEmpresa() {
    const url = `https://crud-03-09.onrender.com/v1/transportaweb/empresas/${id}` 
    const response = await fetch(url)
    const data = await response.json()
    return data.empresa    
}

export async function getVeiculos() {
    try {
        const response = await fetch(`https://crud-03-09.onrender.com/v1/transportaweb/veiculos`);
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

export async function getMotoristas(){
    const url = 'https://crud-03-09.onrender.com/v1/transportaweb/motoristas'
    const respose = await fetch(url)
    const data = await respose.json()
    return data.motoristas
}

export async function getEmpresas(){
    const url = 'https://crud-03-09.onrender.com/v1/transportaweb/empresas'
    const respose = await fetch(url)
    const data = await respose.json()
    return data.empresas
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






