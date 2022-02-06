import {DAO} from "../DAO";
import {Request, Response} from "express";


const express = require('express')
const router = express.Router()
const dao = new DAO();


router.post("/boek-toevoegen", async function (req: Request, res: Response) {
    try {
        const book = req.body
        await dao.addBoek(book.titel, book.voornaam_auteur, book.achternaam_auteur, book.uitgever, book.isbn_nummer, book.genrenaam, book.taal, book.jaar);
        return res.sendStatus(200);

    } catch (error) {
        console.log(error)
        return res.sendStatus(406);
    }
});

router.post("/boeken-toevoegen", async function (req: Request, res: Response) {
    try {
        const books = req.body
        await dao.addBoekenArray(books);
        return res.sendStatus(200);

    } catch (error) {
        console.log(error)
        return res.sendStatus(406);
    }
});



router.route("/:id")
.get( async function (req, res) {
    try {
        const boek = await dao.getBoekById(req.params.id);
        return res.send(boek);
    } catch (error) {
        return res.sendStatus(406);
    }


})
    .delete(async function (req, res) {
        try {
            await dao.deleteBoekById(req.params.id);
            return res.sendStatus(200);
        } catch (error) {
            return res.sendStatus(404);
        }

    })


module.exports = router