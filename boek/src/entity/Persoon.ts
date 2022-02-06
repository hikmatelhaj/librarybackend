    import {Column, Entity, OneToMany, PrimaryColumn, OneToOne, JoinColumn} from "typeorm";
import {Item} from "./Item";
import {Bibkaart} from "./Bibkaart";

@Entity()
export class Persoon {

    @PrimaryColumn()
    email: string;

    @Column()
    voornaam: string;

    @Column()
    familienaam: string;

    @OneToMany(() => Item, item => item.persoon)
    items: Item[];

    @OneToOne(() => Bibkaart, {
        cascade: true,
    })

    @JoinColumn()
    bibkaart: Bibkaart;

}