import { MigrationInterface, QueryRunner } from "typeorm";

export class ProofModel1706784807438 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "proof" ("id" SERIAL NOT NULL, "refId" character varying NOT NULL, "network" smallint NOT NULL, "status" smallint NOT NULL, "type" smallint NOT NULL, "tx_hash" character varying, "cid" character varying NOT NULL, "signature" character varying, "payload" jsonb NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_f5f1d4a1658587cce4683165296" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "proof"`);
  }
}
