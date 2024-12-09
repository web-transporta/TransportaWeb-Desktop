import { getPartida, insertPartida } from "./funcoes.js";

document.addEventListener("DOMContentLoaded", async () => {
    const cepSelect = document.getElementById("selectCep");
    const ruaInput = document.getElementById("rua");
    const bairroInput = document.getElementById("bairro");
    const cidadeInput = document.getElementById("cidade");
    const estadoInput = document.getElementById("estado");
    const paisInput = document.getElementById("pais");
    const modalCep = document.getElementById("modalCep");
    const btnAdicionarCep = document.getElementById("adicionarCep");
    const novoCepInput = document.getElementById("novoCep");
    const salvarCepBtn = document.getElementById("salvarCep");
    const imagemDireita = document.querySelector(".imagem-direita");
    let map, marker;

    paisInput.value = "Brasil";

    // Inicializa o mapa com localização padrão
    const initializeMap = () => {
        map = new google.maps.Map(imagemDireita, {
            center: { lat: -14.235004, lng: -51.92528 }, // Coordenadas do Brasil
            zoom: 4,
        });

        marker = new google.maps.Marker({
            position: { lat: -14.235004, lng: -51.92528 },
            map: map,
        });
    };

    // Atualiza o mapa com nova localização
    const updateMap = (latitude, longitude) => {
        const position = { lat: latitude, lng: longitude };
        map.setCenter(position);
        map.setZoom(15);
        marker.setPosition(position);
    };

    // Função para buscar informações do CEP e atualizar mapa
    const buscarCep = async (cep) => {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            if (!response.ok) throw new Error("Erro ao buscar CEP");

            const data = await response.json();
            if (data.erro) throw new Error("CEP não encontrado");

            ruaInput.value = data.logradouro || "";
            bairroInput.value = data.bairro || "";
            cidadeInput.value = data.localidade || "";
            estadoInput.value = data.uf || "";

            // Busca coordenadas usando a API do Google Maps
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address: `${data.logradouro}, ${data.localidade}, ${data.uf}` }, (results, status) => {
                if (status === "OK") {
                    const location = results[0].geometry.location;
                    updateMap(location.lat(), location.lng());
                } else {
                    console.error("Erro ao buscar coordenadas: " + status);
                }
            });
        } catch (error) {
            console.error(error.message);
            alert("Erro ao buscar informações do CEP");
        }
    };

    // Limpa os campos de endereço
    const limparCampos = () => {
        ruaInput.value = "";
        bairroInput.value = "";
        cidadeInput.value = "";
        estadoInput.value = "";
    };

    // Preenche o select com os CEPs retornados do banco
    const preencherSelectCeps = async () => {
        try {
            const empresas = await getPartida();
            if (empresas && empresas.length > 0) {
                cepSelect.innerHTML = '<option value="">Selecione um CEP</option>';
                empresas.forEach((empresa) => {
                    if (empresa.cep) {
                        const option = document.createElement("option");
                        option.value = empresa.cep;
                        option.textContent = empresa.cep;
                        cepSelect.appendChild(option);
                    }
                });
            }
        } catch (error) {
            console.error("Erro ao preencher CEPs: ", error);
        }
    };

    // Abre o modal para adicionar novo CEP
    btnAdicionarCep.addEventListener("click", () => {
        modalCep.style.display = "block";
    });

    // Fecha o modal
    document.getElementById("closeModal").addEventListener("click", () => {
        modalCep.style.display = "none";
    });

    // Salva o novo CEP no banco
    salvarCepBtn.addEventListener("click", async () => {
        const novoCep = novoCepInput.value.trim();
        if (!novoCep) {
            alert("Digite um CEP válido.");
            return;
        }

        try {
            const response = await insertPartida({ cep: novoCep });
            if (response.success) {
                alert("CEP salvo com sucesso!");
                modalCep.style.display = "none";
                preencherSelectCeps();
            } else {
                throw new Error("Erro ao salvar o CEP.");
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar o CEP.");
        }
    });

    // Listener para buscar informações do CEP ao selecionar no dropdown
    cepSelect.addEventListener("change", () => {
        const selectedCep = cepSelect.value;
        if (selectedCep) {
            buscarCep(selectedCep);
        } else {
            limparCampos();
        }
    });

    // Listener para buscar informações do CEP ao digitar
    document.getElementById("cep").addEventListener("input", (e) => {
        const cep = e.target.value.replace(/\D/g, "");
        if (cep.length === 8) {
            buscarCep(cep);
        } else {
            limparCampos();
        }
    });

    // Inicializa a aplicação
    await preencherSelectCeps();
    initializeMap();
});
