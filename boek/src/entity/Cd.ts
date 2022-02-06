import {Entity, Column, Unique} from "typeorm";
import {Item} from "./Item";

@Entity()
@Unique(["EAN"])
export class Cd extends Item {

    @Column({type: 'bigint'})
    EAN: string;

    @Column()
    speelduur: string;


}
