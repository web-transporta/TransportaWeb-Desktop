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
                    '#FFAEAE', '#FF8888', '#FF6666', '#FF3737', '#F20000',
                    '#CC0000', '#AE0000', '#770000', '#F42932', '#E42427',
                    '#BB1914', '#AD140C'
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

    // Filtra as viagens pela empresa logada
    const idEmpresa = localStorage.getItem('userId');

    // Filtra as viagens da empresa logada
    const viagensDaEmpresa = viagens.filter(viagem => viagem.empresa_id === idEmpresa);

    // Obtém o total de viagens realizadas pela empresa
    const totalViagens = viagensDaEmpresa.length;

    // Exibe no card
    const totalViagensElement = document.getElementById('totalViagens');
    totalViagensElement.textContent = `${totalViagens} Viagens`;
});
