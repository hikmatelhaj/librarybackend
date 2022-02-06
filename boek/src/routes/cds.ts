import {DAO} from "../DAO";
import {Request, Response} from "express";

const express = require('express')
const router = express.Router()
const dao = new DAO();

router.get("/cds-without-genres", async function (req: Request, res: Response) {
    try {
        const cds = await dao.getAlleCds();
        return res.send(cds);
    } catch (error) {
        return res.sendStatus(406);
    }
})

router.get("/cds-with-genres", async function (req: Request, res: Response) {
    try {
        const cds = await dao.getAlleCds();
        const cds_met_genre = [];
        for (let i = 0; i<cds.length; i++) {
            const genres = await cds[i].genrenaam;

            cds_met_genre[i] = {};
            cds_met_genre[i].titel = cds[i].titel;
            cds_met_genre[i].taal = cds[i].taal;
            cds_met_genre[i].jaar = cds[i].jaar;
            cds_met_genre[i].persoon = cds[i].persoon;
            cds_met_genre[i].ean = cds[i].EAN;
            cds_met_genre[i].id = cds[i].id;
            cds_met_genre[i].speelduur = cds[i].speelduur;
            let genrenamen = []
            for (let i = 0; i<genres.length; i++) {
                genrenamen.push(genres[i].genrenaam)
            }
            cds_met_genre[i].genre = genrenamen;

        }
        return res.send(cds_met_genre);
    } catch (error) {
        console.log(error);
        return res.sendStatus(406);
    }

})

module.exports = router;