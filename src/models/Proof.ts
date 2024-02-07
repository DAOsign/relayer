import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Account } from "./Account";

@Entity("proof")
export class Proof {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "varchar" })
  refId: string;

  @Column({ type: "smallint" })
  network: number;

  @Column({ type: "smallint" })
  status: number;

  @Column({ type: "smallint" })
  type: number;

  @Column({ name: "tx_hash", type: "varchar", nullable: true })
  txHash?: string;

  @Column({ name: "cid", type: "varchar" })
  cid: string;

  @Column({ name: "signature", type: "varchar", nullable: true })
  signature?: string;

  @Column({ type: "jsonb", nullable: false })
  payload!: object;

  @CreateDateColumn({
    type: "timestamp with time zone",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at!: Date;

  @UpdateDateColumn({
    type: "timestamp with time zone",
    default: () => "CURRENT_TIMESTAMP",
  })
  updated_at!: Date;

  @OneToOne(() => Account, (account) => account.currentProof)
  processingBy: Account;
}
