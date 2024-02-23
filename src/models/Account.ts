import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Network } from "./Network";
import { Tx } from "./Tx";
import { Proof } from "./Proof";

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

  @OneToMany(() => Tx, (tx) => tx.account)
  transactions?: Tx[];

  @OneToOne(() => Proof, (proof) => proof.id, { eager: true })
  @JoinColumn([{ name: "current_proof", referencedColumnName: "id" }])
  currentProof: Proof;

  @Column({ type: "bigint", nullable: false, default: 0 })
  balance: String;
}
