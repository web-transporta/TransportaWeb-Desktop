import { getMotoristas, getEmpresas } from "./funcoes.js";
import { setRecipientId } from "./chat.js";

// Função para carregar contatos e configurar elementos
async function renderContacts() {
    const userType = localStorage.getItem('userType');
    const contactsContainer = document.querySelector('.contacts');

    contactsContainer.innerHTML = '';

    if (userType === 'empresa') {
        const motoristas = await getMotoristas();
        motoristas.forEach(motorista => {
            createContactElement(motorista.id, motorista.nome, motorista.foto_url);
        });
    } else if (userType === 'funcionario') {
        const empresas = await getEmpresas();
        empresas.forEach(empresa => {
            createContactElement(empresa.id, empresa.nome, empresa.foto_url);
        });
    }
}

// Função para criar o elemento de contato e carregar a última mensagem
function createContactElement(id, name, imageUrl) {
    const contactsContainer = document.querySelector('.contacts');

    const contactContainer = document.createElement('div');
    contactContainer.classList.add('contact-container');
    contactContainer.setAttribute('data-id', id);

    const profileImg = document.createElement('div');
    profileImg.classList.add('profile-img');
    profileImg.style.backgroundImage = `url(${imageUrl})`;

    const message = document.createElement('div');
    message.classList.add('message');

    const contactName = document.createElement('div');
    contactName.classList.add('contact-name');
    contactName.textContent = name;

    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.textContent = 'Inicie uma conversa';

    // Carregar a última mensagem do Firebase
    loadLastMessage(id, messageContent, name);

    message.appendChild(contactName);
    message.appendChild(messageContent);
    contactContainer.appendChild(profileImg);
    contactContainer.appendChild(message);
    contactsContainer.appendChild(contactContainer);

    contactContainer.addEventListener('click', () => {
        const receiverImg = document.getElementById('receiverImg');
        const receiverName = document.getElementById('receiverName');

        receiverImg.style.backgroundImage = `url(${imageUrl})`;
        receiverName.textContent = name;

        setRecipientId(id);
    });
}

// Função para carregar a última mensagem do Firebase
function loadLastMessage(contactId, messageContent, contactName) {
    const currentUserId = localStorage.getItem("userId");
    const conversationKey = [currentUserId, contactId].sort().join("-");

    firebase.database().ref("messages").on("value", (snapshot) => {
        let lastMessage = null;

        snapshot.forEach((childSnapshot) => {
            const messageData = childSnapshot.val();
            const key = [messageData.senderId, messageData.receiverId].sort().join("-");

            if (key === conversationKey) {
                lastMessage = messageData;
            }
        });

        if (lastMessage) {
            if (lastMessage.senderId === currentUserId) {
                messageContent.textContent = `Você: ${lastMessage.message}`;
            } else {
                messageContent.textContent = `${contactName}: ${lastMessage.message}`;
            }
        } else {
            messageContent.textContent = "Inicie uma conversa";
        }
    });
}

document.addEventListener('DOMContentLoaded', renderContacts);
