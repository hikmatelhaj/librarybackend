import {DAO} from "../DAO";
import {Request, Response} from "express";
import * as path from 'path';
import {Persoon} from "../entity/Persoon";
import {Bibkaart} from "../entity/Bibkaart";

const express = require('express')
const router = express.Router()
const dao = new DAO();

function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

router.route("/")
    .get( async function (req: Request, res: Response) {
        try {
            return res.sendFile(path.join(__dirname+'/../static/formulier.html'));
        } catch (error) {
            console.log(error);
            return res.sendStatus(500);
        }

})
    .post(async function (req: Request, res: Response) {
        try {
            const obj = req.body;
            const type = obj.type; //boek huren of terugbrengen
            delete obj.type;
            const persoon = await dao.getPersoonByEmail(obj.email);
            let id = undefined;
            let boek = undefined;
            await dao.getBoekByISBN(obj.isbn_nummer).then(a => {
                if (a != undefined) {
                    id = a.id
                    boek = a;
                }
            }); //get id from isbn number

            if (id == undefined) {
                return res.json({"antw": "ISBN niet gevonden"});

            }
            delete obj.isbn_nummer

            if (persoon == undefined) {
                // Barcode generaten
                let barcode = "";
                for (let i = 0; i<=8; i++) {
                    barcode += randomIntFromInterval(0, 9).toString();
                }

                const bib = new Bibkaart();
                bib.barcode = barcode;

                // User doesn't exist, so we add the created user
                const persoon2 = await dao.entityManager.create(Persoon, obj); // create persoon
                persoon2.bibkaart = bib;
                await dao.entityManager.save(Persoon, persoon2); // save persoon
                if (type == "huren") {
                    if (boek.persoon != null) {
                        return res.json({"antw": "Iemand anders heeft dit boek al gehuurd, het is niet beschikbaar momenteel. Je kan hier een lijst vinden met alle beschikbare boeken: http://193.191.169.111:3000/huren/beschikbare-boeken"})
                    }
                    await dao.uitLenenBoek(id, persoon2);
                } else {
                    return res.send({"antw":"Je kan niet terugbrengen als je niet gehuurd hebt."})
                }

            } else {
                // Else we we use the already existing persoon
                if (type == "huren") {
                    if (boek.persoon != null) {
                        return res.json({"antw": "Iemand anders heeft dit boek al gehuurd, het is niet beschikbaar momenteel. Je kan hier een lijst vinden met alle beschikbare boeken: http://193.191.169.111:3000/huren/beschikbare-boeken"})
                    }
                    await dao.uitLenenBoek(id, persoon); //uitlenen boek, persoon bestaat al (via getisbn)

                } else {
                    await dao.terugbrengenBoek(id);
                }

            }
            return res.send({"antw":"Het formulier is met success ingediend."})
        } catch (error) {
            console.log(error);
            return res.sendStatus(406);
        }

    });



// pagina met alle boeken laden
router.get("/beschikbare-boeken", async function (req: Request, res: Response) {
    try {
        return res.sendFile(path.join(__dirname+'/../static/boek.html'));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }


});


// json object met alle beschikbare boeken sturen naar de client
router.get("/beschikbare-boeken/alle-boeken", async function (req: Request, res: Response) {
    try {
        const boeken = await dao.getAlleBoeken();
        return res.send(boeken);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

module.exports = router