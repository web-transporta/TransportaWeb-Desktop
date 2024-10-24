import { getViagens } from "./funcoes.js"

const criarContainer = (viagem) => {
    //  <a class="w-full flex items-center justify-center" href="./servico.html">
    //             <div class="w-[80%] h-40 bg-input rounded-2xl flex flex-row justify-between p-4 border-4 border-principal hover:scale-105 duration-150">

    //                 <div class="flex flex-col gap-2">
    //                 <h1 class="font-fontDestaque text-2xl text-principal">
    //                     Lavagem Simples
    //                 </h1>
    //                 <p class="font-font text-[16px] text-letra">
    //                     descrição descrição descrição descrição descrição descrição descrição descrição  descrição descrição descrição descrição descrição descrição descrição descrição
    //                 </p>  
    //             </div>
    //             <div class="w-32 h-32 rounded-full bg-input border-2 border-principal bg-cover bg-[url(../../img/teste.svg)] bg-no-repeat"></div> 
    //             </div>
    //         </a>  

    const referenciar = document.createElement('button')
    referenciar.className = 'w-full flex items-center justify-center'
    referenciar.addEventListener('click', ()=> {
        console.log('a');
        localStorage.setItem('servicoId', viagem.id)
        window.location.href = ''
    }) 

    const container = document.createElement('div')
    container.className = ''

    const card = document.createElement('div')
    card.className = ''

    const id_viagem = document.createElement('h1')
    id_viagem.className = ''
    id_viagem.textContent = viagem.id_viagem

    const remetente = document.createElement('p')
    remetente.className = ''
    remetente.textContent = viagem.remetente

    const destinatario = document.createElement('p')
    destinatario.className = ''
    destinatario.textContent = viagem.destinatario


    referenciar.appendChild(container)
    container.replaceChildren(card)
    card.replaceChildren(id_viagem, remetente, destinatario)


    // container.replaceChildren(nome, descricao, cardImg)

    card.addEventListener('click', () => {
        localStorage.setItem('viagemId', viagem.id)
    })

    return referenciar


}


async function mostrarContainer() {
    const containerCards = document.getElementById('container-cards')
    const viagens = await getViagens()




    viagens.forEach(viagens => {
        const card = criarContainer(viagens)
        containerCards.appendChild(card)
    })
}

mostrarContainer()

