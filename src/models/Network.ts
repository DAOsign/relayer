import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Account } from "./Account";

@Entity("network")
export class Network extends BaseEntity {
  @PrimaryColumn()
  network_id!: number;

  @Column({ type: "varchar", unique: true, nullable: false })
  name!: string;

  @OneToMany(() => Account, (account) => account.network)
  accounts?: Account[];
}
