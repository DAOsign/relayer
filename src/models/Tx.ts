import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Network } from "./Network";
import { Account } from "./Account";

@Entity("tx")
export class Tx extends BaseEntity {
  @PrimaryGeneratedColumn()
  tx_id!: number;

  @Column({ type: "jsonb", nullable: false })
  payload!: object;

  @ManyToOne(() => Network, (network) => network.network_id)
  @JoinColumn([{ name: "network_id", referencedColumnName: "network_id" }])
  network!: Network;

  @ManyToOne(() => Account, (account) => account.transactions)
  @JoinColumn([{ name: "account_id", referencedColumnName: "account_id" }])
  account!: Account;

  @Column({ type: "varchar", nullable: true })
  tx_hash!: string;

  @Column({ type: "integer", nullable: true })
  status!: number;

  @Column({ type: "varchar", nullable: true })
  error!: string;

  @CreateDateColumn({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
  updated_at!: Date;
}
