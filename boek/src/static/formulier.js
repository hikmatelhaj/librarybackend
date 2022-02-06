// Create WebSocket connection.
const socket = new WebSocket('ws://193.191.169.111:3000');

// Connection opened
socket.addEventListener('open', function (event) {
    console.log("connectie opgebouwd")
});

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});


let terugbrengen = document.getElementById("terugbrengen");


let form = document.getElementById("form");

form.addEventListener('submit',   async function(event) {
    // eerst submitten, dan refreshen
    event.preventDefault();
    const data = new URLSearchParams();
    for (const pair of new FormData(form)) {
        if (pair[0] === "isbn_nummer") {
            data.append(pair[0], Number(pair[1]));
        } else {
            data.append(pair[0], pair[1]);
        }

    }

    fetch('http://193.191.169.111:3000/huren', {
        method: 'post',
        body: data,
    }).then(a => a.json()).then(a => alert(a.antw)).then(a => socket.send('refresh'));
    document.forms[0].reset();

})
