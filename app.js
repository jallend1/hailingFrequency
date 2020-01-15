const form = document.querySelector('form');
const chatWindow = document.querySelector('#chatwindow');
const ul = document.querySelector('ul');
const li = document.querySelectorAll('li');
const logo = document.querySelector('#logo');

const broadcastName = document.querySelector('#broadcastName');
const updateUsername = document.querySelector('#updateUsername');
const identifier = document.querySelector('#identifier');
document.getElementById('message').focus();                             //Puts cursor in Message input

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

const changeRoom = (room) => {
    chatWindow.innerHTML = "";
    logo.setAttribute('src', `images/${room}.png`)
    localStorage.setItem('lastRoom', chatRoom);
    li.forEach(button => {
        button.innerText === chatRoom.toUpperCase() ? button.classList.add('selected') : button.classList.remove('selected');
    });
    existingChats();
}


let chatRoom = 'ds9'                    
if(localStorage.lastRoom){                  //Defaults to last used chat room
    chatRoom = localStorage.lastRoom;
    changeRoom(chatRoom);
}
let author = "Anonymous"
if(localStorage.localUsername){             //Loads up existing username
    author = localStorage.localUsername;
    broadcastName.textContent = author;
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

// Updates author information and also stores it locally
const addAuthor = () =>{
    author = form.user.value;
    localStorage.setItem('localUsername', author);
    broadcastName.textContent = author;
    updateUsername.classList.add('hide');
    form.reset();
}

// ****************************
// *  Listen for form updates *
// ****************************
window.addEventListener('submit', e => {
    e.preventDefault();
    if(form.newchat.value && form.user.value){      //User updating both username and sending a message
        addAuthor();    
        addChat();
    }
    else if(form.newchat.value){                    //Just sending a chat
        addChat();
    }
    else if(form.user.value){                       //Just updating username
        addAuthor();
    }
}); 

// *****************************
// *  Listen for room changing *
// *****************************
ul.addEventListener('click', e => {
    if(e.target.tagName === "LI"){
        chatRoom = e.target.textContent.toLowerCase();
        changeRoom(chatRoom);
    }
});


// Reveals Update Username field on click
identifier.addEventListener('click', () => {
    updateUsername.classList.toggle('hide');
});