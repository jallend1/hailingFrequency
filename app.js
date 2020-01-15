const form = document.querySelector('form');
const chatWindow = document.querySelector('#chatwindow');
document.getElementById('message').focus();                             //Puts cursor in Message input


let author = "Anonymous"
if(localStorage.localUsername){
    author = localStorage.localUsername;
}

// ***************************
// * Retrieve existing chats *
// ***************************
const chats = db.collection('ds9').orderBy("timestamp").get()           // Sorts by timestamp
    .then(snapshot => {
        snapshot.forEach(chat => {
            chatWindow.innerHTML+= `
                <li>${chat.data().chat} -${chat.data().username}</li>
            `
            console.log(chat.data())
        });
    });

// Sends chat to database
const addChat = () => {
    db.collection('ds9').add({
        chat: form.newchat.value,
        username: author,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    form.reset();
};

// Updates author information and also stores it locally
const addAuthor = () =>{
    author = form.user.value;
    localStorage.setItem('localUsername', author);
}


// ****************************
// *  Listen for form updates *
// ****************************
window.addEventListener('submit', e => {
    e.preventDefault();
    if(form.newchat.value && form.user.value){
        addAuthor();    
        addChat();
    }
    else if(form.newchat.value){
        addChat();
    }
    else if(form.user.value){
        addAuthor;
        form.reset();
    }
}); 