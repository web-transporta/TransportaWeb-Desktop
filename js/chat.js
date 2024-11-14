let myName = "";
let profileImageUrl = "";
export let recipientId = "";

const firebaseConfig = {
    apiKey: "AIzaSyCt8YFxzXXLpwrYhTmNJwLxrlDJmrv5xNE",
    authDomain: "chattransportaweb.firebaseapp.com",
    databaseURL: "https://chattransportaweb-default-rtdb.firebaseio.com/",
    projectId: "chattransportaweb",
    storageBucket: "chattransportaweb.appspot.com",
    messagingSenderId: "12425063178",
    appId: "1:12425063178:web:c92888cbeb7ae8628728f3"
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

    firebase.database().ref("messages").push().set({
        sender,
        senderId,
        receiverId: recipientId,
        message,
        profileImageUrl,
        timestamp: Date.now()
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

            messageElement.innerHTML = `
                <div class="message-card">${messageData.message}</div>
                <div class="profile-card" style="background-image: url(${messageData.profileImageUrl});"></div>
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

document.querySelector(".input-area input[type='text']").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
    }
});