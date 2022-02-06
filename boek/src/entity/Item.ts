import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne} from "typeorm";
import {Genre} from "./Genre";
import {Persoon} from "./Persoon";

@Entity()
export abstract class Item {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    titel: string;

    @Column()
    taal: string;

    @Column()
    jaar: number;

    @ManyToMany(() => Genre, {
        lazy: true
    })
    @JoinTable()
    genrenaam: Promise<Genre[]>;            //Promise<Genre[]>;

    @ManyToOne(() => Persoon, persoon => persoon.items, {
        eager: true
    })
    persoon: Persoon;

}
