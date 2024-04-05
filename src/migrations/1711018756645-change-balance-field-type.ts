import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeBalanceFieldType1711018756645 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "balance" TYPE varchar USING "balance"::text;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "balance" TYPE bigint USING "balance"::bigint;`);
  }
}
