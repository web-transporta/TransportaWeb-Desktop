import { postVeiculo } from "./funcoes.js";

document.addEventListener("DOMContentLoaded", () => {
    const placaInput = document.getElementById("placaVeiculo");
    const anoInput = document.getElementById("anoVeiculo");
    const modeloInput = document.getElementById("modeloVeiculo");
    const capacidadeInput = document.getElementById("capacidadeVeiculo");
    const tipoInput = document.getElementById("tipoVeiculo");
    const finalizarButton = document.getElementById("botao");
  
    const createMessage = (element, message) => {
      const parent = element.parentNode;
      const existingMessage = parent.querySelector(".error-message");
      if (!existingMessage) {
        const errorMessage = document.createElement("div");
        errorMessage.className = "error-message";
        errorMessage.style.color = "#D92727";
        errorMessage.style.fontSize = "12px";
        errorMessage.style.marginTop = "5px";
        errorMessage.textContent = message;
        parent.appendChild(errorMessage);
  
        setTimeout(() => {
          if (errorMessage) errorMessage.remove();
        }, 2000); 
      }
    };
  
    placaInput.addEventListener("input", () => {
      placaInput.value = placaInput.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
    });
  
    anoInput.addEventListener("input", () => {
      if (anoInput.value.match(/\D/)) {
        createMessage(anoInput, "Apenas números são permitidos.");
      }
      anoInput.value = anoInput.value.replace(/\D/g, "").slice(0, 4); 
    });
  
    capacidadeInput.addEventListener("input", () => {
      if (capacidadeInput.value.match(/\D/)) {
        createMessage(capacidadeInput, "Apenas números são permitidos.");
      }
      capacidadeInput.value = capacidadeInput.value.replace(/\D/g, ""); 
    });
    
    // Adicionando o evento de clique no botão "Finalizar"
    finalizarButton.addEventListener("click", () => {
        
        // Coletando os valores dos campos
        const placa = placaInput.value;
        const ano = anoInput.value;
        const modelo = modeloInput.value;
        const capacidade_carga = capacidadeInput.value;
        const tipo = tipoInput.value;
        
        // Verificando se todos os campos foram preenchidos
        if (!placa || !ano || !modelo || !capacidade_carga || !tipo) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        // Criando o objeto com os dados do veículo
        const veiculo = {
            placa: placa,
            ano: ano,
            modelo: modelo,
            capacidade_carga: capacidade_carga,
            tipo: tipo
        };
        
        // Chamando a função postVeiculo para enviar os dados
        postVeiculo(veiculo);

        Swal.fire({
            icon: 'success',
            title: 'Veículo cadastrado com sucesso!',
            text: 'O veículo foi registrado com sucesso no sistema.',
            confirmButtonColor: '#3085d6'
        }).then(() => {
            window.location.href = '../html/paginaHome.html'; 
        });

    });
});
