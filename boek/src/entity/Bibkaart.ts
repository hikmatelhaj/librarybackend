import {Column, Entity, PrimaryGeneratedColumn,} from "typeorm";

@Entity()
export class Bibkaart {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'bigint'})
    barcode: string;

}