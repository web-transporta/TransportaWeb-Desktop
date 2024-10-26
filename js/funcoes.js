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