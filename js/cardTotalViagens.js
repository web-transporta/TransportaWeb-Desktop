'use strict'
import { getViagemEmpresa} from "./funcoes.js";

window.addEventListener('DOMContentLoaded', async () => {
    const id = localStorage.getItem('userId');

    if (!id) {
        alert('ID da empresa não encontrado. Por favor, faça login novamente.');
        window.location.href = '/html/login.html';
        return;
    }

    try {
        const id = localStorage.getItem('userId'); 
        const viagens = await getViagemEmpresa(id);

        const totalViagens = viagens.length;

        const cardsContainer = document.querySelector('.all-trips-card');

        if (cardsContainer) {
            const cardHTML = `
                    <div class="text-trips">
                        <div class="title-trips">Total de viagens realizadas:</div>
                        <div class="all-trips">${totalViagens}</div>
                    </div>
                    <div class="image-trips">
                        <img src="../css/img/estatistica.png" alt="estatistica">
                    </div>
            `;

            cardsContainer.innerHTML = cardHTML; 
        } else {
            console.error('Elemento ".all-trips-card" não encontrado no DOM.');
        }
    } catch (error) {
        console.error('Erro ao buscar o total de viagens:', error);
        alert('Erro ao carregar o total de viagens da empresa: ' + error.message);
    }
});
