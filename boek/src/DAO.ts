import "reflect-metadata";
import {getManager} from "typeorm";
import {EntityManager} from "typeorm/entity-manager/EntityManager";
import {Boek} from "./entity/Boek";
import {Genre} from "./entity/Genre";
import {Persoon} from "./entity/Persoon";
import {Cd} from "./entity/Cd";
import {Bibkaart} from "./entity/Bibkaart";
import {Item} from "./entity/Item";



export class DAO {
    entityManager: EntityManager;

    constructor() {
        this.entityManager = getManager();
    }

    async uitLenenBoek(id: number, persoon: Persoon) {
        const a = await this.entityManager.findOne(Boek, {where: {id: id} });
        a.persoon = persoon;
        return await this.entityManager.update(Boek, id, a);
    }

    async terugbrengenBoek(id: number) {
        const a = await this.entityManager.findOne(Boek, {where: {id: id} });
        a.persoon = null;
        return await this.entityManager.update(Boek, id, a);
    }

    async getAlleBoeken() {
        return await this.entityManager.find(Boek); //{relations: ["persoon", "genrenaam"]}
    }

    async getCdByEAN (ean: number) {
        return await this.entityManager.find(Cd, {where: {EAN: ean}});
    }

    async getAlleCds () {
        return await this.entityManager.find(Cd);
    }

    async deleteBoekById(id: number) {
        return await this.entityManager.delete(Boek, id);
    }

    async getBoekById (id: number) { //miss dit houden, op de website een lijst van alle boeken (met bv 1 item) hebben en als je er op klikt
        return await this.entityManager.find(Boek, {where: {id: id}});
    }


    async updateBibkaart(id: number, bib: Bibkaart) {
        return await this.entityManager.update(Bibkaart, id, bib);
    }

    async getAlleBibkaarten() {
        return await this.entityManager.find(Bibkaart);
    }

    async getAlleItems() {
        return await this.entityManager.find(Item);
    }

    async createBibkaartWithoutSave(barcode) {
        const bibkaart = new Bibkaart();
        bibkaart.barcode = barcode;
        return bibkaart;
    }

    async deleteCdById(id: number) {
        return await this.entityManager.delete(Cd, id);
    }

    async updateCd(id: number, cd: Cd) {
        return await this.entityManager.update(Cd, id, cd);
    }

    async getPersoonByEmail(email: string)  {
        return await this.entityManager.findOne(Persoon, {where: {email: email} });
    }

    async getBoekByISBN(isbn: number) {
        return await this.entityManager.findOne(Boek, {where: {isbn_nummer: isbn}, relations: ["persoon"]});
    }


    async updatePersoon(email: string, persoon: Persoon) {
        return await this.entityManager.update(Persoon, email, persoon);
    }


    async addBoekWithoutSave(titel: string, voornaam_auteur: string, achternaam_auteur: string, uitgever: string, isbn_nummer: string, genres, taal: string, jaar: number  ) {
        const boek = new Boek();
        console.log(genres);
        boek.voornaam_auteur = voornaam_auteur;
        boek.achternaam_auteur = achternaam_auteur;
        boek.uitgever = uitgever;
        boek.isbn_nummer = isbn_nummer;
        boek.titel = titel;
        boek.taal = taal;
        boek.jaar = jaar;
        let tempgenres = [];
        for (let i = 0; i < genres.length; i++) {
            let genre = genres[i];
            await this.entityManager.findOne(Genre, {where: {genrenaam: genre}}).then(async a => {
                if (a == undefined) {
                    const nieuw_genre = new Genre();
                    nieuw_genre.genrenaam = genre;
                    await this.entityManager.save(nieuw_genre);
                    tempgenres.push(nieuw_genre);
                } else {
                    tempgenres.push(a);
                }
            });
        }
        boek.genrenaam = Promise.resolve(tempgenres);
        return boek;
    }


    // voor database op te vullen
    async addBoek(titel: string, voornaam_auteur: string, achternaam_auteur: string, uitgever: string, isbn_nummer: string, genres, taal: string, jaar: number  ) {
        let boek = await this.addBoekWithoutSave(titel, voornaam_auteur, achternaam_auteur, uitgever, isbn_nummer, genres, taal, jaar);
        await this.entityManager.save(boek);
        return boek;
    }

    // voor database op te vullen
    async addCd(EAN: string, speelduur: string, titel: string, taal: string, jaar: number, genres) {
        const cd = new Cd();
        cd.EAN = EAN;
        cd.speelduur = speelduur;
        cd.titel = titel;
        cd.taal = taal;
        cd.jaar = jaar;
        let tempgenres = [];
        for (let genre of genres) {
            await this.entityManager.findOne(Genre, {where: {genrenaam: genre}}).then(async a => {
                if (a == undefined) {
                    const nieuw_genre = new Genre();
                    nieuw_genre.genrenaam = genre;
                    await this.entityManager.save(nieuw_genre);
                    tempgenres.push(nieuw_genre);
                } else {
                    tempgenres.push(a);
                }
            });
        }
        cd.genrenaam = Promise.resolve(tempgenres);
        await this.entityManager.save(cd);
        return cd;
    }


    async addPersoon(persoon: Persoon) {
        const create = await this.entityManager.create(Persoon, persoon);
        const result = await this.entityManager.save(create);
        return result;
    }

    async addBoekenArray(boeken) {
        for (let i = 0; i<boeken.length; i++) {
            const obj = boeken[i];
            console.log(obj.isbn_nummer);
            await this.addBoek(obj.titel, obj.voornaam_auteur, obj.achternaam_auteur, obj.uitgever, obj.isbn_nummer, obj.genrenaam, obj.taal, obj.jaar);
        }
    }





}





