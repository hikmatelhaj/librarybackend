import {DAO} from "../DAO";
import {Request, Response} from "express";

const express = require('express')
const router = express.Router()
const dao = new DAO();


router.get("/bibkaarten", async function (req: Request, res: Response) {
    try {
        const bibs = await dao.getAlleBibkaarten();
        return res.send(bibs);
    } catch (error) {
        console.log(error);
        return res.sendStatus(406);
    }
})

router.put("/bibkaart/:id", async function (req: Request, res: Response) {
    try {
        const obj = req.body;
        const bibkaart = await dao.createBibkaartWithoutSave(obj.barcode);
        await dao.updateBibkaart(Number(req.params.id), bibkaart);
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(406);
    }
});


module.exports = router;