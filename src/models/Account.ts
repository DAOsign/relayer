import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Network } from "./Network";
import { Tx } from "./Tx";

@Entity("account")
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn()
  account_id!: number;

  @ManyToOne(() => Network, (network) => network.accounts)
  @JoinColumn([{ name: "network_id", referencedColumnName: "network_id" }])
  network!: Network;

  @Column({ type: "varchar", nullable: false })
  address!: string;

  @Column({ type: "varchar", nullable: false })
  hd_path!: string;

  @Column({ type: "boolean", nullable: false })
  locked!: boolean;

  @OneToMany(() => Tx, (tx) => tx.account)
  transactions?: Tx[];
}
