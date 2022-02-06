// Create WebSocket connection.
const socket = new WebSocket('ws://193.191.169.111:3000');

// Connection opened
socket.addEventListener('open', function (event) {
    console.log("connectie opgebouwd")
});

// Listen for messages, if asked for a refresh, refresh page
socket.addEventListener('message', function (event) {
    console.log('Message from server hikmat', event.data);
    if(event.data === "refresh"){                               // als binnenkomend bericht overeen komt met refresh, pagina herladen, in echte applicatie is dit bericht versleuteld.
        window.location.reload();
    }
});




fetch('http://193.191.169.111:3000/huren/beschikbare-boeken/alle-boeken')
    .then(response => response.json())
    .then( async a => {
        let first = document.getElementById("first");
        for (let i = 0; i<a.length ; i++) {
            let obj = a[i];
            let tr = document.createElement("tr");
            let td1 = document.createElement("td");
            td1.innerText = obj.titel;
            tr.appendChild(td1);

            let td2 = document.createElement("td");
            td2.innerText = obj.isbn_nummer;
            tr.appendChild(td2);


            let td3 = document.createElement("td");
            td3.innerText = obj.taal;
            tr.appendChild(td3);

            let td4 = document.createElement("td");
            td4.innerText = obj.jaar;
            tr.appendChild(td4);

            let td5 = document.createElement("td");
            td5.innerText = obj.voornaam_auteur + " " + obj.achternaam_auteur;
            tr.appendChild(td5);




            let td6 = document.createElement("td");
            td6.innerText = obj.uitgever;
            tr.appendChild(td6);

            let status = "";
            if (obj.persoon == null) {
                status = "Vrij";
            } else {
                status = "Niet beschikbaar";
            }

            let td7 = document.createElement("td");
            td7.innerText = status;
            tr.appendChild(td7);

            first.appendChild(tr);







        }

    }

    );