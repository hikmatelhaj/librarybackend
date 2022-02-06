import "reflect-metadata";
import {createConnection} from "typeorm";
import {DAO} from "./DAO";
import * as express from "express";
const bodyParser = require('body-parser');
const cors = require('cors');
import * as WebSocket from 'ws';




createConnection().then(async connection => {

    const app = express();
    console.log("Express framework:");

    app.use(cors());
    app.use(express.static(__dirname + 'static'));

    // Configuring body parser middleware
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(express.json());

    // register routes
    const bookRouter = require('./routes/boeken');
    app.use('/admin',bookRouter );

    const huurRouter = require('./routes/huren');
    app.use('/huren',huurRouter);

    const persoonbeheerRouter = require('./routes/persoonbeheer');
    app.use('/persoonbeheer', persoonbeheerRouter)

    const cdRouter = require('./routes/cds')
    app.use('/cd', cdRouter)

    //make static folder publicly
    app.use(express.static(__dirname + '/static'));




    const server = require('http').createServer(app)
    const wss = new WebSocket.Server({ server: server})

    wss.on('connection', function connection(ws) {
        console.log("new client connected!")
        ws.send("welcome new client")       //triggered when new client connects to server

        ws.on('message', function incoming(data, isBinary) {        // triggered when server receives message from client
            console.log('received: %s', data);                                            //  Data wordt  gebroadcast naar
                                                                                            // alle nog luitserende clients (buiten zichzelf) zodat ze weten dat er een aanpassing gebeurd is
            console.log()
            wss.clients.forEach(function each(client) {
                if (client !== ws && client.readyState === WebSocket.OPEN) {               // en er gerefreshed moet worden.
                    client.send(data, { binary: isBinary });
                }
            });
        });
    });


    server.listen(3000);            // app => server

}).catch(error => console.log(error));
