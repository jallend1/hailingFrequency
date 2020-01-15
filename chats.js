// Pulls existing chats from the database
const existingChats = () => {
    db.collection(chatRoom).orderBy("timestamp").onSnapshot(snapshot => {
        snapshot.docChanges().forEach(chat => {
            if(chat.type === 'added'){
                chatWindow.innerHTML+= `
                    <li>${chat.doc.data().chat} <span id="displayedName">-${chat.doc.data().username}</span></li>
                `
            }
        });
    });
}

// Sends chat to database
const addChat = () => {
    db.collection(chatRoom).add({
        chat: form.newchat.value,
        username: author,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    form.reset();
}