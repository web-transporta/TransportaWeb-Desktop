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