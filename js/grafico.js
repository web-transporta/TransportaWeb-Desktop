import { getViagens } from './funcoes.js';


document.addEventListener('DOMContentLoaded', async () => {
    const viagens = await getViagens();


    // Contabiliza as viagens por mês
    const viagensPorMes = new Array(12).fill(0);
    viagens.forEach(viagem => {
        const mes = new Date(viagem.dia_partida).getMonth();
        viagensPorMes[mes]++;
    });


    // Configura os rótulos dos meses
    const labels = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];


    // Cria o gráfico
    const ctx = document.getElementById('viagensChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut', // Gráfico do tipo rosca
        data: {
            labels,
            datasets: [{
                label: 'Viagens Realizadas',
                data: viagensPorMes,
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                    '#FF9F40', '#FFCD56', '#4BC0C0', '#FF6384', '#36A2EB',
                    '#9966FF', '#FF9F40'
                ],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'right', // Posição da legenda (à direita)
                    labels: {
                        font: {
                            size: 14,
                            family: 'Nunito, Arial, sans-serif'
                        },
                        color: '#333'
                    }
                },
                title: {
                    display: true,
                    text: 'Viagens Realizadas por Mês',
                    font: {
                        size: 18,
                        family: 'Nunito, Arial, sans-serif',
                        weight: 'bold'
                    },
                    color: '#333'
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const value = context.raw;
                            return `${context.label}: ${value} viagens`;
                        }
                    }
                }
            },
            animation: {
                animateScale: true, // Animação de escala
                animateRotate: true // Animação de rotação
            }
        }
    });
});




document.addEventListener('DOMContentLoaded', async () => {
    const viagens = await getViagens();


    // Supondo que você tenha a empresa logada com o ID, aqui estamos buscando as viagens dessa empresa
    const empresaLogadaId = 123;  // Exemplo: substitua isso pela variável que contém o ID da empresa logada


    // Filtra as viagens pela empresa logada
    const viagensDaEmpresa = viagens.filter(viagem => viagem.empresa_id === empresaLogadaId);


    // Obtém o total de viagens realizadas pela empresa
    const totalViagens = viagensDaEmpresa.length;


    // Exibe no card
    const totalViagensElement = document.getElementById('totalViagens');
    totalViagensElement.textContent = `${totalViagens} Viagens`;
});
