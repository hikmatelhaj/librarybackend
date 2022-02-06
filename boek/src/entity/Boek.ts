import {Entity, Column, Unique} from "typeorm";
import {Item} from "./Item";

@Entity()
@Unique(["isbn_nummer"])
export class Boek extends Item {

    @Column({type: 'bigint'})
    isbn_nummer: string;

    @Column()
    voornaam_auteur: string;

    @Column()
    achternaam_auteur: string;

    @Column()
    uitgever: string;



}
