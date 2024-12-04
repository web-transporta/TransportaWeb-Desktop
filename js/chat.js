let myName = "";
let profileImageUrl = "";
export let recipientId = "";


const firebaseConfig = {
    apiKey: "AIzaSyBjgxgNsKlSunM9xO1RyayI4t1ZsszM_zU",
    authDomain: "chat-transportaweb.firebaseapp.com",
    databaseURL: "https://chat-transportaweb-default-rtdb.firebaseio.com",
    projectId: "chat-transportaweb",
    storageBucket: "chat-transportaweb.firebasestorage.app",
    messagingSenderId: "750911371591",
    appId: "1:750911371591:web:43f46696736eac9bc4b462"
  };


firebase.initializeApp(firebaseConfig);


function sendMessage() {
    const messageInput = document.querySelector(".input-area input[type='text']");
    const message = messageInput.value.trim();


    if (message === "") return;


    const myName = localStorage.getItem("myName") || "";
    const profileImageUrl = localStorage.getItem("profileImageUrl") || "";
    const senderId = localStorage.getItem("userId");
    const sender = myName;


    // Obter horário atual formatado
    const timestamp = new Date();
    const time = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


    firebase.database().ref("messages").push().set({
        sender,
        senderId,
        receiverId: recipientId,
        message,
        profileImageUrl,
        time // Armazena o horário formatado
    });


    messageInput.value = "";
}


function loadMessages() {
    const chatContent = document.getElementById("chatContent");


    const currentUserId = localStorage.getItem("userId");


    firebase.database().ref("messages").on("value", function(snapshot) {
        chatContent.innerHTML = "";


        const messages = [];
        snapshot.forEach(childSnapshot => {
            messages.push(childSnapshot.val());
        });


        const conversationKey = [currentUserId, recipientId].sort().join("-");
        const currentConversation = messages.filter(messageData => {
            const key = [messageData.senderId, messageData.receiverId].sort().join("-");
            return key === conversationKey;
        });


        currentConversation.forEach(messageData => {
            const messageElement = document.createElement("div");
            const messageClass = messageData.senderId === currentUserId ? "my-message" : "other-message";
            messageElement.classList.add(messageClass);


            // Estrutura de mensagem com horário
            messageElement.innerHTML = `
                <div class="message-card">${messageData.message}</div>
                <div class="profile-card" style="background-image: url(${messageData.profileImageUrl});"></div>
                <div class="time">${messageData.time}</div>
            `;


            chatContent.appendChild(messageElement);
        });


        chatContent.scrollTop = chatContent.scrollHeight;
    });
}


export function setRecipientId(newRecipientId) {
    recipientId = newRecipientId;
    console.log("Recipient ID set to:", recipientId);
    loadMessages();
}

document.querySelector(".button-message .send").addEventListener("click", function(e) {
    e.preventDefault();
    sendMessage();
});

// Função para redirecionar para a página de detalhes do motorista
document.querySelector("#button-visitar-perfil").addEventListener("click", function() {
    // Redireciona para a página detalhesMotorista.html com o ID do motorista como parâmetro
    window.location.href = `../html/detalhesMotorista.html?id=${recipientId}`;
});


